import React, { useContext, useEffect } from "react";
import { AdminContext } from "../Context/AdminContext";

const StatCard = ({ label, value }) => (
  <div className="bg-[#181D21] border border-white/10 p-5 md:p-6">
    <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/40">{label}</p>
    <p className="font-serif text-2xl md:text-3xl text-white mt-2">{value}</p>
  </div>
);

const Dashboard = () => {
  const { dashData, getDashboardData } = useContext(AdminContext);

  useEffect(() => {
    getDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!dashData) {
    return <p className="text-sm text-white/50 p-8">Loading dashboard...</p>;
  }

  return (
    <div className="p-5 md:p-8">
      <p className="text-[11px] uppercase tracking-[0.25em] text-[#D6B36A]/80 mb-1">
        Overview
      </p>
      <h1 className="font-serif text-2xl md:text-3xl text-white mb-8 md:mb-10">
        Dashboard
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-8 md:mb-10">
        <StatCard label="Vendors" value={dashData.vendors} />
        <StatCard label="Customers" value={dashData.customers} />
        <StatCard label="Vehicles" value={dashData.products} />
        <StatCard label="Bookings" value={dashData.bookings} />
        <StatCard label="Pending Bookings" value={dashData.pendingBookings} />
        <StatCard label="Revenue" value={`Rs. ${dashData.revenue}`} />
      </div>

      <div className="bg-[#181D21] border border-white/10 p-5 md:p-6">
        <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-white/60 mb-4">
          Latest Bookings
        </h2>
        {dashData.latestBookings.length === 0 ? (
          <p className="text-sm text-white/40">No bookings yet.</p>
        ) : (
          <>
            {/* Desktop table */}
            <table className="w-full text-sm hidden sm:table">
              <thead>
                <tr className="text-left text-white/40 uppercase text-[11px] tracking-wide">
                  <th className="pb-3">Booking Code</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {dashData.latestBookings.map((booking) => (
                  <tr key={booking._id} className="border-t border-white/10">
                    <td className="py-3 text-white">{booking.bookingCode}</td>
                    <td className="py-3 text-white/60">{booking.status}</td>
                    <td className="py-3 text-white">Rs. {booking.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile cards */}
            <div className="sm:hidden flex flex-col divide-y divide-white/10">
              {dashData.latestBookings.map((booking) => (
                <div key={booking._id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white">{booking.bookingCode}</p>
                    <p className="text-xs text-white/40 mt-0.5">{booking.status}</p>
                  </div>
                  <p className="text-sm text-white">Rs. {booking.totalPrice}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;