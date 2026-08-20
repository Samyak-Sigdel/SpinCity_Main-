// ProfileForm.jsx
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { VendorContext } from "../Context/VendorContext";

const ProfileForm = () => {
  const { backendUrl, vToken, vendorProfile, getVendorProfile } = useContext(VendorContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    shopName: "",
    address: "",
  });

  useEffect(() => {
    if (vendorProfile) {
      setFormData({
        name: vendorProfile.name || "",
        phone: vendorProfile.phone || "",
        shopName: vendorProfile.shopName || "",
        address: vendorProfile.address || "",
      });
    }
  }, [vendorProfile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/vendor/update-profile",
        formData,
        { headers: { vtoken: vToken } }
      );
      if (data.success) {
        toast.success("Profile updated");
        getVendorProfile();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!vendorProfile) {
    return (
      <p className="text-sm text-[#64748B] uppercase tracking-[0.15em]">
        Loading profile...
      </p>
    );
  }

  return (
    <div className="max-w-lg">
      <div className="border border-[#E5E2D9] bg-white rounded-lg shadow-[0_2px_8px_rgba(20,32,51,0.06)] p-5 md:p-6 mb-6">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#64748B]">Email</p>
        <p className="text-sm text-[#142033] mt-2">{vendorProfile.email}</p>
        <p className="text-xs text-[#64748B] mt-3">
          Email can't be changed here. Contact support if you need to update it.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.18em] text-[#64748B] mb-2">
            Full name
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full h-[54px] bg-[#F8F7F2] border border-[#E5E2D9] rounded text-[#142033] px-4 text-sm focus:outline-none focus:border-[#145A4A] focus:bg-white transition-colors"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.18em] text-[#64748B] mb-2">
            Shop name
          </label>
          <input
            name="shopName"
            value={formData.shopName}
            onChange={handleChange}
            required
            className="w-full h-[54px] bg-[#F8F7F2] border border-[#E5E2D9] rounded text-[#142033] px-4 text-sm focus:outline-none focus:border-[#145A4A] focus:bg-white transition-colors"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.18em] text-[#64748B] mb-2">
            Phone
          </label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full h-[54px] bg-[#F8F7F2] border border-[#E5E2D9] rounded text-[#142033] px-4 text-sm focus:outline-none focus:border-[#145A4A] focus:bg-white transition-colors"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.18em] text-[#64748B] mb-2">
            Address
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            rows={3}
            className="w-full bg-[#F8F7F2] border border-[#E5E2D9] rounded text-[#142033] px-4 py-3 text-sm focus:outline-none focus:border-[#145A4A] focus:bg-white transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 h-[44px] w-full sm:w-fit sm:px-8 bg-[#145A4A] hover:bg-[#0D3F35] text-white text-[13px] font-semibold uppercase tracking-[0.15em] rounded transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;