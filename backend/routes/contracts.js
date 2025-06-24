const express = require('express');
const router = express.Router();
const contractService = require('../services/contractService');

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
  const templates = [
    { id: 'mua_ban', name: 'Hợp đồng mua bán hàng hóa', description: 'Dành cho giao dịch mua bán hàng hóa nhập khẩu' },
    { id: 'van_chuyen', name: 'Hợp đồng vận chuyển', description: 'Dành cho dịch vụ vận chuyển hàng hóa' },
    { id: 'bao_hiem', name: 'Hợp đồng bảo hiểm', description: 'Bảo hiểm hàng hóa nhập khẩu' },
    { id: 'dai_ly', name: 'Hợp đồng đại lý', description: 'Hợp đồng đại lý phân phối' }
  ];

  res.json({
    success: true,
    data: templates
  });
});

module.exports = router; 