import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { CustomerContext } from "../Context/CustomerContext";

const statusStyles = {
  Pending: "bg-[#F5E9C9] text-[#9A7628]",
  Confirmed: "bg-[#E5F3ED] text-[#3E8B73]",
  Active: "bg-[#E5F3ED] text-[#3E8B73]",
  Completed: "bg-[#F7F5EF] text-[#667085]",
  Cancelled: "bg-[#FBEAEA] text-[#C75C5C]",
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
      <div className="bg-[#F7F5EF] min-h-screen">
        <div className="max-w-md mx-auto py-24 px-6 text-center">
          <p className="text-sm text-[#667085] mb-4">
            Please log in to view your bookings.
          </p>
          <Link
            to="/login"
            className="inline-block px-6 py-3 rounded-[4px] bg-[#C9A24D] text-[#172033] text-sm font-semibold"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F5EF] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-12">
        <h1 className="font-serif text-3xl font-semibold text-[#172033] mb-8">
          My Bookings
        </h1>

        {loading ? (
          <p className="text-sm text-[#667085]">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <div className="border border-dashed border-[#E5E1D8] rounded-[8px] py-16 text-center bg-white">
            <p className="text-[#667085] text-sm mb-4">You haven't booked anything yet.</p>
            <Link
              to="/vehicles"
              className="inline-block px-5 py-2.5 rounded-[4px] bg-[#C9A24D] text-[#172033] text-sm font-semibold"
            >
              Browse Vehicles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="border border-[#E5E1D8] rounded-[8px] overflow-hidden bg-white shadow-[0_2px_8px_rgba(23,32,51,0.06)]"
              >
                <div className="h-36 bg-[#F7F5EF]">
                  <img
                    src={booking.product?.image}
                    alt={booking.product?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[15px] font-semibold text-[#172033]">
                      {booking.product?.name}
                    </h3>
                    <span
                      className={`text-[11px] font-medium uppercase px-2 py-0.5 rounded-[4px] whitespace-nowrap ${
                        statusStyles[booking.status] || statusStyles.Pending
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#667085] mt-1">
                    Code: {booking.bookingCode}
                  </p>
                  <p className="text-xs text-[#667085] mt-1">
                    {new Date(booking.startDate).toLocaleDateString()} –{" "}
                    {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm font-semibold text-[#172033] mt-2">
                    Rs. {booking.totalPrice}
                  </p>

                  {["Pending", "Confirmed"].includes(booking.status) && (
                    <button
                      onClick={() => cancelBooking(booking._id)}
                      className="mt-4 w-full text-xs font-semibold px-3 py-2 rounded-[4px] border border-[#C75C5C] text-[#C75C5C] hover:bg-[#FBEAEA] transition-colors"
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
    </div>
  );
};

export default MyBookings;