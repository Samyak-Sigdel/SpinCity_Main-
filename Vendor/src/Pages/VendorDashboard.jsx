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
    <div className="min-h-screen bg-[#0B0D0F]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-14">
        {/* Header */}
        <div className="mb-12 relative">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#D6B36A]/80 mb-2">
            Vendor Dashboard
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-white">
            {vendorProfile ? (
              <>
                Welcome, <em className="italic text-[#D6B36A]">{vendorProfile.shopName}</em>
              </>
            ) : (
              "Welcome"
            )}
          </h1>

          {vendorProfile && !vendorProfile.isVerified && (
            <div className="mt-4 inline-flex items-start gap-2 border border-[#D6B36A]/30 bg-[#D6B36A]/5 px-4 py-3">
              <p className="text-xs text-[#D6B36A]/90 leading-relaxed">
                Your vendor account is awaiting admin approval. You can still
                add vehicles — they'll go live once your account is
                verified.
              </p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-white/10 mb-10 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-5 py-3 text-xs font-medium uppercase tracking-[0.15em] whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? "text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-[#D6B36A]" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="relative">
          {/* gold corner brackets */}
          <span className="pointer-events-none absolute -top-3 -left-3 w-5 h-5 border-t border-l border-[#D6B36A]/40" />
          <span className="pointer-events-none absolute -bottom-3 -right-3 w-5 h-5 border-b border-r border-[#D6B36A]/40" />

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
      </div>
    </div>
  );
};

export default VendorDashboard;