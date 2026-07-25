import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    type: {
      type: String,
      enum: ['requirements', 'architecture', 'components', 'pcb', 'validation', 'documentation'],
      required: true,
      index: true,
    },
    title: { type: String, default: '', trim: true },
    version: { type: Number, default: 1 },
    isLatest: { type: Boolean, default: true, index: true },
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
    summary: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // AI metadata
    agentType: { type: String, default: '' },
    tokens: { type: Number, default: 0 },
    // Previous version reference for version history
    previousVersion: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
  },
  { timestamps: true }
);

// Compound index: project + type + isLatest for fast "latest version" queries
documentSchema.index({ project: 1, type: 1, isLatest: 1 });
documentSchema.index({ project: 1, type: 1, version: -1 });

export const Document = mongoose.model('Document', documentSchema);
