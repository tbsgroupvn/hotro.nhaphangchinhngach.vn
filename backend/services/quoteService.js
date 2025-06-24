// Simplified Quote Service for Railway compatibility

const generateQuotePDF = async (quoteData) => {
  try {
    console.log('🔄 Generating quote for:', quoteData.customer?.name);
    
    const currentDate = new Date().toLocaleDateString('vi-VN');
    const validUntil = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)).toLocaleDateString('vi-VN');

    // Calculate totals
    let subtotal = 0;
    const processedItems = quoteData.items.map(item => {
      const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
      const discountAmount = itemTotal * (item.discount || 0) / 100;
      const finalAmount = itemTotal - discountAmount;
      subtotal += finalAmount;
      
      return {
        ...item,
        itemTotal: itemTotal,
        discountAmount: discountAmount,
        finalAmount: finalAmount
      };
    });

    const vatRate = quoteData.settings?.vatRate || 10;
    const vatAmount = subtotal * vatRate / 100;
    const total = subtotal + vatAmount;

    // Create quote content as HTML/Text (simplified)
    const quoteContent = `
BÁO GIÁ HÀNG HÓA
==================

Ngày: ${currentDate}
Có hiệu lực đến: ${validUntil}

THÔNG TIN CÔNG TY:
- Tên: ${quoteData.company?.name || ''}
- Địa chỉ: ${quoteData.company?.address || ''}
- Điện thoại: ${quoteData.company?.phone || ''}
- Email: ${quoteData.company?.email || ''}
- MST: ${quoteData.company?.taxCode || ''}

THÔNG TIN KHÁCH HÀNG:
- Tên: ${quoteData.customer?.name || ''}
- Địa chỉ: ${quoteData.customer?.address || ''}
- Điện thoại: ${quoteData.customer?.phone || ''}
- Email: ${quoteData.customer?.email || ''}
- Người liên hệ: ${quoteData.customer?.contactPerson || ''}

DANH SÁCH SẢN PHẨM:
${processedItems.map(item => 
  `- ${item.name}: ${item.quantity} ${item.unit} x ${item.unitPrice?.toLocaleString('vi-VN')} VND = ${item.finalAmount?.toLocaleString('vi-VN')} VND`
).join('\n')}

TỔNG KẾT:
- Tạm tính: ${subtotal.toLocaleString('vi-VN')} VND
- VAT (${vatRate}%): ${vatAmount.toLocaleString('vi-VN')} VND
- TỔNG CỘNG: ${total.toLocaleString('vi-VN')} VND

${quoteData.settings?.notes ? `Ghi chú: ${quoteData.settings.notes}` : ''}

Cảm ơn quý khách đã quan tâm đến sản phẩm của chúng tôi!
    `;

    console.log('✅ Quote generated successfully');

    // Return as text instead of PDF (Railway-friendly)
    return {
      success: true,
      type: 'text_content',
      content: quoteContent,
      data: {
        company: quoteData.company,
        customer: quoteData.customer,
        items: processedItems,
        totals: {
          subtotal: subtotal,
          vatAmount: vatAmount,
          total: total,
          vatRate: vatRate
        },
        dates: {
          created: currentDate,
          validUntil: validUntil
        }
      },
      generatedAt: new Date().toISOString(),
      message: 'Báo giá được tạo dưới dạng text'
    };

  } catch (error) {
    console.error('❌ Error in generateQuotePDF:', error);
    throw error;
  }
};

module.exports = {
  generateQuotePDF
}; 