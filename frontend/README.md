# Frontend - Hệ thống Hỗ trợ Nhập hàng Chính ngạch

Web-app frontend được xây dựng với React.js và Tailwind CSS.

## Công nghệ sử dụng

- **React 18**: Library chính cho UI
- **React Router DOM**: Routing
- **React Hook Form**: Quản lý form
- **Tailwind CSS**: CSS framework
- **Axios**: HTTP client
- **React Hot Toast**: Notifications
- **Lucide React**: Icons
- **Date-fns**: Date utilities

## Chức năng chính

1. **Tạo báo giá hàng hóa**
   - Form nhập thông tin công ty và khách hàng
   - Quản lý danh sách sản phẩm với tính toán tự động
   - Cài đặt VAT và thời hạn hiệu lực
   - Xuất file PDF

2. **Tạo hợp đồng**
   - Chọn mẫu hợp đồng phù hợp
   - Nhập thông tin bên A và bên B
   - Cấu hình điều khoản đặc biệt
   - Xuất file PDF

3. **Tạo tem dán sản phẩm**
   - Chọn loại tem theo ngành hàng
   - Cấu hình kích thước và bố cục
   - Nhập thông tin sản phẩm và công ty
   - Preview và xuất PDF

4. **Tạo phiếu thanh toán**
   - Chọn loại thanh toán
   - Nhập thông tin công ty và đối tác
   - Chi tiết khoản thanh toán
   - Xuất file PDF

## Cài đặt và chạy

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm start

# Build production
npm run build

# Test
npm test
```

## Cấu trúc thư mục

```
src/
├── components/
│   └── layout/
│       └── Navbar.js
├── pages/
│   ├── Home.js
│   ├── QuotePage.js
│   ├── ContractPage.js
│   ├── LabelPage.js
│   └── PaymentPage.js
├── App.js
├── index.js
└── index.css
```

## Environment Variables

Tạo file `.env` trong thư mục `frontend/`:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENVIRONMENT=development
```

## API Integration

Tất cả API calls được thực hiện thông qua axios với base URL từ environment variables:

```javascript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Example API call
const response = await axios.post(`${API_BASE_URL}/api/quotes/generate`, data, {
  responseType: 'blob'
});
```

## Responsive Design

Ứng dụng được thiết kế responsive với Tailwind CSS:
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Grid system linh hoạt
- Touch-friendly UI

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Color contrast compliance
- Screen reader support

## Performance Optimization

- Code splitting với React.lazy
- Image optimization
- Bundle size monitoring
- Caching strategies

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Deployment

### Netlify (Recommended)

```bash
# Build
npm run build

# Deploy
netlify deploy --prod --dir=build
```

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## Development Guidelines

### Code Style
- Sử dụng ESLint + Prettier
- Functional components với hooks
- Camel case cho biến và functions
- Pascal case cho components

### Component Structure
```javascript
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const ComponentName = () => {
  // State and hooks
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm();

  // Event handlers
  const onSubmit = (data) => {
    // Handle form submission
  };

  // Render
  return (
    <div className="container">
      {/* Component content */}
    </div>
  );
};

export default ComponentName;
```

### State Management
- useState cho local state
- useContext cho global state (nếu cần)
- React Hook Form cho form state

## Testing

```bash
# Run tests
npm test

# Test coverage
npm test -- --coverage

# E2E tests (nếu có)
npm run test:e2e
```

## Troubleshooting

### Common Issues

**1. API Connection Failed**
```javascript
// Check API URL
console.log(process.env.REACT_APP_API_URL);

// Check CORS settings
// Ensure backend allows frontend origin
```

**2. Build Failed**
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run build
```

**3. Styling Issues**
```bash
# Rebuild Tailwind
npm run build:css

# Check for class conflicts
# Use browser dev tools
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## License

MIT License - xem file LICENSE để biết thêm chi tiết. 