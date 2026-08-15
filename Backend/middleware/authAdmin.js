import jwt from "jsonwebtoken";

// admin authentication middleware

const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;

    if (!atoken) {
      return res.json({
        success: false,
        message: "Not authorized, please login again.",
      });
    }

    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);

    if (token_decode.email !== process.env.ADMIN_EMAIL) {
      return res.json({
        success: false,
        message: "Not authorized, please login again.",
      });
    }

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.json({
      success: false,
      message: "Authorization failed. " + (error.message || "Invalid token"),
    });
  }
};

export default authAdmin;