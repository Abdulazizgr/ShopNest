import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
  },
  {
    minimize: false, // Disable minimization to keep empty objects
  }
);
const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
export default UserModel;
