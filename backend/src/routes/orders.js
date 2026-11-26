import { Router } from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { customer, items } = req.body;
    if (
      !customer ||
      typeof customer.name !== "string" ||
      typeof customer.email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email) ||
      typeof customer.address !== "string" ||
      customer.name.trim().length < 2 ||
      customer.name.trim().length > 100 ||
      customer.email.trim().length > 254 ||
      customer.address.trim().length < 5 ||
      customer.address.trim().length > 500 ||
      !Array.isArray(items) ||
      items.length < 1 ||
      items.length > 30
    ) {
      return res.status(400).json({ message: "Enter valid contact and delivery details and at least one item." });
    }

    const quantities = new Map();
    for (const item of items) {
      if (!mongoose.isValidObjectId(item.product) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20) {
        return res.status(400).json({ message: "One or more cart items are invalid." });
      }
      quantities.set(item.product, (quantities.get(item.product) || 0) + item.quantity);
    }
    if ([...quantities.values()].some((quantity) => quantity > 20)) {
      return res.status(400).json({ message: "A maximum of 20 units per product can be ordered." });
    }

    const products = await Product.find({ _id: { $in: [...quantities.keys()] } }).lean();
    if (products.length !== quantities.size) return res.status(400).json({ message: "A cart product is no longer available." });

    const orderItems = products.map((product) => ({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: quantities.get(String(product._id)),
    }));
    const total = Number(orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2));
    const order = await Order.create({
      customer: {
        name: customer.name.trim(),
        email: customer.email.trim(),
        address: customer.address.trim(),
      },
      items: orderItems,
      total,
    });

    res.status(201).json({ id: order.id, total: order.total, message: "Your order is in. Thanks for shopping small." });
  } catch (error) {
    next(error);
  }
});

export default router;
