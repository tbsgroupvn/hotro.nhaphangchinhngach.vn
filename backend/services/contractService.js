const fs = require('fs');
const path = require('path');
const multer = require('multer');

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
    // Accept .txt files for now (simple and reliable)
    if (file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Hiện tại chỉ hỗ trợ file .txt'));
    }
  },
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
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

// Process uploaded template file (simple text only)
const processTemplateFile = async (filePath) => {
  try {
    console.log('🔄 Processing template file:', filePath);
    
    // Read text file
    const text = fs.readFileSync(filePath, 'utf8');
    
    // Extract placeholders
    const placeholders = extractPlaceholders(text);
    
    console.log('✅ Found placeholders:', placeholders);
    
    return {
      success: true,
      content: text,
      placeholders: placeholders,
      filePath: filePath
    };
    
  } catch (error) {
    console.error('❌ Error processing template file:', error);
    throw error;
  }
};

// Replace placeholders in text
const replacePlaceholders = (text, data) => {
  let result = text;
  
  console.log('🔄 Replacing placeholders with data:', Object.keys(data));
  
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

// Generate simple text contract (no PDF for now)
const generateSimpleContract = async (templatePath, data) => {
  try {
    console.log('🔄 Generating simple contract from:', templatePath);
    
    // Read template file
    const template = await processTemplateFile(templatePath);
    
    // Replace placeholders
    const content = replacePlaceholders(template.content, data);
    
    console.log('✅ Contract content generated');
    
    // For now, return as plain text (Railway-friendly)
    return {
      success: true,
      type: 'text_content',
      content: content,
      generatedAt: new Date().toLocaleString('vi-VN'),
      message: 'Hợp đồng được tạo dưới dạng text'
    };

  } catch (error) {
    console.error('❌ Error in generateSimpleContract:', error);
    throw error;
  }
};

// Fallback: Always return text content
const generateSimpleContractFallback = async (templatePath, data) => {
  try {
    const template = await processTemplateFile(templatePath);
    const content = replacePlaceholders(template.content, data);
    
    return {
      success: true,
      type: 'text_content',
      content: content,
      placeholders: template.placeholders,
      generatedAt: new Date().toLocaleString('vi-VN'),
      message: 'Hợp đồng text content'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  upload,
  processTemplateFile,
  generateSimpleContract,
  generateSimpleContractFallback,
  extractPlaceholders,
  replacePlaceholders
}; 