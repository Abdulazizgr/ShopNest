// add product to user cart

import UserModel from "../models/userModel.js";

const addToCart = async (req, res) => {
  try {
    const { productId, userId, size } = req.body;
    if (!productId || !userId || !size) {
      return res.json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    const userData = await UserModel.findById(userId);
    let cartData = await userData.cartData;
    if (cartData[productId]) {
      if (cartData[productId][size]) {
        cartData[productId][size] += 1;
      } else {
        cartData[productId][size] = 1;
      }
    } else {
      cartData[productId] = {};
      cartData[productId][size] = 1;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, { cartData });
    res.json({
      success: true,
      cartData: updatedUser.cartData,
      message: "Product added to cart successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// update product quantity in user cart
const updateCart = async (req, res) => {
  try {
    const { productId, userId, size, quantity } = req.body;

    const userData = await UserModel.findById(userId);
    let cartData = await userData.cartData;
    cartData[productId][size] = quantity;
    await UserModel.findByIdAndUpdate(userId, { cartData });
    res.json({
      success: true,
      message: "Cart updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// get User cart
const getCart = async (req, res) => {
  try {
    const { userId } = req.body;

    const userData = await UserModel.findById(userId);
    if (!userData) {
      return res
      
        .json({ success: false, message: "User not found" });
    }
    let cartData = await userData.cartData;
    res.json({
      success: true,
      message: "Cart retrieved successfully",
      cartData: cartData,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export { addToCart, updateCart, getCart };
