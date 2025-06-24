const moment = require('moment');

// Template định sẵn với replace fields
const contractTemplates = {
  mua_ban: {
    title: 'HỢP ĐỒNG MUA BÁN HÀNG HÓA',
    content: `
HỢP ĐỒNG MUA BÁN HÀNG HÓA
Số: {{contractNumber}}
Ngày ký: {{signDate}}

Căn cứ vào Bộ luật dân sự nước Cộng hòa xã hội chủ nghĩa Việt Nam;
Căn cứ vào nhu cầu và khả năng của các bên;

Hôm nay, ngày {{signDate}}, tại {{signLocation}}, chúng tôi gồm có:

BÊN A (BÊN BÁN): {{partyA.name}}
- Địa chỉ: {{partyA.address}}
- Mã số thuế: {{partyA.taxCode}}
- Người đại diện: {{partyA.representative}}
- Chức vụ: {{partyA.position}}
- Điện thoại: {{partyA.phone}}

BÊN B (BÊN MUA): {{partyB.name}}
- Địa chỉ: {{partyB.address}}
- Mã số thuế: {{partyB.taxCode}}
- Người đại diện: {{partyB.representative}}
- Chức vụ: {{partyB.position}}
- Điện thoại: {{partyB.phone}}

Hai bên thống nhất ký kết hợp đồng với các điều khoản sau:

ĐIỀU 1: ĐỐI TƯỢNG HỢP ĐỒNG
Bên A cam kết bán và Bên B cam kết mua: {{description}}

ĐIỀU 2: GIÁ TRỊ HỢP ĐỒNG
Tổng giá trị hợp đồng: {{contractValue}} {{currency}}
Bằng chữ: {{contractValueInWords}}

ĐIỀU 3: ĐIỀU KIỆN THANH TOÁN
{{paymentTerms}}

ĐIỀU 4: THỜI GIAN THỰC HIỆN
Thời hạn thực hiện: {{duration}} ngày kể từ ngày ký hợp đồng

ĐIỀU 5: TRÁCH NHIỆM CÁC BÊN
{{responsibilities}}

ĐIỀU 6: ĐIỀU KHOẢN KHÁC
{{specialTerms}}

Hợp đồng này có hiệu lực kể từ ngày ký và có giá trị pháp lý ràng buộc đối với các bên.

                BÊN A                           BÊN B
         {{partyA.representative}}      {{partyB.representative}}
`,
    fields: [
      { key: 'contractNumber', label: 'Số hợp đồng', type: 'text', required: false },
      { key: 'signDate', label: 'Ngày ký', type: 'date', required: true },
      { key: 'signLocation', label: 'Nơi ký', type: 'text', required: false, default: 'Tp. Hồ Chí Minh' },
      { key: 'description', label: 'Mô tả hàng hóa', type: 'textarea', required: true },
      { key: 'contractValue', label: 'Giá trị hợp đồng', type: 'number', required: true },
      { key: 'currency', label: 'Đơn vị tiền tệ', type: 'select', options: ['VND', 'USD', 'EUR'], required: true },
      { key: 'paymentTerms', label: 'Điều kiện thanh toán', type: 'textarea', required: true },
      { key: 'duration', label: 'Thời hạn (ngày)', type: 'number', required: false, default: '30' },
      { key: 'responsibilities', label: 'Trách nhiệm các bên', type: 'textarea', required: false },
      { key: 'specialTerms', label: 'Điều khoản đặc biệt', type: 'textarea', required: false }
    ]
  },
  van_chuyen: {
    title: 'HỢP ĐỒNG VẬN CHUYỂN',
    content: `
HỢP ĐỒNG VẬN CHUYỂN HÀNG HÓA
Số: {{contractNumber}}

BÊN THUÊ VẬN CHUYỂN: {{partyA.name}}
BÊN NHẬN VẬN CHUYỂN: {{partyB.name}}

THÔNG TIN VẬN CHUYỂN:
- Loại hàng hóa: {{cargoType}}
- Trọng lượng: {{weight}} {{weightUnit}}
- Điểm đi: {{originLocation}}
- Điểm đến: {{destinationLocation}}
- Thời gian vận chuyển: {{transportDuration}} ngày

GIÁ CƯỚC VẬN CHUYỂN: {{transportCost}} {{currency}}

ĐIỀU KIỆN VẬN CHUYỂN:
{{transportTerms}}
`,
    fields: [
      { key: 'cargoType', label: 'Loại hàng hóa', type: 'text', required: true },
      { key: 'weight', label: 'Trọng lượng', type: 'number', required: true },
      { key: 'weightUnit', label: 'Đơn vị trọng lượng', type: 'select', options: ['kg', 'tấn', 'm³'], required: true },
      { key: 'originLocation', label: 'Điểm đi', type: 'text', required: true },
      { key: 'destinationLocation', label: 'Điểm đến', type: 'text', required: true },
      { key: 'transportDuration', label: 'Thời gian vận chuyển (ngày)', type: 'number', required: true },
      { key: 'transportCost', label: 'Cước vận chuyển', type: 'number', required: true },
      { key: 'transportTerms', label: 'Điều kiện vận chuyển', type: 'textarea', required: false }
    ]
  }
};

