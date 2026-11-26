import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  badge: { type: String, default: "" },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
