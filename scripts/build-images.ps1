Write-Host "🚀 Building Bookstore Images..." -ForegroundColor Cyan

# Build Backend
Write-Host "📦 Building Backend..."
podman build -t bookstore-backend:1.0.0 ./backend

# Build Frontend
Write-Host "📦 Building Frontend..."
podman build -t bookstore-frontend:1.0.0 ./frontend

# Build Database
Write-Host "📦 Building Database..."
podman build -t bookstore-db:1.0.0 ./database

Write-Host "✅ All images built successfully!" -ForegroundColor Green