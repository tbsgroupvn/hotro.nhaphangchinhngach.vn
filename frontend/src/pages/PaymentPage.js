import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Download, Calculator } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../config/api';

const PaymentPage = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      paymentType: 'purchase',
      company: {
        name: '',
        address: '',
        taxCode: '',
        phone: '',
        email: '',
        bankAccount: '',
        bankName: '',
      },
      vendor: {
        name: '',
        address: '',
        taxCode: '',
        phone: '',
        email: '',
        bankAccount: '',
        bankName: '',
      },
      paymentInfo: {
        requestNumber: '',
        requestDate: '',
        dueDate: '',
        purpose: '',
        department: '',
        requester: '',
        approver: '',
        currency: 'VND',
      },
      items: [
        {
          description: '',
          quantity: 1,
          unitPrice: 0,
          amount: 0,
        }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  const watchedItems = watch('items');
  const paymentType = watch('paymentType');



  // Tính tổng tiền
  const calculateTotal = () => {
    return watchedItems.reduce((total, item) => {
      return total + ((item.quantity || 0) * (item.unitPrice || 0));
    }, 0);
  };

  const total = calculateTotal();

  const onSubmit = async (data) => {
    setIsGenerating(true);
    try {
      const response = await apiClient.post('/api/payments/generate', data, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `phieu-thanh-toan-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Phiếu thanh toán đã được tạo thành công!');
    } catch (error) {
      console.error('Error generating payment:', error);
      toast.error('Có lỗi xảy ra khi tạo phiếu thanh toán');
    } finally {
      setIsGenerating(false);
    }
  };

  const addItem = () => {
    append({
      description: '',
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tạo phiếu thanh toán</h1>
        <p className="text-gray-600">Tạo phiếu đề nghị thanh toán theo mẫu chuẩn</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin cơ bản</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Số phiếu</label>
              <input {...register('paymentNumber')} className="form-input" />
            </div>
            <div>
              <label className="form-label">Ngày tạo</label>
              <input {...register('date')} type="date" className="form-input" />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin phiếu</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Số phiếu</label>
              <input
                {...register('paymentInfo.requestNumber')}
                className="form-input"
                placeholder="Nhập số phiếu (tự động nếu để trống)"
              />
            </div>
            <div>
              <label className="form-label">Ngày lập phiếu</label>
              <input
                {...register('paymentInfo.requestDate')}
                type="date"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Hạn thanh toán</label>
              <input
                {...register('paymentInfo.dueDate')}
                type="date"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Bộ phận đề nghị</label>
              <input
                {...register('paymentInfo.department')}
                className="form-input"
                placeholder="Nhập tên bộ phận"
              />
            </div>
            <div>
              <label className="form-label">Người đề nghị</label>
              <input
                {...register('paymentInfo.requester')}
                className="form-input"
                placeholder="Nhập tên người đề nghị"
              />
            </div>
            <div>
              <label className="form-label">Người phê duyệt</label>
              <input
                {...register('paymentInfo.approver')}
                className="form-input"
                placeholder="Nhập tên người phê duyệt"
              />
            </div>
            <div className="md:col-span-3">
              <label className="form-label">Mục đích thanh toán *</label>
              <textarea
                {...register('paymentInfo.purpose', { required: 'Mục đích thanh toán là bắt buộc' })}
                rows="3"
                className="form-input"
                placeholder="Mô tả chi tiết mục đích thanh toán"
              />
              {errors.paymentInfo?.purpose && (
                <p className="text-red-500 text-sm mt-1">{errors.paymentInfo.purpose.message}</p>
              )}
            </div>
          </div>
        </div>

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
            <div>
              <label className="form-label">Số tài khoản</label>
              <input
                {...register('company.bankAccount')}
                className="form-input"
                placeholder="Nhập số tài khoản ngân hàng"
              />
            </div>
            <div>
              <label className="form-label">Tên ngân hàng</label>
              <input
                {...register('company.bankName')}
                className="form-input"
                placeholder="Nhập tên ngân hàng"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin nhà cung cấp/người nhận</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">
                Tên {paymentType === 'advance' ? 'người nhận' : 'nhà cung cấp'} *
              </label>
              <input
                {...register('vendor.name', { required: 'Tên là bắt buộc' })}
                className="form-input"
                placeholder={`Nhập tên ${paymentType === 'advance' ? 'người nhận' : 'nhà cung cấp'}`}
              />
              {errors.vendor?.name && (
                <p className="text-red-500 text-sm mt-1">{errors.vendor.name.message}</p>
              )}
            </div>
            <div>
              <label className="form-label">Mã số thuế</label>
              <input
                {...register('vendor.taxCode')}
                className="form-input"
                placeholder="Nhập mã số thuế"
              />
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Địa chỉ</label>
              <input
                {...register('vendor.address')}
                className="form-input"
                placeholder="Nhập địa chỉ"
              />
            </div>
            <div>
              <label className="form-label">Số điện thoại</label>
              <input
                {...register('vendor.phone')}
                className="form-input"
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input
                {...register('vendor.email')}
                type="email"
                className="form-input"
                placeholder="Nhập email"
              />
            </div>
            <div>
              <label className="form-label">Số tài khoản</label>
              <input
                {...register('vendor.bankAccount')}
                className="form-input"
                placeholder="Nhập số tài khoản ngân hàng"
              />
            </div>
            <div>
              <label className="form-label">Tên ngân hàng</label>
              <input
                {...register('vendor.bankName')}
                className="form-input"
                placeholder="Nhập tên ngân hàng"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Chi tiết thanh toán</h2>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm khoản mục</span>
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">Khoản mục #{index + 1}</h3>
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
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="md:col-span-2">
                    <label className="form-label">Mô tả *</label>
                    <input
                      {...register(`items.${index}.description`, { required: true })}
                      className="form-input"
                      placeholder="Mô tả khoản thanh toán"
                    />
                  </div>
                  <div>
                    <label className="form-label">Số lượng</label>
                    <input
                      {...register(`items.${index}.quantity`, { 
                        valueAsNumber: true
                      })}
                      type="number"
                      min="0"
                      step="0.01"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Đơn giá</label>
                    <input
                      {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                      type="number"
                      min="0"
                      step="0.01"
                      className="form-input"
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div className="mt-3 text-right">
                  <span className="text-sm text-gray-600">Thành tiền: </span>
                  <span className="font-medium text-gray-900">
                    {((watchedItems[index]?.quantity || 0) * (watchedItems[index]?.unitPrice || 0)).toLocaleString('vi-VN')} VND
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            Tổng thanh toán
          </h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-700">Tổng cộng:</span>
              <span className="text-2xl font-bold text-primary-600">
                {total.toLocaleString('vi-VN')} VND
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Bằng chữ: <span className="font-medium">{/* Số tiền bằng chữ sẽ được tạo bởi backend */}</span>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="form-label">Đơn vị tiền tệ</label>
            <select {...register('paymentInfo.currency')} className="form-input max-w-xs">
              <option value="VND">VND - Việt Nam Đồng</option>
              <option value="USD">USD - Đô la Mỹ</option>
              <option value="EUR">EUR - Euro</option>
              <option value="CNY">CNY - Nhân dân tệ</option>
            </select>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isGenerating}
            className="flex items-center space-x-2 btn-primary px-8 py-3 text-lg"
          >
            <Download className="w-5 h-5" />
            <span>Tạo phiếu PDF</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentPage; 