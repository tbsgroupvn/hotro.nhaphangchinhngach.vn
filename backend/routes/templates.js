const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  uploadTemplate,
  getTemplates,
  getTemplateById,
  readTemplateContent,
  deleteTemplate,
  updateTemplate
} = require('../services/templateService');

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Templates route is working!',
    timestamp: new Date().toISOString()
  });
});

// Cấu hình multer cho upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/temp'));
  },
  filename: (req, file, cb) => {
    // Tạo tên file tạm thời
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Chỉ cho phép upload docx, pdf, xlsx, xls
  const allowedTypes = ['.docx', '.pdf', '.xlsx', '.xls'];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Loại file không được hỗ trợ. Chỉ chấp nhận .docx, .pdf, .xlsx, .xls'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// Upload template mới
router.post('/upload', upload.single('template'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn file để upload'
      });
    }

    const { name, description, category } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: 'Tên template và danh mục là bắt buộc'
      });
    }

    try {
      const template = await uploadTemplate(req.file, {
        name,
        description,
        category
      });

      res.json({
        success: true,
        message: 'Upload template thành công',
        data: template
      });
    } catch (dbError) {
      // Fallback: Return demo response when MongoDB is not available
      const demoTemplate = {
        _id: 'demo-' + Date.now(),
        name,
        description,
        type: req.file.originalname.split('.').pop().toLowerCase(),
        category,
        originalName: req.file.originalname,
        fileSize: req.file.size,
        uploadDate: new Date().toISOString(),
        isActive: true
      };

      res.json({
        success: true,
        message: 'Upload template thành công (Demo mode)',
        data: demoTemplate,
        note: 'Demo mode - File uploaded but not saved to database'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Lấy danh sách templates
router.get('/', async (req, res) => {
  try {
    const { category, type } = req.query;
    const filters = {};
    
    if (category) filters.category = category;
    if (type) filters.type = type;

    // Fallback to demo data if MongoDB is not available
    try {
      const templates = await getTemplates(filters);
      res.json({
        success: true,
        data: templates
      });
    } catch (dbError) {
      // Return demo data for development
      const demoTemplates = [
        {
          _id: 'demo1',
          name: 'Hợp đồng mẫu',
          description: 'Template hợp đồng nhập khẩu demo',
          type: 'docx',
          category: 'contract',
          originalName: 'hop-dong-mau.docx',
          fileSize: 25600,
          uploadDate: new Date().toISOString(),
          isActive: true
        },
        {
          _id: 'demo2',
          name: 'Báo giá Excel',
          description: 'Template báo giá Excel demo',
          type: 'excel',
          category: 'quote',
          originalName: 'bao-gia-mau.xlsx',
          fileSize: 15360,
          uploadDate: new Date().toISOString(),
          isActive: true
        }
      ];
      
      let filteredTemplates = demoTemplates;
      if (filters.category) {
        filteredTemplates = filteredTemplates.filter(t => t.category === filters.category);
      }
      if (filters.type) {
        filteredTemplates = filteredTemplates.filter(t => t.type === filters.type);
      }
      
      res.json({
        success: true,
        data: filteredTemplates,
        note: 'Demo data - MongoDB not connected'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Lấy template theo ID
router.get('/:id', async (req, res) => {
  try {
    const template = await getTemplateById(req.params.id);

    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
});

// Đọc nội dung template
router.get('/:id/content', async (req, res) => {
  try {
    const result = await readTemplateContent(req.params.id);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Cập nhật thông tin template
router.put('/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    const updateData = {};
    
    if (name) updateData.name = name;
    if (description) updateData.description = description;

    const template = await updateTemplate(req.params.id, updateData);

    res.json({
      success: true,
      message: 'Cập nhật template thành công',
      data: template
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Xóa template
router.delete('/:id', async (req, res) => {
  try {
    const result = await deleteTemplate(req.params.id);

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Error handler cho multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File quá lớn. Kích thước tối đa 10MB'
      });
    }
  }
  
  res.status(500).json({
    success: false,
    message: error.message
  });
});

module.exports = router; 