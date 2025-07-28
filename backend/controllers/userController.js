import validator from "validator";
import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import e from "express";

// Function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Route for user login

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .json({ success: false, message: "Please fill all fields" });
    }
    // checking if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .json({ success: false, message: "User does not exist" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .json({ success: false, message: "Invalid password" });
    }
    const token = generateToken(user._id);
    res.json({
      success: true,
      message: "User logged in successfully",
      token,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Route for user registration
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;
    if (!firstName || !lastName || !email || !phone || !password) {
      return res.json({ message: "Please fill all fields" });
    }

    // checking if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
      
        .json({ success: false, message: "User already exists" });
    }
    // validating email format & password strength

    if (!validator.isEmail(email)) {
      return res
        
        .json({ success: false, message: "Invalid email format" });
    }
    if (!validator.isMobilePhone(phone, "any")) {
      return res.json({
        success: false,
        message: "Invalid phone number format",
      });
    }

    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minUppercase: 1,
        minSymbols: 1,
      })
    ) {
      return res.json({
        success: false,
        message:
          "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol",
      });
    }
    // hashing password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // creating new user
    const newUser = new UserModel({
      firstName,
      lastName,
      email,
      phone,
      password: hashPassword,
    });
    const savedUser = await newUser.save();

    const token = generateToken(savedUser._id);
    res.json({
      success: true,
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Route for admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .json({ success: false, message: "Please fill all fields" });
    }
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res
        .json({ success: false, message: "Invalid email or password" });
    } else {
      const token = jwt.sign({ email, password }, process.env.JWT_SECRET);
      console.log(email, password);
      return res.json({
        success: true,
        message: "Admin logged in successfully",
        token,
      });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// fetch user profile

const fetchUserProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const editUserProfile = async (req, res) => {
  try {
    const { userId, firstName, lastName, email, phone } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.phone = phone;

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Change user password
const changePassword = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.json({ success: false, message: "Invalid old password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashPassword;
    await user.save();

    res.json({ success: true, message: "Password changed successfully" });
  } catch {
    res.json({
      success: false,
      message: "An error occurred while changing password",
    });
  }
};

export {
  loginUser,
  registerUser,
  loginAdmin,
  fetchUserProfile,
  editUserProfile,
  changePassword,
};
