import React, { useContext, useEffect } from "react";
import { AdminContext } from "../Context/AdminContext";

const Vendors = () => {
  const { vendors, getAllVendors, approveVendor, toggleVendorBlock } =
    useContext(AdminContext);

  useEffect(() => {
    getAllVendors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-8">
      <h1 className="font-[Oswald] uppercase tracking-wide text-2xl text-[#14171F] mb-8">
        Vendors
      </h1>

      <div className="bg-white border border-[#E7E4DB] rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#5B6472] uppercase text-xs tracking-wide bg-[#FBFAF7]">
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
              <tr key={vendor._id} className="border-t border-[#F0EEE7]">
                <td className="px-5 py-3 text-[#14171F] font-medium">{vendor.shopName}</td>
                <td className="px-5 py-3 text-[#5B6472]">{vendor.name}</td>
                <td className="px-5 py-3 text-[#5B6472]">{vendor.email}</td>
                <td className="px-5 py-3 text-[#5B6472]">{vendor.phone}</td>
                <td className="px-5 py-3">
                  <div className="flex flex-col gap-1">
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-sm w-fit ${
                        vendor.isVerified
                          ? "bg-[#E9F3F0] text-[#2F6F5E]"
                          : "bg-[#FDF1E4] text-[#B5720D]"
                      }`}
                    >
                      {vendor.isVerified ? "Verified" : "Unverified"}
                    </span>
                    {vendor.isBlocked && (
                      <span className="text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-sm w-fit bg-[#F5E7E7] text-[#B03636]">
                        Blocked
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    {!vendor.isVerified && (
                      <button
                        onClick={() => approveVendor(vendor._id)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-sm bg-[#14171F] text-[#F7F5F0] hover:bg-[#252A36]"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => toggleVendorBlock(vendor._id)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-sm border ${
                        vendor.isBlocked
                          ? "border-[#2F6F5E] text-[#2F6F5E] hover:bg-[#E9F3F0]"
                          : "border-[#B03636] text-[#B03636] hover:bg-[#F5E7E7]"
                      }`}
                    >
                      {vendor.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {vendors.length === 0 && (
          <p className="text-sm text-[#5B6472] p-8 text-center">No vendors yet.</p>
        )}
      </div>
    </div>
  );
};

export default Vendors;