const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['docx', 'pdf', 'excel'],
    lowercase: true
  },
  category: {
    type: String,
    required: true,
    enum: ['quote', 'contract', 'label', 'payment'],
    lowercase: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Index for better query performance
templateSchema.index({ category: 1, type: 1, isActive: 1 });

const Template = mongoose.model('Template', templateSchema);

module.exports = Template; 