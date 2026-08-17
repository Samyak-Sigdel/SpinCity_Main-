import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { VendorContext, VEHICLE_CATEGORIES } from "../Context/VendorContext";

const STATUS_OPTIONS = ["Available", "Rented", "Maintenance", "Inactive"];

const EditVehicleModal = ({ vehicle, onClose, onSaved }) => {
  const { backendUrl, vToken } = useContext(VendorContext);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(vehicle.image);

  const [formData, setFormData] = useState({
    name: vehicle.name,
    category: vehicle.category,
    pricePerDay: vehicle.pricePerDay,
    quantityTotal: vehicle.quantityTotal,
    description: vehicle.description,
    status: vehicle.status,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("productId", vehicle._id);
      payload.append("name", formData.name);
      payload.append("category", formData.category);
      payload.append("pricePerDay", formData.pricePerDay);
      payload.append("quantityTotal", formData.quantityTotal);
      payload.append("description", formData.description);
      payload.append("status", formData.status);
      if (imageFile) payload.append("image", imageFile);

      const { data } = await axios.post(
        backendUrl + "/api/vendor/update-product",
        payload,
        { headers: { vtoken: vToken } }
      );

      if (data.success) {
        toast.success("Vehicle updated");
        onSaved && onSaved();
        onClose();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update vehicle.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#101417] border border-white/10 max-h-[90vh] overflow-y-auto">
        <div className="px-5 md:px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-serif text-lg text-[#F5F3EE]">Edit Vehicle</h2>
          <button onClick={onClose} className="text-[#858B91] hover:text-[#F5F3EE]" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 md:p-6 flex flex-col gap-5">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.18em] text-[#858B91] mb-2">
              Vehicle photo
            </label>
            <label
              htmlFor="edit-vehicle-image"
              className="flex items-center justify-center w-full h-36 border border-dashed border-white/15 cursor-pointer overflow-hidden bg-[#181D21] hover:border-[#D6B36A]/60 transition-colors"
            >
              <img src={imagePreview} alt={vehicle.name} className="h-full w-full object-cover" />
            </label>
            <input id="edit-vehicle-image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.18em] text-[#858B91] mb-2">
                Vehicle type
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full h-[50px] bg-[#181D21] border border-white/10 text-[#F5F3EE] px-4 text-sm focus:outline-none focus:border-[#D6B36A] [color-scheme:dark]"
              >
                {VEHICLE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.18em] text-[#858B91] mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full h-[50px] bg-[#181D21] border border-white/10 text-[#F5F3EE] px-4 text-sm focus:outline-none focus:border-[#D6B36A] [color-scheme:dark]"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
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
              className="w-full h-[50px] bg-[#181D21] border border-white/10 text-[#F5F3EE] px-4 text-sm focus:outline-none focus:border-[#D6B36A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
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
                className="w-full h-[50px] bg-[#181D21] border border-white/10 text-[#F5F3EE] px-4 text-sm focus:outline-none focus:border-[#D6B36A]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.18em] text-[#858B91] mb-2">
                Total units
              </label>
              <input
                type="number"
                name="quantityTotal"
                min="1"
                value={formData.quantityTotal}
                onChange={handleChange}
                required
                className="w-full h-[50px] bg-[#181D21] border border-white/10 text-[#F5F3EE] px-4 text-sm focus:outline-none focus:border-[#D6B36A]"
              />
            </div>
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
              className="w-full bg-[#181D21] border border-white/10 text-[#F5F3EE] px-4 py-3 text-sm focus:outline-none focus:border-[#D6B36A]"
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-[50px] border border-white/15 text-[#B5B8BB] text-[11px] font-semibold uppercase tracking-[0.18em] hover:border-white/30 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-[50px] bg-[#D6B36A] hover:bg-[#E5C783] text-[#0B0D0F] text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVehicleModal;