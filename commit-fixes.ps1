# Fix ESLint warnings và commit
Write-Host "🔧 Committing ESLint fixes..." -ForegroundColor Green

# Di chuyển về root directory  
Set-Location "D:\project\hotro.nhaphangchinhngach.vn"

# Add changes
git add frontend/src/pages/ContractPage.js
git add frontend/src/pages/LabelPage.js  
git add frontend/src/pages/PaymentPage.js

# Commit fixes
git commit -m "🔧 Fix ESLint warnings for production build

- Remove unused imports in ContractPage.js (Upload, FileText)
- Remove unused pageSize variable in LabelPage.js
- Remove unused imports and variables in PaymentPage.js (Receipt, paymentTypes, onChange vars)
- All warnings resolved for CI=true environment"

# Push to GitHub
git push origin main

Write-Host "✅ ESLint fixes committed and pushed!" -ForegroundColor Green
Write-Host "🚀 Netlify will automatically redeploy with clean build" -ForegroundColor Cyan 