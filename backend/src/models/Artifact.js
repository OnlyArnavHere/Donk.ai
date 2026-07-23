import mongoose from 'mongoose';
const artifactSchema = new mongoose.Schema({ project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', index: true }, type: { type: String, required: true }, version: { type: Number, default: 1 }, createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, data: mongoose.Schema.Types.Mixed, metadata: mongoose.Schema.Types.Mixed }, { timestamps: true });
export const Artifact = mongoose.model('Artifact', artifactSchema);
