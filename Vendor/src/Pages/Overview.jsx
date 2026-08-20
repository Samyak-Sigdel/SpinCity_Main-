// Overview.jsx
import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { VendorContext } from "../Context/VendorContext";
import KpiCard from "../Components/KpiCard";

const statusStyles = {
  Pending: "border-[#D9A441]/40 text-[#8A5B10] bg-[#FBF1DE]",
  Confirmed: "border-[#8FB3D9]/40 text-[#3D6A99] bg-[#EAF1F9]",
  Active: "border-[#145A4A]/30 text-[#145A4A] bg-[#EDF5F1]",
  Completed: "border-[#E5E2D9] text-[#64748B] bg-[#F8F7F2]",
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
      <p className="text-sm text-[#64748B] uppercase tracking-[0.15em]">
        Loading overview...
      </p>
    );
  }

  const { totalProducts, activeRentals, pendingBookings, earnings, todayEarnings, latestBookings } = dashboardStats;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="font-serif text-xl text-[#142033]">Business Overview</h2>
          <p className="text-sm text-[#64748B] mt-1">Here's what's happening with your rentals today.</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/vehicles/add"
            className="h-[44px] px-5 flex items-center bg-[#145A4A] hover:bg-[#0D3F35] text-white text-[13px] font-semibold uppercase tracking-[0.15em] rounded transition-colors"
          >
            + Add Vehicle
          </Link>
          {pendingBookings > 0 && (
            <Link
              to="/bookings"
              className="h-[44px] px-5 flex items-center border border-[#145A4A] text-[#145A4A] text-[13px] font-semibold uppercase tracking-[0.15em] rounded hover:bg-[#EDF5F1] transition-colors"
            >
              Review Bookings
            </Link>
          )}
        </div>
      </div>

      {pendingBookings > 0 && (
        <div className="mb-8 border border-[#D9A441]/30 bg-[#FBF1DE] rounded px-4 py-3">
          <p className="text-sm text-[#8A5B10]">
            {pendingBookings} booking{pendingBookings > 1 ? "s" : ""} awaiting your response.
          </p>
        </div>
      )}

      <div className="flex border border-[#E5E2D9] bg-white rounded-lg shadow-[0_2px_8px_rgba(20,32,51,0.06)] divide-x divide-[#E5E2D9] overflow-x-auto mb-10">
        <KpiCard label="Total Vehicles" value={totalProducts} />
        <KpiCard label="Active Rentals" value={activeRentals} />
        <KpiCard label="Pending Bookings" value={pendingBookings} />
        <KpiCard label="Total Earnings" value={`Rs. ${earnings}`} sublabel={`Rs. ${todayEarnings} today`} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-lg text-[#142033]">Recent Bookings</h3>
        <Link to="/bookings" className="text-[11px] uppercase tracking-[0.15em] text-[#145A4A] hover:text-[#0D3F35]">
          View All →
        </Link>
      </div>

      {latestBookings.length === 0 ? (
        <div className="border border-dashed border-[#E5E2D9] rounded-lg bg-white py-12 px-6 text-center">
          <p className="text-[#64748B] text-sm">No bookings yet.</p>
        </div>
      ) : (
        <div className="border border-[#E5E2D9] bg-white rounded-lg shadow-[0_2px_8px_rgba(20,32,51,0.06)] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#64748B] text-[10px] uppercase tracking-[0.15em] bg-[#F8F7F2] border-b border-[#E5E2D9]">
                <th className="px-5 py-3.5 font-medium">Vehicle</th>
                <th className="px-5 py-3.5 font-medium">Customer</th>
                <th className="px-5 py-3.5 font-medium">Dates</th>
                <th className="px-5 py-3.5 font-medium">Status</th>
                <th className="px-5 py-3.5 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {latestBookings.map((booking) => (
                <tr key={booking._id} className="border-t border-[#E5E2D9]">
                  <td className="px-5 py-4 text-[#142033]">{booking.product?.name}</td>
                  <td className="px-5 py-4 text-[#142033]">{booking.customer?.name}</td>
                  <td className="px-5 py-4 text-[#142033] whitespace-nowrap">
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
                  <td className="px-5 py-4 text-[#145A4A] font-semibold">Rs. {booking.totalPrice}</td>
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