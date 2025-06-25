# Start Backend Server
Write-Host "🚀 Starting Backend Server..." -ForegroundColor Green

# Navigate to backend directory
Set-Location -Path "backend"

# Check if .env exists, create if not
if (!(Test-Path ".env")) {
    Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
    @"
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hotro-nhaphang
JWT_SECRET=hotro-nhaphang-secret-key-development
JWT_EXPIRE=7d
CORS_ORIGINS=http://localhost:3000
"@ | Out-File -FilePath ".env" -Encoding UTF8
}

# Install dependencies if needed
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Start server
Write-Host "🌟 Backend starting on http://localhost:5000" -ForegroundColor Green
node server.js 