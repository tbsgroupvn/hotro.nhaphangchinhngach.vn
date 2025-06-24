# Backend API - Hệ thống Hỗ trợ Nhập hàng Chính ngạch

RESTful API backend được xây dựng với Node.js, Express.js và MongoDB.

## Công nghệ sử dụng

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB + Mongoose**: Database
- **PDFMake**: PDF generation
- **Docxtemplater**: DOCX template processing
- **Puppeteer**: DOCX to PDF conversion
- **JWT**: Authentication (dự phòng)
- **Helmet**: Security middleware
- **CORS**: Cross-origin resource sharing
- **Morgan**: HTTP request logging

## API Endpoints

### Health Check
```
GET /health
```

### Báo giá (Quotes)
```
POST /api/quotes/generate
GET  /api/quotes/templates
```

### Hợp đồng (Contracts)
```
POST /api/contracts/generate
GET  /api/contracts/templates
```

### Tem dán (Labels)
```
POST /api/labels/generate
GET  /api/labels/types
```

### Phiếu thanh toán (Payments)
```
POST /api/payments/generate
GET  /api/payments/types
```

## Cài đặt và chạy

### Prerequisites
- Node.js 16+
- MongoDB (local hoặc MongoDB Atlas)

### Installation
```bash
# Cài đặt dependencies
npm install

# Cấu hình environment variables
cp config/env.example .env
# Chỉnh sửa .env với thông tin thực tế

# Chạy development server
npm run dev

# Chạy production server
npm start
```

## Environment Variables

