import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    pricePerDay: { type: Number, required: true }, // Rental rate per day
    image: { type: String, required: true }, // Path or URL of the image
    description: { type: String, required: true },

    // proof of ownership/registration (bluebook), required for admin verification —
    // not shown to customers, only visible in the admin panel
    vehicleDocument: { type: String, required: true },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    quantityTotal: { type: Number, required: true },
    quantityAvailable: { type: Number, required: true},

    status: {
      type: String,
      enum: ["Available", "Rented", "Maintenance", "Inactive"],
      default: "Available",
    },

    // vehicle stays hidden from public listings until an admin approves it
    isApproved: { type: Boolean, default: false },

    // pickup location, used for "Where" search on the customer app
    location: {
      address: { type: String, required: true },
      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true,
        },
      },
    },
  },
  { timestamps: true }
);

// enables $near / $geoWithin queries for the "Where" search on the customer app
productSchema.index({ "location.coordinates": "2dsphere" });

const productModel =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default productModel;