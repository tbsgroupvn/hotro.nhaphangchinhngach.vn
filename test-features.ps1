# Test All Features Script
Write-Host "🧪 TESTING ALL SYSTEM FEATURES" -ForegroundColor Magenta
Write-Host "===============================" -ForegroundColor Yellow

$baseUrl = "http://localhost:5000"
$frontendUrl = "http://localhost:3000"

# Function to test endpoint
function Test-Endpoint {
    param($url, $name, $method = "GET", $timeout = 5)
    
    try {
        if ($method -eq "GET") {
            $response = Invoke-RestMethod -Uri $url -Method $method -TimeoutSec $timeout
        }
        Write-Host "✅ $name" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ $name - Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Test Results Array
$results = @()

Write-Host ""
Write-Host "🏥 BACKEND API TESTS" -ForegroundColor Cyan
Write-Host "-------------------" -ForegroundColor Gray

# 1. Health Check
$results += @{name="Health Check"; success=(Test-Endpoint "$baseUrl/health" "Health Check")}

# 2. Quotes API
$results += @{name="Quotes API"; success=(Test-Endpoint "$baseUrl/api/quotes" "Quotes API")}

# 3. Contracts API  
$results += @{name="Contracts API"; success=(Test-Endpoint "$baseUrl/api/contracts" "Contracts API")}

# 4. Labels API
$results += @{name="Labels API"; success=(Test-Endpoint "$baseUrl/api/labels" "Labels API")}

# 5. Payments API
$results += @{name="Payments API"; success=(Test-Endpoint "$baseUrl/api/payments" "Payments API")}

# 6. Templates API
$results += @{name="Templates Test"; success=(Test-Endpoint "$baseUrl/api/templates/test" "Templates Test Route")}
$results += @{name="Templates List"; success=(Test-Endpoint "$baseUrl/api/templates" "Templates List")}

Write-Host ""
Write-Host "🌐 FRONTEND TESTS" -ForegroundColor Cyan
Write-Host "-----------------" -ForegroundColor Gray

# Check if frontend is running
try {
    $frontend = Test-NetConnection -ComputerName "localhost" -Port 3000 -WarningAction SilentlyContinue
    if ($frontend.TcpTestSucceeded) {
        Write-Host "✅ Frontend Server (Port 3000)" -ForegroundColor Green
        $results += @{name="Frontend Server"; success=$true}
        
        # Try to access main page
        try {
            $mainPage = Invoke-WebRequest -Uri $frontendUrl -TimeoutSec 5 -UseBasicParsing
            Write-Host "✅ Main Page Access" -ForegroundColor Green
            $results += @{name="Main Page"; success=$true}
        } catch {
            Write-Host "❌ Main Page Access - Error: $($_.Exception.Message)" -ForegroundColor Red
            $results += @{name="Main Page"; success=$false}
        }
    } else {
        Write-Host "❌ Frontend Server (Port 3000) - Not Running" -ForegroundColor Red
        $results += @{name="Frontend Server"; success=$false}
        $results += @{name="Main Page"; success=$false}
    }
} catch {
    Write-Host "❌ Frontend Check Failed" -ForegroundColor Red
    $results += @{name="Frontend Server"; success=$false}
}

Write-Host ""
Write-Host "🧪 SPECIFIC FEATURE TESTS" -ForegroundColor Cyan
Write-Host "-------------------------" -ForegroundColor Gray

# Test Templates with demo data
try {
    $templatesData = Invoke-RestMethod -Uri "$baseUrl/api/templates" -Method GET -TimeoutSec 5
    $templateCount = $templatesData.data.Count
    Write-Host "✅ Templates Data ($templateCount templates)" -ForegroundColor Green
    
    if ($templatesData.note) {
        Write-Host "   ℹ️  Note: $($templatesData.note)" -ForegroundColor Yellow
    }
    
    $results += @{name="Templates Data"; success=$true}
} catch {
    Write-Host "❌ Templates Data - Error: $($_.Exception.Message)" -ForegroundColor Red
    $results += @{name="Templates Data"; success=$false}
}

# Test file upload capability (just check route exists)
try {
    # Try OPTIONS request to check if upload route exists
    $uploadCheck = Invoke-WebRequest -Uri "$baseUrl/api/templates/upload" -Method OPTIONS -TimeoutSec 3 -UseBasicParsing -ErrorAction SilentlyContinue
    Write-Host "✅ Upload Route Available" -ForegroundColor Green
    $results += @{name="Upload Route"; success=$true}
} catch {
    if ($_.Exception.Message -like "*Method Not Allowed*" -or $_.Exception.Message -like "*405*") {
        Write-Host "✅ Upload Route Available (405 expected for OPTIONS)" -ForegroundColor Green
        $results += @{name="Upload Route"; success=$true}
    } else {
        Write-Host "❌ Upload Route - Error: $($_.Exception.Message)" -ForegroundColor Red
        $results += @{name="Upload Route"; success=$false}
    }
}

Write-Host ""
Write-Host "📊 TEST SUMMARY" -ForegroundColor Yellow
Write-Host "===============" -ForegroundColor Yellow

$totalTests = $results.Count
$passedTests = ($results | Where-Object { $_.success -eq $true }).Count
$failedTests = $totalTests - $passedTests

Write-Host "Total Tests: $totalTests" -ForegroundColor White
Write-Host "Passed: $passedTests" -ForegroundColor Green
Write-Host "Failed: $failedTests" -ForegroundColor Red

if ($failedTests -gt 0) {
    Write-Host ""
    Write-Host "❌ Failed Tests:" -ForegroundColor Red
    $results | Where-Object { $_.success -eq $false } | ForEach-Object {
        Write-Host "   - $($_.name)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎯 ACCESS POINTS" -ForegroundColor Cyan
Write-Host "=================" -ForegroundColor Gray
Write-Host "Frontend: $frontendUrl" -ForegroundColor White
Write-Host "Backend:  $baseUrl" -ForegroundColor White
Write-Host "API Docs: $baseUrl/health" -ForegroundColor White
Write-Host ""
Write-Host "📱 PAGES TO TEST:" -ForegroundColor Magenta
Write-Host "- Home: $frontendUrl/" -ForegroundColor White
Write-Host "- Quotes: $frontendUrl/quote" -ForegroundColor White  
Write-Host "- Contracts: $frontendUrl/contract" -ForegroundColor White
Write-Host "- Labels: $frontendUrl/label" -ForegroundColor White
Write-Host "- Payments: $frontendUrl/payment" -ForegroundColor White
Write-Host "- Templates: $frontendUrl/templates" -ForegroundColor White

$successRate = [math]::Round(($passedTests / $totalTests) * 100, 2)
Write-Host ""
if ($successRate -ge 80) {
    Write-Host "🎉 SYSTEM STATUS: GOOD ($successRate%)" -ForegroundColor Green
} elseif ($successRate -ge 60) {
    Write-Host "⚠️  SYSTEM STATUS: FAIR ($successRate%)" -ForegroundColor Yellow
} else {
    Write-Host "🚨 SYSTEM STATUS: NEEDS ATTENTION ($successRate%)" -ForegroundColor Red
}

Write-Host "===============================" -ForegroundColor Yellow 