Tạo file `.env` trong thư mục `backend/`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hotro-nhaphang
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CORS_ORIGINS=http://localhost:3000
```

## API Documentation

### POST /api/quotes/generate

Tạo báo giá PDF từ dữ liệu JSON.

**Request Body:**
```json
{
  "company": {
    "name": "Công ty ABC",
    "address": "123 Đường XYZ",
    "phone": "0123456789",
    "email": "contact@abc.com",
    "taxCode": "0123456789"
  },
  "customer": {
    "name": "Khách hàng XYZ",
    "address": "456 Đường ABC",
    "phone": "0987654321",
    "email": "customer@xyz.com",
    "contactPerson": "Nguyễn Văn A"
  },
  "items": [
    {
      "name": "Sản phẩm 1",
      "description": "Mô tả sản phẩm",
      "quantity": 10,
      "unit": "chiếc",
      "unitPrice": 100000,
      "discount": 5
    }
  ],
  "settings": {
    "vatRate": 10,
    "validDays": 30,
    "notes": "Ghi chú thêm"
  },
  "totals": {
    "subtotal": 950000,
    "vatAmount": 95000,
    "total": 1045000
  }
}
```

**Response:**
- Content-Type: `application/pdf`
- File PDF được generate

### POST /api/contracts/generate

Tạo hợp đồng PDF từ template.

**Request Body:**
```json
{
  "template": "mua_ban",
  "partyA": {
    "name": "Công ty A",
    "address": "Địa chỉ A",
    "taxCode": "123456789",
    "representative": "Nguyễn Văn A",
    "position": "Giám đốc"
  },
  "partyB": {
    "name": "Công ty B",
    "address": "Địa chỉ B",
    "taxCode": "987654321",
    "representative": "Trần Văn B",
    "position": "Giám đốc"
  },
  "contractNumber": "HD001/2024",
  "signDate": "2024-01-15",
  "contractValue": 1000000,
  "currency": "VND",
  "description": "Mua bán hàng hóa",
  "duration": 30,
  "paymentTerms": "30days",
  "specialTerms": "Điều khoản đặc biệt"
}
```

### POST /api/labels/generate

Tạo tem dán sản phẩm PDF.

**Request Body:**
```json
{
  "labelType": "food",
  "size": "a4",
  "orientation": "portrait",
  "rows": 3,
  "cols": 2,
  "product": {
    "name": "Bánh quy nhập khẩu",
    "origin": "Thái Lan",
    "importDate": "2024-01-01",
    "expiryDate": "2024-12-31",
    "lotNumber": "LOT001",
    "weight": 500,
    "unit": "g",
    "barcode": "8935049123456",
    "ingredients": "Bột mì, đường, bơ",
    "storage": "Nơi khô ráo, tránh ánh nắng",
    "company": {
      "name": "Công ty TNHH ABC",
      "address": "123 Đường XYZ, TP.HCM",
      "phone": "0123456789"
    }
  }
}
```

### POST /api/payments/generate

Tạo phiếu thanh toán PDF.

**Request Body:**
```json
{
  "paymentType": "purchase",
  "company": {
    "name": "Công ty ABC",
    "address": "123 Đường XYZ",
    "taxCode": "0123456789",
    "bankAccount": "1234567890",
    "bankName": "Vietcombank"
  },
  "vendor": {
    "name": "Nhà cung cấp XYZ",
    "address": "456 Đường ABC",
    "taxCode": "0987654321",
    "bankAccount": "0987654321",
    "bankName": "BIDV"
  },
  "paymentInfo": {
    "requestNumber": "TT001/2024",
    "requestDate": "2024-01-15",
    "dueDate": "2024-01-30",
    "purpose": "Thanh toán hàng hóa",
    "department": "Phòng Mua hàng",
    "requester": "Nguyễn Văn A",
    "approver": "Trần Văn B",
    "currency": "VND"
  },
  "items": [
    {
      "description": "Hàng hóa đợt 1",
      "quantity": 1,
      "unitPrice": 1000000
    }
  ]
}
```

## Database Schema

### Quotes Collection (Dự phòng)
```javascript
{
  _id: ObjectId,
  quoteNumber: String,
  company: Object,
  customer: Object,
  items: Array,
  totals: Object,
  createdAt: Date,
  status: String
}
```

## Error Handling

API trả về các HTTP status codes chuẩn:

- `200`: Success
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `500`: Internal Server Error

**Error Response Format:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

## Security Features

1. **CORS**: Configured for specific origins
2. **Helmet**: Security headers
3. **Rate Limiting**: 100 requests per 15 minutes
4. **Input Validation**: All endpoints validate input
5. **Error Sanitization**: No sensitive data in error responses

## Performance

- **Compression**: Gzip compression enabled
- **Logging**: Morgan for HTTP request logging
- **Memory Management**: Proper PDF stream handling
- **Connection Pooling**: MongoDB connection optimization

## Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Integration tests
npm run test:integration
```

## Development

### Code Structure
```
backend/
├── config/
│   ├── database.js
│   └── env.example
├── routes/
│   ├── quotes.js
│   ├── contracts.js
│   ├── labels.js
│   └── payments.js
├── services/
│   ├── quoteService.js
│   ├── contractService.js
│   ├── labelService.js
│   └── paymentService.js
├── models/ (future)
├── middleware/ (future)
├── tests/ (future)
└── server.js
```

### PDF Generation

PDFs are generated using PDFMake with Vietnamese font support:

```javascript
const fonts = {
  Roboto: {
    normal: 'path/to/roboto-regular.ttf',
    bold: 'path/to/roboto-bold.ttf',
    italics: 'path/to/roboto-italic.ttf',
    bolditalics: 'path/to/roboto-bolditalic.ttf'
  }
};
```

### Adding New Endpoints

1. Create route file in `routes/`
2. Create service file in `services/`
3. Add route to `server.js`
4. Add validation middleware
5. Write tests

## Deployment

### Railway.app
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

### Docker (Alternative)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## Monitoring

### Logs
```bash
# Development
npm run dev

# Production logs
pm2 logs

# Railway logs
railway logs
```

### Health Check
```bash
curl https://your-api-url.com/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

## Contributing

1. Fork repository
2. Create feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit pull request

## License

MIT License - xem file LICENSE để biết thêm chi tiết. 