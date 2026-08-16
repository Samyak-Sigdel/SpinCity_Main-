import React, { useContext, useEffect } from "react";
import { AdminContext } from "../Context/AdminContext";

const Customers = () => {
  const { customers, getAllCustomers } = useContext(AdminContext);

  useEffect(() => {
    getAllCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-5 md:p-8">
      <p className="text-[11px] uppercase tracking-[0.25em] text-[#D6B36A]/80 mb-1">
        Manage
      </p>
      <h1 className="font-serif text-2xl md:text-3xl text-white mb-8 md:mb-10">
        Customers
      </h1>

      {/* Desktop table */}
      <div className="hidden md:block bg-[#181D21] border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-white/40 uppercase text-[11px] tracking-wide bg-white/[0.02]">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Address</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id} className="border-t border-white/10">
                <td className="px-5 py-3 text-white font-medium">{customer.name}</td>
                <td className="px-5 py-3 text-white/60">{customer.email}</td>
                <td className="px-5 py-3 text-white/60">{customer.phone}</td>
                <td className="px-5 py-3 text-white/60">{customer.address}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {customers.length === 0 && (
          <p className="text-sm text-white/40 p-8 text-center">No customers yet.</p>
        )}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-3">
        {customers.map((customer) => (
          <div key={customer._id} className="bg-[#181D21] border border-white/10 p-4">
            <p className="text-white font-medium text-sm">{customer.name}</p>
            <p className="text-white/50 text-xs mt-1">{customer.email}</p>
            <p className="text-white/50 text-xs">{customer.phone}</p>
            {customer.address && (
              <p className="text-white/40 text-xs mt-1">{customer.address}</p>
            )}
          </div>
        ))}

        {customers.length === 0 && (
          <p className="text-sm text-white/40 text-center py-12">No customers yet.</p>
        )}
      </div>
    </div>
  );
};

export default Customers;