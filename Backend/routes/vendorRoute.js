import express from "express";
import {
  registerVendor,
  loginVendor,
  getVendorProfile,
  updateVendorProfile,
  addProduct,
  vendorProducts,
  updateProduct,
  removeProduct,
  vendorBookings,
  updateBookingStatus,
  vendorDashboard,
} from "../controllers/vendorController.js";
import authVendor from "../middleware/authVendor.js";
import upload from "../middleware/multer.js";

const vendorRouter = express.Router();

// ---------------- Auth ----------------
vendorRouter.post("/register", registerVendor);
vendorRouter.post("/login", loginVendor);

// ---------------- Profile ----------------
vendorRouter.get("/profile", authVendor, getVendorProfile);
vendorRouter.post("/update-profile", authVendor, updateVendorProfile);

// ---------------- Products ----------------
vendorRouter.post(
  "/add-product",
  authVendor,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  addProduct
);
vendorRouter.get("/products", authVendor, vendorProducts);
vendorRouter.post(
  "/update-product",
  authVendor,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  updateProduct
);
vendorRouter.post("/remove-product", authVendor, removeProduct);

// ---------------- Bookings ----------------
vendorRouter.get("/bookings", authVendor, vendorBookings);
vendorRouter.post("/update-booking-status", authVendor, updateBookingStatus);

// ---------------- Dashboard ----------------
vendorRouter.get("/dashboard", authVendor, vendorDashboard);

export default vendorRouter;