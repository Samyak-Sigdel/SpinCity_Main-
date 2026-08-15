import jwt from "jsonwebtoken";
import vendorModel from "../models/venderModel.js";
import customerModel from "../models/customerModel.js";
import productModel from "../models/productModel.js";
import bookingModel from "../models/bookingModel.js";

// ---------------- Admin Login ----------------
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ---------------- Vendors ----------------

// get all vendors (for admin review/listing)
const allVendors = async (req, res) => {
  try {
    const vendors = await vendorModel.find({}).select("-password");
    res.json({ success: true, vendors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// approve / verify a vendor so their products go live
const approveVendor = async (req, res) => {
  try {
    const { vendorId } = req.body;

    if (!vendorId) {
      return res.json({ success: false, message: "vendorId is required" });
    }

    const vendor = await vendorModel.findByIdAndUpdate(
      vendorId,
      { isVerified: true },
      { new: true }
    );

    if (!vendor) {
      return res.json({ success: false, message: "Vendor not found" });
    }

    res.json({ success: true, message: "Vendor approved successfully", vendor });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// block / unblock a vendor
const toggleVendorBlock = async (req, res) => {
  try {
    const { vendorId } = req.body;

    const vendor = await vendorModel.findById(vendorId);
    if (!vendor) {
      return res.json({ success: false, message: "Vendor not found" });
    }

    vendor.isBlocked = !vendor.isBlocked;
    await vendor.save();

    res.json({
      success: true,
      message: `Vendor ${vendor.isBlocked ? "blocked" : "unblocked"} successfully`,
      vendor,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ---------------- Customers ----------------

const allCustomers = async (req, res) => {
  try {
    const customers = await customerModel.find({}).select("-password");
    res.json({ success: true, customers });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ---------------- Products ----------------

// admin view of all products across all vendors
const allProductsAdmin = async (req, res) => {
  try {
    const products = await productModel.find({}).populate("owner", "name shopName email");
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// vehicles awaiting admin approval
const pendingProducts = async (req, res) => {
  try {
    const products = await productModel
      .find({ isApproved: false })
      .populate("owner", "name shopName email");
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// approve a vehicle so it becomes visible to customers
const approveProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await productModel.findByIdAndUpdate(
      productId,
      { isApproved: true },
      { new: true }
    );

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Vehicle approved successfully", product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// admin can remove any product (e.g. policy violation, or rejecting a pending listing)
const removeProductAdmin = async (req, res) => {
  try {
    const { productId } = req.body;

    const deletedProduct = await productModel.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ---------------- Bookings ----------------

const allBookings = async (req, res) => {
  try {
    const bookings = await bookingModel
      .find({})
      .populate("customer", "name email phone")
      .populate("vendor", "name shopName email")
      .populate("product", "name image category")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ---------------- Dashboard ----------------

const adminDashboard = async (req, res) => {
  try {
    const [vendorCount, customerCount, productCount, bookings] = await Promise.all([
      vendorModel.countDocuments({}),
      customerModel.countDocuments({}),
      productModel.countDocuments({}),
      bookingModel.find({}),
    ]);

    const totalRevenue = bookings
      .filter((b) => b.paymentStatus === "Paid")
      .reduce((sum, b) => sum + b.totalPrice, 0);

    const dashData = {
      vendors: vendorCount,
      customers: customerCount,
      products: productCount,
      bookings: bookings.length,
      pendingBookings: bookings.filter((b) => b.status === "Pending").length,
      revenue: totalRevenue,
      latestBookings: bookings.slice(-5).reverse(),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
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
};