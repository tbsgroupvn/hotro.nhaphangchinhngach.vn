# 🚀 Hướng dẫn Deployment - Hệ thống Hỗ trợ Nhập hàng Chính ngạch

## 📋 Tổng quan

Hệ thống bao gồm:
- **Frontend**: React.js → Deploy lên **Netlify**
- **Backend**: Node.js + Express → Deploy lên **Railway**
- **Database**: MongoDB → **MongoDB Atlas**

---

## 🔧 Bước 1: Chuẩn bị MongoDB Atlas

### 1.1 Tạo MongoDB Atlas Cluster
1. Truy cập [MongoDB Atlas](https://cloud.mongodb.com/)
2. Đăng ký/Đăng nhập tài khoản
3. Tạo **New Project**: `hotro-nhaphang`
4. Tạo **Free Cluster** (M0):
   - **Cluster Name**: `hotro-cluster`
   - **Region**: Singapore (ap-southeast-1)
   - **MongoDB Version**: 6.0

### 1.2 Cấu hình Database
1. **Database Access** → **Add New Database User**:
   - Username: `hotro-admin`
   - Password: Tạo password mạnh
   - Database User Privileges: `Atlas admin`

2. **Network Access** → **Add IP Address**:
   - Click **Allow Access from Anywhere** (`0.0.0.0/0`)

3. **Connect** → **Connect your application**:
   - Copy **Connection String**:
   ```
   mongodb+srv://hotro-admin:<password>@hotro-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

## 🚀 Bước 2: Deploy Backend lên Railway

### 2.1 Chuẩn bị Repository
1. Push code lên GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/hotro-nhaphang.git
git push -u origin main
```

### 2.2 Deploy lên Railway
1. Truy cập [Railway.app](https://railway.app/)
2. Đăng nhập bằng GitHub
3. **New Project** → **Deploy from GitHub repo**
4. Chọn repository `hotro-nhaphang`
5. Chọn **backend folder** để deploy

### 2.3 Cấu hình Environment Variables
Trong Railway Dashboard → Settings → Environment Variables:

```env
MONGODB_URI=mongodb+srv://hotro-admin:YOUR_PASSWORD@hotro-cluster.xxxxx.mongodb.net/hotro-nhaphang?retryWrites=true&w=majority
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://hotro-nhaphang.netlify.app
JWT_SECRET=your-super-secure-random-jwt-secret-key-256-bit
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2.4 Lấy Backend URL
- Sau khi deploy thành công, copy **Railway URL**:
- Ví dụ: `https://hotro-nhaphang-backend-production.up.railway.app`

---

## 🌐 Bước 3: Deploy Frontend lên Netlify

### 3.1 Build Frontend
```bash
cd frontend
npm install
npm run build
```

### 3.2 Cập nhật API URL
- File `frontend/src/config/api.js` đã cấu hình sẵn
- Production URL sẽ tự động sử dụng Railway backend

### 3.3 Deploy lên Netlify

#### Option 1: Drag & Drop (Đơn giản)
1. Truy cập [Netlify](https://netlify.com/)
2. Đăng ký/Đăng nhập
3. Drag & drop thư mục `frontend/build` vào Netlify
4. Site sẽ có URL tạm: `https://random-name.netlify.app`

#### Option 2: GitHub Integration (Khuyến nghị)
1. **Sites** → **Add new site** → **Import from Git**
2. Connect GitHub và chọn repository
3. **Build settings**:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
4. **Advanced build settings** → **Environment variables**:
   ```
   NODE_VERSION=18
   ```

### 3.4 Cấu hình Custom Domain (Optional)
1. **Site settings** → **Domain management**
2. **Add custom domain**: `hotro-nhaphang.netlify.app`

---

## 🔧 Bước 4: Cập nhật CORS và Final Configuration

### 4.1 Cập nhật Railway Backend
Sau khi có Netlify URL, cập nhật trong Railway:
```env
CORS_ORIGIN=https://your-actual-netlify-url.netlify.app
```

### 4.2 Test Production
1. Truy cập Netlify URL
2. Test các chức năng:
   - ✅ Tạo báo giá
   - ✅ Tạo hợp đồng
   - ✅ Tạo tem dán
   - ✅ Tạo phiếu thanh toán

---

## 📱 URLs Production

### Frontend (Netlify)
```
https://hotro-nhaphang.netlify.app
```

### Backend API (Railway)
```
https://hotro-nhaphang-backend-production.up.railway.app
```

### Database (MongoDB Atlas)
```
Cluster: hotro-cluster
Database: hotro-nhaphang
Collections: quotes, contracts, labels, payments
```

---

## 🛠️ Troubleshooting

### Lỗi CORS
```javascript
// Nếu gặp lỗi CORS, kiểm tra:
1. Railway Environment Variable CORS_ORIGIN
2. Netlify URL chính xác
3. Protocol https://
```

### MongoDB Connection
```javascript
// Kiểm tra:
1. IP Address whitelist (0.0.0.0/0)
2. Database user credentials
3. Connection string format
4. Network connectivity
```

### Build Errors
```bash
# Clear cache và rebuild:
npm run build --force
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📊 Monitoring & Analytics

### Railway Metrics
- CPU usage
- Memory usage
- Request latency
- Error rates

### Netlify Analytics
- Page views
- Form submissions
- Build performance
- Core Web Vitals

---

## 🔒 Security Checklist

- ✅ MongoDB Atlas IP restrictions
- ✅ Strong database passwords
- ✅ JWT secret keys
- ✅ HTTPS enforcement
- ✅ Rate limiting enabled
- ✅ CORS properly configured
- ✅ Environment variables secured

---

## 📞 Support

- **Documentation**: [Link to docs]
- **Issues**: GitHub Issues
- **Contact**: admin@yourcompany.com

---

**✨ Deployment completed successfully! 🎉** 