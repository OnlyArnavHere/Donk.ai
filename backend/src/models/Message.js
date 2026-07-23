import mongoose from 'mongoose';
const messageSchema = new mongoose.Schema({ chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true, index: true }, sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, type: { type: String, enum: ['user', 'assistant', 'system', 'agent', 'tool'], required: true }, content: { type: String, required: true }, metadata: mongoose.Schema.Types.Mixed }, { timestamps: true });
export const Message = mongoose.model('Message', messageSchema);
