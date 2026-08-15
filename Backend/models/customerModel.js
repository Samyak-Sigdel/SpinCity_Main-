import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: { type: String, required: true },

    phone: { type: String, required: true },

    address: { type: String, required: true },

    role: {
      type: String,
      enum: ["customer"],
      default: "customer",
    },

    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
  },
  { timestamps: true }
);

const customerModel =
  mongoose.models.Customer || mongoose.model("Customer", customerSchema);

export default customerModel;