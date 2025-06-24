import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Download, Tag, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../config/api';

const LabelPage = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      labelType: 'standard',
      size: 'a4',
      orientation: 'portrait',
      rows: 3,
      cols: 2,
      product: {
        name: '',
        origin: '',
        importDate: '',
        expiryDate: '',
        lotNumber: '',
        weight: '',
        unit: 'kg',
        barcode: '',
        ingredients: '',
        storage: '',
        company: {
          name: '',
          address: '',
          phone: '',
        }
      }
    }
  });

  const labelType = watch('labelType');
  const size = watch('size');
  const rows = watch('rows');
  const cols = watch('cols');

  const labelTypes = [
    { id: 'standard', name: 'Tem tiêu chuẩn', description: 'Tem dán cơ bản với thông tin sản phẩm' },
    { id: 'food', name: 'Tem thực phẩm', description: 'Tem dán cho thực phẩm nhập khẩu' },
    { id: 'cosmetic', name: 'Tem mỹ phẩm', description: 'Tem dán cho mỹ phẩm, chăm sóc da' },
    { id: 'electronic', name: 'Tem điện tử', description: 'Tem dán cho thiết bị điện tử' },
    { id: 'medicine', name: 'Tem dược phẩm', description: 'Tem dán cho thuốc và dược phẩm' },
  ];

  const onSubmit = async (data) => {
    setIsGenerating(true);
    try {
      const response = await apiClient.post('/api/labels/generate', data, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `tem-dan-${data.labelType}-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Tem dán đã được tạo thành công!');
    } catch (error) {
      console.error('Error generating label:', error);
      toast.error('Có lỗi xảy ra khi tạo tem dán');
    } finally {
      setIsGenerating(false);
    }
  };

  const calculateLabelsPerPage = () => {
    return rows * cols;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tạo tem dán sản phẩm</h1>
        <p className="text-gray-600">Tạo tem dán nhập khẩu tùy chỉnh cho từng ngành hàng</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Chọn loại tem */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Chọn loại tem dán</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {labelTypes.map((type) => (
              <label
                key={type.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  labelType === type.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  {...register('labelType')}
                  type="radio"
                  value={type.id}
                  className="sr-only"
                />
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      labelType === type.id
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-gray-300'
                    }`}>
                      {labelType === type.id && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{type.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Cài đặt kích thước và bố cục */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Cài đặt kích thước và bố cục
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="form-label">Kích thước giấy</label>
              <select {...register('size')} className="form-input">
                <option value="a4">A4 (210×297mm)</option>
                <option value="a5">A5 (148×210mm)</option>
                <option value="custom">Tùy chỉnh</option>
              </select>
            </div>
            <div>
              <label className="form-label">Hướng giấy</label>
              <select {...register('orientation')} className="form-input">
                <option value="portrait">Dọc</option>
                <option value="landscape">Ngang</option>
              </select>
            </div>
            <div>
              <label className="form-label">Số hàng</label>
              <input
                {...register('rows', { valueAsNumber: true })}
                type="number"
                min="1"
                max="10"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Số cột</label>
              <input
                {...register('cols', { valueAsNumber: true })}
                type="number"
                min="1"
                max="5"
                className="form-input"
              />
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600">
              Số tem trên mỗi trang: <strong>{calculateLabelsPerPage()}</strong>
            </p>
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin sản phẩm</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Tên sản phẩm *</label>
              <input
                {...register('product.name', { required: 'Tên sản phẩm là bắt buộc' })}
                className="form-input"
                placeholder="Nhập tên sản phẩm"
              />
              {errors.product?.name && (
                <p className="text-red-500 text-sm mt-1">{errors.product.name.message}</p>
              )}
            </div>
            <div>
              <label className="form-label">Xuất xứ *</label>
              <input
                {...register('product.origin', { required: 'Xuất xứ là bắt buộc' })}
                className="form-input"
                placeholder="Nhập xuất xứ sản phẩm"
              />
            </div>
            <div>
              <label className="form-label">Ngày nhập khẩu</label>
              <input
                {...register('product.importDate')}
                type="date"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Hạn sử dụng</label>
              <input
                {...register('product.expiryDate')}
                type="date"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Số lô</label>
              <input
                {...register('product.lotNumber')}
                className="form-input"
                placeholder="Nhập số lô sản xuất"
              />
            </div>
            <div>
              <label className="form-label">Mã vạch</label>
              <input
                {...register('product.barcode')}
                className="form-input"
                placeholder="Nhập mã vạch"
              />
            </div>
            <div>
              <label className="form-label">Trọng lượng</label>
              <input
                {...register('product.weight', { valueAsNumber: true })}
                type="number"
                min="0"
                step="0.01"
                className="form-input"
                placeholder="Nhập trọng lượng"
              />
            </div>
            <div>
              <label className="form-label">Đơn vị</label>
              <select {...register('product.unit')} className="form-input">
                <option value="kg">Kg</option>
                <option value="g">Gram</option>
                <option value="l">Lít</option>
                <option value="ml">ml</option>
                <option value="chiếc">Chiếc</option>
                <option value="hộp">Hộp</option>
                <option value="chai">Chai</option>
              </select>
            </div>
          </div>

          {/* Thông tin bổ sung cho thực phẩm */}
          {labelType === 'food' && (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin thực phẩm</h3>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Thành phần</label>
                  <textarea
                    {...register('product.ingredients')}
                    rows="3"
                    className="form-input"
                    placeholder="Liệt kê các thành phần chính"
                  />
                </div>
                <div>
                  <label className="form-label">Hướng dẫn bảo quản</label>
                  <textarea
                    {...register('product.storage')}
                    rows="2"
                    className="form-input"
                    placeholder="Hướng dẫn bảo quản sản phẩm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Thông tin bổ sung cho mỹ phẩm */}
          {labelType === 'cosmetic' && (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin mỹ phẩm</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Loại da phù hợp</label>
                  <select {...register('product.skinType')} className="form-input">
                    <option value="">Chọn loại da</option>
                    <option value="all">Mọi loại da</option>
                    <option value="dry">Da khô</option>
                    <option value="oily">Da dầu</option>
                    <option value="combination">Da hỗn hợp</option>
                    <option value="sensitive">Da nhạy cảm</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Cách sử dụng</label>
                  <textarea
                    {...register('product.usage')}
                    rows="2"
                    className="form-input"
                    placeholder="Hướng dẫn sử dụng"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Thông tin công ty */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin công ty nhập khẩu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Tên công ty *</label>
              <input
                {...register('product.company.name', { required: 'Tên công ty là bắt buộc' })}
                className="form-input"
                placeholder="Nhập tên công ty nhập khẩu"
              />
            </div>
            <div>
              <label className="form-label">Số điện thoại</label>
              <input
                {...register('product.company.phone')}
                className="form-input"
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Địa chỉ</label>
              <input
                {...register('product.company.address')}
                className="form-input"
                placeholder="Nhập địa chỉ công ty"
              />
            </div>
          </div>
        </div>

        {/* Preview kích thước */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Xem trước bố cục</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center text-gray-500 mb-4">
              Kích thước: {size.toUpperCase()} - {rows}×{cols} tem/trang
            </div>
            <div className={`grid gap-2 mx-auto max-w-md`} style={{
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, 1fr)`
            }}>
              {Array.from({ length: rows * cols }).map((_, index) => (
                <div
                  key={index}
                  className="border border-gray-300 rounded p-2 text-xs text-center bg-gray-50"
                  style={{
                    aspectRatio: '3/2',
                    minHeight: '40px'
                  }}
                >
                  <Tag className="w-4 h-4 mx-auto mb-1 text-gray-400" />
                  <div className="text-gray-400">Tem #{index + 1}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Nút tạo tem */}
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
                <span>Tạo tem dán PDF</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LabelPage; 