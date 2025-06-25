# Deploy to Production Script
Write-Host "🚀 DEPLOYING TO PRODUCTION" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Yellow

# Check if git is configured
try {
    $gitStatus = git status 2>$null
    Write-Host "✅ Git repository detected" -ForegroundColor Green
} catch {
    Write-Host "❌ Git not found or not a git repository" -ForegroundColor Red
    Write-Host "Please run 'git init' and setup remote repository first" -ForegroundColor Yellow
    exit 1
}

# Check for uncommitted changes
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "📝 Uncommitted changes detected. Committing all changes..." -ForegroundColor Yellow
    
    git add .
    $commitMessage = Read-Host "Enter commit message (or press Enter for default)"
    if (!$commitMessage) {
        $commitMessage = "Production deployment - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    }
    
    git commit -m $commitMessage
    Write-Host "✅ Changes committed" -ForegroundColor Green
}

# Check if remote exists
try {
    $remoteUrl = git remote get-url origin 2>$null
    Write-Host "✅ Remote origin: $remoteUrl" -ForegroundColor Green
} catch {
    Write-Host "❌ No remote origin configured" -ForegroundColor Red
    Write-Host "Please add remote: git remote add origin <your-repo-url>" -ForegroundColor Yellow
    exit 1
}

# Test local build
Write-Host ""
Write-Host "🔨 Testing local frontend build..." -ForegroundColor Cyan
try {
    Set-Location -Path "frontend"
    npm run build | Out-Null
    Write-Host "✅ Frontend build successful" -ForegroundColor Green
    Set-Location -Path ".."
} catch {
    Write-Host "❌ Frontend build failed" -ForegroundColor Red
    Write-Host "Please fix build errors before deploying" -ForegroundColor Yellow
    Set-Location -Path ".."
    exit 1
}

# Test backend
Write-Host ""
Write-Host "🔧 Testing backend..." -ForegroundColor Cyan
try {
    Set-Location -Path "backend"
    npm test 2>$null | Out-Null
    Write-Host "✅ Backend tests passed" -ForegroundColor Green
    Set-Location -Path ".."
} catch {
    Write-Host "⚠️ Backend tests failed or not configured" -ForegroundColor Yellow
    Set-Location -Path ".."
}

# Push to GitHub
Write-Host ""
Write-Host "📤 Pushing to GitHub..." -ForegroundColor Cyan
try {
    git push origin main
    Write-Host "✅ Code pushed to GitHub" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to push to GitHub" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🎉 DEPLOYMENT INITIATED!" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Yellow

Write-Host ""
Write-Host "📋 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. 🔧 Setup Railway for Backend:" -ForegroundColor White
Write-Host "   - Go to https://railway.app" -ForegroundColor Gray
Write-Host "   - Connect your GitHub repository" -ForegroundColor Gray
Write-Host "   - Deploy 'backend' folder" -ForegroundColor Gray
Write-Host "   - Set environment variables" -ForegroundColor Gray

Write-Host ""
Write-Host "2. 🎨 Setup Netlify for Frontend:" -ForegroundColor White
Write-Host "   - Go to https://netlify.com" -ForegroundColor Gray
Write-Host "   - Connect your GitHub repository" -ForegroundColor Gray
Write-Host "   - Set base directory to 'frontend'" -ForegroundColor Gray
Write-Host "   - Set build command to 'npm run build'" -ForegroundColor Gray
Write-Host "   - Set publish directory to 'build'" -ForegroundColor Gray

Write-Host ""
Write-Host "3. 💾 Setup MongoDB Atlas:" -ForegroundColor White
Write-Host "   - Go to https://cloud.mongodb.com" -ForegroundColor Gray
Write-Host "   - Create free cluster" -ForegroundColor Gray
Write-Host "   - Get connection string" -ForegroundColor Gray
Write-Host "   - Add to Railway environment variables" -ForegroundColor Gray

Write-Host ""
Write-Host "📚 Detailed guide: See DEPLOY_PRODUCTION.md" -ForegroundColor Magenta

Write-Host ""
Write-Host "🔗 USEFUL LINKS:" -ForegroundColor Yellow
Write-Host "- Railway: https://railway.app" -ForegroundColor Blue
Write-Host "- Netlify: https://netlify.com" -ForegroundColor Blue  
Write-Host "- MongoDB Atlas: https://cloud.mongodb.com" -ForegroundColor Blue
Write-Host "- GitHub: https://github.com" -ForegroundColor Blue

Write-Host ""
Write-Host "⏱️ Estimated deployment time: 10-15 minutes" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎯 After deployment, your app will be live at:" -ForegroundColor Green
Write-Host "   Frontend: https://your-app.netlify.app" -ForegroundColor White
Write-Host "   Backend:  https://your-app.railway.app" -ForegroundColor White

Write-Host ""
Write-Host "============================" -ForegroundColor Yellow
Write-Host "🚀 READY FOR PRODUCTION! 🚀" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Yellow 