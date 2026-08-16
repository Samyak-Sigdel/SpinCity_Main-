import React, { useContext, useEffect } from "react";
import { AdminContext } from "../Context/AdminContext";

const statusStyles = {
  Pending: "bg-[#D6B36A]/10 text-[#D6B36A]",
  Confirmed: "bg-blue-400/10 text-blue-300",
  Active: "bg-emerald-400/10 text-emerald-300",
  Completed: "bg-white/5 text-white/50",
  Cancelled: "bg-red-400/10 text-red-300",
};

const Bookings = () => {
  const { bookings, getAllBookings } = useContext(AdminContext);

  useEffect(() => {
    getAllBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const StatusBadge = ({ status }) => (
    <span
      className={`text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 ${
        statusStyles[status] || statusStyles.Pending
      }`}
    >
      {status}
    </span>
  );

  return (
    <div className="p-5 md:p-8">
      <p className="text-[11px] uppercase tracking-[0.25em] text-[#D6B36A]/80 mb-1">
        Manage
      </p>
      <h1 className="font-serif text-2xl md:text-3xl text-white mb-8 md:mb-10">
        Bookings
      </h1>

      {/* Desktop table */}
      <div className="hidden lg:block bg-[#181D21] border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-white/40 uppercase text-[11px] tracking-wide bg-white/[0.02]">
              <th className="px-5 py-3">Booking Code</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Vendor</th>
              <th className="px-5 py-3">Vehicle</th>
              <th className="px-5 py-3">Dates</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Payment</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="border-t border-white/10">
                <td className="px-5 py-3 text-white font-medium">
                  {booking.bookingCode}
                </td>
                <td className="px-5 py-3 text-white/60">{booking.customer?.name}</td>
                <td className="px-5 py-3 text-white/60">{booking.vendor?.shopName}</td>
                <td className="px-5 py-3 text-white/60">{booking.product?.name}</td>
                <td className="px-5 py-3 text-white/60 whitespace-nowrap">
                  {new Date(booking.startDate).toLocaleDateString()} –{" "}
                  {new Date(booking.endDate).toLocaleDateString()}
                </td>
                <td className="px-5 py-3 text-white">Rs. {booking.totalPrice}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={booking.status} />
                </td>
                <td className="px-5 py-3 text-white/60">{booking.paymentStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {bookings.length === 0 && (
          <p className="text-sm text-white/40 p-8 text-center">No bookings yet.</p>
        )}
      </div>

      {/* Mobile / tablet cards */}
      <div className="lg:hidden flex flex-col gap-3">
        {bookings.map((booking) => (
          <div key={booking._id} className="bg-[#181D21] border border-white/10 p-4">
            <div className="flex items-start justify-between mb-2">
              <p className="text-white font-medium text-sm">{booking.bookingCode}</p>
              <StatusBadge status={booking.status} />
            </div>
            <p className="text-white/50 text-xs">
              {booking.customer?.name} → {booking.vendor?.shopName}
            </p>
            <p className="text-white/50 text-xs mt-0.5">{booking.product?.name}</p>
            <p className="text-white/40 text-xs mt-1">
              {new Date(booking.startDate).toLocaleDateString()} –{" "}
              {new Date(booking.endDate).toLocaleDateString()}
            </p>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
              <span className="text-white text-sm font-medium">
                Rs. {booking.totalPrice}
              </span>
              <span className="text-white/50 text-xs">{booking.paymentStatus}</span>
            </div>
          </div>
        ))}

        {bookings.length === 0 && (
          <p className="text-sm text-white/40 text-center py-12">No bookings yet.</p>
        )}
      </div>
    </div>
  );
};

export default Bookings;