// Chuyển số thành chữ (VND)
const numberToWords = (num) => {
  if (num === 0) return 'Không';
  
  const ones = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
  const units = ['', 'nghìn', 'triệu', 'tỷ'];
  
  // Simplified version - chỉ support basic numbers
  if (num < 1000) return `${ones[Math.floor(num)]} trăm`;
  if (num < 1000000) return `${Math.floor(num/1000)} nghìn`;
  if (num < 1000000000) return `${Math.floor(num/1000000)} triệu`;
  return `${Math.floor(num/1000000000)} tỷ`;
};

// Replace các fields trong template
const replaceTemplateFields = (template, data) => {
  let content = template.content;
  
  // Replace simple fields
  content = content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] || match;
  });
  
  // Replace nested fields (như partyA.name)
  content = content.replace(/\{\{(\w+)\.(\w+)\}\}/g, (match, parent, child) => {
    return (data[parent] && data[parent][child]) || match;
  });
  
  // Auto-generate missing fields
  if (!data.signDate) {
    data.signDate = moment().format('DD/MM/YYYY');
    content = content.replace(/\{\{signDate\}\}/g, data.signDate);
  }
  
  if (!data.contractNumber) {
    data.contractNumber = `HD-${moment().format('YYYYMMDD')}-${Math.floor(Math.random() * 1000)}`;
    content = content.replace(/\{\{contractNumber\}\}/g, data.contractNumber);
  }
  
  // Convert number to words for VND
  if (data.contractValue && data.currency === 'VND') {
    const words = numberToWords(parseFloat(data.contractValue));
    content = content.replace(/\{\{contractValueInWords\}\}/g, `${words} đồng`);
  }
  
  return content;
};

// Lấy template theo loại
const getTemplate = (templateType) => {
  return contractTemplates[templateType] || contractTemplates.mua_ban;
};

// Lấy danh sách tất cả templates
const getAllTemplates = () => {
  return Object.keys(contractTemplates).map(key => ({
    id: key,
    title: contractTemplates[key].title,
    fieldCount: contractTemplates[key].fields.length
  }));
};

// Generate document content
const generateDocument = (templateType, data) => {
  const template = getTemplate(templateType);
  const content = replaceTemplateFields(template, data);
  
  return {
    title: template.title,
    content: content,
    generatedAt: moment().format('DD/MM/YYYY HH:mm:ss')
  };
};

module.exports = {
  getTemplate,
  getAllTemplates,
  generateDocument,
  replaceTemplateFields,
  contractTemplates
}; 