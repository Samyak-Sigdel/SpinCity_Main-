import React from "react";

const KpiCard = ({ label, value, sublabel }) => (
  <div className="flex-1 min-w-[160px] bg-white border border-[#E5E1D8] rounded-lg px-5 py-5 md:px-6 md:py-6 shadow-[0_2px_8px_rgba(23,32,51,0.06)]">
    <p className="text-[10px] uppercase tracking-[0.18em] text-[#667085] whitespace-nowrap">{label}</p>
    <p className="font-serif text-2xl md:text-3xl text-[#172033] mt-2">{value}</p>
    {sublabel && <p className="text-xs text-[#3E8B73] mt-1">{sublabel}</p>}
  </div>
);

export default KpiCard;