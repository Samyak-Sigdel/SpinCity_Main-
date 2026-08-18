import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { CustomerContext } from "../Context/CustomerContext";

const Profile = () => {
  const { backendUrl, token, customerProfile, getCustomerProfile } =
    useContext(CustomerContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });

  useEffect(() => {
    if (customerProfile) {
      setFormData({
        name: customerProfile.name || "",
        phone: customerProfile.phone || "",
        address: customerProfile.address || "",
      });
    }
  }, [customerProfile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        { headers: { ctoken: token } }
      );
      if (data.success) {
        toast.success("Profile updated");
        getCustomerProfile();
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

  if (!token) {
    return (
      <div className="bg-[#F7F5EF] min-h-screen">
        <div className="max-w-md mx-auto py-24 px-6 text-center">
          <p className="text-sm text-[#667085] mb-4">
            Please log in to view your profile.
          </p>
          <Link
            to="/login"
            className="inline-block px-6 py-3 rounded-[4px] bg-[#C9A24D] text-[#172033] text-sm font-semibold"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  if (!customerProfile) {
    return (
      <div className="bg-[#F7F5EF] min-h-screen">
        <p className="text-sm text-[#667085] p-8 text-center">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F5EF] min-h-screen">
      <div className="max-w-lg mx-auto px-6 py-12">
        <h1 className="font-serif text-3xl font-semibold text-[#172033] mb-8">
          My Profile
        </h1>

        <div className="bg-white border border-[#E5E1D8] rounded-[8px] shadow-[0_2px_8px_rgba(23,32,51,0.06)] p-6 mb-6">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#667085]">Email</p>
          <p className="text-sm text-[#172033] mt-1">{customerProfile.email}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#E5E1D8] rounded-[8px] shadow-[0_2px_8px_rgba(23,32,51,0.06)] p-6 flex flex-col gap-4"
        >
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#667085] mb-2">
              Full name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-[#E5E1D8] rounded-[4px] px-4 py-3 text-sm text-[#172033] focus:outline-none focus:border-[#C9A24D]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#667085] mb-2">
              Phone
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full border border-[#E5E1D8] rounded-[4px] px-4 py-3 text-sm text-[#172033] focus:outline-none focus:border-[#C9A24D]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#667085] mb-2">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows={3}
              className="w-full border border-[#E5E1D8] rounded-[4px] px-4 py-3 text-sm text-[#172033] focus:outline-none focus:border-[#C9A24D]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-[#C9A24D] text-[#172033] py-3 rounded-[4px] text-sm font-semibold uppercase tracking-[0.06em] hover:brightness-95 transition-all disabled:opacity-60 w-fit px-6"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;