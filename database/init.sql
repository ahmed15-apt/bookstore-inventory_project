CREATE DATABASE IF NOT EXISTS bookstore;
USE bookstore;

CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20),
    price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO books (title, author, isbn, price) VALUES 
('The Pragmatic Programmer', 'Andrew Hunt', '978-0135957059', 45.00),
('Clean Code', 'Robert C. Martin', '978-0132350884', 40.00),
('DevSecOps Handbook', 'John Willis', '978-1942788002', 35.00);