import React, { useContext, useEffect } from "react";
import { AdminContext } from "../Context/AdminContext";

const Vehicles = () => {
  const { products, getAllProducts, removeProduct } =
    useContext(AdminContext);

  useEffect(() => {
    getAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-5 md:p-8">
      {/* Page Header */}
      <p className="text-[11px] uppercase tracking-[0.25em] text-[#D6B36A]/80 mb-1">
        Manage
      </p>

      <h1 className="font-serif text-2xl md:text-3xl text-white mb-8 md:mb-10">
        All Vehicles
      </h1>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {products.map((product) => {
          const badgeClass = product.isApproved
            ? "absolute top-3 left-3 text-[10px] font-medium uppercase tracking-wide px-2 py-1 bg-emerald-400/10 text-emerald-300 backdrop-blur-sm"
            : "absolute top-3 left-3 text-[10px] font-medium uppercase tracking-wide px-2 py-1 bg-[#D6B36A]/10 text-[#D6B36A] backdrop-blur-sm";

          return (
            <div
              key={product._id}
              className="bg-[#181D21] border border-white/10 overflow-hidden"
            >
              {/* Vehicle Image */}
              <div className="relative h-40 bg-[#0B0D0F]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {/* Approval Status */}
                <span className={badgeClass}>
                  {product.isApproved ? "Live" : "Pending"}
                </span>
              </div>

              {/* Vehicle Information */}
              <div className="p-4">
                <h3 className="font-serif text-white text-base">
                  {product.name}
                </h3>

                <p className="text-xs text-white/40 mt-0.5">
                  {product.category} -{" "}
                  {product.owner?.shopName || "No owner"}
                </p>

                {/* Price + Remove Button */}
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm font-medium text-white">
                    Rs. {product.pricePerDay}
                    <span className="text-white/40 font-normal">
                      {" "}
                      / day
                    </span>
                  </span>

                  <button
                    type="button"
                    onClick={() => removeProduct(product._id)}
                    className="text-xs font-medium uppercase tracking-wide px-3 py-1.5 border border-red-400/40 text-red-300 hover:bg-red-400/10 transition-colors"
                  >
                    Remove
                  </button>
                </div>

                {/* Vehicle Document */}
                {product.vehicleDocument && (
                  <a
                    href={product.vehicleDocument}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-3 text-xs font-medium text-[#D6B36A] hover:underline"
                  >
                    View Document
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <p className="text-sm text-white/40 text-center py-16">
          No vehicles yet.
        </p>
      )}
    </div>
  );
};

export default Vehicles;