import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { VendorContext } from "../Context/VendorContext";
import VendorAuth from "./VendorAuth";

const VendorLayout = () => {
  const { vToken, vendorProfile } = useContext(VendorContext);

  if (!vToken) {
    return <VendorAuth />;
  }

  return (
    <div className="min-h-screen bg-[#F8F7F2]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-10">
        {vendorProfile && !vendorProfile.isVerified && (
          <div className="mb-8 inline-flex items-start gap-2 border border-[#145A4A]/30 bg-[#EDF5F1] rounded px-4 py-3">
            <p className="text-xs text-[#0D3F35] leading-relaxed">
              Your vendor account is awaiting admin approval. You can still
              add vehicles — they'll go live once your account is verified.
            </p>
          </div>
        )}

        <div className="relative">
          <span className="pointer-events-none absolute -top-3 -left-3 w-5 h-5 border-t border-l border-[#145A4A]/40" />
          <span className="pointer-events-none absolute -bottom-3 -right-3 w-5 h-5 border-b border-r border-[#145A4A]/40" />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default VendorLayout;