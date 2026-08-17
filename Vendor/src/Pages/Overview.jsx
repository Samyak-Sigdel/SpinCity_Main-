import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { VendorContext } from "../Context/VendorContext";
import KpiCard from "../Components/KpiCard";

const statusStyles = {
  Pending: "border-[#D6B36A]/40 text-[#D6B36A] bg-[#D6B36A]/10",
  Confirmed: "border-[#8FB3D9]/40 text-[#8FB3D9] bg-[#8FB3D9]/10",
  Active: "border-[#7FBFA0]/40 text-[#7FBFA0] bg-[#7FBFA0]/10",
  Completed: "border-white/15 text-[#858B91] bg-white/5",
  Cancelled: "border-[#D97878]/40 text-[#D97878] bg-[#D97878]/10",
};

const Overview = () => {
  const { dashboardStats, getDashboardStats } = useContext(VendorContext);

  useEffect(() => {
    getDashboardStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!dashboardStats) {
    return (
      <p className="text-sm text-[#858B91] uppercase tracking-[0.15em]">
        Loading overview...
      </p>
    );
  }

  const { totalProducts, activeRentals, pendingBookings, earnings, todayEarnings, latestBookings } = dashboardStats;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="font-serif text-xl text-[#F5F3EE]">Business Overview</h2>
          <p className="text-sm text-[#858B91] mt-1">Here's what's happening with your rentals today.</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/vehicles/add"
            className="h-[46px] px-5 flex items-center bg-[#D6B36A] hover:bg-[#E5C783] text-[#0B0D0F] text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors"
          >
            + Add Vehicle
          </Link>
          {pendingBookings > 0 && (
            <Link
              to="/bookings"
              className="h-[46px] px-5 flex items-center border border-[#D6B36A]/50 text-[#D6B36A] text-[11px] font-semibold uppercase tracking-[0.18em] hover:bg-[#D6B36A]/10 transition-colors"
            >
              Review Bookings
            </Link>
          )}
        </div>
      </div>

      {pendingBookings > 0 && (
        <div className="mb-8 border border-[#D6B36A]/30 bg-[#D6B36A]/5 px-4 py-3">
          <p className="text-sm text-[#D6B36A]">
            {pendingBookings} booking{pendingBookings > 1 ? "s" : ""} awaiting your response.
          </p>
        </div>
      )}

      <div className="flex border border-white/10 bg-[#101417] divide-x divide-white/10 overflow-x-auto mb-10">
        <KpiCard label="Total Vehicles" value={totalProducts} />
        <KpiCard label="Active Rentals" value={activeRentals} />
        <KpiCard label="Pending Bookings" value={pendingBookings} />
        <KpiCard label="Total Earnings" value={`Rs. ${earnings}`} sublabel={`Rs. ${todayEarnings} today`} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-lg text-[#F5F3EE]">Recent Bookings</h3>
        <Link to="/bookings" className="text-[11px] uppercase tracking-[0.15em] text-[#D6B36A] hover:text-[#E5C783]">
          View All →
        </Link>
      </div>

      {latestBookings.length === 0 ? (
        <div className="border border-dashed border-white/15 py-12 px-6 text-center">
          <p className="text-[#858B91] text-sm">No bookings yet.</p>
        </div>
      ) : (
        <div className="border border-white/10 bg-[#101417] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#858B91] text-[10px] uppercase tracking-[0.15em] bg-[#181D21] border-b border-white/10">
                <th className="px-5 py-3.5 font-medium">Vehicle</th>
                <th className="px-5 py-3.5 font-medium">Customer</th>
                <th className="px-5 py-3.5 font-medium">Dates</th>
                <th className="px-5 py-3.5 font-medium">Status</th>
                <th className="px-5 py-3.5 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {latestBookings.map((booking) => (
                <tr key={booking._id} className="border-t border-white/5">
                  <td className="px-5 py-4 text-[#F5F3EE]">{booking.product?.name}</td>
                  <td className="px-5 py-4 text-[#B5B8BB]">{booking.customer?.name}</td>
                  <td className="px-5 py-4 text-[#B5B8BB] whitespace-nowrap">
                    {new Date(booking.startDate).toLocaleDateString()} – {new Date(booking.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-[9px] font-semibold uppercase tracking-[0.15em] px-2 py-1 border ${
                        statusStyles[booking.status] || statusStyles.Pending
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[#D6B36A] font-semibold">Rs. {booking.totalPrice}</td>
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