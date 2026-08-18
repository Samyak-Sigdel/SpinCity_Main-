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
    <div className="min-h-screen bg-[#F7F5EF]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-10">
        {vendorProfile && !vendorProfile.isVerified && (
          <div className="mb-8 inline-flex items-start gap-2 border border-[#C9A24D]/30 bg-[#F5E9C9] rounded px-4 py-3">
            <p className="text-xs text-[#9A7628] leading-relaxed">
              Your vendor account is awaiting admin approval. You can still
              add vehicles — they'll go live once your account is verified.
            </p>
          </div>
        )}

        <div className="relative">
          <span className="pointer-events-none absolute -top-3 -left-3 w-5 h-5 border-t border-l border-[#C9A24D]/40" />
          <span className="pointer-events-none absolute -bottom-3 -right-3 w-5 h-5 border-b border-r border-[#C9A24D]/40" />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default VendorLayout;