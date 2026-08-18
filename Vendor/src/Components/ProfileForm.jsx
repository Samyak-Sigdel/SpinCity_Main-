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
      <p className="text-sm text-[#667085] uppercase tracking-[0.15em]">
        Loading profile...
      </p>
    );
  }

  return (
    <div className="max-w-lg">
      <div className="border border-[#E5E1D8] bg-white rounded-lg shadow-[0_2px_8px_rgba(23,32,51,0.06)] p-5 md:p-6 mb-6">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#667085]">Email</p>
        <p className="text-sm text-[#172033] mt-2">{vendorProfile.email}</p>
        <p className="text-xs text-[#98A2B3] mt-3">
          Email can't be changed here. Contact support if you need to update it.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.18em] text-[#667085] mb-2">
            Full name
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full h-[54px] bg-[#F7F5EF] border border-[#E5E1D8] rounded text-[#172033] px-4 text-sm focus:outline-none focus:border-[#BFA05A] focus:bg-white transition-colors"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.18em] text-[#667085] mb-2">
            Shop name
          </label>
          <input
            name="shopName"
            value={formData.shopName}
            onChange={handleChange}
            required
            className="w-full h-[54px] bg-[#F7F5EF] border border-[#E5E1D8] rounded text-[#172033] px-4 text-sm focus:outline-none focus:border-[#BFA05A] focus:bg-white transition-colors"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.18em] text-[#667085] mb-2">
            Phone
          </label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full h-[54px] bg-[#F7F5EF] border border-[#E5E1D8] rounded text-[#172033] px-4 text-sm focus:outline-none focus:border-[#BFA05A] focus:bg-white transition-colors"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.18em] text-[#667085] mb-2">
            Address
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            rows={3}
            className="w-full bg-[#F7F5EF] border border-[#E5E1D8] rounded text-[#172033] px-4 py-3 text-sm focus:outline-none focus:border-[#BFA05A] focus:bg-white transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 h-[44px] w-full sm:w-fit sm:px-8 bg-[#BFA05A] hover:bg-[#AC8D48] text-[#172033] text-[13px] font-semibold uppercase tracking-[0.15em] rounded transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;