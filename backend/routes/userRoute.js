import express from "express";

import {
  registerUser,
  loginUser,
  loginAdmin,
  fetchUserProfile,
  editUserProfile,
  changePassword,
} from "../controllers/userController.js";
import { addSubscription } from "../controllers/subscriptionController.js";
import authUser from "../middleware/auth.js";

const userRouter = express.Router();

//  Post methods
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", loginAdmin);
userRouter.post("/subscribe", addSubscription);
userRouter.post("/my-profile", authUser, fetchUserProfile);
userRouter.post("/editProfile", authUser, editUserProfile);
userRouter.post("/changePassword", authUser, changePassword);

export default userRouter;
