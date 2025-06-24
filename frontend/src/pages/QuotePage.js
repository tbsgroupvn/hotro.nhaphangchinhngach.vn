import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Download, Calculator } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const QuotePage = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      company: {
        name: '',
        address: '',
        phone: '',
        email: '',
        taxCode: '',
      },
      customer: {
        name: '',
        address: '',
        phone: '',
        email: '',
        contactPerson: '',
      },
      items: [
        {
          name: '',
          description: '',
          quantity: 1,
          unit: 'chiếc',
          unitPrice: 0,
          discount: 0,
        }
      ],
      settings: {
        currency: 'VND',
        vatRate: 10,
        validDays: 30,
        notes: '',
      }
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  const watchedItems = watch('items');
  const vatRate = watch('settings.vatRate');

  // Tính toán tổng tiền
  const calculateTotal = () => {
    const subtotal = watchedItems.reduce((total, item) => {
      const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
      const discountAmount = itemTotal * (item.discount || 0) / 100;
      return total + itemTotal - discountAmount;
    }, 0);
    
    const vatAmount = subtotal * (vatRate || 0) / 100;
    const total = subtotal + vatAmount;
    
    return { subtotal, vatAmount, total };
  };

  const { subtotal, vatAmount, total } = calculateTotal();

  const onSubmit = async (data) => {
    setIsGenerating(true);
    try {
      const response = await axios.post('/api/quotes/generate', {
        ...data,
        totals: { subtotal, vatAmount, total }
      }, {
        responseType: 'blob'
      });

      // Tạo URL để download file PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bao-gia-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Báo giá đã được tạo thành công!');
    } catch (error) {
      console.error('Error generating quote:', error);
      toast.error('Có lỗi xảy ra khi tạo báo giá');
    } finally {
      setIsGenerating(false);
    }
  };

  const addItem = () => {
    append({
      name: '',
      description: '',
      quantity: 1,
      unit: 'chiếc',
      unitPrice: 0,
      discount: 0,
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tạo báo giá hàng hóa</h1>
        <p className="text-gray-600">Nhập thông tin để tạo báo giá chuyên nghiệp</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Thông tin công ty */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin công ty</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Tên công ty *</label>
              <input
                {...register('company.name', { required: 'Tên công ty là bắt buộc' })}
                className="form-input"
                placeholder="Nhập tên công ty"
              />
              {errors.company?.name && (
                <p className="text-red-500 text-sm mt-1">{errors.company.name.message}</p>
              )}
            </div>
            <div>
              <label className="form-label">Mã số thuế</label>
              <input
                {...register('company.taxCode')}
                className="form-input"
                placeholder="Nhập mã số thuế"
              />
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Địa chỉ</label>
              <input
                {...register('company.address')}
                className="form-input"
                placeholder="Nhập địa chỉ công ty"
              />
            </div>
            <div>
              <label className="form-label">Số điện thoại</label>
              <input
                {...register('company.phone')}
                className="form-input"
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input
                {...register('company.email')}
                type="email"
                className="form-input"
                placeholder="Nhập email"
              />
            </div>
          </div>
        </div>

        {/* Thông tin khách hàng */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin khách hàng</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Tên khách hàng *</label>
              <input
                {...register('customer.name', { required: 'Tên khách hàng là bắt buộc' })}
                className="form-input"
                placeholder="Nhập tên khách hàng"
              />
              {errors.customer?.name && (
                <p className="text-red-500 text-sm mt-1">{errors.customer.name.message}</p>
              )}
            </div>
            <div>
              <label className="form-label">Người liên hệ</label>
              <input
                {...register('customer.contactPerson')}
                className="form-input"
                placeholder="Nhập tên người liên hệ"
              />
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Địa chỉ</label>
              <input
                {...register('customer.address')}
                className="form-input"
                placeholder="Nhập địa chỉ khách hàng"
              />
            </div>
            <div>
              <label className="form-label">Số điện thoại</label>
              <input
                {...register('customer.phone')}
                className="form-input"
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input
                {...register('customer.email')}
                type="email"
                className="form-input"
                placeholder="Nhập email"
              />
            </div>
          </div>
        </div>

        {/* Danh sách hàng hóa */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Danh sách hàng hóa</h2>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm mặt hàng</span>
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">Mặt hàng #{index + 1}</h3>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                  <div className="md:col-span-2">
                    <label className="form-label">Tên hàng hóa *</label>
                    <input
                      {...register(`items.${index}.name`, { required: true })}
                      className="form-input"
                      placeholder="Nhập tên hàng hóa"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="form-label">Mô tả</label>
                    <input
                      {...register(`items.${index}.description`)}
                      className="form-input"
                      placeholder="Mô tả chi tiết"
                    />
                  </div>
                  <div>
                    <label className="form-label">Số lượng</label>
                    <input
                      {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                      type="number"
                      min="1"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Đơn vị</label>
                    <select {...register(`items.${index}.unit`)} className="form-input">
                      <option value="chiếc">Chiếc</option>
                      <option value="kg">Kg</option>
                      <option value="m">Mét</option>
                      <option value="m2">M²</option>
                      <option value="m3">M³</option>
                      <option value="thùng">Thùng</option>
                      <option value="bộ">Bộ</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Đơn giá</label>
                    <input
                      {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                      type="number"
                      min="0"
                      className="form-input"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="form-label">Giảm giá (%)</label>
                    <input
                      {...register(`items.${index}.discount`, { valueAsNumber: true })}
                      type="number"
                      min="0"
                      max="100"
                      className="form-input"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tính toán và cài đặt */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tổng tiền */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Calculator className="w-5 h-5 mr-2" />
              Tổng tiền
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span className="font-medium">{subtotal.toLocaleString('vi-VN')} VND</span>
              </div>
              <div className="flex justify-between">
                <span>VAT ({vatRate}%):</span>
                <span className="font-medium">{vatAmount.toLocaleString('vi-VN')} VND</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-primary-600">{total.toLocaleString('vi-VN')} VND</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cài đặt */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Cài đặt</h2>
            <div className="space-y-4">
              <div>
                <label className="form-label">Thuế VAT (%)</label>
                <input
                  {...register('settings.vatRate', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  max="100"
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Hiệu lực (ngày)</label>
                <input
                  {...register('settings.validDays', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Ghi chú</label>
                <textarea
                  {...register('settings.notes')}
                  rows="3"
                  className="form-input"
                  placeholder="Ghi chú thêm cho báo giá"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Nút tạo báo giá */}
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
                <span>Tạo báo giá PDF</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuotePage; 