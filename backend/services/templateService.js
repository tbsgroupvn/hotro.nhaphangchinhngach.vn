const moment = require('moment');
const fs = require('fs-extra');
const path = require('path');
const XLSX = require('xlsx');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const Template = require('../models/Template');

// Đảm bảo thư mục uploads tồn tại
const UPLOAD_DIR = path.join(__dirname, '../uploads');
fs.ensureDirSync(UPLOAD_DIR);

// Template định sẵn với replace fields
const contractTemplates = {
  import_contract: {
    title: "HỢP ĐỒNG NHẬP KHẨU HÀNG HÓA",
    content: `
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc

HỢP ĐỒNG NHẬP KHẨU HÀNG HÓA
Số: {{contractNumber}}

Hôm nay, ngày {{contractDate}}, tại {{contractLocation}}, chúng tôi gồm:

BÊN A (Bên mua): {{buyerName}}
- Địa chỉ: {{buyerAddress}}
- Điện thoại: {{buyerPhone}}
- Email: {{buyerEmail}}
- Mã số thuế: {{buyerTaxCode}}

BÊN B (Bên bán): {{sellerName}}
- Địa chỉ: {{sellerAddress}}
- Điện thoại: {{sellerPhone}}
- Email: {{sellerEmail}}
- Mã số thuế: {{sellerTaxCode}}

ĐIỀU 1: ĐỐI TƯỢNG HỢP ĐỒNG
Hàng hóa: {{productName}}
Xuất xứ: {{productOrigin}}
Số lượng: {{quantity}}
Đơn giá: {{unitPrice}}
Tổng giá trị: {{totalValue}}

ĐIỀU 2: ĐIỀU KIỆN GIAO HÀNG
Thời gian giao hàng: {{deliveryTime}}
Địa điểm giao hàng: {{deliveryLocation}}

ĐIỀU 3: ĐIỀU KIỆN THANH TOÁN
Phương thức thanh toán: {{paymentMethod}}
Thời hạn thanh toán: {{paymentTerm}}

Hợp đồng có hiệu lực từ ngày ký.

BÊN A                    BÊN B
{{buyerName}}            {{sellerName}}
    `
  }
};

// Lấy template theo ID
const getTemplate = (templateId) => {
  return contractTemplates[templateId] || null;
};

// Lấy tất cả templates
const getAllTemplates = () => {
  return Object.keys(contractTemplates).map(id => ({
    id,
    title: contractTemplates[id].title
  }));
};

// Thay thế các trường trong template
const replaceTemplateFields = (template, data) => {
  let content = template.content;
  
  // Thay thế tất cả các trường {{field}}
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    content = content.replace(regex, data[key] || '');
  });
  
  return content;
};

// Tạo document từ template
const generateDocument = (templateId, data) => {
  const template = getTemplate(templateId);
  if (!template) {
    throw new Error('Template không tồn tại');
  }
  
  const content = replaceTemplateFields(template, data);
  
  return {
    title: template.title,
    content: content,
    generatedAt: moment().format('DD/MM/YYYY HH:mm:ss')
  };
};

class TemplateService {
  // Upload và lưu template
  async uploadTemplate(file, templateData) {
    try {
      const { name, description, category } = templateData;
      
      // Xác định loại file
      const fileExtension = path.extname(file.originalname).toLowerCase();
      let fileType;
      
      switch (fileExtension) {
        case '.docx':
          fileType = 'docx';
          break;
        case '.pdf':
          fileType = 'pdf';
          break;
        case '.xlsx':
        case '.xls':
          fileType = 'excel';
          break;
        default:
          throw new Error('Loại file không được hỗ trợ. Chỉ chấp nhận .docx, .pdf, .xlsx, .xls');
      }

      // Tạo tên file unique
      const timestamp = Date.now();
      const uniqueFilename = `${timestamp}_${file.originalname}`;
      const filePath = path.join(UPLOAD_DIR, uniqueFilename);

      // Di chuyển file từ temp location
      await fs.move(file.path, filePath);

      // Đọc metadata của file
      const metadata = await this.extractMetadata(filePath, fileType);

      // Check if MongoDB is connected
      const mongoose = require('mongoose');
      if (mongoose.connection.readyState !== 1) {
        // MongoDB not connected, return demo response
        return {
          _id: 'demo-' + Date.now(),
          name,
          description,
          type: fileType,
          category,
          filename: uniqueFilename,
          originalName: file.originalname,
          fileSize: file.size,
          uploadDate: new Date().toISOString(),
          isActive: true,
          metadata,
          isDemoMode: true
        };
      }

      // Lưu thông tin template vào database
      const template = new Template({
        name,
        description,
        type: fileType,
        category,
        filename: uniqueFilename,
        originalName: file.originalname,
        filePath,
        fileSize: file.size,
        metadata
      });

      await template.save();
      return template;
    } catch (error) {
      // Cleanup file nếu có lỗi
      if (file.path && await fs.pathExists(file.path)) {
        await fs.remove(file.path);
      }
      throw error;
    }
  }

