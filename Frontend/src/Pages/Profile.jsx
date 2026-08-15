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
      <div className="max-w-md mx-auto my-24 px-6 text-center">
        <p className="text-sm text-[#5B6472] mb-4">
          Please log in to view your profile.
        </p>
        <Link
          to="/login"
          className="inline-block px-6 py-3 rounded-sm bg-[#14171F] text-[#F7F5F0] text-sm font-semibold"
        >
          Log In
        </Link>
      </div>
    );
  }

  if (!customerProfile) {
    return <p className="text-sm text-[#5B6472] p-8 text-center">Loading profile...</p>;
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-12">
      <h1 className="font-[Oswald] uppercase tracking-wide text-2xl text-[#14171F] mb-8">
        My Profile
      </h1>

      <div className="bg-white border border-[#E7E4DB] rounded-sm p-6 mb-6">
        <p className="text-xs uppercase tracking-wide text-[#5B6472]">Email</p>
        <p className="text-sm text-[#14171F] mt-1">{customerProfile.email}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-[#5B6472] mb-2">
            Full name
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-[#D8D5CC] rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#FFB020]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-[#5B6472] mb-2">
            Phone
          </label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full border border-[#D8D5CC] rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#FFB020]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-[#5B6472] mb-2">
            Address
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            rows={3}
            className="w-full border border-[#D8D5CC] rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#FFB020]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-[#14171F] text-[#F7F5F0] py-3 rounded-sm text-sm font-semibold tracking-wide hover:bg-[#252A36] transition-colors disabled:opacity-60 w-fit px-6"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default Profile;