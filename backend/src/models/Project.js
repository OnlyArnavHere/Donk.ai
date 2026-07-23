import mongoose from 'mongoose';
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 }, description: { type: String, maxlength: 5000 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  members: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, role: { type: String, enum: ['viewer', 'editor'], default: 'viewer' } }],
  status: { type: String, enum: ['active', 'archived'], default: 'active' }, currentStage: { type: String, default: 'requirements' },
  agentsCompleted: [String], requirements: mongoose.Schema.Types.Mixed, architecture: mongoose.Schema.Types.Mixed, bom: mongoose.Schema.Types.Mixed,
  validation: mongoose.Schema.Types.Mixed, documentation: mongoose.Schema.Types.Mixed
}, { timestamps: true });
export const Project = mongoose.model('Project', projectSchema);
