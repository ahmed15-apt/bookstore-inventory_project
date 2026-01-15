const express = require('express');
const mysql = require('mysql2/promise');
const { createClient } = require('redis');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const client = require('prom-client');
const winston = require('winston');

// --- Configuration ---
const PORT = process.env.PORT || 3000;
const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'bookuser',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'bookstore'
};
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// --- Logging Setup (JSON) ---
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [new winston.transports.Console()]
});

// --- App Setup ---
const app = express();
app.use(helmet()); // Security Headers
app.use(cors());
app.use(express.json());
app.use(morgan('combined')); // HTTP Logging

// --- Metrics ---
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// --- Database & Cache Connections ---
let dbPool;
let redisClient;

async function initConnections() {
    try {
        // MySQL
        dbPool = mysql.createPool(DB_CONFIG);
        logger.info('Connected to MySQL');

        // Redis
        redisClient = createClient({ url: REDIS_URL });
        redisClient.on('error', (err) => logger.error('Redis Client Error', err));
        await redisClient.connect();
        logger.info('Connected to Redis');
    } catch (err) {
        logger.error('Failed to connect to infrastructure', err);
        process.exit(1);
    }
}

// --- Endpoints ---

// Health Check
app.get('/api/health', (req, res) => res.status(200).json({ status: 'UP' }));

// Metrics Endpoint
app.get('/api/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

// GET Books (Read with Cache)
app.get('/api/books', async (req, res) => {
    try {
        // Check Cache
        const cachedBooks = await redisClient.get('all_books');
        if (cachedBooks) {
            logger.info('Cache Hit');
            return res.json(JSON.parse(cachedBooks));
        }

        // Database Query
        const [rows] = await dbPool.query('SELECT * FROM books');
        
        // Set Cache (TTL 60 seconds)
        await redisClient.set('all_books', JSON.stringify(rows), { EX: 60 });
        
        logger.info('Cache Miss - DB Query');
        res.json(rows);
    } catch (err) {
        logger.error('Error fetching books', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST Book (Create)
app.post('/api/books', async (req, res) => {
    const { title, author, price, isbn } = req.body;
    
    // Basic Validation
    if (!title || !author || !price || !isbn) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const [result] = await dbPool.query(
            'INSERT INTO books (title, author, price, isbn) VALUES (?, ?, ?, ?)',
            [title, author, price, isbn]
        );
        
        // Invalidate Cache
        await redisClient.del('all_books');
        
        res.status(201).json({ id: result.insertId, message: 'Book added' });
    } catch (err) {
        logger.error('Error adding book', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// DELETE Book
app.delete('/api/books/:id', async (req, res) => {
    try {
        await dbPool.query('DELETE FROM books WHERE id = ?', [req.params.id]);
        await redisClient.del('all_books');
        res.status(200).json({ message: 'Book deleted' });
    } catch (err) {
        logger.error('Error deleting book', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// --- Start Server ---
initConnections().then(() => {
    app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
    });
});