import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: true, select: false },
  avatar: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  subscription: { plan: { type: String, default: 'free' }, status: { type: String, default: 'active' } },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true, toJSON: { transform: (_, ret) => { delete ret.password; delete ret.__v; return ret; } } });
export const User = mongoose.model('User', userSchema);
