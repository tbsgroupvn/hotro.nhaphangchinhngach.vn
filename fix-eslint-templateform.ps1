# Fix ESLint warnings in TemplateForm.js
Write-Host "🔧 Fixing ESLint warnings for production build..." -ForegroundColor Green

# Di chuyển về root directory  
Set-Location "D:\project\hotro.nhaphangchinhngach.vn"

# Add the fixed file
git add frontend/src/components/TemplateForm.js

# Commit ESLint fixes
git commit -m "🔧 Fix ESLint warnings in TemplateForm.js for production build

Fixes:
- Remove unused 'watch' variable from useForm destructuring
- Add missing dependency 'loadTemplateFields' to useEffect
- Wrap loadTemplateFields with useCallback to prevent infinite loop
- Add setValue to useCallback dependency array

All ESLint warnings resolved for CI=true environment"

# Push to GitHub (triggers Netlify auto-redeploy)
git push origin main

Write-Host "✅ ESLint fixes committed and pushed!" -ForegroundColor Green
Write-Host "🚀 Netlify will automatically redeploy with clean build" -ForegroundColor Cyan 