import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const ContractPage = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const contractTemplates = [
    { id: 'mua_ban', name: 'Hợp đồng mua bán hàng hóa', description: 'Dành cho giao dịch mua bán hàng hóa nhập khẩu' },
    { id: 'van_chuyen', name: 'Hợp đồng vận chuyển', description: 'Dành cho dịch vụ vận chuyển hàng hóa' },
    { id: 'bao_hiem', name: 'Hợp đồng bảo hiểm', description: 'Bảo hiểm hàng hóa nhập khẩu' },
    { id: 'dai_ly', name: 'Hợp đồng đại lý', description: 'Hợp đồng đại lý phân phối' },
  ];

  const onSubmit = async (data) => {
    if (!selectedTemplate) {
      toast.error('Vui lòng chọn mẫu hợp đồng');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await axios.post('/api/contracts/generate', {
        ...data,
        template: selectedTemplate
      }, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `hop-dong-${selectedTemplate}-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Hợp đồng đã được tạo thành công!');
    } catch (error) {
      console.error('Error generating contract:', error);
      toast.error('Có lỗi xảy ra khi tạo hợp đồng');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tạo hợp đồng</h1>
        <p className="text-gray-600">Tạo hợp đồng từ template có sẵn với thông tin tùy chỉnh</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Chọn mẫu hợp đồng */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Chọn mẫu hợp đồng</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contractTemplates.map((template) => (
              <div
                key={template.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedTemplate === template.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedTemplate === template.id
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedTemplate === template.id && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Thông tin bên A (Công ty) */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin bên A (Công ty)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Tên công ty *</label>
              <input
                {...register('partyA.name', { required: 'Tên công ty là bắt buộc' })}
                className="form-input"
                placeholder="Nhập tên công ty"
              />
              {errors.partyA?.name && (
                <p className="text-red-500 text-sm mt-1">{errors.partyA.name.message}</p>
              )}
            </div>
            <div>
              <label className="form-label">Mã số thuế</label>
              <input
                {...register('partyA.taxCode')}
                className="form-input"
                placeholder="Nhập mã số thuế"
              />
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Địa chỉ *</label>
              <input
                {...register('partyA.address', { required: 'Địa chỉ là bắt buộc' })}
                className="form-input"
                placeholder="Nhập địa chỉ công ty"
              />
            </div>
            <div>
              <label className="form-label">Người đại diện *</label>
              <input
                {...register('partyA.representative', { required: 'Người đại diện là bắt buộc' })}
                className="form-input"
                placeholder="Nhập tên người đại diện"
              />
            </div>
            <div>
              <label className="form-label">Chức vụ</label>
              <input
                {...register('partyA.position')}
                className="form-input"
                placeholder="Nhập chức vụ"
              />
            </div>
            <div>
              <label className="form-label">Số điện thoại</label>
              <input
                {...register('partyA.phone')}
                className="form-input"
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input
                {...register('partyA.email')}
                type="email"
                className="form-input"
                placeholder="Nhập email"
              />
            </div>
          </div>
        </div>

        {/* Thông tin bên B (Đối tác) */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin bên B (Đối tác)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Tên đối tác *</label>
              <input
                {...register('partyB.name', { required: 'Tên đối tác là bắt buộc' })}
                className="form-input"
                placeholder="Nhập tên đối tác"
              />
              {errors.partyB?.name && (
                <p className="text-red-500 text-sm mt-1">{errors.partyB.name.message}</p>
              )}
            </div>
            <div>
              <label className="form-label">Mã số thuế</label>
              <input
                {...register('partyB.taxCode')}
                className="form-input"
                placeholder="Nhập mã số thuế"
              />
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Địa chỉ *</label>
              <input
                {...register('partyB.address', { required: 'Địa chỉ là bắt buộc' })}
                className="form-input"
                placeholder="Nhập địa chỉ đối tác"
              />
            </div>
            <div>
              <label className="form-label">Người đại diện *</label>
              <input
                {...register('partyB.representative', { required: 'Người đại diện là bắt buộc' })}
                className="form-input"
                placeholder="Nhập tên người đại diện"
              />
            </div>
            <div>
              <label className="form-label">Chức vụ</label>
              <input
                {...register('partyB.position')}
                className="form-input"
                placeholder="Nhập chức vụ"
              />
            </div>
            <div>
              <label className="form-label">Số điện thoại</label>
              <input
                {...register('partyB.phone')}
                className="form-input"
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input
                {...register('partyB.email')}
                type="email"
                className="form-input"
                placeholder="Nhập email"
              />
            </div>
          </div>
        </div>

        {/* Chi tiết hợp đồng */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Chi tiết hợp đồng</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Số hợp đồng</label>
              <input
                {...register('contractNumber')}
                className="form-input"
                placeholder="Nhập số hợp đồng"
              />
            </div>
            <div>
              <label className="form-label">Ngày ký</label>
              <input
                {...register('signDate')}
                type="date"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Giá trị hợp đồng</label>
              <input
                {...register('contractValue', { valueAsNumber: true })}
                type="number"
                min="0"
                className="form-input"
                placeholder="Nhập giá trị hợp đồng"
              />
            </div>
            <div>
              <label className="form-label">Đơn vị tiền tệ</label>
              <select {...register('currency')} className="form-input">
                <option value="VND">VND</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="CNY">CNY</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Mô tả hàng hóa/dịch vụ</label>
              <textarea
                {...register('description')}
                rows="3"
                className="form-input"
                placeholder="Mô tả chi tiết về hàng hóa hoặc dịch vụ"
              />
            </div>
            <div>
              <label className="form-label">Thời hạn thực hiện (ngày)</label>
              <input
                {...register('duration', { valueAsNumber: true })}
                type="number"
                min="1"
                className="form-input"
                placeholder="Số ngày thực hiện"
              />
            </div>
            <div>
              <label className="form-label">Điều kiện thanh toán</label>
              <select {...register('paymentTerms')} className="form-input">
                <option value="prepaid">Trả trước 100%</option>
                <option value="cod">Thanh toán khi giao hàng</option>
                <option value="30days">Thanh toán trong 30 ngày</option>
                <option value="60days">Thanh toán trong 60 ngày</option>
                <option value="installment">Thanh toán theo đợt</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Điều khoản đặc biệt</label>
              <textarea
                {...register('specialTerms')}
                rows="4"
                className="form-input"
                placeholder="Các điều khoản đặc biệt khác (nếu có)"
              />
            </div>
          </div>
        </div>

        {/* Nút tạo hợp đồng */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isGenerating}
            className="flex items-center space-x-2 btn-primary px-8 py-3 text-lg disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Đang tạo...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Tạo hợp đồng PDF</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContractPage; 