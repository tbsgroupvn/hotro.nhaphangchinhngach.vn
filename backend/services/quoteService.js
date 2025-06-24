const PdfPrinter = require('pdfmake');
const moment = require('moment');

// Định nghĩa fonts hỗ trợ tiếng Việt
const fonts = {
  Roboto: {
    normal: 'node_modules/pdfmake/build/vfs_fonts.js',
    bold: 'node_modules/pdfmake/build/vfs_fonts.js',
    italics: 'node_modules/pdfmake/build/vfs_fonts.js',
    bolditalics: 'node_modules/pdfmake/build/vfs_fonts.js'
  }
};

const printer = new PdfPrinter(fonts);

const generateQuotePDF = async (quoteData) => {
  try {
    const currentDate = moment().format('DD/MM/YYYY');
    const validUntil = moment().add(quoteData.settings?.validDays || 30, 'days').format('DD/MM/YYYY');

    // Tạo bảng sản phẩm
    const itemsTable = {
      table: {
        headerRows: 1,
        widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto'],
        body: [
          [
            { text: 'Tên sản phẩm', style: 'tableHeader' },
            { text: 'Số lượng', style: 'tableHeader' },
            { text: 'Đơn vị', style: 'tableHeader' },
            { text: 'Đơn giá', style: 'tableHeader' },
            { text: 'Giảm giá (%)', style: 'tableHeader' },
            { text: 'Thành tiền', style: 'tableHeader' }
          ],
          ...quoteData.items.map(item => {
            const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
            const discountAmount = itemTotal * (item.discount || 0) / 100;
            const finalAmount = itemTotal - discountAmount;
            
            return [
              { text: item.name || '', style: 'tableCell' },
              { text: (item.quantity || 0).toString(), style: 'tableCell', alignment: 'center' },
              { text: item.unit || '', style: 'tableCell', alignment: 'center' },
              { text: (item.unitPrice || 0).toLocaleString('vi-VN'), style: 'tableCell', alignment: 'right' },
              { text: (item.discount || 0).toString(), style: 'tableCell', alignment: 'center' },
              { text: finalAmount.toLocaleString('vi-VN'), style: 'tableCell', alignment: 'right' }
            ];
          })
        ]
      },
      layout: {
        fillColor: function (rowIndex, node, columnIndex) {
          return (rowIndex === 0) ? '#3B82F6' : ((rowIndex % 2 === 0) ? '#F3F4F6' : null);
        }
      }
    };

    // Tính toán tổng tiền
    const { subtotal, vatAmount, total } = quoteData.totals || {};

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
                { text: 'BÁO GIÁ HÀNG HÓA', style: 'title' },
                { text: `Ngày: ${currentDate}`, style: 'subtitle' },
                { text: `Có hiệu lực đến: ${validUntil}`, style: 'subtitle' }
              ]
            },
            {
              width: 'auto',
              qr: `Quote-${Date.now()}`,
              fit: 80
            }
          ],
          margin: [0, 0, 0, 20]
        },

        // Thông tin công ty
        {
          columns: [
            {
              width: '50%',
              stack: [
                { text: 'THÔNG TIN CÔNG TY', style: 'sectionHeader' },
                { text: `Tên: ${quoteData.company?.name || ''}`, style: 'info' },
                { text: `Địa chỉ: ${quoteData.company?.address || ''}`, style: 'info' },
                { text: `Điện thoại: ${quoteData.company?.phone || ''}`, style: 'info' },
                { text: `Email: ${quoteData.company?.email || ''}`, style: 'info' },
                { text: `MST: ${quoteData.company?.taxCode || ''}`, style: 'info' }
              ]
            },
            {
              width: '50%',
              stack: [
                { text: 'THÔNG TIN KHÁCH HÀNG', style: 'sectionHeader' },
                { text: `Tên: ${quoteData.customer?.name || ''}`, style: 'info' },
                { text: `Địa chỉ: ${quoteData.customer?.address || ''}`, style: 'info' },
                { text: `Điện thoại: ${quoteData.customer?.phone || ''}`, style: 'info' },
                { text: `Email: ${quoteData.customer?.email || ''}`, style: 'info' },
                { text: `Người liên hệ: ${quoteData.customer?.contactPerson || ''}`, style: 'info' }
              ]
            }
          ],
          margin: [0, 0, 0, 30]
        },

        // Bảng sản phẩm
        { text: 'DANH SÁCH SẢN PHẨM', style: 'sectionHeader', margin: [0, 0, 0, 10] },
        itemsTable,

        // Tổng tiền
        {
          columns: [
            { width: '*', text: '' },
            {
              width: 200,
              table: {
                body: [
                  [
                    { text: 'Tạm tính:', style: 'summaryLabel' },
                    { text: `${(subtotal || 0).toLocaleString('vi-VN')} VND`, style: 'summaryValue' }
                  ],
                  [
                    { text: `VAT (${quoteData.settings?.vatRate || 10}%):`, style: 'summaryLabel' },
                    { text: `${(vatAmount || 0).toLocaleString('vi-VN')} VND`, style: 'summaryValue' }
                  ],
                  [
                    { text: 'TỔNG CỘNG:', style: 'totalLabel' },
                    { text: `${(total || 0).toLocaleString('vi-VN')} VND`, style: 'totalValue' }
                  ]
                ]
              },
              layout: 'noBorders'
            }
          ],
          margin: [0, 20, 0, 0]
        },

        // Ghi chú
        quoteData.settings?.notes ? {
          text: [
            { text: 'Ghi chú: ', style: 'noteLabel' },
            { text: quoteData.settings.notes, style: 'noteText' }
          ],
          margin: [0, 20, 0, 0]
        } : {},

        // Footer
        {
          text: [
            'Cảm ơn quý khách đã quan tâm đến sản phẩm của chúng tôi!\n',
            'Mọi thắc mắc xin vui lòng liên hệ với chúng tôi.'
          ],
          style: 'footer',
          margin: [0, 30, 0, 0]
        }
      ],

      styles: {
        title: {
          fontSize: 20,
          bold: true,
          color: '#1F2937',
          alignment: 'center'
        },
        subtitle: {
          fontSize: 12,
          color: '#6B7280',
          alignment: 'center',
          margin: [0, 5, 0, 0]
        },
        sectionHeader: {
          fontSize: 14,
          bold: true,
          color: '#374151',
          margin: [0, 0, 0, 10]
        },
        info: {
          fontSize: 11,
          margin: [0, 2, 0, 0]
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
        summaryLabel: {
          fontSize: 11,
          bold: true,
          alignment: 'left'
        },
        summaryValue: {
          fontSize: 11,
          alignment: 'right'
        },
        totalLabel: {
          fontSize: 12,
          bold: true,
          color: '#DC2626',
          alignment: 'left'
        },
        totalValue: {
          fontSize: 12,
          bold: true,
          color: '#DC2626',
          alignment: 'right'
        },
        noteLabel: {
          fontSize: 11,
          bold: true
        },
        noteText: {
          fontSize: 11,
          italics: true
        },
        footer: {
          fontSize: 10,
          alignment: 'center',
          color: '#6B7280',
          italics: true
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
    console.error('Error in generateQuotePDF:', error);
    throw error;
  }
};

module.exports = {
  generateQuotePDF
}; 