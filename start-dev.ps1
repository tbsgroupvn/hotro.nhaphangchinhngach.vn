# Development Startup Script
Write-Host "🚀 Starting Development Environment..." -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Yellow

# Kill any existing node processes
Write-Host "🧹 Cleaning up existing processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Wait a moment
Start-Sleep -Seconds 2

# Get current directory
$rootDir = Get-Location

# Start Backend in new window
Write-Host "🔥 Starting Backend Server..." -ForegroundColor Green
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", "$rootDir\start-backend.ps1" -WorkingDirectory $rootDir

# Wait for backend to start
Write-Host "⏳ Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Start Frontend in new window  
Write-Host "🎨 Starting Frontend App..." -ForegroundColor Cyan
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", "$rootDir\start-frontend.ps1" -WorkingDirectory $rootDir

# Wait a bit more
Start-Sleep -Seconds 5

Write-Host "✅ Development environment is starting up!" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend:  http://localhost:5000" -ForegroundColor Green
Write-Host "📚 API Docs: http://localhost:5000/health" -ForegroundColor Blue
Write-Host "" 
Write-Host "🎯 Templates Page: http://localhost:3000/templates" -ForegroundColor Magenta
Write-Host "=======================================" -ForegroundColor Yellow

# Keep this window open for monitoring
Write-Host "🔍 Monitoring... Press Ctrl+C to exit" -ForegroundColor Gray
try {
    while ($true) {
        Start-Sleep -Seconds 30
        $backendProcess = Get-Process -Name "node" -ErrorAction SilentlyContinue
        if ($backendProcess) {
            Write-Host "✅ $(Get-Date -Format 'HH:mm:ss') - System running ($(($backendProcess | Measure-Object).Count) processes)" -ForegroundColor Green
        } else {
            Write-Host "⚠️  $(Get-Date -Format 'HH:mm:ss') - No Node.js processes detected" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "👋 Shutting down..." -ForegroundColor Red
} 