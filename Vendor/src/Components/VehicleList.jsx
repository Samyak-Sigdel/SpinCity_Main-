import React, { useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { VendorContext } from "../Context/VendorContext";
import EditVehicleModal from "./EditVehicleModal";

const statusTextStyles = {
  Available: "text-[#7FBFA0]",
  Rented: "text-[#858B91]",
  Maintenance: "text-[#D6B36A]",
  Inactive: "text-[#D97878]",
};

const VehicleList = ({ refreshKey, searchTerm = "", statusFilter = "All", onChanged }) => {
  const { backendUrl, vToken } = useContext(VendorContext);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

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

  const handleToggleVisibility = async (vehicle) => {
    setTogglingId(vehicle._id);
    // optimistic update so the switch feels instant
    setVehicles((prev) =>
      prev.map((v) => (v._id === vehicle._id ? { ...v, isVisible: !v.isVisible } : v))
    );
    try {
      const payload = new FormData();
      payload.append("productId", vehicle._id);
      payload.append("isVisible", !vehicle.isVisible);

      const { data } = await axios.post(backendUrl + "/api/vendor/update-product", payload, {
        headers: { vtoken: vToken },
      });

      if (!data.success) {
        toast.error(data.message);
        // revert on failure
        setVehicles((prev) =>
          prev.map((v) => (v._id === vehicle._id ? { ...v, isVisible: vehicle.isVisible } : v))
        );
      } else {
        toast.success(!vehicle.isVisible ? "Hidden from customer page" : "Now visible to customers");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update visibility.");
      setVehicles((prev) =>
        prev.map((v) => (v._id === vehicle._id ? { ...v, isVisible: vehicle.isVisible } : v))
      );
    } finally {
      setTogglingId(null);
    }
  };

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.trim().toLowerCase());
      const matchesStatus = statusFilter === "All" || vehicle.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [vehicles, searchTerm, statusFilter]);

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

  if (filteredVehicles.length === 0) {
    return (
      <div className="border border-dashed border-white/15 py-16 px-6 text-center">
        <p className="text-[#858B91] text-sm">No vehicles match your search or filter.</p>
      </div>
    );
  }

  return (
    <>
      <div className="border border-white/10 bg-[#101417] divide-y divide-white/10">
        {filteredVehicles.map((vehicle) => (
          <div
            key={vehicle._id}
            className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-5 md:p-6"
          >
            {/* Info */}
            <div className="flex-1 min-w-0 order-2 sm:order-1">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span
                  className={`text-[9px] font-semibold uppercase tracking-[0.15em] px-2 py-1 border ${
                    vehicle.isApproved
                      ? "border-[#7FBFA0]/40 text-[#7FBFA0] bg-[#7FBFA0]/10"
                      : "border-[#D6B36A]/40 text-[#D6B36A] bg-[#D6B36A]/10"
                  }`}
                >
                  {vehicle.isApproved ? "Live" : "Pending Approval"}
                </span>
                {vehicle.isApproved && !vehicle.isVisible && (
                  <span className="text-[9px] font-semibold uppercase tracking-[0.15em] px-2 py-1 border border-white/15 text-[#858B91] bg-white/5">
                    Hidden from customers
                  </span>
                )}
              </div>

              <h3 className="font-serif text-lg text-[#F5F3EE] truncate">{vehicle.name}</h3>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#858B91] mt-1">
                {vehicle.category}
              </p>

              <p className="text-xs text-[#70767C] mt-3">
                {vehicle.quantityAvailable}/{vehicle.quantityTotal} available
                <span className="mx-2 text-white/15">·</span>
                <span className={statusTextStyles[vehicle.status] || statusTextStyles.Available}>
                  {vehicle.status}
                </span>
              </p>
            </div>

            {/* Thumbnail */}
            <div className="order-1 sm:order-2 w-full h-40 sm:w-28 sm:h-32 bg-[#181D21] shrink-0 overflow-hidden">
              <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
            </div>

            {/* Divider — desktop only */}
            <div className="hidden sm:block w-px self-stretch bg-white/10 order-3" />

            {/* Price + actions */}
            <div className="order-4 sm:w-40 shrink-0 flex sm:flex-col sm:items-end items-center justify-between gap-4">
              <div className="sm:text-right">
                <span className="font-serif text-xl text-[#F5F3EE]">Rs. {vehicle.pricePerDay}</span>
                <span className="text-[#70767C] text-sm">/day</span>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end gap-3">
                <button
                  onClick={() => setEditingVehicle(vehicle)}
                  className="h-[38px] px-4 border border-[#D6B36A]/50 text-[#D6B36A] text-[10px] font-semibold uppercase tracking-[0.15em] hover:bg-[#D6B36A]/10 transition-colors"
                >
                  Edit
                </button>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className="text-[9px] uppercase tracking-[0.15em] text-[#70767C] sm:order-1">
                    {vehicle.isVisible ? "Visible" : "Hidden"}
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={vehicle.isVisible}
                    disabled={togglingId === vehicle._id}
                    onClick={() => handleToggleVisibility(vehicle)}
                    className={`relative w-10 h-[22px] shrink-0 transition-colors disabled:opacity-50 sm:order-2 ${
                      vehicle.isVisible ? "bg-[#D6B36A]" : "bg-white/15"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-[18px] h-[18px] bg-[#0B0D0F] transition-transform ${
                        vehicle.isVisible ? "translate-x-[18px]" : "translate-x-0"
                      }`}
                    />
                  </button>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingVehicle && (
        <EditVehicleModal
          vehicle={editingVehicle}
          onClose={() => setEditingVehicle(null)}
          onSaved={() => {
            fetchVehicles();
            onChanged && onChanged();
          }}
        />
      )}
    </>
  );
};

export default VehicleList;