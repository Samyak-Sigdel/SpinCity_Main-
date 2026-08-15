import React, { useContext, useEffect } from "react";
import { AdminContext } from "../Context/AdminContext";

const statusStyles = {
  Pending: "bg-[#FDF1E4] text-[#B5720D]",
  Confirmed: "bg-[#E9F0FA] text-[#2F5E8F]",
  Active: "bg-[#E9F3F0] text-[#2F6F5E]",
  Completed: "bg-[#EFF0F2] text-[#5B6472]",
  Cancelled: "bg-[#F5E7E7] text-[#B03636]",
};

const Bookings = () => {
  const { bookings, getAllBookings } = useContext(AdminContext);

  useEffect(() => {
    getAllBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-8">
      <h1 className="font-[Oswald] uppercase tracking-wide text-2xl text-[#14171F] mb-8">
        Bookings
      </h1>

      <div className="bg-white border border-[#E7E4DB] rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#5B6472] uppercase text-xs tracking-wide bg-[#FBFAF7]">
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
              <tr key={booking._id} className="border-t border-[#F0EEE7]">
                <td className="px-5 py-3 text-[#14171F] font-medium">
                  {booking.bookingCode}
                </td>
                <td className="px-5 py-3 text-[#5B6472]">
                  {booking.customer?.name}
                </td>
                <td className="px-5 py-3 text-[#5B6472]">
                  {booking.vendor?.shopName}
                </td>
                <td className="px-5 py-3 text-[#5B6472]">
                  {booking.product?.name}
                </td>
                <td className="px-5 py-3 text-[#5B6472] whitespace-nowrap">
                  {new Date(booking.startDate).toLocaleDateString()} –{" "}
                  {new Date(booking.endDate).toLocaleDateString()}
                </td>
                <td className="px-5 py-3 text-[#14171F]">
                  Rs. {booking.totalPrice}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-sm ${
                      statusStyles[booking.status] || statusStyles.Pending
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-[#5B6472]">
                  {booking.paymentStatus}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {bookings.length === 0 && (
          <p className="text-sm text-[#5B6472] p-8 text-center">No bookings yet.</p>
        )}
      </div>
    </div>
  );
};

export default Bookings;