import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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

  const rentalSubtotal = vehicle && totalDays > 0 ? vehicle.pricePerDay * totalDays * quantity : 0;

  const isAvailable = vehicle && vehicle.quantityAvailable > 0;
  const showQuantityField = vehicle && vehicle.quantityAvailable > 1;

  const decrementQty = () => setQuantity((q) => Math.max(1, q - 1));
  const incrementQty = () =>
    setQuantity((q) => Math.min(vehicle?.quantityAvailable ?? 1, q + 1));

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
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-[#667085] mb-6 flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-[#C9A24D] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/vehicles" className="hover:text-[#C9A24D] transition-colors">
            Fleet
          </Link>
          <span>/</span>
          <span className="text-[#344054]">{vehicle.category}</span>
          <span>/</span>
          <span className="text-[#172033] font-medium">{vehicle.name}</span>
        </nav>

        {/* Hero: image + buy box side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image — thumbnail rail + main image, sized down from the previous full-width block */}
          <div className="flex gap-3 h-[420px]">
            <div className="flex flex-col gap-3 w-[90px] shrink-0">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex-1 bg-white border border-[#E5E1D8] rounded-[8px] overflow-hidden flex items-center justify-center p-1.5 cursor-pointer hover:border-[#C9A24D] transition-colors"
                >
                  <img
                    src={vehicle.image}
                    alt={`${vehicle.name} thumbnail ${i + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
            <div className="flex-1 bg-white border border-[#E5E1D8] rounded-[8px] shadow-[0_2px_8px_rgba(23,32,51,0.06)] overflow-hidden flex items-center justify-center p-2">
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Title + price + booking, together in the right column */}
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="w-8 h-px bg-[#C9A24D]" />
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#C9A24D]">
                {vehicle.category}
              </p>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#172033]">
              {vehicle.name}
            </h1>

            <div className="flex items-center gap-3 mt-3">
              <p className="text-[28px] font-bold text-[#172033] leading-tight">
                Rs. {vehicle.pricePerDay}
                <span className="text-sm font-normal text-[#667085]"> / day</span>
              </p>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-[4px] text-[11px] font-medium uppercase ${
                  isAvailable ? "bg-[#E5F3ED] text-[#3E8B73]" : "bg-[#FBEAEA] text-[#C75C5C]"
                }`}
              >
                {isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>
            {isAvailable && (
              <p className="text-[13px] text-[#667085] mt-1">
                {vehicle.quantityAvailable} of {vehicle.quantityTotal} in stock
              </p>
            )}

            <div className="border-t border-[#E5E1D8] mt-6 pt-6">
              <form onSubmit={handleBooking} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#667085] mb-2">
                      Pick-up
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
                      Return
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

                {/* Quantity stepper — only when more than one unit exists */}
                {showQuantityField && (
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#667085] mb-2">
                      Number of vehicles
                    </label>
                    <div className="flex items-center border border-[#E5E1D8] rounded-[4px] bg-[#F7F5EF] w-fit">
                      <button
                        type="button"
                        onClick={decrementQty}
                        className="w-11 h-[48px] flex items-center justify-center text-[#172033] hover:bg-[#E5E1D8] transition-colors rounded-l-[4px]"
                      >
                        −
                      </button>
                      <span className="w-12 h-[48px] flex items-center justify-center text-sm text-[#172033] border-x border-[#E5E1D8]">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={incrementQty}
                        className="w-11 h-[48px] flex items-center justify-center text-[#172033] hover:bg-[#E5E1D8] transition-colors rounded-r-[4px]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Rate breakdown */}
                {totalDays > 0 && (
                  <div className="border-t border-[#E5E1D8] pt-4 flex flex-col gap-1.5 text-sm">
                    <div className="flex items-center justify-between text-[#667085]">
                      <span>
                        {totalDays} day{totalDays > 1 ? "s" : ""}
                        {quantity > 1 ? ` × ${quantity} vehicles` : ""}
                      </span>
                      <span>Rs. {rentalSubtotal}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 mt-1 border-t border-[#E5E1D8] text-[#172033] font-semibold text-base">
                      <span>Estimated total</span>
                      <span>Rs. {rentalSubtotal}</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={vehicle.quantityAvailable === 0}
                  className="mt-1 bg-[#C9A24D] text-[#172033] h-[48px] rounded-[4px] text-[12px] font-semibold uppercase tracking-[0.1em] hover:brightness-95 transition-all disabled:opacity-50 disabled:hover:brightness-100"
                >
                  {vehicle.quantityAvailable === 0
                    ? "Currently Unavailable"
                    : "Book This Vehicle"}
                </button>

                {!token && vehicle.quantityAvailable > 0 && (
                  <p className="text-[12px] text-[#667085] text-center -mt-1">
                    You'll be asked to log in before confirming your booking.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Description + vendor/location — full width below the hero */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10 pt-10 border-t border-[#E5E1D8]">
          <div>
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#344054] mb-2">
              About this vehicle
            </h2>
            <p className="text-sm text-[#667085] leading-relaxed">{vehicle.description}</p>
          </div>

          <div className="bg-white border border-[#E5E1D8] rounded-[8px] p-4 h-fit flex flex-col gap-2">
            {vehicle.owner?.shopName && (
              <div className="text-sm text-[#667085]">
                Listed by{" "}
                <span className="text-[#172033] font-medium">{vehicle.owner.shopName}</span>
              </div>
            )}
            {vehicle.location?.address && (
              <div className="text-sm text-[#667085] flex items-start gap-1.5">
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
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;