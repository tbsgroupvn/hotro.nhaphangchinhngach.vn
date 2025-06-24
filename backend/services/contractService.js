// const pdfMake = require('pdfmake/build/pdfmake');
// const pdfFonts = require('pdfmake/build/vfs_fonts');
const moment = require('moment');

// Cấu hình fonts mặc định
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

const generateContractPDF = async (contractData) => {
  try {
    const currentDate = moment().format('DD/MM/YYYY');
    
    // Test version - return simple JSON instead of PDF
    const testResponse = {
      success: true,
      message: "Hợp đồng đã được tạo thành công (chế độ test)",
      data: {
        template: contractData.template,
        partyA: contractData.partyA?.name,
        partyB: contractData.partyB?.name,
        contractValue: contractData.contractValue,
        description: contractData.description,
        generatedAt: currentDate,
        note: "API hoạt động bình thường - PDF sẽ được tạo sau khi sửa font"
      }
    };
    
    // Return simple buffer for testing
    return Buffer.from(JSON.stringify(testResponse, null, 2));

  } catch (error) {
    console.error('Error in generateContractPDF:', error);
    throw error;
  }
};

const getContractTemplate = (templateType) => {
  const templates = {
    mua_ban: {
      title: 'HỢP ĐỒNG MUA BÁN HÀNG HÓA',
      specificClauses: []
    },
    van_chuyen: {
      title: 'HỢP ĐỒNG VẬN CHUYỂN',
      specificClauses: []
    },
    bao_hiem: {
      title: 'HỢP ĐỒNG BẢO HIỂM',
      specificClauses: []
    },
    dai_ly: {
      title: 'HỢP ĐỒNG ĐẠI LÝ',
      specificClauses: []
    }
  };

  return templates[templateType] || templates.mua_ban;
};

const getPaymentTermsText = (paymentTerms) => {
  const terms = {
    prepaid: 'Trả trước 100%',
    cod: 'Thanh toán khi giao hàng',
    '30days': 'Thanh toán trong 30 ngày',
    '60days': 'Thanh toán trong 60 ngày',
    installment: 'Thanh toán theo đợt'
  };

  return terms[paymentTerms] || 'Theo thỏa thuận';
};

module.exports = {
  generateContractPDF
}; 