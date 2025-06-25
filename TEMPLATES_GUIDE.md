# Hướng dẫn sử dụng Templates

## Tổng quan

Tính năng Templates cho phép bạn upload và quản lý các file mẫu (DOCX, PDF, Excel) để sử dụng trong hệ thống tự động hóa văn bản.

## Tính năng chính

### 1. Upload Templates
- Hỗ trợ các định dạng: `.docx`, `.pdf`, `.xlsx`, `.xls`
- Kích thước file tối đa: 10MB
- Tự động phân loại theo danh mục (Báo giá, Hợp đồng, Tem nhãn, Thanh toán)

### 2. Quản lý Templates
- Xem danh sách templates
- Lọc theo danh mục và loại file
- Xem nội dung file
- Xóa templates

### 3. Đọc nội dung file
- **DOCX**: Trích xuất text từ Word documents
- **PDF**: Đọc text và metadata (số trang, thông tin file)
- **Excel**: Hiển thị dữ liệu từ tất cả sheets

## Cách sử dụng

### Upload Template mới

1. Truy cập trang **Templates** từ menu navigation
2. Click nút **"Upload Template"**
3. Điền thông tin:
   - **Tên template**: Tên hiển thị cho template
   - **Mô tả**: Mô tả chi tiết (tùy chọn)
   - **Danh mục**: Chọn danh mục phù hợp
   - **File template**: Chọn file từ máy tính
4. Click **"Upload"** để hoàn tất

### Xem và quản lý Templates

1. **Lọc templates**:
   - Chọn danh mục từ dropdown
   - Chọn loại file từ dropdown

2. **Xem nội dung template**:
   - Click nút **"Xem"** trên template card
   - Xem nội dung trong modal popup

3. **Xóa template**:
   - Click nút **"Xóa"** (icon thùng rác)
   - Xác nhận xóa trong dialog

## API Endpoints

### Backend Routes

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/templates/upload` | Upload template mới |
| GET | `/api/templates` | Lấy danh sách templates |
| GET | `/api/templates/:id` | Lấy thông tin template |
| GET | `/api/templates/:id/content` | Đọc nội dung template |
| PUT | `/api/templates/:id` | Cập nhật thông tin template |
| DELETE | `/api/templates/:id` | Xóa template |

### Request/Response Examples

#### Upload Template
```bash
POST /api/templates/upload
Content-Type: multipart/form-data

Form data:
- template: [File]
- name: "Hợp đồng mẫu"
- description: "Template hợp đồng nhập khẩu"
- category: "contract"
```

#### Get Templates
```bash
GET /api/templates?category=contract&type=docx

Response:
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Hợp đồng mẫu",
      "description": "Template hợp đồng nhập khẩu",
      "type": "docx",
      "category": "contract",
      "originalName": "hop-dong-mau.docx",
      "fileSize": 25600,
      "uploadDate": "2024-01-01T00:00:00.000Z",
      "metadata": {...}
    }
  ]
}
```

#### Read Template Content
```bash
GET /api/templates/:id/content

Response:
{
  "success": true,
  "data": {
    "template": {...},
    "content": {
      "text": "Nội dung template...",
      "type": "docx",
      "messages": []
    }
  }
}
```

## Database Schema

### Template Model
```javascript
{
  name: String,           // Tên template
  description: String,    // Mô tả
  type: String,          // 'docx', 'pdf', 'excel'
  category: String,      // 'quote', 'contract', 'label', 'payment'
  filename: String,      // Tên file lưu trữ
  originalName: String,  // Tên file gốc
  filePath: String,      // Đường dẫn file
  fileSize: Number,      // Kích thước file (bytes)
  uploadDate: Date,      // Ngày upload
  isActive: Boolean,     // Trạng thái hoạt động
  metadata: Object,      // Metadata của file
  createdAt: Date,       // Ngày tạo
  updatedAt: Date        // Ngày cập nhật
}
```

## Cấu trúc thư mục

```
backend/
├── models/
│   └── Template.js          # Model cho templates
├── routes/
│   └── templates.js         # Routes xử lý templates
├── services/
│   └── templateService.js   # Service xử lý templates
└── uploads/
    ├── temp/               # Thư mục tạm cho upload
    └── [timestamp]_[filename] # Files đã upload

frontend/
├── src/
│   └── pages/
│       └── TemplatesPage.js # Component trang Templates
```

## Dependencies

### Backend
```json
{
  "xlsx": "^0.18.0",        // Đọc file Excel
  "pdf-parse": "^1.1.0",   // Đọc file PDF
  "mammoth": "^1.5.0",     // Đọc file DOCX
  "fs-extra": "^11.0.0",   // File system utilities
  "multer": "^1.4.0"       // File upload middleware
}
```

### Frontend
```json
{
  "react-hook-form": "^7.0.0",  // Form handling
  "react-hot-toast": "^2.0.0",  // Toast notifications
  "lucide-react": "^0.0.0"      // Icons
}
```

## Lưu ý bảo mật

1. **File validation**: Chỉ cho phép upload các loại file được hỗ trợ
2. **Size limit**: Giới hạn kích thước file 10MB
3. **Path traversal**: Tên file được sanitize để tránh path traversal
4. **Access control**: Đường dẫn file không được trả về trong API response
5. **Virus scan**: Khuyến nghị thêm virus scanning cho production

## Troubleshooting

### Lỗi thường gặp

1. **"Loại file không được hỗ trợ"**
   - Kiểm tra extension file (.docx, .pdf, .xlsx, .xls)
   - Đảm bảo file không bị corrupt

2. **"File quá lớn"**
   - Kiểm tra kích thước file < 10MB
   - Nén file nếu cần thiết

3. **"Lỗi đọc file"**
   - File có thể bị corrupt hoặc có password protection
   - Thử export lại file từ ứng dụng gốc

4. **"Template không tồn tại"**
   - Template có thể đã bị xóa
   - Refresh trang để cập nhật danh sách

### Debug

1. **Kiểm tra logs server** để xem chi tiết lỗi
2. **Kiểm tra Network tab** trong DevTools để xem API responses
3. **Kiểm tra Console** để xem JavaScript errors

## Tích hợp với các chức năng khác

Templates có thể được tích hợp với:
- **Quotes**: Sử dụng Excel templates cho báo giá
- **Contracts**: Sử dụng DOCX templates cho hợp đồng
- **Labels**: Sử dụng templates cho thiết kế tem
- **Payments**: Sử dụng templates cho phiếu thanh toán

## Roadmap

### Tính năng sắp tới:
- [ ] Template versioning
- [ ] Template sharing
- [ ] Advanced template editor
- [ ] Template preview
- [ ] Batch operations
- [ ] Template categories management
- [ ] Template usage analytics 