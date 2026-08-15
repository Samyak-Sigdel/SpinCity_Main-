import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingCode: {
      type: String,
      required: true,
      unique: true, // creates the index — do NOT also add schema.index({ bookingCode: 1 })
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: { type: Number, required: true, default: 1 },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalDays: { type: Number, required: true }, // (endDate - startDate) in days

    pricePerDay: { type: Number, required: true }, // snapshot of product.pricePerDay at booking time
    totalPrice: { type: Number, required: true }, // pricePerDay * totalDays * quantity

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Active", "Completed", "Cancelled"],
      default: "Pending",
    },

    // collected at checkout, per booking — mirrors a rental checkout's driver details step
    driverDetails: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      countryCode: { type: String, default: "+977" },
      age: { type: Number, required: true },
      countryOfResidence: { type: String, required: true },
      licenseImage: { type: String, required: true }, // Cloudinary URL of the driver's license photo
    },

    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid", "Refunded"],
      default: "Unpaid",
    },
  },
  { timestamps: true }
);

// Compound index for common lookup pattern — safe to keep alongside the
// single-field unique index above since it covers a different query shape
bookingSchema.index({ customer: 1, status: 1 });

const bookingModel =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default bookingModel;