import React, { useContext, useEffect } from "react";
import { AdminContext } from "../Context/AdminContext";

const Vehicles = () => {
  const { products, getAllProducts, removeProduct } = useContext(AdminContext);

  useEffect(() => {
    getAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-8">
      <h1 className="font-[Oswald] uppercase tracking-wide text-2xl text-[#14171F] mb-8">
        All Vehicles
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white border border-[#E7E4DB] rounded-sm overflow-hidden"
          >
            <div className="relative h-40 bg-[#F0EEE7]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <span
                className={`absolute top-3 left-3 text-[11px] font-semibold uppercase tracking-wide px-2 py-1 rounded-sm ${
                  product.isApproved
                    ? "bg-[#E9F3F0] text-[#2F6F5E]"
                    : "bg-[#FDF1E4] text-[#B5720D]"
                }`}
              >
                {product.isApproved ? "Live" : "Pending"}
              </span>
            </div>

            <div className="p-4">
              <h3 className="font-[Oswald] uppercase tracking-wide text-sm text-[#14171F]">
                {product.name}
              </h3>
              <p className="text-xs text-[#5B6472] mt-0.5">
                {product.category} · {product.owner?.shopName}
              </p>

              <div className="flex items-center justify-between mt-4">
                <span className="text-sm font-semibold text-[#14171F]">
                  Rs. {product.pricePerDay}
                  <span className="text-[#5B6472] font-normal"> / day</span>
                </span>
                <button
                  onClick={() => removeProduct(product._id)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-sm border border-[#B03636] text-[#B03636] hover:bg-[#F5E7E7]"
                >
                  Remove
                </button>
              </div>

              {product.vehicleDocument && (
                <a
                  href={product.vehicleDocument}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2 text-xs font-semibold text-[#2F5E8F] underline"
                >
                  View Document
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-sm text-[#5B6472] text-center py-16">No vehicles yet.</p>
      )}
    </div>
  );
};

export default Vehicles;