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

const generateLabelPDF = async (labelData) => {
  try {
    const { product, labelType, size, orientation, rows, cols } = labelData;
    const totalLabels = rows * cols;

    // Tính kích thước label
    const pageSize = getPageSize(size, orientation);
    const labelWidth = (pageSize.width - 20) / cols;
    const labelHeight = (pageSize.height - 20) / rows;

    // Tạo nội dung cho từng label
    const labels = Array.from({ length: totalLabels }, () => createLabelContent(product, labelType, labelWidth, labelHeight));

    const docDefinition = {
      pageSize: size.toUpperCase(),
      pageOrientation: orientation,
      pageMargins: [10, 10, 10, 10],
      content: [
        {
          table: {
            widths: Array(cols).fill('*'),
            heights: Array(rows).fill(labelHeight),
            body: createLabelGrid(labels, rows, cols)
          },
          layout: {
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => '#CCCCCC',
            vLineColor: () => '#CCCCCC'
          }
        }
      ]
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
    console.error('Error in generateLabelPDF:', error);
    throw error;
  }
};

const createLabelContent = (product, labelType, width, height) => {
  const baseContent = [
    { 
      text: product.name || 'Tên sản phẩm', 
      style: 'productName',
      margin: [2, 2, 2, 1]
    },
    { 
      text: `Xuất xứ: ${product.origin || 'N/A'}`, 
      style: 'origin',
      margin: [2, 1, 2, 1]
    },
    { 
      text: `Công ty: ${product.company?.name || 'N/A'}`, 
      style: 'company',
      margin: [2, 1, 2, 1]
    }
  ];

  // Thêm thông tin cụ thể theo loại tem
  switch (labelType) {
    case 'food':
      baseContent.push(
        { text: `Thành phần: ${product.ingredients || 'N/A'}`, style: 'info', margin: [2, 1, 2, 1] },
        { text: `HSD: ${formatDate(product.expiryDate)}`, style: 'expiry', margin: [2, 1, 2, 1] },
        { text: `Bảo quản: ${product.storage || 'N/A'}`, style: 'storage', margin: [2, 1, 2, 1] }
      );
      break;
    case 'cosmetic':
      baseContent.push(
        { text: `Loại da: ${product.skinType || 'Mọi loại da'}`, style: 'info', margin: [2, 1, 2, 1] },
        { text: `Cách dùng: ${product.usage || 'N/A'}`, style: 'info', margin: [2, 1, 2, 1] },
        { text: `HSD: ${formatDate(product.expiryDate)}`, style: 'expiry', margin: [2, 1, 2, 1] }
      );
      break;
    case 'electronic':
      baseContent.push(
        { text: `Model: ${product.model || 'N/A'}`, style: 'info', margin: [2, 1, 2, 1] },
        { text: `Bảo hành: ${product.warranty || 'N/A'}`, style: 'info', margin: [2, 1, 2, 1] }
      );
      break;
    case 'medicine':
      baseContent.push(
        { text: `Hoạt chất: ${product.activeIngredient || 'N/A'}`, style: 'info', margin: [2, 1, 2, 1] },
        { text: `HSD: ${formatDate(product.expiryDate)}`, style: 'expiry', margin: [2, 1, 2, 1] },
        { text: `Số lô: ${product.lotNumber || 'N/A'}`, style: 'info', margin: [2, 1, 2, 1] }
      );
      break;
    default:
      if (product.weight) {
        baseContent.push(
          { text: `Trọng lượng: ${product.weight} ${product.unit || 'kg'}`, style: 'info', margin: [2, 1, 2, 1] }
        );
      }
      if (product.lotNumber) {
        baseContent.push(
          { text: `Số lô: ${product.lotNumber}`, style: 'info', margin: [2, 1, 2, 1] }
        );
      }
  }

  // Thêm mã vạch nếu có
  if (product.barcode) {
    baseContent.push(
      { text: `Mã: ${product.barcode}`, style: 'barcode', margin: [2, 1, 2, 2] }
    );
  }

  return {
    stack: baseContent,
    style: 'label'
  };
};

const createLabelGrid = (labels, rows, cols) => {
  const grid = [];
  let labelIndex = 0;

  for (let row = 0; row < rows; row++) {
    const rowData = [];
    for (let col = 0; col < cols; col++) {
      if (labelIndex < labels.length) {
        rowData.push(labels[labelIndex]);
        labelIndex++;
      } else {
        rowData.push({ text: '', style: 'label' });
      }
    }
    grid.push(rowData);
  }

  return grid;
};

const getPageSize = (size, orientation) => {
  const sizes = {
    a4: { width: 595, height: 842 },
    a5: { width: 420, height: 595 }
  };

  let pageSize = sizes[size] || sizes.a4;
  
  if (orientation === 'landscape') {
    return { width: pageSize.height, height: pageSize.width };
  }
  
  return pageSize;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return moment(dateString).format('DD/MM/YYYY');
};

// Định nghĩa styles cho PDF
const styles = {
  label: {
    fontSize: 8,
    lineHeight: 1.1
  },
  productName: {
    fontSize: 10,
    bold: true,
    color: '#1F2937'
  },
  origin: {
    fontSize: 8,
    color: '#374151'
  },
  company: {
    fontSize: 7,
    color: '#6B7280'
  },
  info: {
    fontSize: 7,
    color: '#4B5563'
  },
  expiry: {
    fontSize: 8,
    bold: true,
    color: '#DC2626'
  },
  storage: {
    fontSize: 7,
    italics: true,
    color: '#059669'
  },
  barcode: {
    fontSize: 7,
    color: '#1F2937',
    alignment: 'center'
  }
};

module.exports = {
  generateLabelPDF
}; 