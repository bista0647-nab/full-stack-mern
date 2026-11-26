import { Router } from "express";
import Product from "../models/Product.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category && req.query.category !== "All") filter.category = req.query.category;
    if (req.query.featured === "true") filter.featured = true;
    if (typeof req.query.search === "string" && req.query.search.trim()) {
      const term = req.query.search.trim().slice(0, 80).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.name = { $regex: term, $options: "i" };
    }
    const products = await Product.find(filter).sort({ featured: -1, createdAt: -1 }).limit(100).lean();
    res.json(products);
  } catch (error) {
    next(error);
  }
});

export default router;
