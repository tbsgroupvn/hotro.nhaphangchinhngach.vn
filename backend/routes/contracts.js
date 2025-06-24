const express = require('express');
const router = express.Router();
const contractService = require('../services/contractService');
const path = require('path');
const fs = require('fs');

// @route   POST /api/contracts/upload
// @desc    Upload contract template file
// @access  Public
router.post('/upload', contractService.upload.single('template'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn file template'
      });
    }

    console.log('🔄 Processing uploaded template:', req.file.filename);

    // Process the uploaded file
    const result = await contractService.processTemplateFile(req.file.path);

    res.json({
      success: true,
      message: 'Upload template thành công',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        placeholders: result.placeholders,
        templateId: req.file.filename.replace(/\.[^/.]+$/, '') // Remove extension
      }
    });

  } catch (error) {
    console.error('❌ Error uploading template:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi upload template',
      error: error.message
    });
  }
});

// @route   GET /api/contracts/templates/:templateId
// @desc    Get template info and placeholders
// @access  Public
router.get('/templates/:templateId', async (req, res) => {
  try {
    const { templateId } = req.params;
    const uploadsDir = path.join(__dirname, '../uploads');
    
    // Find template file
    const files = fs.readdirSync(uploadsDir);
    const templateFile = files.find(file => file.startsWith(templateId));
    
    if (!templateFile) {
      return res.status(404).json({
        success: false,
        message: 'Template không tồn tại'
      });
    }

    const templatePath = path.join(uploadsDir, templateFile);
    const result = await contractService.processTemplateFile(templatePath);

    res.json({
      success: true,
      data: {
        templateId: templateId,
        filename: templateFile,
        placeholders: result.placeholders,
        preview: result.content.substring(0, 500) + '...'
      }
    });

  } catch (error) {
    console.error('❌ Error getting template:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin template',
      error: error.message
    });
  }
});

// @route   POST /api/contracts/generate
// @desc    Generate contract from template
// @access  Public
router.post('/generate', async (req, res) => {
  try {
    console.log('🚀 Contract generation request for template:', req.body.templateId);
    
    const { templateId, ...formData } = req.body;
    
    if (!templateId) {
      console.log('❌ Missing templateId');
      return res.status(400).json({
        success: false,
        message: 'Chưa chọn template'
      });
    }

    // Find template file
    const uploadsDir = path.join(__dirname, '../uploads');
    const files = fs.readdirSync(uploadsDir);
    const templateFile = files.find(file => file.startsWith(templateId));
    
    if (!templateFile) {
      return res.status(404).json({
        success: false,
        message: 'Template không tồn tại'
      });
    }

    const templatePath = path.join(uploadsDir, templateFile);
    console.log('✅ Template found, generating contract...');

    try {
      // Try to generate PDF
      const pdfBuffer = await contractService.generateSimpleContract(templatePath, formData);

      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="hop-dong-${templateId}-${Date.now()}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);

      console.log('✅ Contract PDF generated successfully');
      // Send PDF buffer
      res.send(pdfBuffer);

    } catch (pdfError) {
      // Fallback to text if PDF fails
      console.log('⚠️ PDF generation failed, using fallback:', pdfError.message);
      
      const fallbackResult = await contractService.generateSimpleContractFallback(templatePath, formData);
      
      res.json({
        success: true,
        type: 'fallback_text',
        message: 'Không thể tạo PDF, trả về nội dung text', 
        data: fallbackResult
      });
    }

  } catch (error) {
    console.error('❌ Fatal error in contract generation:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo hợp đồng',
      error: error.message
    });
  }
});

// @route   POST /api/contracts/preview
// @desc    Preview contract before generating PDF
// @access  Public
router.post('/preview', async (req, res) => {
  try {
    const { templateId, ...formData } = req.body;
    
    if (!templateId) {
      return res.status(400).json({
        success: false,
        message: 'Chưa chọn template'
      });
    }

    // Find template file
    const uploadsDir = path.join(__dirname, '../uploads');
    const files = fs.readdirSync(uploadsDir);
    const templateFile = files.find(file => file.startsWith(templateId));
    
    if (!templateFile) {
      return res.status(404).json({
        success: false,
        message: 'Template không tồn tại'
      });
    }

    const templatePath = path.join(uploadsDir, templateFile);
    
    // Process template and replace placeholders
    const template = await contractService.processTemplateFile(templatePath);
    const content = contractService.replacePlaceholders(template.content, formData);
    
    res.json({
      success: true,
      data: {
        content: content,
        placeholders: template.placeholders,
        generatedAt: new Date().toLocaleString('vi-VN')
      }
    });

  } catch (error) {
    console.error('❌ Error generating preview:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo preview',
      error: error.message
    });
  }
});

// @route   GET /api/contracts/templates
// @desc    Get list of uploaded templates
// @access  Public
router.get('/templates', (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, '../uploads');
    
    if (!fs.existsSync(uploadsDir)) {
      return res.json({
        success: true,
        data: []
      });
    }

    const files = fs.readdirSync(uploadsDir);
    const templates = files.map(file => {
      const stats = fs.statSync(path.join(uploadsDir, file));
      return {
        id: file.replace(/\.[^/.]+$/, ''), // Remove extension
        filename: file,
        uploadedAt: stats.birthtime.toLocaleString('vi-VN'),
        size: `${Math.round(stats.size / 1024)} KB`
      };
    });

    res.json({
      success: true,
      data: templates
    });

  } catch (error) {
    console.error('❌ Error getting templates list:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách templates',
      error: error.message
    });
  }
});

module.exports = router; 