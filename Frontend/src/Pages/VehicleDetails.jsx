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

  const isAvailable = vehicle && vehicle.quantityAvailable > 0;

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
      <div className="bg-[#F7F5EF] min-h-screen">
        <p className="text-sm text-[#667085] p-8 text-center">Loading vehicle...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="bg-[#F7F5EF] min-h-screen">
        <p className="text-sm text-[#667085] p-8 text-center">Vehicle not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F5EF] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image + details */}
        <div>
          <div className="h-80 bg-white border border-[#E5E1D8] rounded-[8px] shadow-[0_2px_8px_rgba(23,32,51,0.06)] overflow-hidden flex items-center justify-center p-6">
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div className="flex items-center gap-3 mt-7 mb-1">
            <span className="w-8 h-px bg-[#C9A24D]" />
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#C9A24D]">
              {vehicle.category}
            </p>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#172033] mt-2">
            {vehicle.name}
          </h1>

          <span
            className={`inline-flex items-center mt-3 px-2.5 py-1 rounded-[4px] text-[11px] font-medium uppercase ${
              isAvailable ? "bg-[#E5F3ED] text-[#3E8B73]" : "bg-[#FBEAEA] text-[#C75C5C]"
            }`}
          >
            {isAvailable ? `${vehicle.quantityAvailable} Available` : "Unavailable"}
          </span>

          <p className="text-sm text-[#667085] mt-4 leading-relaxed">
            {vehicle.description}
          </p>

          <div className="mt-6 text-sm text-[#667085]">
            Listed by{" "}
            <span className="text-[#172033] font-medium">
              {vehicle.owner?.shopName}
            </span>
          </div>

          {vehicle.location?.address && (
            <div className="mt-2 text-sm text-[#667085] flex items-start gap-1.5">
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none" className="mt-0.5 shrink-0">
                <path
                  d="M6 0.75C3.79 0.75 2 2.54 2 4.75c0 3 4 6.5 4 6.5s4-3.5 4-6.5c0-2.21-1.79-4-4-4z"
                  stroke="#C9A24D"
                  strokeWidth="1"
                />
                <circle cx="6" cy="4.75" r="1.3" stroke="#C9A24D" strokeWidth="1" />
              </svg>
              <span>Pickup at {vehicle.location.address}</span>
            </div>
          )}
        </div>

        {/* Booking form */}
        <div>
          <div className="bg-white border border-[#E5E1D8] rounded-[8px] shadow-[0_8px_24px_rgba(23,32,51,0.10)] p-6 sticky top-24">
            <p className="text-2xl font-semibold text-[#172033]">
              Rs. {vehicle.pricePerDay}
              <span className="text-sm text-[#667085] font-normal"> / day</span>
            </p>
            <p className="text-xs text-[#667085] mt-1">
              {vehicle.quantityAvailable} of {vehicle.quantityTotal} available
            </p>

            <form onSubmit={handleBooking} className="flex flex-col gap-4 mt-6">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#667085] mb-2">
                    Start date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    className="w-full h-[48px] bg-[#F7F5EF] border border-[#E5E1D8] rounded-[4px] text-[#172033] px-3 text-sm focus:outline-none focus:border-[#C9A24D]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#667085] mb-2">
                    End date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split("T")[0]}
                    required
                    className="w-full h-[48px] bg-[#F7F5EF] border border-[#E5E1D8] rounded-[4px] text-[#172033] px-3 text-sm focus:outline-none focus:border-[#C9A24D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#667085] mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max={vehicle.quantityAvailable}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  required
                  className="w-full h-[48px] bg-[#F7F5EF] border border-[#E5E1D8] rounded-[4px] text-[#172033] px-3 text-sm focus:outline-none focus:border-[#C9A24D]"
                />
              </div>

              {totalDays > 0 && (
                <div className="border-t border-[#E5E1D8] pt-4 flex items-center justify-between text-sm">
                  <span className="text-[#667085]">
                    {totalDays} day{totalDays > 1 ? "s" : ""} × {quantity}
                  </span>
                  <span className="font-semibold text-[#172033]">
                    Rs. {estimatedTotal}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={vehicle.quantityAvailable === 0}
                className="mt-2 bg-[#C9A24D] text-[#172033] h-[48px] rounded-[4px] text-[12px] font-semibold uppercase tracking-[0.1em] hover:brightness-95 transition-all disabled:opacity-50 disabled:hover:brightness-100"
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