  // Lấy danh sách templates
  async getTemplates(filters = {}) {
    try {
      // Check if MongoDB is connected
      const mongoose = require('mongoose');
      if (mongoose.connection.readyState !== 1) {
        // MongoDB not connected, return demo data
        return this.getDemoTemplates(filters);
      }

      const query = { isActive: true };
      
      if (filters.category) {
        query.category = filters.category;
      }
      
      if (filters.type) {
        query.type = filters.type;
      }

      // Set a short timeout for the query
      const templates = await Template.find(query)
        .sort({ uploadDate: -1 })
        .select('-filePath')
        .timeout(3000); // 3 second timeout

      return templates;
    } catch (error) {
      // If any error (including timeout), return demo data
      return this.getDemoTemplates(filters);
    }
  }

  // Demo templates for development
  getDemoTemplates(filters = {}) {
    const demoTemplates = [
      {
        _id: 'demo1',
        name: 'Hợp đồng nhập khẩu mẫu',
        description: 'Template hợp đồng nhập khẩu chính ngạch',
        type: 'docx',
        category: 'contract',
        originalName: 'hop-dong-nhap-khau.docx',
        fileSize: 25600,
        uploadDate: new Date().toISOString(),
        isActive: true
      },
      {
        _id: 'demo2',
        name: 'Báo giá Excel mẫu',
        description: 'Template báo giá hàng hóa nhập khẩu',
        type: 'excel',
        category: 'quote',
        originalName: 'bao-gia-hang-hoa.xlsx',
        fileSize: 15360,
        uploadDate: new Date().toISOString(),
        isActive: true
      },
      {
        _id: 'demo3',
        name: 'Tem nhãn sản phẩm',
        description: 'Template tem nhãn cho sản phẩm nhập khẩu',
        type: 'pdf',
        category: 'label',
        originalName: 'tem-nhan-san-pham.pdf',
        fileSize: 8192,
        uploadDate: new Date().toISOString(),
        isActive: true
      },
      {
        _id: 'demo4',
        name: 'Phiếu thanh toán',
        description: 'Template phiếu đề nghị thanh toán',
        type: 'docx',
        category: 'payment',
        originalName: 'phieu-thanh-toan.docx',
        fileSize: 12800,
        uploadDate: new Date().toISOString(),
        isActive: true
      }
    ];
    
    let filteredTemplates = demoTemplates;
    if (filters.category) {
      filteredTemplates = filteredTemplates.filter(t => t.category === filters.category);
    }
    if (filters.type) {
      filteredTemplates = filteredTemplates.filter(t => t.type === filters.type);
    }
    
    return filteredTemplates;
  }

  // Lấy template theo ID
  async getTemplateById(id) {
    try {
      const template = await Template.findById(id);
      if (!template || !template.isActive) {
        throw new Error('Template không tồn tại');
      }
      return template;
    } catch (error) {
      throw error;
    }
  }

  // Đọc nội dung file template
  async readTemplateContent(templateId) {
    try {
      const template = await this.getTemplateById(templateId);
      const content = await this.readFileContent(template.filePath, template.type);
      
      return {
        template,
        content
      };
    } catch (error) {
      throw error;
    }
  }

