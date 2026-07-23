import mongoose from 'mongoose';
const sessionSchema = new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }, tokenHash: { type: String, unique: true }, expiresAt: { type: Date, expires: 0 } }, { timestamps: true });
export const Session = mongoose.model('Session', sessionSchema);
