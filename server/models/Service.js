import mongoose from 'mongoose';

const requirementFieldSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['text', 'textarea', 'number', 'select'],
    },
    required: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: null,
      trim: true,
    },
    options: {
      type: [String],
      default: [],
    },
  },
  {
    _id: false,
  },
);

const serviceSchema = new mongoose.Schema(
  {
    serviceType: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      required: true,
      trim: true,
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    requirementFields: {
      type: [requirementFieldSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);
