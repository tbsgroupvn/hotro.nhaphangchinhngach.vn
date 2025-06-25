import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Calculator, Tag, Receipt, Folder } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Trang chủ', icon: FileText },
    { path: '/quote', label: 'Báo giá', icon: Calculator },
    { path: '/contract', label: 'Hợp đồng', icon: FileText },
    { path: '/label', label: 'Tem dán', icon: Tag },
    { path: '/payment', label: 'Thanh toán', icon: Receipt },
    { path: '/templates', label: 'Templates', icon: Folder },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Hỗ trợ Nhập hàng
            </span>
          </Link>

          {/* Navigation Menu */}
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 