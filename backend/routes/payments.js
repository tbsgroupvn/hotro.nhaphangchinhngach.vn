const express = require('express');
const router = express.Router();
const paymentService = require('../services/paymentService');

// @route   GET /api/payments
// @desc    Test payments endpoint
// @access  Public
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Payments API is working',
    endpoints: [
      'POST /api/payments/generate - Tạo phiếu thanh toán PDF',
      'GET /api/payments/templates - Lấy mẫu phiếu'
    ]
  });
});

// @route   POST /api/payments/generate
// @desc    Tạo phiếu thanh toán PDF
// @access  Public
router.post('/generate', async (req, res) => {
  try {
    const paymentData = req.body;
    
    // Validate required fields
    if (!paymentData.company?.name || !paymentData.vendor?.name) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin công ty hoặc nhà cung cấp'
      });
    }

    if (!paymentData.paymentInfo?.purpose) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu mục đích thanh toán'
      });
    }

    // Generate PDF
    const pdfBuffer = await paymentService.generatePaymentPDF(paymentData);

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="phieu-thanh-toan.pdf"');
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send PDF buffer
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating payment:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo phiếu thanh toán',
      error: error.message
    });
  }
});

// @route   GET /api/payments/types
// @desc    Lấy danh sách loại thanh toán
// @access  Public
router.get('/types', (req, res) => {
  const paymentTypes = [
    { id: 'purchase', name: 'Thanh toán mua hàng', description: 'Thanh toán cho nhà cung cấp' },
    { id: 'service', name: 'Thanh toán dịch vụ', description: 'Thanh toán phí dịch vụ' },
    { id: 'expense', name: 'Thanh toán chi phí', description: 'Thanh toán các khoản chi phí khác' },
    { id: 'advance', name: 'Tạm ứng', description: 'Phiếu tạm ứng cho nhân viên' }
  ];

  res.json({
    success: true,
    data: paymentTypes
  });
});

module.exports = router; 