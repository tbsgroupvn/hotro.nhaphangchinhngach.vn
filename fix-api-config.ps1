# Fix API configuration và deploy
Write-Host "🔧 Fixing API configuration..." -ForegroundColor Green

# Di chuyển về root directory  
Set-Location "D:\project\hotro.nhaphangchinhngach.vn"

# Add changes
git add frontend/src/config/api.js
git add frontend/src/pages/ContractPage.js
git add frontend/src/pages/QuotePage.js  
git add frontend/src/pages/LabelPage.js
git add frontend/src/pages/PaymentPage.js

# Commit API fixes
git commit -m "🔧 Fix API configuration for production deployment

- Create axios instance with proper baseURL
- Update all pages to use apiClient instead of relative URLs
- Add environment variable support for API URL
- Fix frontend-backend connection for production

Changes:
- frontend/src/config/api.js: Create axios instance
- All pages: Replace axios with apiClient
- Support REACT_APP_API_URL environment variable"

# Push to GitHub
git push origin main

Write-Host "✅ API configuration fixes committed!" -ForegroundColor Green
Write-Host "🚀 Next steps:" -ForegroundColor Yellow
Write-Host "1. Update Railway URL in api.js" -ForegroundColor Cyan
Write-Host "2. Or set REACT_APP_API_URL in Netlify" -ForegroundColor Cyan
Write-Host "3. Netlify will auto-redeploy" -ForegroundColor Cyan 