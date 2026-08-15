import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import mongoose from "mongoose";
import customerModel from "../models/customerModel.js";
import productModel from "../models/productModel.js";
import bookingModel from "../models/bookingModel.js";

// ---------------- Auth ----------------

const registerCustomer = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password || !phone || !address) {
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

    const existingCustomer = await customerModel.findOne({ email });
    if (existingCustomer) {
      return res.json({ success: false, message: "Customer already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const customerData = { name, email, password: hashedPassword, phone, address };

    const newCustomer = new customerModel(customerData);
    const customer = await newCustomer.save();

    const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET);

    res.json({ success: true, message: "Registered successfully", token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await customerModel.findOne({ email });
    if (!customer) {
      return res.json({ success: false, message: "Customer does not exist" });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ---------------- Profile ----------------

const getCustomerProfile = async (req, res) => {
  try {
    const customer = await customerModel.findById(req.customerId).select("-password");
    res.json({ success: true, customer });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateCustomerProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const customer = await customerModel.findByIdAndUpdate(
      req.customerId,
      { name, phone, address },
      { new: true }
    ).select("-password");

    res.json({ success: true, message: "Profile updated", customer });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ---------------- Browse Products ----------------

// public listing, optionally filtered by category / search term
const listProducts = async (req, res) => {
  try {
    const { category, search, lat, lng, radius } = req.query;

    const matchStage = { status: "Available", isApproved: true };
    if (category) matchStage.category = category;
    if (search) matchStage.name = { $regex: search, $options: "i" };

    let products;

    if (lat && lng) {
      // $geoNear also returns how far each vehicle is from the searched point
      products = await productModel.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: [Number(lng), Number(lat)] },
            distanceField: "distanceMeters",
            maxDistance: (radius ? Number(radius) : 25) * 1000, // km → meters
            spherical: true,
            query: matchStage,
          },
        },
        {
          $lookup: {
            from: "vendors",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
          },
        },
        { $unwind: "$owner" },
        {
          $project: {
            name: 1,
            category: 1,
            pricePerDay: 1,
            image: 1,
            description: 1,
            quantityTotal: 1,
            quantityAvailable: 1,
            status: 1,
            isApproved: 1,
            location: 1,
            distanceMeters: 1,
            createdAt: 1,
            "owner._id": 1,
            "owner.shopName": 1,
          },
        },
      ]);
    } else {
      products = await productModel.find(matchStage).populate("owner", "shopName");
    }

    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.json({ success: false, message: "Invalid product ID" });
    }

    const product = await productModel.findById(productId).populate("owner", "shopName address phone");
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ---------------- Bookings ----------------

const createBooking = async (req, res) => {
  try {
    const {
      productId,
      startDate,
      endDate,
      quantity,
      firstName,
      lastName,
      email,
      phone,
      countryCode,
      age,
      countryOfResidence,
    } = req.body;

    if (
      !productId ||
      !startDate ||
      !endDate ||
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !age ||
      !countryOfResidence
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const licenseFile = req.file;
    if (!licenseFile) {
      return res.json({ success: false, message: "Driver's license photo is required" });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    const qty = quantity ? Number(quantity) : 1;
    if (product.quantityAvailable < qty) {
      return res.json({ success: false, message: "Not enough stock available" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (totalDays <= 0) {
      return res.json({ success: false, message: "endDate must be after startDate" });
    }

    const licenseUpload = await cloudinary.uploader.upload(licenseFile.path, {
      resource_type: "image",
    });

    const totalPrice = product.pricePerDay * totalDays * qty;
    const bookingCode = `BK-${Date.now()}`;

    const bookingData = {
      bookingCode,
      customer: req.customerId,
      vendor: product.owner,
      product: product._id,
      quantity: qty,
      startDate: start,
      endDate: end,
      totalDays,
      pricePerDay: product.pricePerDay,
      totalPrice,
      driverDetails: {
        firstName,
        lastName,
        email,
        phone,
        countryCode: countryCode || "+977",
        age: Number(age),
        countryOfResidence,
        licenseImage: licenseUpload.secure_url,
      },
    };

    const newBooking = new bookingModel(bookingData);
    const booking = await newBooking.save();

    // reserve the stock
    product.quantityAvailable -= qty;
    if (product.quantityAvailable === 0) product.status = "Rented";
    await product.save();

    res.json({ success: true, message: "Booking created successfully", booking });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const myBookings = async (req, res) => {
  try {
    const bookings = await bookingModel
      .find({ customer: req.customerId })
      .populate("product", "name image category")
      .populate("vendor", "shopName phone")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await bookingModel.findOne({ _id: bookingId, customer: req.customerId });
    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    if (["Completed", "Cancelled"].includes(booking.status)) {
      return res.json({ success: false, message: `Booking is already ${booking.status}` });
    }

    booking.status = "Cancelled";
    await booking.save();

    // release the reserved stock back to the product
    await productModel.findByIdAndUpdate(booking.product, {
      $inc: { quantityAvailable: booking.quantity },
      status: "Available",
    });

    res.json({ success: true, message: "Booking cancelled successfully", booking });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  registerCustomer,
  loginCustomer,
  getCustomerProfile,
  updateCustomerProfile,
  listProducts,
  getProductById,
  createBooking,
  myBookings,
  cancelBooking,
};