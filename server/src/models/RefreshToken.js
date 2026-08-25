import mongoose from 'mongoose';

/**
 * Stores issued refresh tokens so we can revoke them on logout
 * or detect token reuse attacks.
 */
const refreshTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // When this token naturally expires — MongoDB TTL index auto-deletes it
    expiresAt: {
      type: Date,
      required: true,
    },
    // Whether it has been manually revoked (logout / rotation)
    revoked: {
      type: Boolean,
      default: false,
    },
    // Device / user-agent info for security visibility
    userAgent: {
      type: String,
      default: '',
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// TTL index: MongoDB automatically removes expired documents
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
refreshTokenSchema.index({ userId: 1 });
refreshTokenSchema.index({ token: 1 });

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

export default RefreshToken;
