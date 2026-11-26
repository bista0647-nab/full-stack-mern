import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import productRoutes from "./src/routes/products.js";
import orderRoutes from "./src/routes/orders.js";

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("This origin is not allowed by the CORS policy."));
  },
}));
app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", database: mongoose.connection.readyState === 1 ? "connected" : "disconnected" });
});
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "An unexpected server error occurred." });
});

async function start() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required. Add your MongoDB Atlas connection string to backend/.env.");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(port, () => console.log(`Good Things API listening on port ${port}`));
}

start().catch((error) => {
  console.error("Could not start the API:", error.message);
  process.exitCode = 1;
});
