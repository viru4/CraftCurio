import mongoose from 'mongoose';

const artisanProductCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  icon: { type: String },
  craftTechniques: [{ type: String }],
  materialTypes: [{ type: String }],
  originRegions: [{ type: String }],
  styleTags: [{ type: String }],
  tags: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('ArtisanProductCategory', artisanProductCategorySchema);
