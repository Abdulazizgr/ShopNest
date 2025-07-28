import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// app config
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// connect to database
connectDB();
connectCloudinary();

// middleware
app.use(cors());
app.use(express.json());

// api endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);

app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
