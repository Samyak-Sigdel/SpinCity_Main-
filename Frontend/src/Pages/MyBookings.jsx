import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { CustomerContext } from "../Context/CustomerContext";

const statusStyles = {
  Pending: "bg-[#FDF1E4] text-[#B5720D]",
  Confirmed: "bg-[#E9F0FA] text-[#2F5E8F]",
  Active: "bg-[#E9F3F0] text-[#2F6F5E]",
  Completed: "bg-[#EFF0F2] text-[#5B6472]",
  Cancelled: "bg-[#F5E7E7] text-[#B03636]",
};

const MyBookings = () => {
  const { backendUrl, token } = useContext(CustomerContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(backendUrl + "/api/user/my-bookings", {
        headers: { ctoken: token },
      });
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-booking",
        { bookingId },
        { headers: { ctoken: token } }
      );
      if (data.success) {
        toast.success("Booking cancelled");
        fetchBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel booking.");
    }
  };

  useEffect(() => {
    if (token) fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!token) {
    return (
      <div className="max-w-md mx-auto my-24 px-6 text-center">
        <p className="text-sm text-[#5B6472] mb-4">
          Please log in to view your bookings.
        </p>
        <Link
          to="/login"
          className="inline-block px-6 py-3 rounded-sm bg-[#14171F] text-[#F7F5F0] text-sm font-semibold"
        >
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-12">
      <h1 className="font-[Oswald] uppercase tracking-wide text-2xl text-[#14171F] mb-8">
        My Bookings
      </h1>

      {loading ? (
        <p className="text-sm text-[#5B6472]">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <div className="border border-dashed border-[#D8D5CC] rounded-sm py-16 text-center">
          <p className="text-[#5B6472] text-sm mb-4">You haven't booked anything yet.</p>
          <Link
            to="/vehicles"
            className="inline-block px-5 py-2.5 rounded-sm bg-[#14171F] text-[#F7F5F0] text-sm font-semibold"
          >
            Browse Vehicles
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="border border-[#E7E4DB] rounded-sm overflow-hidden bg-white"
            >
              <div className="h-36 bg-[#F0EEE7]">
                <img
                  src={booking.product?.image}
                  alt={booking.product?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-[Oswald] uppercase tracking-wide text-sm text-[#14171F]">
                    {booking.product?.name}
                  </h3>
                  <span
                    className={`text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-sm whitespace-nowrap ${
                      statusStyles[booking.status] || statusStyles.Pending
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <p className="text-xs text-[#5B6472] mt-1">
                  Code: {booking.bookingCode}
                </p>
                <p className="text-xs text-[#5B6472] mt-1">
                  {new Date(booking.startDate).toLocaleDateString()} –{" "}
                  {new Date(booking.endDate).toLocaleDateString()}
                </p>
                <p className="text-sm font-semibold text-[#14171F] mt-2">
                  Rs. {booking.totalPrice}
                </p>

                {["Pending", "Confirmed"].includes(booking.status) && (
                  <button
                    onClick={() => cancelBooking(booking._id)}
                    className="mt-4 w-full text-xs font-semibold px-3 py-2 rounded-sm border border-[#B03636] text-[#B03636] hover:bg-[#F5E7E7]"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;