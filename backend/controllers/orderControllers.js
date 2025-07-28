import orderModel from "../models/orderModel.js";
import UserModel from "../models/userModel.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();
//global variables for Razorpay and Stripe keys
const currency = "USD";
const deliveryCharge = 10;

// Initialize Stripe and Razorpay with their respective keys

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const CHAPA_URL =
  process.env.CHAPA_URL || "https://api.chapa.co/v1/transaction/initialize";
const CHAPA_AUTH = process.env.CHAPA_AUTH;

const config = {
  headers: {
    Authorization: `Bearer ${CHAPA_AUTH}`,
  },
};

// placing order using COD Method

const placeOrder = async (req, res) => {
  try {
    const { userId, products, amount, address } = req.body;
    const orderData = {
      userId,
      products,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();
    await UserModel.findByIdAndUpdate(userId, { cartData: {} });
    res.json({
      success: true,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.json({
      success: false,
      message: error.message || "Failed to place order",
    });
  }
};

// place order using Stripe Method
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, products, amount, address } = req.body;
    const { origin } = req.headers;
    const orderData = {
      userId,
      products,
      amount,
      address,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = products.map((product) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: product.name,
        },
        unit_amount: product.price * 100,
      },
      quantity: product.quantity,
    }));
    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charge",
        },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });
    res.json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.json({
      success: false,
      message: error.message || "Failed to place order",
    });
  }
};

// Verify Stripe
const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await UserModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({
        success: true,
        message: "Order placed successfully",
      });
    } else {
      res.json({
        success: false,
        message: "Order placement failed",
      });
    }
  } catch (error) {
    console.error("Error verifying Stripe payment:", error);
    res.json({
      success: false,
      message: error.message || "Failed to verify payment",
    });
  }
};

// Place order using Chapa Method
const placeOrderChapa = async (req, res) => {
  try {
    const { userId, products, amount, address } = req.body;
    const { origin } = req.headers;

    const tx_ref = `tx-${userId}-${Date.now()}`;

    const orderData = {
      userId,
      products,
      amount,
      address,
      paymentMethod: "Chapa",
      payment: false,
      date: Date.now(),
      tx_ref,
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Define return and callback URLs
    const RETURN_URL = `${origin}/verify?success=true&orderId=${newOrder._id}`;
    const CALLBACK_URL = `${origin}/api/order/verify-chapa/${tx_ref}/${newOrder._id}`;

    const chapaData = {
      amount: amount.toString(),
      currency: "ETB",
      email: address.email,
      first_name: address.firstName,
      last_name: address.lastName,
      tx_ref,
      return_url: RETURN_URL,
      callback_url: CALLBACK_URL,
    };

    const response = await axios.post(CHAPA_URL, chapaData, config);

    if (response.data.status === "success") {
      res.json({
        success: true,
        session_url: response.data.data.checkout_url,
      });
    } else {
      res.json({
        success: false,
        message: "Failed to create Chapa payment",
      });
    }
  } catch (error) {
    console.error("Error placing Chapa order:", error);
    res.json({
      success: false,
      message: error.message || "Failed to place Chapa order",
    });
  }
};

// Verify Chapa
const verifyChapa = async (req, res) => {
  try {
    const { tx_ref, orderId } = req.params;

    if (!tx_ref || !orderId) {
      return res.json({
        success: false,
        message: "Missing tx_ref or orderId",
      });
    }

    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      config
    );

    if (
      response.data.status === "success" &&
      response.data.data.status === "success"
    ) {
      const order = await orderModel.findById(orderId);
      if (!order) {
        return res.json({
          success: false,
          message: "Order not found",
        });
      }

      order.payment = true;
      await order.save();

      await UserModel.findByIdAndUpdate(order.userId, { cartData: {} });

      return res.json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      return res.json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("Error verifying Chapa payment:", error);
    return res.json({
      success: false,
      message: error.message || "Failed to verify payment",
    });
  }
};

// All orders data for admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.json({
      success: false,
      message: error.message || "Failed to fetch all orders",
    });
  }
};

// User orders data for frontend
const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.json({
      success: false,
      message: error.message || "Failed to fetch user orders",
    });
  }
};

// update order status by admin
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.json({
        success: false,
        message: "Order not found",
      });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(orderId, {
      status,
    });

    if (order.paymentMethod === "COD" || (order.paymentMethod === "Chapa" && status === "Delivered")) {
      order.payment = true;

      await order.save();
    }

    if (order.paymentMethod === "COD" && status !== "Delivered") {
      order.payment = false;

      await order.save();
    }
    res.json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.json({
      success: false,
      message: error.message || "Failed to update order status",
    });
  }
};

// order track

const trackOrder = async (req, res) => {
  const { orderId, productId } = req.body;
  try {
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.json({
        success: false,
        message: "Order not found",
      });
    }
    const product = order.products.find(
      (product) => product._id.toString() === productId
    );
    if (!product) {
      return res.json({
        success: false,
        message: "Product not found in order",
      });
    }

    res.json({
      success: true,
      order,
      status: order.status,
      product,
    });
  } catch (error) {
    console.error("Error tracking order:", error);
    res.json({
      success: false,
      message: error.message || "Failed to track order",
    });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
  verifyStripe,
  trackOrder,
  verifyChapa,
  placeOrderChapa,
};
