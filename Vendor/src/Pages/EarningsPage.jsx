// EarningsPage.jsx
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { VendorContext } from "../Context/VendorContext";
import KpiCard from "../Components/KpiCard";

const EarningsPage = () => {
  const { backendUrl, vToken, dashboardStats, getDashboardStats } = useContext(VendorContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPaidBookings = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(backendUrl + "/api/vendor/bookings", {
        headers: { vtoken: vToken },
      });
      if (data.success) {
        setBookings(data.bookings.filter((b) => b.paymentStatus === "Paid"));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load earnings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaidBookings();
    getDashboardStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h2 className="font-serif text-xl text-[#142033] mb-6">Earnings</h2>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <KpiCard label="Total Earnings" value={`Rs. ${dashboardStats?.earnings ?? 0}`} />
        <KpiCard label="Today's Earnings" value={`Rs. ${dashboardStats?.todayEarnings ?? 0}`} />
        <KpiCard label="Paid Bookings" value={bookings.length} />
      </div>

      {loading ? (
        <p className="text-sm text-[#64748B] uppercase tracking-[0.15em]">Loading earnings...</p>
      ) : bookings.length === 0 ? (
        <div className="border border-dashed border-[#E5E2D9] rounded-lg bg-white py-16 px-6 text-center">
          <p className="text-[#64748B] text-sm">No paid bookings yet.</p>
        </div>
      ) : (
        <div className="border border-[#E5E2D9] bg-white rounded-lg shadow-[0_2px_8px_rgba(20,32,51,0.06)] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#64748B] text-[10px] uppercase tracking-[0.15em] bg-[#F8F7F2] border-b border-[#E5E2D9]">
                <th className="px-5 py-3.5 font-medium">Booking Code</th>
                <th className="px-5 py-3.5 font-medium">Vehicle</th>
                <th className="px-5 py-3.5 font-medium">Customer</th>
                <th className="px-5 py-3.5 font-medium">Date Paid</th>
                <th className="px-5 py-3.5 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-t border-[#E5E2D9]">
                  <td className="px-5 py-4 text-[#142033] font-medium">{b.bookingCode}</td>
                  <td className="px-5 py-4 text-[#142033]">{b.product?.name}</td>
                  <td className="px-5 py-4 text-[#142033]">{b.customer?.name}</td>
                  <td className="px-5 py-4 text-[#142033]">{new Date(b.updatedAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4 text-[#145A4A] font-semibold">Rs. {b.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EarningsPage;