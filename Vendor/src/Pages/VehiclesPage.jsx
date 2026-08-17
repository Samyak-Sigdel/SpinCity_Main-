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
        <h2 className="font-serif text-xl text-[#F5F3EE]">My Vehicles</h2>
        <Link
          to="/vehicles/add"
          className="h-[46px] px-5 inline-flex items-center justify-center bg-[#D6B36A] hover:bg-[#E5C783] text-[#0B0D0F] text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors"
        >
          + Add Vehicle
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search vehicles..."
          className="h-[46px] flex-1 bg-[#181D21] border border-white/10 text-[#F5F3EE] placeholder:text-[#70767C] px-4 text-sm focus:outline-none focus:border-[#D6B36A]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-[46px] bg-[#181D21] border border-white/10 text-[#F5F3EE] px-4 text-sm focus:outline-none focus:border-[#D6B36A] [color-scheme:dark]"
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