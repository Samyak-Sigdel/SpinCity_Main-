import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#F8F7F2] text-[#64748B] mt-24 border-t border-[#E5E2D9]">
      <div
        className="h-[2px] w-full"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #145A4A 0 18px, transparent 18px 30px)",
        }}
      />
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-8 text-center">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#64748B]">
          © {new Date().getFullYear()} Spin<span className="text-[#145A4A]">City</span> Vendor Portal — All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;