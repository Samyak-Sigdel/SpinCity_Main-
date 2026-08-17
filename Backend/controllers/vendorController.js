import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import mongoose from "mongoose";
import vendorModel from "../models/venderModel.js";
import productModel from "../models/productModel.js";
import bookingModel from "../models/bookingModel.js";

// ---------------- Auth ----------------

const registerVendor = async (req, res) => {
  try {
    const { name, email, password, phone, shopName, address } = req.body;

    if (!name || !email || !password || !phone || !shopName || !address) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const existingVendor = await vendorModel.findOne({ email });
    if (existingVendor) {
      return res.json({ success: false, message: "Vendor already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const vendorData = {
      name,
      email,
      password: hashedPassword,
      phone,
      shopName,
      address,
    };

    const newVendor = new vendorModel(vendorData);
    const vendor = await newVendor.save();

    const token = jwt.sign({ id: vendor._id }, process.env.JWT_SECRET);

    res.json({ success: true, message: "Registered successfully", token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const vendor = await vendorModel.findOne({ email });
    if (!vendor) {
      return res.json({ success: false, message: "Vendor does not exist" });
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: vendor._id }, process.env.JWT_SECRET);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ---------------- Profile ----------------

const getVendorProfile = async (req, res) => {
  try {
    const vendor = await vendorModel.findById(req.vendorId).select("-password");
    res.json({ success: true, vendor });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateVendorProfile = async (req, res) => {
  try {
    const { name, phone, shopName, address } = req.body;

    const vendor = await vendorModel.findByIdAndUpdate(
      req.vendorId,
      { name, phone, shopName, address },
      { new: true }
    ).select("-password");

    res.json({ success: true, message: "Profile updated", vendor });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ---------------- Products ----------------

const addProduct = async (req, res) => {
  try {
    const { name, category, pricePerDay, description, quantityTotal, address, lat, lng, isVisible } = req.body;
    const imageFile = req.files?.image?.[0];
    const documentFile = req.files?.document?.[0];

    if (!name || !category || !description || !pricePerDay) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (!imageFile) {
      return res.json({ success: false, message: "Product image is required" });
    }

    if (!documentFile) {
      return res.json({ success: false, message: "Vehicle document (bluebook) is required" });
    }

    if (!address || !lat || !lng) {
      return res.json({ success: false, message: "Pickup location is required" });
    }

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    const documentUpload = await cloudinary.uploader.upload(documentFile.path, {
      resource_type: "auto",
    });
    const documentUrl = documentUpload.secure_url;

    const productData = {
      name,
      image: imageUrl,
      vehicleDocument: documentUrl,
      category,
      pricePerDay: Number(pricePerDay),
      description,
      owner: req.vendorId,
      quantityTotal: quantityTotal ? Number(quantityTotal) : 1,
      quantityAvailable: quantityTotal ? Number(quantityTotal) : 1,
      // NEW: lets a vendor opt a vehicle out of the customer-facing listing
      // right from creation; defaults to visible if not sent
      isVisible: typeof isVisible !== "undefined" ? isVisible === "true" || isVisible === true : true,
      location: {
        address,
        coordinates: {
          type: "Point",
          coordinates: [Number(lng), Number(lat)],
        },
      },
    };

    const newProduct = new productModel(productData);
    const product = await newProduct.save();

    res.json({ success: true, message: "Product added successfully", product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const vendorProducts = async (req, res) => {
  try {
    const products = await productModel.find({ owner: req.vendorId });
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId, name, category, pricePerDay, description, quantityTotal, status, address, lat, lng, isVisible } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.json({ success: false, message: "Invalid product ID" });
    }

    const product = await productModel.findOne({ _id: productId, owner: req.vendorId });
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    if (req.files?.image?.[0]) {
      const imageUpload = await cloudinary.uploader.upload(req.files.image[0].path, {
        resource_type: "image",
      });
      product.image = imageUpload.secure_url;
    }

    if (req.files?.document?.[0]) {
      const documentUpload = await cloudinary.uploader.upload(req.files.document[0].path, {
        resource_type: "auto",
      });
      product.vehicleDocument = documentUpload.secure_url;
    }

    if (name) product.name = name;
    if (category) product.category = category;
    if (pricePerDay) product.pricePerDay = Number(pricePerDay);
    if (description) product.description = description;
    if (quantityTotal) product.quantityTotal = Number(quantityTotal);
    if (status) product.status = status;
    // NEW: vendor-controlled visibility toggle, editable independently of
    // any other field (e.g. a simple switch in the vehicle list/edit modal)
    if (typeof isVisible !== "undefined") {
      product.isVisible = isVisible === "true" || isVisible === true;
    }
    if (address && lat && lng) {
      product.location = {
        address,
        coordinates: {
          type: "Point",
          coordinates: [Number(lng), Number(lat)],
        },
      };
    }

    await product.save();

    res.json({ success: true, message: "Product updated successfully", product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const removeProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID format" });
    }

    const deletedProduct = await productModel.findOneAndDelete({
      _id: productId,
      owner: req.vendorId,
    });

    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Product not found or already deleted" });
    }

    res.json({ success: true, message: "Product removed successfully", product: deletedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Bookings ----------------

const vendorBookings = async (req, res) => {
  try {
    const bookings = await bookingModel
      .find({ vendor: req.vendorId })
      .populate("customer", "name email phone")
      .populate("product", "name image")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;

    const allowedStatuses = ["Confirmed", "Active", "Completed", "Cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.json({ success: false, message: "Invalid status" });
    }

    const booking = await bookingModel.findOne({ _id: bookingId, vendor: req.vendorId });
    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    if (status === "Cancelled") {
      await productModel.findByIdAndUpdate(booking.product, {
        $inc: { quantityAvailable: booking.quantity },
      });
    }

    res.json({ success: true, message: `Booking marked as ${status}`, booking });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ---------------- Dashboard ----------------

const vendorDashboard = async (req, res) => {
  try {
    const products = await productModel.find({ owner: req.vendorId });
    const bookings = await bookingModel
      .find({ vendor: req.vendorId })
      .populate("customer", "name email phone")
      .populate("product", "name image")
      .sort({ createdAt: -1 });

    const paidBookings = bookings.filter((b) => b.paymentStatus === "Paid");
    const earnings = paidBookings.reduce((sum, b) => sum + b.totalPrice, 0);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayEarnings = paidBookings
      .filter((b) => new Date(b.updatedAt) >= startOfToday)
      .reduce((sum, b) => sum + b.totalPrice, 0);

    const dashData = {
      totalProducts: products.length,
      totalBookings: bookings.length,
      pendingBookings: bookings.filter((b) => b.status === "Pending").length,
      activeRentals: bookings.filter((b) => b.status === "Active").length,
      earnings,
      todayEarnings,
      latestBookings: bookings.slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
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
};