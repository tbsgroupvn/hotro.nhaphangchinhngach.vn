# 🚀 Production Deployment Guide

## 📋 Tổng quan

Hệ thống Hỗ trợ Nhập hàng Chính ngạch sẽ được deploy trên:
- **Frontend**: Netlify (React.js)
- **Backend**: Railway (Node.js + Express)
- **Database**: MongoDB Atlas (Cloud)

## 🎯 Trước khi Deploy

### ✅ Checklist
- [x] Backend API endpoints hoạt động (81.82% success rate)
- [x] Frontend build thành công
- [x] MongoDB connection fallback đã được cấu hình
- [x] Environment variables đã được setup
- [x] Error handling và security middleware đã có

## 🔧 1. Deploy Backend lên Railway

### 1.1 Tạo Account Railway
1. Truy cập [Railway.app](https://railway.app)
2. Sign up/Login với GitHub
3. Connect repository `hotro.nhaphangchinhngach.vn`

### 1.2 Deploy Backend
1. Click **"New Project"** → **"Deploy from GitHub repo"**
2. Chọn repository và branch `main`
3. Chọn thư mục **`backend`** để deploy
4. Railway sẽ tự động detect Node.js và deploy

### 1.3 Cấu hình Environment Variables
Trong Railway Dashboard, thêm variables:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hotro-nhaphang
JWT_SECRET=your-super-secret-jwt-key-production
CORS_ORIGINS=https://your-frontend-domain.netlify.app
PORT=5000
```

### 1.4 Custom Domain (Optional)
- Trong Railway: Settings → Domains
- Thêm custom domain hoặc sử dụng Railway domain

## 🎨 2. Deploy Frontend lên Netlify

### 2.1 Tạo Account Netlify
1. Truy cập [Netlify.com](https://netlify.com)
2. Sign up/Login với GitHub
3. Connect repository

### 2.2 Deploy Frontend
1. Click **"New site from Git"**
2. Chọn GitHub repository
3. Cấu hình build:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
   - **Base directory**: `frontend`

### 2.3 Environment Variables
Trong Netlify: Site settings → Environment variables:

```env
REACT_APP_API_URL=https://your-backend.railway.app
```

### 2.4 Custom Domain (Optional)
- Trong Netlify: Site settings → Domain management
- Thêm custom domain

## 💾 3. Setup MongoDB Atlas

### 3.1 Tạo Cluster
1. Đăng ký [MongoDB Atlas](https://cloud.mongodb.com)
2. Tạo cluster miễn phí (M0 Sandbox)
3. Tạo database user và password
4. Whitelist IP addresses (0.0.0.0/0 cho production)

### 3.2 Connection String
```
mongodb+srv://<username>:<password>@cluster0.mongodb.net/hotro-nhaphang?retryWrites=true&w=majority
```

## 🔄 4. Deployment Process

### 4.1 Deploy Backend
```bash
# 1. Push code lên GitHub
git add .
git commit -m "Production ready"
git push origin main

# 2. Railway sẽ tự động deploy
# 3. Kiểm tra logs trong Railway dashboard
```

### 4.2 Deploy Frontend
```bash
# 1. Update API URL trong frontend/.env
echo "REACT_APP_API_URL=https://your-backend.railway.app" > frontend/.env

# 2. Push lên GitHub
git add .
git commit -m "Update API URL for production"
git push origin main

# 3. Netlify sẽ tự động build và deploy
```

## ✅ 5. Post-Deploy Testing

### 5.1 Test Backend
```bash
# Health check
curl https://your-backend.railway.app/health

# API endpoints
curl https://your-backend.railway.app/api/templates/test
curl https://your-backend.railway.app/api/quotes
curl https://your-backend.railway.app/api/contracts
```

### 5.2 Test Frontend
1. Truy cập frontend URL
2. Test các trang: Home, Quotes, Contracts, Labels, Payments, Templates
3. Test upload file functionality
4. Test API calls từ frontend

## 🎯 6. Production URLs

### Sau khi deploy thành công:
- **Frontend**: `https://hotro-nhaphang.netlify.app`
- **Backend**: `https://hotro-nhaphang-backend.railway.app`
- **API Base**: `https://hotro-nhaphang-backend.railway.app/api`

### API Endpoints:
- Health: `/health`
- Quotes: `/api/quotes`
- Contracts: `/api/contracts`
- Labels: `/api/labels`
- Payments: `/api/payments`
- Templates: `/api/templates`

## 🔧 7. Monitoring & Maintenance

### 7.1 Railway Monitoring
- Dashboard: Metrics, logs, deployments
- Health checks: `/health` endpoint
- Auto-scaling: Railway handles automatically

### 7.2 Netlify Monitoring
- Build logs và deploy status
- Analytics và performance metrics
- Form submissions (nếu có)

### 7.3 MongoDB Atlas Monitoring
- Database metrics
- Connection monitoring
- Performance insights

## 🚨 8. Troubleshooting

### Backend Issues
```bash
# Check Railway logs
railway logs

# Check health endpoint
curl https://your-backend.railway.app/health

# Check environment variables
railway variables
```

### Frontend Issues
```bash
# Check Netlify build logs
# Trong Netlify dashboard: Deploys → View details

# Test local build
cd frontend
npm run build
npx serve -s build
```

### Database Issues
- Check MongoDB Atlas dashboard
- Verify connection string
- Check IP whitelist
- Monitor connection limits

## 📚 9. Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Netlify Documentation](https://docs.netlify.com)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)

## 🎉 10. Success Checklist

- [ ] Backend deployed và health check pass
- [ ] Frontend deployed và accessible
- [ ] Database connected
- [ ] All API endpoints working
- [ ] Frontend → Backend communication working
- [ ] File upload functionality working
- [ ] No console errors
- [ ] Performance acceptable

---

**🎯 Ready for Production!** 

Sau khi hoàn thành các bước trên, hệ thống sẽ sẵn sàng cho người dùng thực tế. 