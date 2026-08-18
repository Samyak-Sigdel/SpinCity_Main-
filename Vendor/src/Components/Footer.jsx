import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#F7F5EF] text-[#667085] mt-24 border-t border-[#E5E1D8]">
      <div
        className="h-[2px] w-full"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #C9A24D 0 18px, transparent 18px 30px)",
        }}
      />
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-8 text-center">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#667085]">
          © {new Date().getFullYear()} Spin<span className="text-[#C9A24D]">City</span> Vendor Portal — All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;