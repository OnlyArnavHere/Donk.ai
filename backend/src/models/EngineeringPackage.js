import mongoose from 'mongoose';

const engineeringPackageSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, default: '' },
    version: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ['draft', 'in_progress', 'complete', 'exported'],
      default: 'draft',
    },
    // References to latest documents of each type
    documents: [
      {
        type: { type: String, enum: ['requirements', 'architecture', 'components', 'pcb', 'validation', 'documentation'] },
        documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
        version: { type: Number, default: 1 },
      },
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Export metadata
    exportUrl: { type: String, default: '' },
    exportedAt: { type: Date },
  },
  { timestamps: true }
);

engineeringPackageSchema.index({ project: 1, version: -1 });

export const EngineeringPackage = mongoose.model('EngineeringPackage', engineeringPackageSchema);
