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
      <p className="text-sm text-[#858B91] uppercase tracking-[0.15em]">
        Loading profile...
      </p>
    );
  }

  return (
    <div className="max-w-lg">
      <div className="border border-white/10 bg-[#101417] p-5 md:p-6 mb-6">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#858B91]">Email</p>
        <p className="text-sm text-[#F5F3EE] mt-2">{vendorProfile.email}</p>
        <p className="text-xs text-[#60666C] mt-3">
          Email can't be changed here. Contact support if you need to update it.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.18em] text-[#858B91] mb-2">
            Full name
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full h-[54px] bg-[#181D21] border border-white/10 text-[#F5F3EE] px-4 text-sm focus:outline-none focus:border-[#D6B36A]"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.18em] text-[#858B91] mb-2">
            Shop name
          </label>
          <input
            name="shopName"
            value={formData.shopName}
            onChange={handleChange}
            required
            className="w-full h-[54px] bg-[#181D21] border border-white/10 text-[#F5F3EE] px-4 text-sm focus:outline-none focus:border-[#D6B36A]"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.18em] text-[#858B91] mb-2">
            Phone
          </label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full h-[54px] bg-[#181D21] border border-white/10 text-[#F5F3EE] px-4 text-sm focus:outline-none focus:border-[#D6B36A]"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.18em] text-[#858B91] mb-2">
            Address
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            rows={3}
            className="w-full bg-[#181D21] border border-white/10 text-[#F5F3EE] px-4 py-3 text-sm focus:outline-none focus:border-[#D6B36A]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 h-[54px] w-full sm:w-fit sm:px-8 bg-[#D6B36A] hover:bg-[#E5C783] text-[#0B0D0F] text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;