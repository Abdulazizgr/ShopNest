import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided, authorization denied",
      });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    if (
      token_decode.email !== process.env.ADMIN_EMAIL &&
      token_decode.password !== process.env.ADMIN_PASSWORD
    ) {
      console.log(token_decode);
      return res.status(403).json({
        success: false,
        message: "Access denied: Admins only",
      });
    }
    next();
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export default adminAuth;
