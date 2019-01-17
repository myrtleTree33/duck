import mongoose from 'mongoose';
const { Schema } = mongoose;

const queuedUrlSchema = new Schema({
  url: {
    type: String,
    unique: true,
    required: true
  },
  priority: Number,
  interval: {
    type: String,
    required: true
  },
  depth: {
    type: Number,
    required: true
  },
  maxRandDelayMs: {
    type: Number,
    required: true
  },
  dateAdded: { type: Date, default: Date.now }
});

export default mongoose.model('QueuedUrl', queuedUrlSchema);
