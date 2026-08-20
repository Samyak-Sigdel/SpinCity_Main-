// VehicleList.jsx
import React, { useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { VendorContext } from "../Context/VendorContext";
import EditVehicleModal from "./EditVehicleModal";

const statusTextStyles = {
  Available: "text-[#145A4A]",
  Rented: "text-[#64748B]",
  Maintenance: "text-[#8A5B10]",
  Inactive: "text-[#C75C5C]",
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
      <p className="text-sm text-[#64748B] uppercase tracking-[0.15em]">
        Loading your vehicles...
      </p>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="border border-dashed border-[#E5E2D9] rounded-lg bg-white py-16 px-6 text-center">
        <p className="text-[#64748B] text-sm">
          You haven't listed any vehicles yet. Add your first one to get started.
        </p>
      </div>
    );
  }

  if (filteredVehicles.length === 0) {
    return (
      <div className="border border-dashed border-[#E5E2D9] rounded-lg bg-white py-16 px-6 text-center">
        <p className="text-[#64748B] text-sm">No vehicles match your search or filter.</p>
      </div>
    );
  }

  return (
    <>
      <div className="border border-[#E5E2D9] bg-white rounded-lg shadow-[0_2px_8px_rgba(20,32,51,0.06)] divide-y divide-[#E5E2D9]">
        {filteredVehicles.map((vehicle) => (
          <div
            key={vehicle._id}
            className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-5 md:p-6"
          >
            {/* Info */}
            <div className="flex-1 min-w-0 order-2 sm:order-1">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span
                  className={`text-[9px] font-semibold uppercase tracking-[0.15em] px-2 py-1 rounded border ${
                    vehicle.isApproved
                      ? "border-[#145A4A]/30 text-[#145A4A] bg-[#EDF5F1]"
                      : "border-[#D9A441]/40 text-[#8A5B10] bg-[#FBF1DE]"
                  }`}
                >
                  {vehicle.isApproved ? "Live" : "Pending Approval"}
                </span>
                {vehicle.isApproved && !vehicle.isVisible && (
                  <span className="text-[9px] font-semibold uppercase tracking-[0.15em] px-2 py-1 rounded border border-[#E5E2D9] text-[#64748B] bg-[#F8F7F2]">
                    Hidden from customers
                  </span>
                )}
              </div>

              <h3 className="font-serif text-lg text-[#142033] truncate">{vehicle.name}</h3>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#64748B] mt-1">
                {vehicle.category}
              </p>

              <p className="text-xs text-[#64748B] mt-3">
                {vehicle.quantityAvailable}/{vehicle.quantityTotal} available
                <span className="mx-2 text-[#E5E2D9]">·</span>
                <span className={statusTextStyles[vehicle.status] || statusTextStyles.Available}>
                  {vehicle.status}
                </span>
              </p>
            </div>

            {/* Thumbnail */}
            <div className="order-1 sm:order-2 w-full h-40 sm:w-28 sm:h-32 bg-[#F8F7F2] rounded-lg shrink-0 overflow-hidden">
              <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
            </div>

            {/* Divider — desktop only */}
            <div className="hidden sm:block w-px self-stretch bg-[#E5E2D9] order-3" />

            {/* Price + actions */}
            <div className="order-4 sm:w-44 shrink-0 flex sm:flex-col sm:items-end items-center justify-between gap-4">
              <div className="sm:text-right">
                <span className="font-serif text-xl text-[#142033]">Rs. {vehicle.pricePerDay}</span>
                <span className="text-[#64748B] text-sm">/day</span>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end gap-3">
                <button
                  onClick={() => setEditingVehicle(vehicle)}
                  className="h-[38px] w-[112px] flex items-center justify-center border border-[#145A4A] rounded text-[#145A4A] text-[11px] font-semibold uppercase tracking-[0.15em] hover:bg-[#EDF5F1] transition-colors"
                >
                  Edit
                </button>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className="text-[9px] uppercase tracking-[0.15em] text-[#64748B] sm:order-1">
                    {vehicle.isVisible ? "Visible" : "Hidden"}
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={vehicle.isVisible}
                    disabled={togglingId === vehicle._id}
                    onClick={() => handleToggleVisibility(vehicle)}
                    className={`relative w-10 h-[22px] shrink-0 rounded-full transition-colors disabled:opacity-50 sm:order-2 ${
                      vehicle.isVisible ? "bg-[#145A4A]" : "bg-[#E5E2D9]"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-[18px] h-[18px] bg-white rounded-full shadow transition-transform ${
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