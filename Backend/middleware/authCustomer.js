import jwt from "jsonwebtoken";

// customer authentication middleware

const authCustomer = async (req, res, next) => {
  try {
    const { ctoken } = req.headers;

    if (!ctoken) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, please login again.",
      });
    }

    const token_decode = jwt.verify(ctoken, process.env.JWT_SECRET);
    req.customerId = token_decode.id; // set here so controllers can use req.customerId

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    res.status(401).json({
      success: false,
      message: "Authorization failed. " + (error.message || "Invalid token"),
    });
  }
};

export default authCustomer;