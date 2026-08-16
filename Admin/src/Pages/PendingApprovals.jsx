import React, { useContext, useEffect } from "react";
import { AdminContext } from "../Context/AdminContext";

const PendingApprovals = () => {
  const {
    pendingProducts,
    getPendingProducts,
    approveProduct,
    removeProduct,
  } = useContext(AdminContext);

  useEffect(() => {
    getPendingProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-5 md:p-8">
      {/* Page Header */}
      <p className="text-[11px] uppercase tracking-[0.25em] text-[#D6B36A]/80 mb-1">
        Review
      </p>

      <h1 className="font-serif text-2xl md:text-3xl text-white mb-2">
        Pending Approvals
      </h1>

      <p className="text-sm text-white/40 mb-8 md:mb-10">
        Vehicles submitted by vendors that aren't visible to customers yet.
      </p>

      {/* Pending Vehicles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {pendingProducts.map((product) => (
          <div
            key={product._id}
            className="bg-[#181D21] border border-white/10 overflow-hidden"
          >
            {/* Vehicle Image */}
            <div className="h-40 bg-[#0B0D0F]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Vehicle Information */}
            <div className="p-4">
              <h3 className="font-serif text-white text-base">
                {product.name}
              </h3>

              <p className="text-xs text-white/40 mt-0.5">
                {product.category} ·{" "}
                {product.owner?.shopName || "No owner"}
              </p>

              <p className="text-xs text-white/50 mt-2 line-clamp-2">
                {product.description || "No description available."}
              </p>

              {/* Price + Document */}
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm font-medium text-white">
                  Rs. {product.pricePerDay}
                  <span className="text-white/40 font-normal">
                    {" "}
                    / day
                  </span>
                </span>

                {product.vehicleDocument && (
                  <a
                    href={product.vehicleDocument}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-[#D6B36A] hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Document
                  </a>
                )}
              </div>

              {/* Approve / Reject Buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => approveProduct(product._id)}
                  className="flex-1 text-xs font-medium uppercase tracking-wide px-3 py-2 bg-[#D6B36A] text-[#0B0D0F] hover:bg-[#E8C784] transition-colors"
                >
                  Approve
                </button>

                <button
                  type="button"
                  onClick={() => removeProduct(product._id)}
                  className="flex-1 text-xs font-medium uppercase tracking-wide px-3 py-2 border border-red-400/40 text-red-300 hover:bg-red-400/10 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {pendingProducts.length === 0 && (
        <p className="text-sm text-white/40 text-center py-16">
          Nothing waiting for approval right now.
        </p>
      )}
    </div>
  );
};

export default PendingApprovals;