# System Health Check
Write-Host "🔍 Checking System Health..." -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Yellow

# Check Node.js processes
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "✅ Node.js Processes: $(($nodeProcesses | Measure-Object).Count) running" -ForegroundColor Green
    $nodeProcesses | ForEach-Object { Write-Host "   - PID: $($_.Id), Memory: $([math]::Round($_.WorkingSet64/1MB,2))MB" -ForegroundColor Gray }
} else {
    Write-Host "❌ Node.js Processes: None running" -ForegroundColor Red
}

# Check ports
Write-Host ""
Write-Host "🔌 Port Status:" -ForegroundColor Blue

# Check Backend (Port 5000)
try {
    $backend = Test-NetConnection -ComputerName "localhost" -Port 5000 -WarningAction SilentlyContinue
    if ($backend.TcpTestSucceeded) {
        Write-Host "✅ Backend (5000): Running" -ForegroundColor Green
        
        # Test API endpoint
        try {
            $response = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method GET -TimeoutSec 5
            Write-Host "   - API Health: $($response.status)" -ForegroundColor Green
        } catch {
            Write-Host "   - API Health: Error" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Backend (5000): Not responding" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Backend (5000): Error checking" -ForegroundColor Red
}

# Check Frontend (Port 3000)
try {
    $frontend = Test-NetConnection -ComputerName "localhost" -Port 3000 -WarningAction SilentlyContinue
    if ($frontend.TcpTestSucceeded) {
        Write-Host "✅ Frontend (3000): Running" -ForegroundColor Green
    } else {
        Write-Host "❌ Frontend (3000): Not responding" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Frontend (3000): Error checking" -ForegroundColor Red
}

# Check Templates API
Write-Host ""
Write-Host "🗂️ Templates API:" -ForegroundColor Magenta
try {
    $templatesResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/templates/test" -Method GET -TimeoutSec 5
    Write-Host "✅ Templates Test: $($templatesResponse.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Templates Test: Error - $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $templatesListResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/templates" -Method GET -TimeoutSec 5
    Write-Host "✅ Templates List: $($templatesListResponse.data.Count) templates available" -ForegroundColor Green
    if ($templatesListResponse.note) {
        Write-Host "   - Note: $($templatesListResponse.note)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Templates List: Error - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "   - Access Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   - Access Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "   - Templates Page:  http://localhost:3000/templates" -ForegroundColor White
Write-Host "==============================" -ForegroundColor Yellow 