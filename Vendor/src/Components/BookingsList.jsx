// BookingsList.jsx — emerald theme, statuses kept semantically distinct
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { VendorContext } from "../Context/VendorContext";

const statusStyles = {
  Pending: "border-[#D9A441]/40 text-[#8A5B10] bg-[#FBF1DE]",
  Confirmed: "border-[#8FB3D9]/40 text-[#3D6A99] bg-[#EAF1F9]",
  Active: "border-[#145A4A]/30 text-[#145A4A] bg-[#EDF5F1]",
  Completed: "border-[#E5E2D9] text-[#64748B] bg-[#F8F7F2]",
  Cancelled: "border-[#C75C5C]/30 text-[#C75C5C] bg-[#FBEAEA]",
};

const nextActions = {
  Pending: ["Confirmed", "Cancelled"],
  Confirmed: ["Active", "Cancelled"],
  Active: ["Completed"],
  Completed: [],
  Cancelled: [],
};

const FILTERS = ["All", "Pending", "Confirmed", "Active", "Completed", "Cancelled"];

const StatusBadge = ({ status }) => (
  <span
    className={`text-[9px] font-semibold uppercase tracking-[0.15em] px-2 py-1 rounded border whitespace-nowrap ${
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
        className={`text-[10px] font-semibold uppercase tracking-[0.12em] px-3 py-2 rounded border transition-colors ${
          action === "Cancelled"
            ? "border-[#C75C5C]/40 text-[#C75C5C] hover:bg-[#FBEAEA]"
            : "border-[#145A4A]/50 text-[#145A4A] hover:bg-[#EDF5F1]"
        }`}
      >
        Mark {action}
      </button>
    ))}
  </div>
);

const BookingsList = () => {
  const { backendUrl, vToken, getDashboardStats } = useContext(VendorContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

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
        getDashboardStats();
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

  const filteredBookings = filter === "All" ? bookings : bookings.filter((b) => b.status === filter);

  if (loading) {
    return (
      <p className="text-sm text-[#64748B] uppercase tracking-[0.15em]">
        Loading bookings...
      </p>
    );
  }

  return (
    <>
      <div className="flex gap-1 mb-6 overflow-x-auto">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] whitespace-nowrap rounded border transition-colors ${
              filter === f
                ? "border-[#145A4A]/60 text-[#145A4A] bg-[#EDF5F1]"
                : "border-[#E5E2D9] text-[#64748B] hover:border-[#64748B]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filteredBookings.length === 0 ? (
        <div className="border border-dashed border-[#E5E2D9] rounded-lg bg-white py-16 px-6 text-center">
          <p className="text-[#64748B] text-sm">
            {filter === "All" ? "No bookings yet for your vehicles." : `No ${filter.toLowerCase()} bookings.`}
          </p>
        </div>
      ) : (
        <>
          {/* ============ MOBILE: card list (below md) ============ */}
          <div className="md:hidden flex flex-col gap-3">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="border border-[#E5E2D9] bg-white rounded-lg shadow-[0_2px_8px_rgba(20,32,51,0.06)] p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[#142033] font-semibold text-sm truncate">
                      {booking.bookingCode}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-[#64748B] mt-1">
                      {booking.customer?.name}
                    </p>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>

                <div className="mt-3 pt-3 border-t border-[#E5E2D9] grid grid-cols-2 gap-y-2 text-xs">
                  <span className="text-[#64748B]">Vehicle</span>
                  <span className="text-[#142033] text-right truncate">{booking.product?.name}</span>

                  <span className="text-[#64748B]">Dates</span>
                  <span className="text-[#142033] text-right">
                    {new Date(booking.startDate).toLocaleDateString()} – {new Date(booking.endDate).toLocaleDateString()}
                  </span>

                  <span className="text-[#64748B]">Total</span>
                  <span className="text-[#145A4A] font-semibold text-right">Rs. {booking.totalPrice}</span>
                </div>

                {nextActions[booking.status].length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#E5E2D9]">
                    <ActionButtons status={booking.status} onAction={(action) => updateStatus(booking._id, action)} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ============ DESKTOP: table (md and up) ============ */}
          <div className="hidden md:block border border-[#E5E2D9] bg-white rounded-lg shadow-[0_2px_8px_rgba(20,32,51,0.06)] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#64748B] text-[10px] uppercase tracking-[0.15em] bg-[#F8F7F2] border-b border-[#E5E2D9]">
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
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="border-t border-[#E5E2D9] hover:bg-[#F8F7F2]/60 transition-colors">
                    <td className="px-5 py-4 text-[#142033] font-medium">{booking.bookingCode}</td>
                    <td className="px-5 py-4 text-[#142033]">{booking.customer?.name}</td>
                    <td className="px-5 py-4 text-[#142033]">{booking.product?.name}</td>
                    <td className="px-5 py-4 text-[#142033] whitespace-nowrap">
                      {new Date(booking.startDate).toLocaleDateString()} –{" "}
                      {new Date(booking.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-[#145A4A] font-semibold">Rs. {booking.totalPrice}</td>
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
      )}
    </>
  );
};

export default BookingsList;