import React, { useContext, useEffect } from "react";
import { AdminContext } from "../Context/AdminContext";

const PendingApprovals = () => {
  const { pendingProducts, getPendingProducts, approveProduct, removeProduct } =
    useContext(AdminContext);

  useEffect(() => {
    getPendingProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-8">
      <h1 className="font-[Oswald] uppercase tracking-wide text-2xl text-[#14171F] mb-2">
        Pending Approvals
      </h1>
      <p className="text-sm text-[#5B6472] mb-8">
        Vehicles submitted by vendors that aren't visible to customers yet.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {pendingProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white border border-[#E7E4DB] rounded-sm overflow-hidden"
          >
            <div className="h-40 bg-[#F0EEE7]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4">
              <h3 className="font-[Oswald] uppercase tracking-wide text-sm text-[#14171F]">
                {product.name}
              </h3>
              <p className="text-xs text-[#5B6472] mt-0.5">
                {product.category} · {product.owner?.shopName}
              </p>
              <p className="text-xs text-[#5B6472] mt-1 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center justify-between mt-4">
                <span className="text-sm font-semibold text-[#14171F]">
                  Rs. {product.pricePerDay}
                  <span className="text-[#5B6472] font-normal"> / day</span>
                </span>
                {product.vehicleDocument && (
                  <a
                    href={product.vehicleDocument}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#2F5E8F] underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Document
                  </a>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => approveProduct(product._id)}
                  className="flex-1 text-xs font-semibold px-3 py-2 rounded-sm bg-[#14171F] text-[#F7F5F0] hover:bg-[#252A36]"
                >
                  Approve
                </button>
                <button
                  onClick={() => removeProduct(product._id)}
                  className="flex-1 text-xs font-semibold px-3 py-2 rounded-sm border border-[#B03636] text-[#B03636] hover:bg-[#F5E7E7]"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pendingProducts.length === 0 && (
        <p className="text-sm text-[#5B6472] text-center py-16">
          Nothing waiting for approval right now.
        </p>
      )}
    </div>
  );
};

export default PendingApprovals;