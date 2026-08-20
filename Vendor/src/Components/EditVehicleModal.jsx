// EditVehicleModal.jsx
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
    <div className="fixed inset-0 z-[999] bg-[#142033]/60 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-[0_8px_24px_rgba(20,32,51,0.10)] border border-[#E5E2D9] max-h-[90vh] overflow-y-auto">
        <div className="px-5 md:px-6 py-4 border-b border-[#E5E2D9] flex items-center justify-between">
          <h2 className="font-serif text-lg text-[#142033]">Edit Vehicle</h2>
          <button onClick={onClose} className="text-[#64748B] hover:text-[#142033]" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 md:p-6 flex flex-col gap-5">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.18em] text-[#64748B] mb-2">
              Vehicle photo
            </label>
            <label
              htmlFor="edit-vehicle-image"
              className="flex items-center justify-center w-full h-36 border border-dashed border-[#E5E2D9] rounded-lg cursor-pointer overflow-hidden bg-[#F8F7F2] hover:border-[#145A4A]/60 transition-colors"
            >
              <img src={imagePreview} alt={vehicle.name} className="h-full w-full object-cover" />
            </label>
            <input id="edit-vehicle-image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.18em] text-[#64748B] mb-2">
                Vehicle type
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full h-[50px] bg-[#F8F7F2] border border-[#E5E2D9] rounded text-[#142033] px-4 text-sm focus:outline-none focus:border-[#145A4A] focus:bg-white transition-colors"
              >
                {VEHICLE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.18em] text-[#64748B] mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full h-[50px] bg-[#F8F7F2] border border-[#E5E2D9] rounded text-[#142033] px-4 text-sm focus:outline-none focus:border-[#145A4A] focus:bg-white transition-colors"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.18em] text-[#64748B] mb-2">
              Vehicle name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full h-[50px] bg-[#F8F7F2] border border-[#E5E2D9] rounded text-[#142033] px-4 text-sm focus:outline-none focus:border-[#145A4A] focus:bg-white transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.18em] text-[#64748B] mb-2">
                Price per day
              </label>
              <input
                type="number"
                name="pricePerDay"
                min="0"
                value={formData.pricePerDay}
                onChange={handleChange}
                required
                className="w-full h-[50px] bg-[#F8F7F2] border border-[#E5E2D9] rounded text-[#142033] px-4 text-sm focus:outline-none focus:border-[#145A4A] focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.18em] text-[#64748B] mb-2">
                Total units
              </label>
              <input
                type="number"
                name="quantityTotal"
                min="1"
                value={formData.quantityTotal}
                onChange={handleChange}
                required
                className="w-full h-[50px] bg-[#F8F7F2] border border-[#E5E2D9] rounded text-[#142033] px-4 text-sm focus:outline-none focus:border-[#145A4A] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.18em] text-[#64748B] mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full bg-[#F8F7F2] border border-[#E5E2D9] rounded text-[#142033] px-4 py-3 text-sm focus:outline-none focus:border-[#145A4A] focus:bg-white transition-colors"
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-[46px] border border-[#E5E2D9] rounded text-[#142033] text-[13px] font-semibold uppercase tracking-[0.12em] hover:border-[#64748B] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-[46px] bg-[#145A4A] hover:bg-[#0D3F35] text-white text-[13px] font-semibold uppercase tracking-[0.12em] rounded transition-colors disabled:opacity-50"
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