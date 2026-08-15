import express from "express";
import {
  registerCustomer,
  loginCustomer,
  getCustomerProfile,
  updateCustomerProfile,
  listProducts,
  getProductById,
  createBooking,
  myBookings,
  cancelBooking,
} from "../controllers/userController.js";
import authCustomer from "../middleware/authCustomer.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

// ---------------- Auth ----------------
userRouter.post("/register", registerCustomer);
userRouter.post("/login", loginCustomer);

// ---------------- Profile ----------------
userRouter.get("/profile", authCustomer, getCustomerProfile);
userRouter.post("/update-profile", authCustomer, updateCustomerProfile);

// ---------------- Browse Products (public) ----------------
userRouter.get("/products", listProducts);
userRouter.get("/products/:productId", getProductById);

// ---------------- Bookings ----------------
userRouter.post("/book", authCustomer, upload.single("licenseImage"), createBooking);
userRouter.get("/my-bookings", authCustomer, myBookings);
userRouter.post("/cancel-booking", authCustomer, cancelBooking);

export default userRouter;