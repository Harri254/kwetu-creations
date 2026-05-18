import mongoose from 'mongoose';

const specialistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: undefined,
      unique: true,
      sparse: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['online', 'offline'],
      default: 'offline',
      index: true,
    },
    serviceTypes: {
      type: [String],
      default: [],
      index: true,
    },
    bio: {
      type: String,
      required: true,
      trim: true,
    },
    availability: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Specialist =
  mongoose.models.Specialist || mongoose.model('Specialist', specialistSchema);
