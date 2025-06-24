# Hướng dẫn Triển khai Hệ thống Hỗ trợ Nhập hàng Chính ngạch

## Tổng quan

Hướng dẫn này sẽ giúp bạn triển khai hoàn chỉnh hệ thống lên các nền tảng cloud miễn phí:
- **Frontend**: Netlify
- **Backend**: Railway.app  
- **Database**: MongoDB Atlas

## Bước 1: Chuẩn bị Database (MongoDB Atlas)

### 1.1. Tạo tài khoản MongoDB Atlas
1. Truy cập [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Đăng ký tài khoản miễn phí
3. Tạo cluster mới (chọn Free Tier M0)
4. Chọn region gần Việt Nam (Singapore hoặc Tokyo)

### 1.2. Cấu hình Database
1. Vào **Database Access** → **Add New Database User**
   - Username: `hotro-user`
   - Password: tạo password mạnh
   - Role: `Atlas admin`

2. Vào **Network Access** → **Add IP Address**
   - Chọn **Allow access from anywhere** (0.0.0.0/0)

3. Vào **Database** → **Connect** → **Connect your application**
   - Copy connection string
   - Thay thế `<password>` bằng password đã tạo

## Bước 2: Triển khai Backend (Railway.app)

### 2.1. Chuẩn bị Repository
```bash
# Clone dự án
git clone https://github.com/tbsgroupvn/hotro.nhaphangchinhngach.vn.git
cd hotro.nhaphangchinhngach.vn

# Push lên GitHub repository của bạn
git remote set-url origin https://github.com/your-username/your-repo.git
git push -u origin main
```

### 2.2. Triển khai lên Railway
1. Truy cập [Railway.app](https://railway.app)
2. Đăng nhập bằng GitHub
3. Chọn **New Project** → **Deploy from GitHub repo**
4. Chọn repository dự án của bạn
5. Railway sẽ tự động detect và deploy backend

### 2.3. Cấu hình Environment Variables
Trong Railway dashboard → Settings → Variables:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://hotro-user:your-password@cluster.mongodb.net/hotro-nhaphang?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRE=7d
CORS_ORIGINS=https://hotronhaphang.netlify.app,https://hotronhaphang.netlify.vn
```

### 2.4. Cấu hình Custom Domain (Tùy chọn)
1. Trong Railway dashboard → Settings → Domains
2. Thêm custom domain hoặc sử dụng domain được cung cấp
3. Lưu lại URL backend để cấu hình frontend

## Bước 3: Triển khai Frontend (Netlify)

### 3.1. Build và Deploy
```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Tạo file cấu hình environment
cat > .env << EOF
REACT_APP_API_URL=https://your-railway-app.up.railway.app
REACT_APP_ENVIRONMENT=production
EOF

# Build production
npm run build
```

### 3.2. Deploy lên Netlify
**Cách 1: Drag & Drop**
1. Truy cập [Netlify](https://www.netlify.com)
2. Đăng nhập và vào Dashboard
3. Kéo thả thư mục `build/` vào Netlify
4. Netlify sẽ tự động deploy

**Cách 2: Git Integration**
1. Trong Netlify dashboard → **New site from Git**
2. Chọn GitHub và authorize
3. Chọn repository dự án
4. Cấu hình build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`

### 3.3. Cấu hình Custom Domain
1. Trong Netlify dashboard → **Domain management**
2. Chọn **Add custom domain**
3. Nhập domain: `hotronhaphang.netlify.vn`
4. Cấu hình DNS records theo hướng dẫn

### 3.4. Cấu hình Redirects
Tạo file `frontend/public/_redirects`:
```
/*    /index.html   200
```

## Bước 4: Cấu hình HTTPS và Security

### 4.1. SSL Certificate
- Netlify: Tự động cấp SSL certificate
- Railway: Tự động hỗ trợ HTTPS

### 4.2. Security Headers
Trong Netlify, tạo file `frontend/public/_headers`:
```
/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

## Bước 5: Testing và Monitoring

### 5.1. Kiểm tra Backend
```bash
# Test health endpoint
curl https://your-railway-app.up.railway.app/health

# Test API endpoints
curl -X POST https://your-railway-app.up.railway.app/api/quotes/generate \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### 5.2. Kiểm tra Frontend
1. Truy cập `https://hotronhaphang.netlify.vn`
2. Test các chức năng chính:
   - Tạo báo giá
   - Tạo hợp đồng  
   - Tạo tem dán
   - Tạo phiếu thanh toán

### 5.3. Monitoring
- **Netlify**: Analytics tích hợp
- **Railway**: Metrics và Logs
- **MongoDB**: Atlas monitoring

## Bước 6: Backup và Bảo trì

### 6.1. Database Backup
MongoDB Atlas tự động backup mỗi ngày (Free tier: 7 ngày retention)

### 6.2. Code Backup
```bash
# Backup repository
git clone --mirror https://github.com/your-username/your-repo.git
```

### 6.3. Monitoring Logs
```bash
# Railway logs
railway logs

# Netlify functions logs (nếu có)
netlify logs
```

## Bước 7: Tối ưu hiệu suất

### 7.1. Frontend Optimization
```bash
# Trong frontend/package.json
"scripts": {
  "build": "react-scripts build && npm run optimize",
  "optimize": "npx bundlesize"
}
```

### 7.2. Backend Optimization
- Bật compression trong Express
- Sử dụng CDN cho static files
- Implement caching cho API responses

### 7.3. Database Optimization
- Tạo indexes cho các truy vấn thường xuyên
- Monitor slow queries trong Atlas

## Troubleshooting

### Lỗi thường gặp:

**1. CORS Error**
```javascript
// Kiểm tra CORS_ORIGINS trong Railway
CORS_ORIGINS=https://hotronhaphang.netlify.app,https://hotronhaphang.netlify.vn
```

**2. Build Failed**
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
npm run build
```

**3. API Not Found**
```javascript
// Kiểm tra REACT_APP_API_URL trong frontend
console.log(process.env.REACT_APP_API_URL);
```

**4. Database Connection Failed**
- Kiểm tra IP whitelist trong MongoDB Atlas
- Verify connection string format
- Check username/password

## Monitoring và Logs

### Production Monitoring
```bash
# Railway CLI
npm install -g @railway/cli
railway login
railway logs --project your-project-id

# MongoDB Atlas
# Vào Atlas dashboard → Monitoring
```

### Error Tracking
Khuyến nghị sử dụng:
- **Sentry** cho error tracking
- **LogRocket** cho session replay
- **Google Analytics** cho user analytics

## Bảo mật Production

1. **Environment Variables**: Không commit vào Git
2. **API Rate Limiting**: Đã cấu hình trong Express
3. **Input Validation**: Đã implement trong routes
4. **HTTPS**: Bắt buộc cho production
5. **Database Security**: MongoDB Atlas có security mặc định

## Performance Benchmarks

### Target Metrics:
- **Page Load Time**: < 3 seconds
- **API Response Time**: < 500ms
- **PDF Generation**: < 5 seconds
- **Uptime**: > 99.5%

### Monitoring Tools:
- Lighthouse for frontend performance
- Railway metrics for backend
- MongoDB Atlas performance advisor

## Chi phí dự kiến (Free Tiers)

- **Netlify**: 100GB bandwidth/tháng (miễn phí)
- **Railway**: $5/tháng sau trial (hoặc sử dụng Heroku/Vercel)
- **MongoDB Atlas**: 512MB storage (miễn phí vĩnh viễn)

**Tổng chi phí**: $0-5/tháng

---

🎉 **Chúc mừng!** Hệ thống của bạn đã được triển khai thành công!

📧 **Hỗ trợ**: Nếu gặp vấn đề, vui lòng tạo issue trên GitHub repository. 