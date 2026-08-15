import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { VendorContext } from "../Context/VendorContext";

const statusStyles = {
  Available: "border-[#7FBFA0]/40 text-[#7FBFA0] bg-[#7FBFA0]/10",
  Rented: "border-white/15 text-[#858B91] bg-white/5",
  Maintenance: "border-[#D6B36A]/40 text-[#D6B36A] bg-[#D6B36A]/10",
  Inactive: "border-[#D97878]/40 text-[#D97878] bg-[#D97878]/10",
};

const VehicleList = ({ refreshKey }) => {
  const { backendUrl, vToken } = useContext(VendorContext);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(backendUrl + "/api/vendor/products", {
        headers: { vtoken: vToken },
      });
      if (data.success) {
        setVehicles(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load your vehicles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  if (loading) {
    return (
      <p className="text-sm text-[#858B91] uppercase tracking-[0.15em]">
        Loading your vehicles...
      </p>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="border border-dashed border-white/15 py-16 px-6 text-center">
        <p className="text-[#858B91] text-sm">
          You haven't listed any vehicles yet. Add your first one to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
      {vehicles.map((vehicle) => (
        <div
          key={vehicle._id}
          className="border border-white/10 bg-[#101417] overflow-hidden"
        >
          <div className="relative h-40 bg-[#181D21]">
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="w-full h-full object-cover"
            />
            <span
              className={`absolute top-3 left-3 text-[9px] font-semibold uppercase tracking-[0.15em] px-2 py-1 border ${
                vehicle.isApproved
                  ? "border-[#7FBFA0]/40 text-[#7FBFA0] bg-[#0B0D0F]/80"
                  : "border-[#D6B36A]/40 text-[#D6B36A] bg-[#0B0D0F]/80"
              }`}
            >
              {vehicle.isApproved ? "Live" : "Pending Approval"}
            </span>
          </div>

          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-serif text-base text-[#F5F3EE] truncate">
                  {vehicle.name}
                </h3>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#858B91] mt-1">
                  {vehicle.category}
                </p>
              </div>
              <span
                className={`text-[9px] font-semibold uppercase tracking-[0.15em] px-2 py-1 border whitespace-nowrap shrink-0 ${
                  statusStyles[vehicle.status] || statusStyles.Available
                }`}
              >
                {vehicle.status}
              </span>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10 text-sm">
              <span className="font-semibold text-[#D6B36A]">
                Rs. {vehicle.pricePerDay}
                <span className="text-[#70767C] font-normal"> / day</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.12em] text-[#858B91]">
                {vehicle.quantityAvailable}/{vehicle.quantityTotal} avail.
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VehicleList;