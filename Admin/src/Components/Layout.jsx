import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-[#F7F5F0]">
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default Layout;