import React, { useState, useEffect } from 'react';
import { Upload, FileText, File, FileSpreadsheet, Trash2, Eye, Edit, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../config/api';

const TemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [viewingTemplate, setViewingTemplate] = useState(null);
  const [viewingContent, setViewingContent] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const categories = [
    { value: 'all', label: 'Tất cả danh mục' },
    { value: 'quote', label: 'Báo giá' },
    { value: 'contract', label: 'Hợp đồng' },
    { value: 'label', label: 'Tem nhãn' },
    { value: 'payment', label: 'Thanh toán' }
  ];

  const types = [
    { value: 'all', label: 'Tất cả loại file' },
    { value: 'docx', label: 'Word (.docx)' },
    { value: 'pdf', label: 'PDF (.pdf)' },
    { value: 'excel', label: 'Excel (.xlsx/.xls)' }
  ];

  useEffect(() => {
    fetchTemplates();
  }, [selectedCategory, selectedType]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedType !== 'all') params.append('type', selectedType);

      const response = await api.get(`/templates?${params.toString()}`);
      setTemplates(response.data.data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách templates');
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (data) => {
    try {
      const formData = new FormData();
      formData.append('template', data.file[0]);
      formData.append('name', data.name);
      formData.append('description', data.description || '');
      formData.append('category', data.category);

      const response = await api.post('/templates/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Upload template thành công!');
      setShowUploadModal(false);
      reset();
      fetchTemplates();
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi khi upload template';
      toast.error(message);
    }
  };

  const handleDelete = async (templateId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa template này?')) {
      return;
    }

    try {
      await api.delete(`/templates/${templateId}`);
      toast.success('Đã xóa template thành công');
      fetchTemplates();
    } catch (error) {
      toast.error('Lỗi khi xóa template');
    }
  };

  const handleViewContent = async (template) => {
    try {
      setLoading(true);
      const response = await api.get(`/templates/${template._id}/content`);
      setViewingTemplate(template);
      setViewingContent(response.data.data);
    } catch (error) {
      toast.error('Lỗi khi đọc nội dung template');
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'docx':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'pdf':
        return <File className="w-5 h-5 text-red-500" />;
      case 'excel':
        return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderContent = (content) => {
    if (!content) return null;

    switch (content.type) {
      case 'docx':
      case 'pdf':
        return (
          <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm">{content.text}</pre>
          </div>
        );
      case 'excel':
        return (
          <div className="space-y-4">
            {Object.entries(content.sheets).map(([sheetName, data]) => (
              <div key={sheetName} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Sheet: {sheetName}</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs">
                    <tbody>
                      {data.slice(0, 10).map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-b">
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="px-2 py-1 border-r">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {data.length > 10 && (
                    <p className="text-gray-500 text-xs mt-2">
                      ... và {data.length - 10} dòng khác
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return <p>Không thể hiển thị nội dung</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Templates</h1>
          <p className="mt-2 text-gray-600">
            Upload và quản lý các file mẫu DOCX, PDF, Excel để sử dụng trong hệ thống
          </p>
        </div>

        {/* Filters và Upload Button */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {types.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload Template
            </button>
          </div>
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div key={template._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(template.type)}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-500">{template.originalName}</p>
                    </div>
                  </div>
                </div>

                {template.description && (
                  <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {categories.find(c => c.value === template.category)?.label}
                  </span>
                  <span>{formatFileSize(template.fileSize)}</span>
                </div>

                <div className="text-xs text-gray-400 mb-4">
                  Upload: {new Date(template.uploadDate).toLocaleDateString('vi-VN')}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewContent(template)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Xem
                  </button>
                  <button
                    onClick={() => handleDelete(template._id)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {templates.length === 0 && !loading && (
          <div className="text-center py-12">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Chưa có template nào. Hãy upload template đầu tiên!</p>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Template</h3>
                <form onSubmit={handleSubmit(handleUpload)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên template *
                    </label>
                    <input
                      type="text"
                      {...register('name', { required: 'Tên template là bắt buộc' })}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mô tả
                    </label>
                    <textarea
                      {...register('description')}
                      rows={3}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Danh mục *
                    </label>
                    <select
                      {...register('category', { required: 'Danh mục là bắt buộc' })}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.slice(1).map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      File template *
                    </label>
                    <input
                      type="file"
                      accept=".docx,.pdf,.xlsx,.xls"
                      {...register('file', { required: 'File template là bắt buộc' })}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.file && (
                      <p className="text-red-500 text-xs mt-1">{errors.file.message}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Chỉ chấp nhận file .docx, .pdf, .xlsx, .xls (tối đa 10MB)
                    </p>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowUploadModal(false);
                        reset();
                      }}
                      className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* View Content Modal */}
        {viewingTemplate && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {viewingTemplate.name}
                  </h3>
                  <button
                    onClick={() => {
                      setViewingTemplate(null);
                      setViewingContent(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>

                <div className="mb-4 text-sm text-gray-600">
                  <p><strong>File:</strong> {viewingTemplate.originalName}</p>
                  <p><strong>Loại:</strong> {viewingTemplate.type.toLowerCase()}</p>
                  <p><strong>Kích thước:</strong> {formatFileSize(viewingTemplate.fileSize)}</p>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {viewingContent ? renderContent(viewingContent.content) : (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Đang đọc nội dung...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatesPage; 