import React from "react";

const KpiCard = ({ label, value, sublabel }) => (
  <div className="flex-1 min-w-[160px] bg-white border border-[#E5E2D9] rounded-lg px-5 py-5 md:px-6 md:py-6 shadow-[0_2px_8px_rgba(20,32,51,0.06)]">
    <p className="text-[10px] uppercase tracking-[0.18em] text-[#64748B] whitespace-nowrap">{label}</p>
    <p className="font-serif text-2xl md:text-3xl text-[#142033] mt-2">{value}</p>
    {sublabel && <p className="text-xs text-[#145A4A] mt-1">{sublabel}</p>}
  </div>
);

export default KpiCard;