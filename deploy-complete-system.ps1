# Deploy Complete Template System
Write-Host "🚀 Deploying Complete Template System..." -ForegroundColor Green

# Di chuyển về root directory  
Set-Location "D:\project\hotro.nhaphangchinhngach.vn"

# Add all new and modified files
git add backend/server.js
git add backend/services/templateService.js
git add backend/services/contractService.js
git add backend/routes/contracts.js
git add frontend/src/components/TemplateForm.js
git add frontend/src/pages/ContractPage.js

# Commit comprehensive changes
git commit -m "🎉 Complete Template System with Replace Fields & Document Generation

✨ NEW FEATURES:
✅ Dynamic Template System with {{field}} replacement
✅ Template Form Builder with field types (text, textarea, select, date, number)
✅ Real-time Preview functionality
✅ PDF Generation with proper formatting
✅ Template Fields Reference panel
✅ Auto-generation of contract numbers, dates
✅ Number to words conversion (VND)

🔧 BACKEND IMPROVEMENTS:
✅ Fixed CORS for production deployment
✅ New templateService.js with field replacement logic
✅ Updated contractService.js for real PDF generation
✅ New API endpoints: /templates/:id, /preview
✅ Proper error handling and validation

📱 FRONTEND IMPROVEMENTS:
✅ New TemplateForm component with dynamic fields
✅ Real-time preview panel
✅ Template fields reference
✅ Copy to clipboard functionality
✅ Responsive 2-column layout
✅ Better UX with loading states

🎯 FIXED ISSUES:
✅ Services returning JSON instead of PDF
✅ API URL configuration for production
✅ Template selection and field generation
✅ Form validation and error handling

🔧 TECHNICAL DETAILS:
- Backend: Express.js + PDFMake + Template Engine
- Frontend: React + Custom Template Form Builder  
- Templates: mua_ban, van_chuyen with extensible system
- Field Types: text, textarea, select, date, number
- Replace Logic: {{field}} and {{nested.field}} support
- PDF: Proper Vietnamese formatting with Roboto font"

# Push to GitHub (triggers auto-deploy)
git push origin main

Write-Host ""
Write-Host "🎊 COMPLETE SYSTEM DEPLOYED!" -ForegroundColor Yellow
Write-Host ""
Write-Host "✨ NEW FEATURES ADDED:" -ForegroundColor Green
Write-Host "📝 Template System with Replace Fields" -ForegroundColor Cyan
Write-Host "👁️ Real-time Preview" -ForegroundColor Cyan  
Write-Host "📄 Proper PDF Generation" -ForegroundColor Cyan
Write-Host "🔧 Dynamic Form Builder" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔗 URLs:" -ForegroundColor Yellow
Write-Host "Backend: https://hotronhaphangchinhngachvn-production.up.railway.app" -ForegroundColor Cyan
Write-Host "Frontend: Will be auto-deployed by Netlify" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎯 Test in ~3 minutes after deployment completes!" -ForegroundColor Green 