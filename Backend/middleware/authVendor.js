import jwt from "jsonwebtoken";

// vendor authentication middleware

const authVendor = async (req, res, next) => {
  try {
    const { vtoken } = req.headers;

    if (!vtoken) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, please login again.",
      });
    }

    const token_decode = jwt.verify(vtoken, process.env.JWT_SECRET);
    req.vendorId = token_decode.id; // set here so controllers can use req.vendorId

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    res.status(401).json({
      success: false,
      message: "Authorization failed. " + (error.message || "Invalid token"),
    });
  }
};

export default authVendor;