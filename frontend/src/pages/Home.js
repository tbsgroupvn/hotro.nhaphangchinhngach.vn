import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, FileText, Tag, Receipt, TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';

const Home = () => {
  const features = [
    {
      title: 'Báo giá hàng hóa',
      description: 'Tạo báo giá với công thức tính toán tự động, xuất file PDF',
      icon: Calculator,
      path: '/quote',
      color: 'bg-blue-500',
    },
    {
      title: 'Hợp đồng',
      description: 'Tạo hợp đồng từ template DOCX, thay thế thông tin động',
      icon: FileText,
      path: '/contract',
      color: 'bg-green-500',
    },
    {
      title: 'Tem dán sản phẩm',
      description: 'Tạo tem dán nhập khẩu tùy chỉnh, xuất file PDF để in',
      icon: Tag,
      path: '/label',
      color: 'bg-purple-500',
    },
    {
      title: 'Phiếu thanh toán',
      description: 'Tạo phiếu đề nghị thanh toán theo mẫu chuẩn',
      icon: Receipt,
      path: '/payment',
      color: 'bg-orange-500',
    },
  ];

  const stats = [
    { label: 'Văn bản đã tạo', value: '1,234', icon: CheckCircle, color: 'text-green-600' },
    { label: 'Người dùng', value: '89', icon: Users, color: 'text-blue-600' },
    { label: 'Thời gian tiết kiệm', value: '156h', icon: Clock, color: 'text-purple-600' },
    { label: 'Tăng trưởng', value: '+23%', icon: TrendingUp, color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Hệ thống Hỗ trợ Nhập hàng Chính ngạch
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Tự động hóa việc tạo lập các loại văn bản: báo giá, hợp đồng, tem dán sản phẩm 
          và phiếu thanh toán một cách nhanh chóng và chính xác.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card text-center">
              <Icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Link
              key={index}
              to={feature.path}
              className="card hover:shadow-md transition-shadow duration-200 group"
            >
              <div className="flex items-start space-x-4">
                <div className={`${feature.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="card bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Bắt đầu nhanh</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/quote" className="btn-primary">
            Tạo báo giá mới
          </Link>
          <Link to="/contract" className="btn-secondary">
            Tạo hợp đồng
          </Link>
          <Link to="/label" className="btn-secondary">
            Tạo tem dán
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home; 