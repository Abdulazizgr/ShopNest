import SubscriptionModel from "../models/subscriptionModel.js";

const addSubscription = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.json({
        success: false,
        message: "Email is required",
      });
    }
    const existingSubscription = await SubscriptionModel.find({ email });
    if (existingSubscription.length > 0) {
      return res.json({
        success: false,
        message: "You are already subscribed",
      });
    }

    const subscription = new SubscriptionModel({ email });
    subscription.save();
    res.json({ success: true, message: "Subscription added successfully" });
  } catch (error) {
    console.error("Error adding subscription:", error);
    return res.json({ success: false, message: "Internal server error" });
  }
};

export { addSubscription };
