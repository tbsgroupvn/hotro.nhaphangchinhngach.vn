const fs = require('fs');
const path = require('path');
const multer = require('multer');
const mammoth = require('mammoth');
const pdfMake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');
// Note: mammoth and multer are used in the functions below

// Fix font configuration for Railway deployment
try {
  if (pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  } else if (pdfFonts.vfs) {
    pdfMake.vfs = pdfFonts.vfs;
  } else {
    console.warn('⚠️ pdfMake fonts not loaded properly, using basic configuration');
  }
} catch (fontError) {
  console.warn('⚠️ Font configuration error:', fontError.message);
}

// Upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `template-${timestamp}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Accept .docx and .pdf files
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Chỉ hỗ trợ file .docx, .pdf, .txt'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Extract placeholders from text
const extractPlaceholders = (text) => {
  // Find patterns like [FIELD_NAME], {{FIELD_NAME}}, {FIELD_NAME}
  const patterns = [
    /\[([^\]]+)\]/g,  // [FIELD_NAME]
    /\{\{([^}]+)\}\}/g, // {{FIELD_NAME}}
    /\{([^}]+)\}/g    // {FIELD_NAME}
  ];
  
  const placeholders = new Set();
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      placeholders.add(match[1].trim());
    }
  });
  
  return Array.from(placeholders);
};

// Process uploaded template file
const processTemplateFile = async (filePath) => {
  try {
    const ext = path.extname(filePath).toLowerCase();
    let text = '';
    
    if (ext === '.docx') {
      // Extract text from DOCX
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
    } else if (ext === '.txt') {
      // Read plain text
      text = fs.readFileSync(filePath, 'utf8');
    } else {
      throw new Error('Định dạng file không được hỗ trợ');
    }
    
    // Extract placeholders
    const placeholders = extractPlaceholders(text);
    
    return {
      success: true,
      content: text,
      placeholders: placeholders,
      filePath: filePath
    };
    
  } catch (error) {
    console.error('Error processing template file:', error);
    throw error;
  }
};

// Replace placeholders in text
const replacePlaceholders = (text, data) => {
  let result = text;
  
  // Replace different placeholder formats
  Object.keys(data).forEach(key => {
    const value = data[key] || `[${key}]`; // Keep placeholder if no value
    
    // Replace [KEY], {{KEY}}, {KEY}
    result = result.replace(new RegExp(`\\[${key}\\]`, 'g'), value);
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  });
  
  return result;
};

// Generate contract from template
const generateSimpleContract = async (templatePath, data) => {
  try {
    console.log('🔄 Generating simple contract from template:', templatePath);
    
    // Read template file
    const template = await processTemplateFile(templatePath);
    
    // Replace placeholders
    const content = replacePlaceholders(template.content, data);
    
    // Create simple PDF
    const docDefinition = {
      content: [
        {
          text: 'HỢP ĐỒNG',
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        {
          text: content,
          fontSize: 12,
          lineHeight: 1.5,
          preserveLeadingSpaces: true
        },
        {
          text: `\n\nNgày tạo: ${new Date().toLocaleDateString('vi-VN')}`,
          fontSize: 10,
          italics: true,
          alignment: 'right',
          margin: [0, 20, 0, 0]
        }
      ],
      pageMargins: [40, 60, 40, 60]
    };

    // Generate PDF
    return new Promise((resolve, reject) => {
      try {
        const pdfDoc = pdfMake.createPdf(docDefinition);
        pdfDoc.getBuffer((buffer) => {
          if (buffer) {
            console.log('✅ Simple contract PDF generated successfully');
            resolve(buffer);
          } else {
            console.error('❌ Failed to generate PDF buffer');
            reject(new Error('Failed to generate PDF buffer'));
          }
        });
      } catch (pdfError) {
        console.error('❌ PDFMake error:', pdfError);
        reject(pdfError);
      }
    });

  } catch (error) {
    console.error('❌ Error in generateSimpleContract:', error);
    throw error;
  }
};

// Fallback: Return processed text if PDF fails
const generateSimpleContractFallback = async (templatePath, data) => {
  try {
    const template = await processTemplateFile(templatePath);
    const content = replacePlaceholders(template.content, data);
    
    return {
      success: true,
      type: 'text_content',
      content: content,
      placeholders: template.placeholders,
      message: 'PDF generation failed, returning text content'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
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
  upload,
  processTemplateFile,
  generateSimpleContract,
  generateSimpleContractFallback,
  extractPlaceholders,
  replacePlaceholders
}; 