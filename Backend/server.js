import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Database & Cloudinary
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

// Routes
import adminRouter from "./routes/adminRoute.js";
import vendorRouter from "./routes/vendorRoute.js";
import userRouter from "./routes/userRoute.js";

// Initialize Express
const app = express();
const port = process.env.PORT || 4000;

// Connect services
connectDB();
connectCloudinary();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/admin", adminRouter);
app.use("/api/vendor", vendorRouter);
app.use("/api/user", userRouter);

// Test Route
app.get("/", (req, res) => {
    res.send("API Working Fine");
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL);
console.log("ADMIN_PASSWORD:", process.env.ADMIN_PASSWORD);