import React from "react";

const KpiCard = ({ label, value, sublabel }) => (
  <div className="flex-1 min-w-[160px] px-5 py-5 md:px-6 md:py-6">
    <p className="text-[10px] uppercase tracking-[0.18em] text-[#858B91] whitespace-nowrap">{label}</p>
    <p className="font-serif text-2xl md:text-3xl text-[#F5F3EE] mt-2">{value}</p>
    {sublabel && <p className="text-xs text-[#7FBFA0] mt-1">{sublabel}</p>}
  </div>
);

export default KpiCard;