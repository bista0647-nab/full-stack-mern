import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    address: { type: String, required: true, trim: true },
  },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1, max: 20 },
  }],
  total: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["placed", "processing", "shipped"], default: "placed" },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
