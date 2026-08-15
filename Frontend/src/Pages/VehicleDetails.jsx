import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { CustomerContext } from "../Context/CustomerContext";

const VehicleDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { backendUrl, token } = useContext(CustomerContext);

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState(1);

  const fetchVehicle = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(backendUrl + `/api/user/products/${productId}`);
      if (data.success) {
        setVehicle(data.product);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load vehicle.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const totalDays =
    startDate && endDate
      ? Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
      : 0;

  const estimatedTotal =
    vehicle && totalDays > 0 ? vehicle.pricePerDay * totalDays * quantity : 0;

  const handleBooking = (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please log in to book a vehicle");
      navigate("/login");
      return;
    }

    if (totalDays <= 0) {
      toast.error("End date must be after start date");
      return;
    }

    navigate(`/checkout/${productId}`, {
      state: { startDate, endDate, quantity },
    });
  };

  if (loading) {
    return (
      <div className="bg-[#0B0D0F] min-h-screen">
        <p className="text-sm text-[#858B91] p-8 text-center">Loading vehicle...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="bg-[#0B0D0F] min-h-screen">
        <p className="text-sm text-[#858B91] p-8 text-center">Vehicle not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0D0F] min-h-screen">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image + details */}
        <div>
          <div className="h-80 bg-[#181D21] border border-white/10 overflow-hidden rounded-sm flex items-center justify-center p-6">
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div className="flex items-center gap-3 mt-7 mb-1">
            <span className="w-8 h-px bg-[#D6B36A]" />
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#D6B36A]">
              {vehicle.category}
            </p>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-[#F5F3EE] mt-2">
            {vehicle.name}
          </h1>
          <p className="text-sm text-[#B5B8BB] mt-4 leading-relaxed">
            {vehicle.description}
          </p>

          <div className="mt-6 text-sm text-[#858B91]">
            Listed by{" "}
            <span className="text-[#F5F3EE] font-medium">
              {vehicle.owner?.shopName}
            </span>
          </div>

          {vehicle.location?.address && (
            <div className="mt-2 text-sm text-[#858B91] flex items-start gap-1.5">
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none" className="mt-0.5 shrink-0">
                <path
                  d="M6 0.75C3.79 0.75 2 2.54 2 4.75c0 3 4 6.5 4 6.5s4-3.5 4-6.5c0-2.21-1.79-4-4-4z"
                  stroke="#858B91"
                  strokeWidth="1"
                />
                <circle cx="6" cy="4.75" r="1.3" stroke="#858B91" strokeWidth="1" />
              </svg>
              <span>Pickup at {vehicle.location.address}</span>
            </div>
          )}
        </div>

        {/* Booking form */}
        <div>
          <div className="relative border border-white/10 bg-[#101417]/95 backdrop-blur-xl p-6 sticky top-24">
            <span className="absolute -top-px -left-px w-8 h-8 border-t border-l border-[#D6B36A]/70" />
            <span className="absolute -bottom-px -right-px w-8 h-8 border-b border-r border-[#D6B36A]/70" />

            <p className="text-2xl font-semibold text-[#F5F3EE]">
              Rs. {vehicle.pricePerDay}
              <span className="text-sm text-[#858B91] font-normal"> / day</span>
            </p>
            <p className="text-xs text-[#858B91] mt-1">
              {vehicle.quantityAvailable} of {vehicle.quantityTotal} available
            </p>

            <form onSubmit={handleBooking} className="flex flex-col gap-4 mt-6">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#858B91] mb-2">
                    Start date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    className="w-full h-[50px] bg-[#181D21] border border-white/10 text-[#F5F3EE] px-3 text-sm focus:outline-none focus:border-[#D6B36A] [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#858B91] mb-2">
                    End date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split("T")[0]}
                    required
                    className="w-full h-[50px] bg-[#181D21] border border-white/10 text-[#F5F3EE] px-3 text-sm focus:outline-none focus:border-[#D6B36A] [color-scheme:dark]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#858B91] mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max={vehicle.quantityAvailable}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  required
                  className="w-full h-[50px] bg-[#181D21] border border-white/10 text-[#F5F3EE] px-3 text-sm focus:outline-none focus:border-[#D6B36A]"
                />
              </div>

              {totalDays > 0 && (
                <div className="border-t border-white/10 pt-4 flex items-center justify-between text-sm">
                  <span className="text-[#858B91]">
                    {totalDays} day{totalDays > 1 ? "s" : ""} × {quantity}
                  </span>
                  <span className="font-semibold text-[#D6B36A]">
                    Rs. {estimatedTotal}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={vehicle.quantityAvailable === 0}
                className="mt-2 bg-[#D6B36A] text-[#0B0D0F] py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-[#E5C783] transition-colors disabled:opacity-50 disabled:hover:bg-[#D6B36A]"
              >
                {vehicle.quantityAvailable === 0
                  ? "Currently Unavailable"
                  : token
                  ? "Continue to Checkout"
                  : "Log In to Book"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;