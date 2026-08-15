import express from "express";
import {
  loginAdmin,
  allVendors,
  approveVendor,
  toggleVendorBlock,
  allCustomers,
  allProductsAdmin,
  pendingProducts,
  approveProduct,
  removeProductAdmin,
  allBookings,
  adminDashboard,
} from "../controllers/adminController.js";
import authAdmin from "../middleware/authAdmin.js";

const adminRouter = express.Router();

// ---------------- Auth ----------------
adminRouter.post("/login", loginAdmin);

// ---------------- Vendors ----------------
adminRouter.get("/vendors", authAdmin, allVendors);
adminRouter.post("/approve-vendor", authAdmin, approveVendor);
adminRouter.post("/toggle-block-vendor", authAdmin, toggleVendorBlock);

// ---------------- Customers ----------------
adminRouter.get("/customers", authAdmin, allCustomers);

// ---------------- Products ----------------
adminRouter.get("/products", authAdmin, allProductsAdmin);
adminRouter.get("/pending-products", authAdmin, pendingProducts);
adminRouter.post("/approve-product", authAdmin, approveProduct);
adminRouter.post("/remove-product", authAdmin, removeProductAdmin);

// ---------------- Bookings ----------------
adminRouter.get("/bookings", authAdmin, allBookings);

// ---------------- Dashboard ----------------
adminRouter.get("/dashboard", authAdmin, adminDashboard);

export default adminRouter;