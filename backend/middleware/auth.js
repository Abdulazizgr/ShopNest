import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(401).json({ message: "Not Authorized Login Again" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = decoded.id;
    req.body.password = decoded.password;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: error.message + "av" || "Not Authorized Login Again" });
  }
};

export default authUser;
