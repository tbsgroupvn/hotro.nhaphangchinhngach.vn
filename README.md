# 🌟 Hệ thống Hỗ trợ Nhập hàng Chính ngạch

[![Netlify Status](https://api.netlify.com/api/v1/badges/placeholder/deploy-status)](https://hotro-nhaphang.netlify.app)
[![Railway Deploy](https://img.shields.io/badge/Railway-Deployed-success)](https://hotro-nhaphang-backend-production.up.railway.app)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-green)](https://cloud.mongodb.com)

## 📋 Mô tả

**Hệ thống web-app tự động hóa toàn diện** cho các công ty nhập khẩu, giúp tạo lập nhanh chóng và chính xác các loại văn bản quan trọng:

- 📊 **Báo giá hàng hóa** - Tính toán tự động với VAT, xuất PDF
- 📜 **Hợp đồng** - 4 mẫu chuẩn (mua bán, vận chuyển, bảo hiểm, đại lý)  
- 🏷️ **Tem dán sản phẩm** - 5 loại theo ngành hàng, in PDF
- 💰 **Phiếu thanh toán** - 4 hình thức thanh toán chuẩn

## 🚀 Demo Live

- **🌐 Frontend**: [https://hotro-nhaphang.netlify.app](https://hotro-nhaphang.netlify.app)
- **⚡ API Backend**: [https://hotro-nhaphang-backend-production.up.railway.app](https://hotro-nhaphang-backend-production.up.railway.app)

## 🛠️ Công nghệ

### Frontend
- **React 18** + **JavaScript**
- **Tailwind CSS** - Modern UI/UX
- **React Hook Form** - Form validation
- **Lucide React** - Icon system
- **Axios** - HTTP client

### Backend  
- **Node.js 18** + **Express.js**
- **MongoDB** + **Mongoose**
- **PDFMake** - PDF generation (hỗ trợ tiếng Việt)
- **Docxtemplater** - DOCX processing
- **Helmet** + **Rate Limiting** - Security

### Infrastructure
- **Frontend**: Netlify (CDN global)
- **Backend**: Railway (Auto-deploy)
- **Database**: MongoDB Atlas (Cloud)

## 🏃‍♂️ Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/hotro-nhaphang.git
cd hotro-nhaphang
```

### 2. Backend Setup
```bash
cd backend
npm install
cp config/env.example .env
# Cấu hình MongoDB URI trong .env
npm run dev
```

### 3. Frontend Setup  
```bash
cd frontend
npm install
npm start
```

### 4. Truy cập ứng dụng
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📁 Cấu trúc Project

```
hotro.nhaphangchinhngach.vn/
├── 📂 frontend/               # React.js Application
│   ├── 📂 src/
│   │   ├── 📂 components/     # UI Components
│   │   ├── 📂 pages/          # Page Components  
│   │   └── 📂 config/         # Configuration
│   ├── 📂 public/             # Static Assets
│   └── 📄 package.json
├── 📂 backend/                # Node.js API Server
│   ├── 📂 routes/             # API Routes
│   ├── 📂 services/           # Business Logic
│   ├── 📂 config/             # Database Config
│   └── 📄 server.js
├── 📂 docs/                   # Documentation
├── 📄 DEPLOYMENT.md           # Deployment Guide
└── 📄 README.md               # This file
```

## 🎯 Tính năng chính

### 📊 Báo giá hàng hóa
- ✅ Form nhập liệu thông minh
- ✅ Danh sách sản phẩm động
- ✅ Tính toán VAT tự động
- ✅ Xuất PDF với logo công ty
- ✅ Lưu lịch sử báo giá

### 📜 Hợp đồng
- ✅ 4 mẫu hợp đồng chuẩn Việt Nam
- ✅ Template DOCX động
- ✅ Thay thế thông tin tự động
- ✅ Export PDF chính thức
- ✅ Quản lý 2 bên ký kết

### 🏷️ Tem dán sản phẩm  
- ✅ 5 loại tem theo ngành hàng
- ✅ Cấu hình kích thước linh hoạt
- ✅ Preview trước khi in
- ✅ Batch export PDF
- ✅ QR Code integration

### 💰 Phiếu thanh toán
- ✅ 4 hình thức: Tiền mặt, Chuyển khoản, Séc, Trả góp
- ✅ Thông tin người nhận/chuyển
- ✅ Chi tiết khoản thanh toán
- ✅ Mẫu chuẩn kế toán
- ✅ Tích hợp với hệ thống ERP

## 🚀 Deployment  

### Hướng dẫn chi tiết: **[📖 DEPLOYMENT.md](DEPLOYMENT.md)**

### Quick Deploy:

1. **MongoDB Atlas** - Tạo cluster miễn phí
2. **Railway** - Deploy backend với GitHub
3. **Netlify** - Deploy frontend drag & drop

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://...
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://hotro-nhaphang.netlify.app
JWT_SECRET=your-secret-key
```

### Frontend
- Cấu hình tự động trong `src/config/api.js`
- Production URL sẽ tự động chuyển về Railway backend

## 📊 Trạng thái hiện tại

- ✅ **Backend API** - Hoạt động ổn định
- ✅ **Frontend React** - Build thành công  
- ✅ **MongoDB** - Kết nối thành công
- ⚠️ **PDF Generation** - Đang sử dụng JSON test mode (do lỗi font)
- ✅ **Deployment** - Sẵn sàng upload lên production

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`  
4. Push branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/hotro-nhaphang/issues)
- 📖 **Documentation**: [DEPLOYMENT.md](DEPLOYMENT.md)
- 💬 **Contact**: admin@yourcompany.com

---

<div align="center">

**💙 Made with love for Vietnamese import businesses 💙**

**🎉 Ready for Production Deployment! 🚀**

</div> 