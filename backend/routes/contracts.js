const express = require('express');
const router = express.Router();
const contractService = require('../services/contractService');
const templateService = require('../services/templateService');

// @route   POST /api/contracts/generate
// @desc    Tạo hợp đồng PDF từ template DOCX
// @access  Public
router.post('/generate', async (req, res) => {
  try {
    const contractData = req.body;
    
    // Validate required fields
    if (!contractData.template) {
      return res.status(400).json({
        success: false,
        message: 'Chưa chọn mẫu hợp đồng'
      });
    }

    if (!contractData.partyA?.name || !contractData.partyB?.name) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bên A hoặc bên B'
      });
    }

    // Generate PDF
    const pdfBuffer = await contractService.generateContractPDF(contractData);

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="hop-dong.pdf"');
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send PDF buffer
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating contract:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo hợp đồng',
      error: error.message
    });
  }
});

// @route   GET /api/contracts/templates
// @desc    Lấy danh sách mẫu hợp đồng
// @access  Public
router.get('/templates', (req, res) => {
  try {
    const templates = templateService.getAllTemplates();
    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách templates',
      error: error.message
    });
  }
});

// @route   GET /api/contracts/templates/:templateId
// @desc    Lấy chi tiết template và fields
// @access  Public
router.get('/templates/:templateId', (req, res) => {
  try {
    const { templateId } = req.params;
    const template = templateService.getTemplate(templateId);
    
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template không tồn tại'
      });
    }

    res.json({
      success: true,
      data: {
        id: templateId,
        title: template.title,
        fields: template.fields,
        preview: template.content.substring(0, 500) + '...'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy template',
      error: error.message
    });
  }
});

// @route   POST /api/contracts/preview
// @desc    Preview hợp đồng trước khi tạo PDF
// @access  Public
router.post('/preview', (req, res) => {
  try {
    const { template, ...data } = req.body;
    
    if (!template) {
      return res.status(400).json({
        success: false,
        message: 'Chưa chọn mẫu hợp đồng'
      });
    }

    const document = templateService.generateDocument(template, data);
    
    res.json({
      success: true,
      data: {
        title: document.title,
        content: document.content,
        generatedAt: document.generatedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo preview',
      error: error.message
    });
  }
});

module.exports = router; 