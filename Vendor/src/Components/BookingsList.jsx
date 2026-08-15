import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { VendorContext } from "../Context/VendorContext";

const statusStyles = {
  Pending: "border-[#D6B36A]/40 text-[#D6B36A] bg-[#D6B36A]/10",
  Confirmed: "border-[#8FB3D9]/40 text-[#8FB3D9] bg-[#8FB3D9]/10",
  Active: "border-[#7FBFA0]/40 text-[#7FBFA0] bg-[#7FBFA0]/10",
  Completed: "border-white/15 text-[#858B91] bg-white/5",
  Cancelled: "border-[#D97878]/40 text-[#D97878] bg-[#D97878]/10",
};

const nextActions = {
  Pending: ["Confirmed", "Cancelled"],
  Confirmed: ["Active", "Cancelled"],
  Active: ["Completed"],
  Completed: [],
  Cancelled: [],
};

const StatusBadge = ({ status }) => (
  <span
    className={`text-[9px] font-semibold uppercase tracking-[0.15em] px-2 py-1 border whitespace-nowrap ${
      statusStyles[status] || statusStyles.Pending
    }`}
  >
    {status}
  </span>
);

const ActionButtons = ({ status, onAction }) => (
  <div className="flex gap-2 flex-wrap">
    {nextActions[status].map((action) => (
      <button
        key={action}
        onClick={() => onAction(action)}
        className={`text-[10px] font-semibold uppercase tracking-[0.12em] px-3 py-2 border transition-colors ${
          action === "Cancelled"
            ? "border-[#D97878]/40 text-[#D97878] hover:bg-[#D97878]/10"
            : "border-[#D6B36A]/50 text-[#D6B36A] hover:bg-[#D6B36A]/10"
        }`}
      >
        Mark {action}
      </button>
    ))}
  </div>
);

const BookingsList = () => {
  const { backendUrl, vToken } = useContext(VendorContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(backendUrl + "/api/vendor/bookings", {
        headers: { vtoken: vToken },
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

  const updateStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/vendor/update-booking-status",
        { bookingId, status },
        { headers: { vtoken: vToken } }
      );
      if (data.success) {
        toast.success(data.message);
        fetchBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update booking status.");
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <p className="text-sm text-[#858B91] uppercase tracking-[0.15em]">
        Loading bookings...
      </p>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="border border-dashed border-white/15 py-16 px-6 text-center">
        <p className="text-[#858B91] text-sm">No bookings yet for your vehicles.</p>
      </div>
    );
  }

  return (
    <>
      {/* ============ MOBILE: card list (below md) ============ */}
      <div className="md:hidden flex flex-col gap-3">
        {bookings.map((booking) => (
          <div key={booking._id} className="border border-white/10 bg-[#101417] p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[#F5F3EE] font-semibold text-sm truncate">
                  {booking.bookingCode}
                </p>
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#858B91] mt-1">
                  {booking.customer?.name}
                </p>
              </div>
              <StatusBadge status={booking.status} />
            </div>

            <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-y-2 text-xs">
              <span className="text-[#70767C]">Vehicle</span>
              <span className="text-[#F5F3EE] text-right truncate">{booking.product?.name}</span>

              <span className="text-[#70767C]">Dates</span>
              <span className="text-[#F5F3EE] text-right">
                {new Date(booking.startDate).toLocaleDateString()} – {new Date(booking.endDate).toLocaleDateString()}
              </span>

              <span className="text-[#70767C]">Total</span>
              <span className="text-[#D6B36A] font-semibold text-right">Rs. {booking.totalPrice}</span>
            </div>

            {nextActions[booking.status].length > 0 && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <ActionButtons status={booking.status} onAction={(action) => updateStatus(booking._id, action)} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ============ DESKTOP: table (md and up) ============ */}
      <div className="hidden md:block border border-white/10 bg-[#101417] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#858B91] text-[10px] uppercase tracking-[0.15em] bg-[#181D21] border-b border-white/10">
              <th className="px-5 py-3.5 font-medium">Booking Code</th>
              <th className="px-5 py-3.5 font-medium">Customer</th>
              <th className="px-5 py-3.5 font-medium">Vehicle</th>
              <th className="px-5 py-3.5 font-medium">Dates</th>
              <th className="px-5 py-3.5 font-medium">Total</th>
              <th className="px-5 py-3.5 font-medium">Status</th>
              <th className="px-5 py-3.5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-4 text-[#F5F3EE] font-medium">{booking.bookingCode}</td>
                <td className="px-5 py-4 text-[#B5B8BB]">{booking.customer?.name}</td>
                <td className="px-5 py-4 text-[#B5B8BB]">{booking.product?.name}</td>
                <td className="px-5 py-4 text-[#B5B8BB] whitespace-nowrap">
                  {new Date(booking.startDate).toLocaleDateString()} –{" "}
                  {new Date(booking.endDate).toLocaleDateString()}
                </td>
                <td className="px-5 py-4 text-[#D6B36A] font-semibold">Rs. {booking.totalPrice}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={booking.status} />
                </td>
                <td className="px-5 py-4">
                  <ActionButtons status={booking.status} onAction={(action) => updateStatus(booking._id, action)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BookingsList;