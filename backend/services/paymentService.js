const PdfPrinter = require('pdfmake');
const moment = require('moment');

const fonts = {
  Roboto: {
    normal: 'node_modules/pdfmake/build/vfs_fonts.js',
    bold: 'node_modules/pdfmake/build/vfs_fonts.js',
    italics: 'node_modules/pdfmake/build/vfs_fonts.js',
    bolditalics: 'node_modules/pdfmake/build/vfs_fonts.js'
  }
};

const printer = new PdfPrinter(fonts);

const generatePaymentPDF = async (paymentData) => {
  try {
    const currentDate = moment().format('DD/MM/YYYY');
    const requestDate = paymentData.paymentInfo?.requestDate ? 
      moment(paymentData.paymentInfo.requestDate).format('DD/MM/YYYY') : currentDate;
    const dueDate = paymentData.paymentInfo?.dueDate ? 
      moment(paymentData.paymentInfo.dueDate).format('DD/MM/YYYY') : '';

    // Tính tổng tiền từ items
    const total = paymentData.items?.reduce((sum, item) => {
      return sum + ((item.quantity || 0) * (item.unitPrice || 0));
    }, 0) || paymentData.total || 0;

    // Tạo bảng chi tiết thanh toán
    const itemsTable = paymentData.items && paymentData.items.length > 0 ? {
      table: {
        headerRows: 1,
        widths: ['*', 'auto', 'auto', 'auto'],
        body: [
          [
            { text: 'Nội dung', style: 'tableHeader' },
            { text: 'Số lượng', style: 'tableHeader' },
            { text: 'Đơn giá', style: 'tableHeader' },
            { text: 'Thành tiền', style: 'tableHeader' }
          ],
          ...paymentData.items.map(item => {
            const amount = (item.quantity || 0) * (item.unitPrice || 0);
            return [
              { text: item.description || '', style: 'tableCell' },
              { text: (item.quantity || 0).toString(), style: 'tableCell', alignment: 'center' },
              { text: (item.unitPrice || 0).toLocaleString('vi-VN'), style: 'tableCell', alignment: 'right' },
              { text: amount.toLocaleString('vi-VN'), style: 'tableCell', alignment: 'right' }
            ];
          })
        ]
      },
      layout: {
        fillColor: function (rowIndex, node, columnIndex) {
          return (rowIndex === 0) ? '#3B82F6' : ((rowIndex % 2 === 0) ? '#F8FAFC' : null);
        }
      },
      margin: [0, 10, 0, 20]
    } : null;

    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      content: [
        // Header
        {
          columns: [
            {
              width: '*',
              stack: [
                { text: 'PHIẾU ĐỀ NGHỊ THANH TOÁN', style: 'title' },
                { text: `Số: ${paymentData.paymentInfo?.requestNumber || 'Tự động'}`, style: 'subtitle' },
                { text: `Ngày: ${requestDate}`, style: 'subtitle' }
              ]
            },
            {
              width: 'auto',
              qr: `Payment-${Date.now()}`,
              fit: 80
            }
          ],
          margin: [0, 0, 0, 30]
        },

        // Thông tin công ty và nhà cung cấp
        {
          columns: [
            {
              width: '48%',
              stack: [
                { text: 'THÔNG TIN CÔNG TY', style: 'sectionHeader' },
                { text: `Tên: ${paymentData.company?.name || ''}`, style: 'info' },
                { text: `Địa chỉ: ${paymentData.company?.address || ''}`, style: 'info' },
                { text: `MST: ${paymentData.company?.taxCode || ''}`, style: 'info' },
                { text: `Điện thoại: ${paymentData.company?.phone || ''}`, style: 'info' },
                { text: `Email: ${paymentData.company?.email || ''}`, style: 'info' },
                { text: `STK: ${paymentData.company?.bankAccount || ''}`, style: 'info' },
                { text: `Ngân hàng: ${paymentData.company?.bankName || ''}`, style: 'info' }
              ]
            },
            {
              width: '4%',
              text: ''
            },
            {
              width: '48%',
              stack: [
                { text: getVendorTitle(paymentData.paymentType), style: 'sectionHeader' },
                { text: `Tên: ${paymentData.vendor?.name || ''}`, style: 'info' },
                { text: `Địa chỉ: ${paymentData.vendor?.address || ''}`, style: 'info' },
                { text: `MST: ${paymentData.vendor?.taxCode || ''}`, style: 'info' },
                { text: `Điện thoại: ${paymentData.vendor?.phone || ''}`, style: 'info' },
                { text: `Email: ${paymentData.vendor?.email || ''}`, style: 'info' },
                { text: `STK: ${paymentData.vendor?.bankAccount || ''}`, style: 'info' },
                { text: `Ngân hàng: ${paymentData.vendor?.bankName || ''}`, style: 'info' }
              ]
            }
          ],
          margin: [0, 0, 0, 25]
        },

        // Thông tin phiếu
        {
          table: {
            widths: ['25%', '25%', '25%', '25%'],
            body: [
              [
                { text: 'Bộ phận đề nghị:', style: 'formLabel' },
                { text: paymentData.paymentInfo?.department || '', style: 'formValue' },
                { text: 'Người đề nghị:', style: 'formLabel' },
                { text: paymentData.paymentInfo?.requester || '', style: 'formValue' }
              ],
              [
                { text: 'Người phê duyệt:', style: 'formLabel' },
                { text: paymentData.paymentInfo?.approver || '', style: 'formValue' },
                { text: 'Hạn thanh toán:', style: 'formLabel' },
                { text: dueDate, style: 'formValue' }
              ]
            ]
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 20]
        },

        // Mục đích thanh toán
        {
          text: 'MỤC ĐÍCH THANH TOÁN:',
          style: 'sectionHeader',
          margin: [0, 0, 0, 10]
        },
        {
          text: paymentData.paymentInfo?.purpose || '',
          style: 'purpose',
          margin: [0, 0, 0, 20]
        },

        // Bảng chi tiết (nếu có)
        ...(itemsTable ? [
          { text: 'CHI TIẾT THANH TOÁN:', style: 'sectionHeader' },
          itemsTable
        ] : []),

        // Tổng tiền
        {
          columns: [
            { width: '*', text: '' },
            {
              width: 200,
              table: {
                body: [
                  [
                    { text: 'TỔNG TIỀN:', style: 'totalLabel' },
                    { text: `${total.toLocaleString('vi-VN')} ${paymentData.paymentInfo?.currency || 'VND'}`, style: 'totalValue' }
                  ]
                ]
              },
              layout: 'noBorders'
            }
          ],
          margin: [0, 10, 0, 30]
        },

        // Chữ ký
        {
          columns: [
            {
              width: '33%',
              stack: [
                { text: 'NGƯỜI ĐỀ NGHỊ', style: 'signatureHeader', alignment: 'center' },
                { text: '(Ký tên)', style: 'signatureNote', alignment: 'center' },
                { text: '\n\n\n', style: 'normal' },
                { text: paymentData.paymentInfo?.requester || '', style: 'signatureName', alignment: 'center' }
              ]
            },
            {
              width: '33%',
              stack: [
                { text: 'KẾ TOÁN', style: 'signatureHeader', alignment: 'center' },
                { text: '(Ký tên)', style: 'signatureNote', alignment: 'center' },
                { text: '\n\n\n', style: 'normal' },
                { text: '', style: 'signatureName', alignment: 'center' }
              ]
            },
            {
              width: '34%',
              stack: [
                { text: 'NGƯỜI PHÊ DUYỆT', style: 'signatureHeader', alignment: 'center' },
                { text: '(Ký tên, đóng dấu)', style: 'signatureNote', alignment: 'center' },
                { text: '\n\n\n', style: 'normal' },
                { text: paymentData.paymentInfo?.approver || '', style: 'signatureName', alignment: 'center' }
              ]
            }
          ]
        }
      ],

      styles: {
        title: {
          fontSize: 18,
          bold: true,
          color: '#1F2937',
          alignment: 'center'
        },
        subtitle: {
          fontSize: 12,
          color: '#6B7280',
          alignment: 'center',
          margin: [0, 3, 0, 0]
        },
        sectionHeader: {
          fontSize: 12,
          bold: true,
          color: '#374151',
          margin: [0, 0, 0, 8]
        },
        info: {
          fontSize: 10,
          margin: [0, 2, 0, 0]
        },
        formLabel: {
          fontSize: 10,
          bold: true,
          color: '#374151'
        },
        formValue: {
          fontSize: 10,
          color: '#1F2937'
        },
        purpose: {
          fontSize: 11,
          color: '#1F2937',
          lineHeight: 1.3
        },
        tableHeader: {
          fontSize: 11,
          bold: true,
          color: 'white',
          alignment: 'center'
        },
        tableCell: {
          fontSize: 10,
          margin: [3, 3, 3, 3]
        },
        totalLabel: {
          fontSize: 14,
          bold: true,
          color: '#DC2626',
          alignment: 'left'
        },
        totalValue: {
          fontSize: 14,
          bold: true,
          color: '#DC2626',
          alignment: 'right'
        },
        signatureHeader: {
          fontSize: 11,
          bold: true,
          color: '#1F2937'
        },
        signatureNote: {
          fontSize: 9,
          italics: true,
          color: '#6B7280'
        },
        signatureName: {
          fontSize: 10,
          bold: true,
          color: '#1F2937'
        }
      }
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    
    return new Promise((resolve, reject) => {
      const chunks = [];
      
      pdfDoc.on('data', chunk => chunks.push(chunk));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      pdfDoc.on('error', reject);
      
      pdfDoc.end();
    });

  } catch (error) {
    console.error('Error in generatePaymentPDF:', error);
    throw error;
  }
};

const getVendorTitle = (paymentType) => {
  const titles = {
    purchase: 'THÔNG TIN NHÀ CUNG CẤP',
    service: 'THÔNG TIN NHÀ CUNG CẤP DỊCH VỤ',
    expense: 'THÔNG TIN ĐỐI TƯƠNG CHI PHÍ',
    advance: 'THÔNG TIN NGƯỜI NHẬN'
  };

  return titles[paymentType] || 'THÔNG TIN NHÀ CUNG CẤP';
};

module.exports = {
  generatePaymentPDF
}; 