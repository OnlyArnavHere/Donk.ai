import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      select: false,
      // Not required because Google OAuth users may not have a password
    },
    avatar: { type: String, default: '' },

    // Auth provider
    provider: { type: String, enum: ['local', 'google'], default: 'local' },
    googleId: { type: String, index: true, sparse: true },

    // Role-based access
    role: { type: String, enum: ['user', 'admin'], default: 'user' },

    // Email verification
    isVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, select: false },

    // Password reset
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },

    // Subscription
    subscription: {
      plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
      status: { type: String, enum: ['active', 'cancelled', 'past_due'], default: 'active' },
      seats: { type: Number, default: 1 },
    },

    // Activity
    lastLogin: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.password;
        delete ret.__v;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpires;
        delete ret.emailVerificationToken;
        return ret;
      },
    },
  }
);

userSchema.methods.hasPassword = function () {
  return Boolean(this.password);
};

export const User = mongoose.model('User', userSchema);
