const express = require('express');
const router = express.Router();
const labelService = require('../services/labelService');

// @route   POST /api/labels/generate
// @desc    Tạo tem dán sản phẩm PDF
// @access  Public
router.post('/generate', async (req, res) => {
  try {
    const labelData = req.body;
    
    // Validate required fields
    if (!labelData.product?.name || !labelData.product?.origin) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin sản phẩm hoặc xuất xứ'
      });
    }

    if (!labelData.product?.company?.name) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin công ty nhập khẩu'
      });
    }

    // Generate PDF
    const pdfBuffer = await labelService.generateLabelPDF(labelData);

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="tem-dan.pdf"');
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send PDF buffer
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating label:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo tem dán',
      error: error.message
    });
  }
});

// @route   GET /api/labels/types
// @desc    Lấy danh sách loại tem dán
// @access  Public
router.get('/types', (req, res) => {
  const labelTypes = [
    { id: 'standard', name: 'Tem tiêu chuẩn', description: 'Tem dán cơ bản với thông tin sản phẩm' },
    { id: 'food', name: 'Tem thực phẩm', description: 'Tem dán cho thực phẩm nhập khẩu' },
    { id: 'cosmetic', name: 'Tem mỹ phẩm', description: 'Tem dán cho mỹ phẩm, chăm sóc da' },
    { id: 'electronic', name: 'Tem điện tử', description: 'Tem dán cho thiết bị điện tử' },
    { id: 'medicine', name: 'Tem dược phẩm', description: 'Tem dán cho thuốc và dược phẩm' }
  ];

  res.json({
    success: true,
    data: labelTypes
  });
});

module.exports = router; 