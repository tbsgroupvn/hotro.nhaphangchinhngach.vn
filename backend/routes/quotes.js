const express = require('express');
const router = express.Router();
const quoteService = require('../services/quoteService');

// @route   POST /api/quotes/generate
// @desc    Tạo báo giá PDF
// @access  Public
router.post('/generate', async (req, res) => {
  try {
    const quoteData = req.body;
    
    // Validate required fields
    if (!quoteData.company?.name || !quoteData.customer?.name) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin công ty hoặc khách hàng'
      });
    }

    if (!quoteData.items || quoteData.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Phải có ít nhất một sản phẩm trong báo giá'
      });
    }

    // Generate PDF
    const pdfBuffer = await quoteService.generateQuotePDF(quoteData);

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="bao-gia.pdf"');
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send PDF buffer
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating quote:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo báo giá',
      error: error.message
    });
  }
});

// @route   GET /api/quotes/templates
// @desc    Lấy danh sách mẫu báo giá
// @access  Public
router.get('/templates', (req, res) => {
  const templates = [
    { id: 'standard', name: 'Báo giá tiêu chuẩn', description: 'Mẫu báo giá cơ bản' },
    { id: 'detailed', name: 'Báo giá chi tiết', description: 'Mẫu báo giá với thông tin chi tiết' },
    { id: 'simple', name: 'Báo giá đơn giản', description: 'Mẫu báo giá tối giản' }
  ];

  res.json({
    success: true,
    data: templates
  });
});

module.exports = router; 