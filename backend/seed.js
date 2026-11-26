import "dotenv/config";
import mongoose from "mongoose";
import Product from "./src/models/Product.js";

const products = [
  { name: "Everyday Ceramic Mug", category: "Home", description: "A hand-finished mug for slow mornings and second cups.", price: 28, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85", badge: "Bestseller", featured: true },
  { name: "Canvas Market Tote", category: "Accessories", description: "Roomy recycled cotton canvas, ready for the long way home.", price: 36, image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85", badge: "Made to last", featured: true },
  { name: "Rituals No. 04 Candle", category: "Home", description: "Cedar, bergamot and a little bit of staying in.", price: 42, image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=85", badge: "Small batch", featured: true },
  { name: "Weekend Knit Throw", category: "Home", description: "Soft, textured cotton for your favourite corner of the sofa.", price: 89, image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85", badge: "", featured: true },
  { name: "Daily Carry Bottle", category: "Accessories", description: "A double-wall stainless bottle that keeps its cool.", price: 34, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=85", badge: "New", featured: false },
  { name: "Pocket Notebook Set", category: "Stationery", description: "Three thoughtfully made notebooks for ideas on the go.", price: 22, image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=85", badge: "", featured: false },
  { name: "Sunday Ceramic Vase", category: "Home", description: "A sculptural little home for wildflowers and found things.", price: 54, image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=900&q=85", badge: "Handmade", featured: false },
  { name: "Soft Structure Cap", category: "Accessories", description: "Organic cotton twill with an easy, everyday fit.", price: 31, image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=900&q=85", badge: "", featured: false },
];

try {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required to seed products.");
  await mongoose.connect(process.env.MONGODB_URI);
  const operations = products.map((product) => ({
    updateOne: { filter: { name: product.name }, update: { $setOnInsert: product }, upsert: true },
  }));
  await Product.bulkWrite(operations);
  console.log(`Seeded ${products.length} catalog products (existing products were preserved).`);
} catch (error) {
  console.error("Could not seed catalog:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
