import express from "express";
import {
  placeOrder,
  placeOrderStripe,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
  verifyStripe,
  trackOrder,
  verifyChapa,
  placeOrderChapa,
} from "../controllers/orderControllers.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

// Admin routes
orderRouter.post("/list", adminAuth, getAllOrders);
orderRouter.post("/status", adminAuth, updateOrderStatus);

// User routes
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/stripe", authUser, placeOrderStripe);
orderRouter.post("/userorders", authUser, getUserOrders);
orderRouter.post("/chapa", authUser, placeOrderChapa);
orderRouter.get("/verify-chapa/:tx_ref/:orderId", authUser, verifyChapa);
orderRouter.post("/trackOrder", authUser, trackOrder);

// verify Stripe payment
orderRouter.post("/verifyStripe", authUser, verifyStripe);

export default orderRouter;
