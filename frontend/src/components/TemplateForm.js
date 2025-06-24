import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, Eye, Download, FileText, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../config/api';

const SimpleContractForm = () => {
  const [uploadedTemplate, setUploadedTemplate] = useState(null);
  const [placeholders, setPlaceholders] = useState([]);
  const [preview, setPreview] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { register, handleSubmit, reset } = useForm();

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'text/plain') {
      toast.error('Chỉ hỗ trợ file .txt');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('template', file);

    try {
      const response = await apiClient.post('/api/contracts/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setUploadedTemplate(response.data.data);
        setPlaceholders(response.data.data.placeholders);
        toast.success('Upload thành công!');
        reset(); // Reset form when new template uploaded
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Lỗi khi upload file');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle form submission to preview
  const handlePreview = async (formData) => {
    if (!uploadedTemplate) {
      toast.error('Vui lòng upload template trước');
      return;
    }

    try {
      const response = await apiClient.post('/api/contracts/preview', {
        templateId: uploadedTemplate.templateId,
        ...formData
      });

      if (response.data.success) {
        setPreview(response.data.data.content);
        setShowPreview(true);
        toast.success('Preview được tạo thành công!');
      }
    } catch (error) {
      console.error('Preview error:', error);
      toast.error('Lỗi khi tạo preview');
    }
  };

  // Handle PDF generation
  const handleGeneratePDF = async (formData) => {
    if (!uploadedTemplate) {
      toast.error('Vui lòng upload template trước');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await apiClient.post('/api/contracts/generate', {
        templateId: uploadedTemplate.templateId,
        ...formData
      });

      if (response.data.success) {
        // Show contract content and download as text file
        const content = response.data.data.content;
        
        // Create and download text file
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `hop-dong-${uploadedTemplate.templateId}-${Date.now()}.txt`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        // Show in preview
        setPreview(content);
        setShowPreview(true);
        
        toast.success('Hợp đồng được tạo thành công!');
      } else {
        toast.error('Lỗi khi tạo hợp đồng');
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Lỗi khi tạo hợp đồng');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tạo hợp đồng đơn giản
        </h1>
        <p className="text-gray-600">
          Upload file hợp đồng mẫu (.txt), điền thông tin và tạo hợp đồng
        </p>
      </div>

      {/* File Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Upload className="w-5 h-5 mr-2" />
          Bước 1: Upload file hợp đồng mẫu
        </h2>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
                         accept=".txt"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            disabled={isUploading}
          />
          <label
            htmlFor="file-upload"
            className={`cursor-pointer flex flex-col items-center ${
              isUploading ? 'opacity-50' : ''
            }`}
          >
            <FileText className="w-12 h-12 text-gray-400 mb-4" />
            {isUploading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span>Đang upload...</span>
              </div>
            ) : (
              <>
                <span className="text-lg font-medium text-gray-900 mb-2">
                  Chọn file hợp đồng mẫu
                </span>
                                 <span className="text-sm text-gray-500">
                   Hỗ trợ file .txt
                 </span>
              </>
            )}
          </label>
        </div>

        {uploadedTemplate && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <p className="font-medium text-green-800">
                  {uploadedTemplate.originalName}
                </p>
                <p className="text-sm text-green-600">
                  Tìm thấy {placeholders.length} trường cần điền
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Form Section */}
      {placeholders.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Bước 2: Điền thông tin vào các trường
          </h2>
          
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800">
                  <strong>Các trường được tìm thấy:</strong>
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {placeholders.map((placeholder, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      [{placeholder}]
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {placeholders.map((placeholder, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {placeholder}
                  </label>
                  <input
                    type="text"
                    {...register(placeholder)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Nhập ${placeholder.toLowerCase()}`}
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                type="button"
                onClick={handleSubmit(handlePreview)}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                Xem trước
              </button>
              
              <button
                type="button"
                onClick={handleSubmit(handleGeneratePDF)}
                disabled={isGenerating}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Tạo hợp đồng
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Preview Section */}
      {showPreview && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Xem trước nội dung</h2>
            <button
              onClick={() => setShowPreview(false)}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Ẩn
            </button>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
              {preview}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleContractForm; 