import React, { useContext, useEffect } from "react";
import { AdminContext } from "../Context/AdminContext";

const Customers = () => {
  const { customers, getAllCustomers } = useContext(AdminContext);

  useEffect(() => {
    getAllCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-8">
      <h1 className="font-[Oswald] uppercase tracking-wide text-2xl text-[#14171F] mb-8">
        Customers
      </h1>

      <div className="bg-white border border-[#E7E4DB] rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#5B6472] uppercase text-xs tracking-wide bg-[#FBFAF7]">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Address</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id} className="border-t border-[#F0EEE7]">
                <td className="px-5 py-3 text-[#14171F] font-medium">{customer.name}</td>
                <td className="px-5 py-3 text-[#5B6472]">{customer.email}</td>
                <td className="px-5 py-3 text-[#5B6472]">{customer.phone}</td>
                <td className="px-5 py-3 text-[#5B6472]">{customer.address}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {customers.length === 0 && (
          <p className="text-sm text-[#5B6472] p-8 text-center">No customers yet.</p>
        )}
      </div>
    </div>
  );
};

export default Customers;