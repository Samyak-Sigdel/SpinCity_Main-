import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },

    vehicleDocument: { type: String, required: true },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    quantityTotal: { type: Number, required: true },
    quantityAvailable: { type: Number, required: true },

    status: {
      type: String,
      enum: ["Available", "Rented", "Maintenance", "Inactive"],
      default: "Available",
    },

    // vehicle stays hidden from public listings until an admin approves it
    isApproved: { type: Boolean, default: false },

    // NEW: vendor-controlled visibility — lets a vendor hide an approved
    // vehicle from the customer app without deleting or unapproving it
    isVisible: { type: Boolean, default: true },

    location: {
      address: { type: String, required: true },
      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number],
          required: true,
        },
      },
    },
  },
  { timestamps: true }
);

productSchema.index({ "location.coordinates": "2dsphere" });

const productModel =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default productModel;