import React, { useContext, useState } from "react";
import { VendorContext } from "../Context/VendorContext";
import VendorAuth from "../Components/VendorAuth";
import AddVehicleForm from "../Components/AddVehicleForm";
import VehicleList from "../Components/VehicleList";
import BookingsList from "../Components/BookingsList";
import ProfileForm from "../Components/ProfileForm";

const VendorDashboard = () => {
  const { vToken, vendorProfile } = useContext(VendorContext);
  const [activeTab, setActiveTab] = useState("vehicles");
  const [refreshKey, setRefreshKey] = useState(0);

  if (!vToken) {
    return <VendorAuth />;
  }

  const tabs = [
    { key: "vehicles", label: "My Vehicles" },
    { key: "add", label: "Add Vehicle" },
    { key: "bookings", label: "Bookings" },
    { key: "profile", label: "Profile" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-12">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-wide text-[#5B6472] mb-1">
          Vendor Dashboard
        </p>
        <h1 className="font-[Oswald] uppercase tracking-wide text-2xl text-[#14171F]">
          {vendorProfile ? vendorProfile.shopName : "Welcome"}
        </h1>
        {vendorProfile && !vendorProfile.isVerified && (
          <p className="text-xs text-[#B5720D] mt-2">
            Your vendor account is awaiting admin approval. You can still add
            vehicles — they'll go live once your account is verified.
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#E7E4DB] mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-3 text-sm font-semibold uppercase tracking-wide border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? "border-[#FFB020] text-[#14171F]"
                : "border-transparent text-[#5B6472] hover:text-[#14171F]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "vehicles" && <VehicleList refreshKey={refreshKey} />}
      {activeTab === "add" && (
        <AddVehicleForm
          onAdded={() => {
            setRefreshKey((k) => k + 1);
            setActiveTab("vehicles");
          }}
        />
      )}
      {activeTab === "bookings" && <BookingsList />}
      {activeTab === "profile" && <ProfileForm />}
    </div>
  );
};

export default VendorDashboard;