  // Xóa template
  async deleteTemplate(id) {
    try {
      const template = await Template.findById(id);
      if (!template) {
        throw new Error('Template không tồn tại');
      }

      // Xóa file khỏi disk
      if (await fs.pathExists(template.filePath)) {
        await fs.remove(template.filePath);
      }

      // Đánh dấu là không hoạt động thay vì xóa hoàn toàn
      template.isActive = false;
      await template.save();

      return { message: 'Đã xóa template thành công' };
    } catch (error) {
      throw error;
    }
  }

  // Đọc nội dung file dựa trên loại
  async readFileContent(filePath, fileType) {
    try {
      switch (fileType) {
        case 'docx':
          return await this.readDocxContent(filePath);
        case 'pdf':
          return await this.readPdfContent(filePath);
        case 'excel':
          return await this.readExcelContent(filePath);
        default:
          throw new Error('Loại file không được hỗ trợ');
      }
    } catch (error) {
      throw error;
    }
  }

  // Đọc file DOCX
  async readDocxContent(filePath) {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return {
        text: result.value,
        type: 'docx',
        messages: result.messages
      };
    } catch (error) {
      throw new Error(`Lỗi đọc file DOCX: ${error.message}`);
    }
  }

  // Đọc file PDF
  async readPdfContent(filePath) {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdfParse(dataBuffer);
      
      return {
        text: data.text,
        type: 'pdf',
        pages: data.numpages,
        info: data.info
      };
    } catch (error) {
      throw new Error(`Lỗi đọc file PDF: ${error.message}`);
    }
  }

  // Đọc file Excel
  async readExcelContent(filePath) {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheets = {};
      
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        sheets[sheetName] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      });

      return {
        sheets,
        type: 'excel',
        sheetNames: workbook.SheetNames
      };
    } catch (error) {
      throw new Error(`Lỗi đọc file Excel: ${error.message}`);
    }
  }

  // Trích xuất metadata từ file
  async extractMetadata(filePath, fileType) {
    try {
      const stats = await fs.stat(filePath);
      const metadata = {
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
        size: stats.size
      };

      // Thêm metadata specific cho từng loại file
      switch (fileType) {
        case 'excel':
          const workbook = XLSX.readFile(filePath);
          metadata.sheetNames = workbook.SheetNames;
          metadata.sheetCount = workbook.SheetNames.length;
          break;
        case 'pdf':
          try {
            const dataBuffer = await fs.readFile(filePath);
            const pdfData = await pdfParse(dataBuffer);
            metadata.pages = pdfData.numpages;
            metadata.info = pdfData.info;
          } catch (err) {
            // Ignore PDF parsing errors for metadata
          }
          break;
      }

      return metadata;
    } catch (error) {
      return {};
    }
  }

  // Cập nhật thông tin template
  async updateTemplate(id, updateData) {
    try {
      const template = await Template.findById(id);
      if (!template || !template.isActive) {
        throw new Error('Template không tồn tại');
      }

      // Chỉ cho phép cập nhật một số trường
      const allowedFields = ['name', 'description'];
      const updates = {};
      
      allowedFields.forEach(field => {
        if (updateData[field] !== undefined) {
          updates[field] = updateData[field];
        }
      });

      Object.assign(template, updates);
      await template.save();

      return template;
    } catch (error) {
      throw error;
    }
  }
}

const templateServiceInstance = new TemplateService();

module.exports = {
  // Xuất các function cũ
  getTemplate,
  getAllTemplates,
  generateDocument,
  replaceTemplateFields,
  contractTemplates,
  
  // Xuất instance của class mới
  templateService: templateServiceInstance,
  
  // Xuất các method của class
  uploadTemplate: templateServiceInstance.uploadTemplate.bind(templateServiceInstance),
  getTemplates: templateServiceInstance.getTemplates.bind(templateServiceInstance),
  getTemplateById: templateServiceInstance.getTemplateById.bind(templateServiceInstance),
  readTemplateContent: templateServiceInstance.readTemplateContent.bind(templateServiceInstance),
  deleteTemplate: templateServiceInstance.deleteTemplate.bind(templateServiceInstance),
  updateTemplate: templateServiceInstance.updateTemplate.bind(templateServiceInstance)
}; 