import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', index: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    originalName: { type: String, required: true },
    path: { type: String, default: '' }, // local path or Cloudinary URL
    url: { type: String, default: '' }, // public URL
    cloudinaryPublicId: { type: String, default: '' }, // Cloudinary public ID for deletion
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    category: {
      type: String,
      enum: ['image', 'pdf', 'datasheet', 'document', 'other'],
      default: 'other',
    },
    folder: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

fileSchema.index({ project: 1, uploadedBy: 1 });

// Use "uploads" collection name per spec
export const File = mongoose.model('Upload', fileSchema, 'uploads');

