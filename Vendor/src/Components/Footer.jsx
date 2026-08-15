import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#0B0D0F] text-[#60666C] mt-24 border-t border-white/10">
      <div
        className="h-[2px] w-full"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #D6B36A 0 18px, transparent 18px 30px)",
        }}
      />
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-8 text-center">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#60666C]">
          © {new Date().getFullYear()} Spin<span className="text-[#D6B36A]">City</span> Vendor Portal — All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;