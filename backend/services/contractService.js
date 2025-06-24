const pdfMake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');
const moment = require('moment');
const templateService = require('./templateService');

// Cấu hình fonts
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const generateContractPDF = async (contractData) => {
  try {
    // Generate document using template service
    const document = templateService.generateDocument(contractData.template, contractData);
    
    // Create PDF document definition
    const docDefinition = {
      content: [
        {
          text: document.title,
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        {
          text: document.content,
          style: 'content',
          preserveLeadingSpaces: true
        },
        {
          text: `\n\nTạo ngày: ${document.generatedAt}`,
          style: 'footer',
          alignment: 'right',
          margin: [0, 20, 0, 0]
        }
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          color: '#2563eb'
        },
        content: {
          fontSize: 11,
          lineHeight: 1.4
        },
        footer: {
          fontSize: 9,
          italics: true,
          color: '#666666'
        }
      },
      pageMargins: [40, 60, 40, 60],
      defaultStyle: {
        font: 'Roboto'
      }
    };

    // Generate PDF
    return new Promise((resolve, reject) => {
      const pdfDoc = pdfMake.createPdf(docDefinition);
      pdfDoc.getBuffer((buffer) => {
        if (buffer) {
          resolve(buffer);
        } else {
          reject(new Error('Failed to generate PDF buffer'));
        }
      });
    });

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