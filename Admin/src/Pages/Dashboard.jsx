import React, { useContext, useEffect } from "react";
import { AdminContext } from "../Context/AdminContext";

const StatCard = ({ label, value }) => (
  <div className="bg-white border border-[#E7E4DB] rounded-sm p-6">
    <p className="text-xs uppercase tracking-wide text-[#5B6472]">{label}</p>
    <p className="font-[Oswald] text-3xl text-[#14171F] mt-2">{value}</p>
  </div>
);

const Dashboard = () => {
  const { dashData, getDashboardData } = useContext(AdminContext);

  useEffect(() => {
    getDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!dashData) {
    return <p className="text-sm text-[#5B6472] p-8">Loading dashboard...</p>;
  }

  return (
    <div className="p-8">
      <h1 className="font-[Oswald] uppercase tracking-wide text-2xl text-[#14171F] mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard label="Vendors" value={dashData.vendors} />
        <StatCard label="Customers" value={dashData.customers} />
        <StatCard label="Vehicles" value={dashData.products} />
        <StatCard label="Bookings" value={dashData.bookings} />
        <StatCard label="Pending Bookings" value={dashData.pendingBookings} />
        <StatCard label="Revenue" value={`Rs. ${dashData.revenue}`} />
      </div>

      <div className="bg-white border border-[#E7E4DB] rounded-sm p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#14171F] mb-4">
          Latest Bookings
        </h2>
        {dashData.latestBookings.length === 0 ? (
          <p className="text-sm text-[#5B6472]">No bookings yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#5B6472] uppercase text-xs tracking-wide">
                <th className="pb-3">Booking Code</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {dashData.latestBookings.map((booking) => (
                <tr key={booking._id} className="border-t border-[#F0EEE7]">
                  <td className="py-3 text-[#14171F]">{booking.bookingCode}</td>
                  <td className="py-3 text-[#5B6472]">{booking.status}</td>
                  <td className="py-3 text-[#14171F]">Rs. {booking.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;