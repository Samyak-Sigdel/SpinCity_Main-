// Overview.jsx
import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { VendorContext } from "../Context/VendorContext";
import KpiCard from "../Components/KpiCard";

const statusStyles = {
  Pending: "border-[#C9A24D]/40 text-[#9A7628] bg-[#F5E9C9]",
  Confirmed: "border-[#8FB3D9]/40 text-[#3D6A99] bg-[#EAF1F9]",
  Active: "border-[#3E8B73]/30 text-[#3E8B73] bg-[#E5F3ED]",
  Completed: "border-[#E5E1D8] text-[#667085] bg-[#F7F5EF]",
  Cancelled: "border-[#C75C5C]/30 text-[#C75C5C] bg-[#FBEAEA]",
};

const Overview = () => {
  const { dashboardStats, getDashboardStats } = useContext(VendorContext);

  useEffect(() => {
    getDashboardStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!dashboardStats) {
    return (
      <p className="text-sm text-[#667085] uppercase tracking-[0.15em]">
        Loading overview...
      </p>
    );
  }

  const { totalProducts, activeRentals, pendingBookings, earnings, todayEarnings, latestBookings } = dashboardStats;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="font-serif text-xl text-[#172033]">Business Overview</h2>
          <p className="text-sm text-[#667085] mt-1">Here's what's happening with your rentals today.</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/vehicles/add"
            className="h-[44px] px-5 flex items-center bg-[#C9A24D] hover:bg-[#B8923E] text-[#172033] text-[13px] font-semibold uppercase tracking-[0.15em] rounded transition-colors"
          >
            + Add Vehicle
          </Link>
          {pendingBookings > 0 && (
            <Link
              to="/bookings"
              className="h-[44px] px-5 flex items-center border border-[#C9A24D] text-[#C9A24D] text-[13px] font-semibold uppercase tracking-[0.15em] rounded hover:bg-[#F5E9C9] transition-colors"
            >
              Review Bookings
            </Link>
          )}
        </div>
      </div>

      {pendingBookings > 0 && (
        <div className="mb-8 border border-[#C9A24D]/30 bg-[#F5E9C9] rounded px-4 py-3">
          <p className="text-sm text-[#9A7628]">
            {pendingBookings} booking{pendingBookings > 1 ? "s" : ""} awaiting your response.
          </p>
        </div>
      )}

      <div className="flex border border-[#E5E1D8] bg-white rounded-lg shadow-[0_2px_8px_rgba(23,32,51,0.06)] divide-x divide-[#E5E1D8] overflow-x-auto mb-10">
        <KpiCard label="Total Vehicles" value={totalProducts} />
        <KpiCard label="Active Rentals" value={activeRentals} />
        <KpiCard label="Pending Bookings" value={pendingBookings} />
        <KpiCard label="Total Earnings" value={`Rs. ${earnings}`} sublabel={`Rs. ${todayEarnings} today`} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-lg text-[#172033]">Recent Bookings</h3>
        <Link to="/bookings" className="text-[11px] uppercase tracking-[0.15em] text-[#C9A24D] hover:text-[#B8923E]">
          View All →
        </Link>
      </div>

      {latestBookings.length === 0 ? (
        <div className="border border-dashed border-[#E5E1D8] rounded-lg bg-white py-12 px-6 text-center">
          <p className="text-[#667085] text-sm">No bookings yet.</p>
        </div>
      ) : (
        <div className="border border-[#E5E1D8] bg-white rounded-lg shadow-[0_2px_8px_rgba(23,32,51,0.06)] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#667085] text-[10px] uppercase tracking-[0.15em] bg-[#F7F5EF] border-b border-[#E5E1D8]">
                <th className="px-5 py-3.5 font-medium">Vehicle</th>
                <th className="px-5 py-3.5 font-medium">Customer</th>
                <th className="px-5 py-3.5 font-medium">Dates</th>
                <th className="px-5 py-3.5 font-medium">Status</th>
                <th className="px-5 py-3.5 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {latestBookings.map((booking) => (
                <tr key={booking._id} className="border-t border-[#E5E1D8]">
                  <td className="px-5 py-4 text-[#172033]">{booking.product?.name}</td>
                  <td className="px-5 py-4 text-[#344054]">{booking.customer?.name}</td>
                  <td className="px-5 py-4 text-[#344054] whitespace-nowrap">
                    {new Date(booking.startDate).toLocaleDateString()} – {new Date(booking.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-[9px] font-semibold uppercase tracking-[0.15em] px-2 py-1 rounded border ${
                        statusStyles[booking.status] || statusStyles.Pending
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[#C9A24D] font-semibold">Rs. {booking.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Overview;