import mongoose from 'mongoose';
const { Schema } = mongoose;

const cacheItemSchema = new Schema({
  url: {
    type: String,
    unique: true,
    required: true
  },
  rootUrl: {
    type: String,
    required: true
  },
  priority: Number,
  dateAdded: { type: Date, default: Date.now }
});

export default mongoose.model('CacheItem', cacheItemSchema);
