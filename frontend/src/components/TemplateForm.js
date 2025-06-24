import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, Code, Copy, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../config/api';

const TemplateForm = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [templateFields, setTemplateFields] = useState([]);
  const [preview, setPreview] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  // Load templates on mount
  useEffect(() => {
    loadTemplates();
  }, []);

  // Load template fields when template changes
  useEffect(() => {
    if (selectedTemplate) {
      loadTemplateFields(selectedTemplate);
    }
  }, [selectedTemplate, loadTemplateFields]);

  const loadTemplates = async () => {
    try {
      const response = await apiClient.get('/api/contracts/templates');
      setTemplates(response.data.data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách templates');
    }
  };

  const loadTemplateFields = useCallback(async (templateId) => {
    try {
      const response = await apiClient.get(`/api/contracts/templates/${templateId}`);
      setTemplateFields(response.data.data.fields);
      
      // Set default values
      response.data.data.fields.forEach(field => {
        if (field.default) {
          setValue(field.key, field.default);
        }
      });
    } catch (error) {
      toast.error('Lỗi khi tải template fields');
    }
  }, [setValue]);

  const handlePreview = async (data) => {
    try {
      const response = await apiClient.post('/api/contracts/preview', {
        template: selectedTemplate,
        ...data
      });
      setPreview(response.data.data.content);
      setShowPreview(true);
    } catch (error) {
      toast.error('Lỗi khi tạo preview');
    }
  };

  const handleGeneratePDF = async (data) => {
    if (!selectedTemplate) {
      toast.error('Vui lòng chọn mẫu hợp đồng');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await apiClient.post('/api/contracts/generate', {
        template: selectedTemplate,
        ...data
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

  const copyPreview = () => {
    navigator.clipboard.writeText(preview);
    toast.success('Đã copy nội dung!');
  };

  const renderField = (field) => {
    const commonProps = {
      ...register(field.key, { required: field.required }),
      className: "form-input",
      placeholder: field.label
    };

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows="3"
          />
        );
      
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Chọn {field.label}</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'date':
        return (
          <input
            {...commonProps}
            type="date"
          />
        );
      
      case 'number':
        return (
          <input
            {...commonProps}
            type="number"
            min="0"
            step="0.01"
          />
        );
      
      default:
        return (
          <input
            {...commonProps}
            type="text"
          />
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tạo hợp đồng với Template System</h1>
        <p className="text-gray-600">Chọn template và điền thông tin để tạo hợp đồng tự động</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Panel */}
        <div className="space-y-6">
          {/* Template Selection */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Chọn mẫu hợp đồng</h2>
            <div className="space-y-3">
              {templates.map((template) => (
                <label
                  key={template.id}
                  className={`block border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedTemplate === template.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    value={template.id}
                    checked={selectedTemplate === template.id}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{template.title}</h3>
                      <p className="text-sm text-gray-600">{template.fieldCount} trường cần điền</p>
                    </div>
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
                </label>
              ))}
            </div>
          </div>

          {/* Template Fields */}
          {templateFields.length > 0 && (
            <form className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin hợp đồng</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templateFields.map((field) => (
                    <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                      <label className="form-label">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      {renderField(field)}
                      {errors[field.key] && (
                        <p className="text-red-500 text-sm mt-1">
                          {field.label} là bắt buộc
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={handleSubmit(handlePreview)}
                  className="flex items-center space-x-2 btn-secondary"
                >
                  <Eye className="w-4 h-4" />
                  <span>Xem trước</span>
                </button>
                <button
                  type="button"
                  onClick={handleSubmit(handleGeneratePDF)}
                  disabled={isGenerating}
                  className="flex items-center space-x-2 btn-primary disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Đang tạo...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Tạo PDF</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          {showPreview && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Xem trước nội dung</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={copyPreview}
                    className="flex items-center space-x-1 text-sm btn-secondary"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="text-sm btn-secondary"
                  >
                    Ẩn
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                  {preview}
                </pre>
              </div>
            </div>
          )}

          {/* Template Fields Reference */}
          {templateFields.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                <Code className="w-5 h-5 inline mr-2" />
                Template Fields Reference
              </h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {templateFields.map((field) => (
                  <div key={field.key} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {`{{${field.key}}}`}
                    </span>
                    <span className="text-sm text-gray-600">{field.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateForm; 