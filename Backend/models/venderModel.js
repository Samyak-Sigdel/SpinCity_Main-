import mongoose from "mongoose";

const venderSchema = new mongoose.Schema(
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
      enum: ["vendor"],
      default: "vendor",
    },

    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },

    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

const venderModel =
  mongoose.models.Vendor || mongoose.model("Vendor", venderSchema);

export default venderModel;