# Start Frontend React App
Write-Host "🎨 Starting Frontend React App..." -ForegroundColor Cyan

# Navigate to frontend directory
Set-Location -Path "frontend"

# Install dependencies if needed
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Create .env for frontend if needed
if (!(Test-Path ".env")) {
    Write-Host "📝 Creating frontend .env file..." -ForegroundColor Yellow
    @"
REACT_APP_API_URL=http://localhost:5000
"@ | Out-File -FilePath ".env" -Encoding UTF8
}

# Start React development server
Write-Host "🌟 Frontend starting on http://localhost:3000" -ForegroundColor Cyan
npm start 