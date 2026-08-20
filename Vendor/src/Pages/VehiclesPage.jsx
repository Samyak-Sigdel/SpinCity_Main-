// VehiclesPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import VehicleList from "../Components/VehicleList";

const VehiclesPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="font-serif text-xl text-[#142033]">My Vehicles</h2>
        <Link
          to="/vehicles/add"
          className="h-[44px] px-5 inline-flex items-center justify-center bg-[#145A4A] hover:bg-[#0D3F35] text-white text-[13px] font-semibold uppercase tracking-[0.15em] rounded transition-colors"
        >
          + Add Vehicle
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search vehicles..."
          className="h-[46px] flex-1 bg-[#F8F7F2] border border-[#E5E2D9] rounded text-[#142033] placeholder:text-[#64748B] px-4 text-sm focus:outline-none focus:border-[#145A4A] focus:bg-white transition-colors"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-[46px] bg-[#F8F7F2] border border-[#E5E2D9] rounded text-[#142033] px-4 text-sm focus:outline-none focus:border-[#145A4A] focus:bg-white transition-colors"
        >
          {["All", "Available", "Rented", "Maintenance", "Inactive"].map((s) => (
            <option key={s} value={s}>{s === "All" ? "All statuses" : s}</option>
          ))}
        </select>
      </div>

      <VehicleList
        refreshKey={refreshKey}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onChanged={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
};

export default VehiclesPage;