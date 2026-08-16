import React, { useContext, useEffect } from "react";
import { AdminContext } from "../Context/AdminContext";

const Vendors = () => {
  const { vendors, getAllVendors, approveVendor, toggleVendorBlock } =
    useContext(AdminContext);

  useEffect(() => {
    getAllVendors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ActionButtons = ({ vendor }) => (
    <div className="flex gap-2">
      {!vendor.isVerified && (
        <button
          onClick={() => approveVendor(vendor._id)}
          className="text-xs font-medium uppercase tracking-wide px-3 py-1.5 bg-[#D6B36A] text-[#0B0D0F] hover:bg-[#E8C784] transition-colors"
        >
          Approve
        </button>
      )}
      <button
        onClick={() => toggleVendorBlock(vendor._id)}
        className={`text-xs font-medium uppercase tracking-wide px-3 py-1.5 border transition-colors ${
          vendor.isBlocked
            ? "border-emerald-400/40 text-emerald-300 hover:bg-emerald-400/10"
            : "border-red-400/40 text-red-300 hover:bg-red-400/10"
        }`}
      >
        {vendor.isBlocked ? "Unblock" : "Block"}
      </button>
    </div>
  );

  const StatusBadges = ({ vendor }) => (
    <div className="flex flex-col gap-1 items-start">
      <span
        className={`text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 w-fit ${
          vendor.isVerified
            ? "bg-emerald-400/10 text-emerald-300"
            : "bg-[#D6B36A]/10 text-[#D6B36A]"
        }`}
      >
        {vendor.isVerified ? "Verified" : "Unverified"}
      </span>
      {vendor.isBlocked && (
        <span className="text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 w-fit bg-red-400/10 text-red-300">
          Blocked
        </span>
      )}
    </div>
  );

  return (
    <div className="p-5 md:p-8">
      <p className="text-[11px] uppercase tracking-[0.25em] text-[#D6B36A]/80 mb-1">
        Manage
      </p>
      <h1 className="font-serif text-2xl md:text-3xl text-white mb-8 md:mb-10">
        Vendors
      </h1>

      {/* Desktop table */}
      <div className="hidden md:block bg-[#181D21] border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-white/40 uppercase text-[11px] tracking-wide bg-white/[0.02]">
              <th className="px-5 py-3">Shop Name</th>
              <th className="px-5 py-3">Owner</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor._id} className="border-t border-white/10">
                <td className="px-5 py-3 text-white font-medium">{vendor.shopName}</td>
                <td className="px-5 py-3 text-white/60">{vendor.name}</td>
                <td className="px-5 py-3 text-white/60">{vendor.email}</td>
                <td className="px-5 py-3 text-white/60">{vendor.phone}</td>
                <td className="px-5 py-3">
                  <StatusBadges vendor={vendor} />
                </td>
                <td className="px-5 py-3">
                  <ActionButtons vendor={vendor} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {vendors.length === 0 && (
          <p className="text-sm text-white/40 p-8 text-center">No vendors yet.</p>
        )}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-3">
        {vendors.map((vendor) => (
          <div key={vendor._id} className="bg-[#181D21] border border-white/10 p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-white font-medium text-sm">{vendor.shopName}</p>
                <p className="text-white/50 text-xs mt-0.5">{vendor.name}</p>
              </div>
              <StatusBadges vendor={vendor} />
            </div>
            <p className="text-white/50 text-xs">{vendor.email}</p>
            <p className="text-white/50 text-xs mb-3">{vendor.phone}</p>
            <ActionButtons vendor={vendor} />
          </div>
        ))}

        {vendors.length === 0 && (
          <p className="text-sm text-white/40 text-center py-12">No vendors yet.</p>
        )}
      </div>
    </div>
  );
};

export default Vendors;