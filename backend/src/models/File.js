import mongoose from 'mongoose';
const fileSchema = new mongoose.Schema({ project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', index: true }, uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, originalName: String, path: String, mimeType: String, size: Number }, { timestamps: true });
export const File = mongoose.model('File', fileSchema);
