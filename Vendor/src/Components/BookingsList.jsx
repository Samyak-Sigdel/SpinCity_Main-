// BookingsList.jsx — softened gold on action buttons + filter chip
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { VendorContext } from "../Context/VendorContext";

const statusStyles = {
  Pending: "border-[#BFA05A]/40 text-[#9C7F3F] bg-[#F3ECDA]",
  Confirmed: "border-[#8FB3D9]/40 text-[#3D6A99] bg-[#EAF1F9]",
  Active: "border-[#3E8B73]/30 text-[#3E8B73] bg-[#E5F3ED]",
  Completed: "border-[#E5E1D8] text-[#667085] bg-[#F7F5EF]",
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
            : "border-[#BFA05A]/50 text-[#9C7F3F] hover:bg-[#F3ECDA]"
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
      <p className="text-sm text-[#667085] uppercase tracking-[0.15em]">
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
                ? "border-[#BFA05A]/60 text-[#9C7F3F] bg-[#F3ECDA]"
                : "border-[#E5E1D8] text-[#667085] hover:border-[#98A2B3]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filteredBookings.length === 0 ? (
        <div className="border border-dashed border-[#E5E1D8] rounded-lg bg-white py-16 px-6 text-center">
          <p className="text-[#667085] text-sm">
            {filter === "All" ? "No bookings yet for your vehicles." : `No ${filter.toLowerCase()} bookings.`}
          </p>
        </div>
      ) : (
        <>
          {/* ============ MOBILE: card list (below md) ============ */}
          <div className="md:hidden flex flex-col gap-3">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="border border-[#E5E1D8] bg-white rounded-lg shadow-[0_2px_8px_rgba(23,32,51,0.06)] p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[#172033] font-semibold text-sm truncate">
                      {booking.bookingCode}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-[#667085] mt-1">
                      {booking.customer?.name}
                    </p>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>

                <div className="mt-3 pt-3 border-t border-[#E5E1D8] grid grid-cols-2 gap-y-2 text-xs">
                  <span className="text-[#667085]">Vehicle</span>
                  <span className="text-[#172033] text-right truncate">{booking.product?.name}</span>

                  <span className="text-[#667085]">Dates</span>
                  <span className="text-[#172033] text-right">
                    {new Date(booking.startDate).toLocaleDateString()} – {new Date(booking.endDate).toLocaleDateString()}
                  </span>

                  <span className="text-[#667085]">Total</span>
                  <span className="text-[#9C7F3F] font-semibold text-right">Rs. {booking.totalPrice}</span>
                </div>

                {nextActions[booking.status].length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#E5E1D8]">
                    <ActionButtons status={booking.status} onAction={(action) => updateStatus(booking._id, action)} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ============ DESKTOP: table (md and up) ============ */}
          <div className="hidden md:block border border-[#E5E1D8] bg-white rounded-lg shadow-[0_2px_8px_rgba(23,32,51,0.06)] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#667085] text-[10px] uppercase tracking-[0.15em] bg-[#F7F5EF] border-b border-[#E5E1D8]">
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
                  <tr key={booking._id} className="border-t border-[#E5E1D8] hover:bg-[#F7F5EF]/60 transition-colors">
                    <td className="px-5 py-4 text-[#172033] font-medium">{booking.bookingCode}</td>
                    <td className="px-5 py-4 text-[#344054]">{booking.customer?.name}</td>
                    <td className="px-5 py-4 text-[#344054]">{booking.product?.name}</td>
                    <td className="px-5 py-4 text-[#344054] whitespace-nowrap">
                      {new Date(booking.startDate).toLocaleDateString()} –{" "}
                      {new Date(booking.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-[#9C7F3F] font-semibold">Rs. {booking.totalPrice}</td>
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