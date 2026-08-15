import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { VendorContext, VEHICLE_CATEGORIES } from "../Context/VendorContext";
import LocationPickerModal from "./LocationPickerModal";

const AddVehicleForm = ({ onAdded }) => {
  const { backendUrl, vToken } = useContext(VendorContext);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [location, setLocation] = useState(null); // { address, lat, lon }
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: VEHICLE_CATEGORIES[0],
    pricePerDay: "",
    quantityTotal: "1",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setDocumentFile(file);
    setDocumentName(file.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please upload a photo of the vehicle");
      return;
    }

    if (!documentFile) {
      toast.error("Please upload the vehicle's registration document (bluebook)");
      return;
    }

    if (!location) {
      toast.error("Please select a pickup location");
      return;
    }

    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("category", formData.category);
      payload.append("pricePerDay", formData.pricePerDay);
      payload.append("quantityTotal", formData.quantityTotal);
      payload.append("description", formData.description);
      payload.append("image", imageFile);
      payload.append("document", documentFile);
      payload.append("address", location.address);
      payload.append("lat", location.lat);
      payload.append("lng", location.lon);

      const { data } = await axios.post(
        backendUrl + "/api/vendor/add-product",
        payload,
        { headers: { vtoken: vToken } }
      );

      if (data.success) {
        toast.success("Vehicle submitted — it will appear once approved");
        setFormData({
          name: "",
          category: VEHICLE_CATEGORIES[0],
          pricePerDay: "",
          quantityTotal: "1",
          description: "",
        });
        setImageFile(null);
        setImagePreview(null);
        setDocumentFile(null);
        setDocumentName("");
        setLocation(null);
        onAdded && onAdded();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add vehicle. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl flex flex-col gap-5">
      <div>
        <label className="block text-[10px] uppercase tracking-[0.18em] text-[#858B91] mb-2">
          Vehicle photo
        </label>
        <label
          htmlFor="vehicle-image"
          className="flex items-center justify-center w-full h-44 border border-dashed border-white/15 cursor-pointer overflow-hidden bg-[#181D21] hover:border-[#D6B36A]/60 transition-colors"
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Vehicle preview" className="h-full w-full object-cover" />
          ) : (
            <span className="text-sm text-[#70767C]">Click to upload a photo</span>
          )}
        </label>
        <input
          id="vehicle-image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-[0.18em] text-[#858B91] mb-2">
          Pickup location
        </label>
        <button
          type="button"
          onClick={() => setLocationModalOpen(true)}
          className="w-full h-[54px] flex items-center gap-3 border border-white/10 bg-[#181D21] px-4 text-left hover:border-[#D6B36A]/60 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
            <circle cx="7" cy="7" r="5" stroke="#D6B36A" strokeWidth="1.5" />
            <path d="M11 11l4 4" stroke="#D6B36A" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className={location ? "text-[#F5F3EE] text-sm truncate" : "text-[#70767C] text-sm truncate"}>
            {location ? location.address : "Search, use current location, or pick on the map"}
          </span>
        </button>
        {location && (
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#7FBFA0] mt-2">
            ✓ Location set
          </p>
        )}
        <LocationPickerModal
          isOpen={locationModalOpen}
          onClose={() => setLocationModalOpen(false)}
          onConfirm={(place) => setLocation(place)}
          initialAddress={location?.address || ""}
        />
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-[0.18em] text-[#858B91] mb-2">
          Vehicle document (bluebook)
        </label>
        <label
          htmlFor="vehicle-document"
          className="flex items-center gap-3 w-full border border-dashed border-white/15 px-4 py-3.5 cursor-pointer bg-[#181D21] hover:border-[#D6B36A]/60 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
            <path
              d="M4 2h7l4 4v10a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z"
              stroke="#D6B36A"
              strokeWidth="1.3"
            />
            <path d="M11 2v4h4" stroke="#D6B36A" strokeWidth="1.3" />
          </svg>
          <span className="text-sm text-[#B5B8BB] truncate">
            {documentName || "Upload a photo or scan of the vehicle's registration"}
          </span>
        </label>
        <input
          id="vehicle-document"
          type="file"
          accept="image/*,.pdf"
          onChange={handleDocumentChange}
          className="hidden"
        />
        <p className="text-xs text-[#60666C] mt-2">
          Only visible to SpinCity admins for verification — never shown to customers.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.18em] text-[#858B91] mb-2">
            Vehicle type
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full h-[54px] bg-[#181D21] border border-white/10 text-[#F5F3EE] px-4 text-sm focus:outline-none focus:border-[#D6B36A] [color-scheme:dark]"
          >
            {VEHICLE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.18em] text-[#858B91] mb-2">
            Price per day
          </label>
          <input
            type="number"
            name="pricePerDay"
            min="0"
            value={formData.pricePerDay}
            onChange={handleChange}
            required
            placeholder="e.g. 1200"
            className="w-full h-[54px] bg-[#181D21] border border-white/10 text-[#F5F3EE] placeholder:text-[#70767C] px-4 text-sm focus:outline-none focus:border-[#D6B36A]"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-[0.18em] text-[#858B91] mb-2">
          Vehicle name
        </label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="e.g. Honda Activa 6G"
          className="w-full h-[54px] bg-[#181D21] border border-white/10 text-[#F5F3EE] placeholder:text-[#70767C] px-4 text-sm focus:outline-none focus:border-[#D6B36A]"
        />
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-[0.18em] text-[#858B91] mb-2">
          Units available
        </label>
        <input
          type="number"
          name="quantityTotal"
          min="1"
          value={formData.quantityTotal}
          onChange={handleChange}
          required
          className="w-full h-[54px] bg-[#181D21] border border-white/10 text-[#F5F3EE] px-4 text-sm focus:outline-none focus:border-[#D6B36A]"
        />
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-[0.18em] text-[#858B91] mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          placeholder="Condition, mileage, fuel type, any pickup notes..."
          className="w-full bg-[#181D21] border border-white/10 text-[#F5F3EE] placeholder:text-[#70767C] px-4 py-3 text-sm focus:outline-none focus:border-[#D6B36A]"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 h-[54px] bg-[#D6B36A] hover:bg-[#E5C783] text-[#0B0D0F] text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit for Approval"}
      </button>
    </form>
  );
};

export default AddVehicleForm;