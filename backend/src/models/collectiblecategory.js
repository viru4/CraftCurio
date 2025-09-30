import mongoose from 'mongoose';

const collectibleCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  icon: { type: String },
  historicalEra: { type: String },
  provenanceRequired: { type: Boolean, default: false },
  validConditions: [{ type: String }],
  collectorType: [{ type: String }],
  tags: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('CollectibleCategory', collectibleCategorySchema);
