import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex bg-[#0B0D0F] min-h-screen">
      <Sidebar mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen} />
      <div className="flex-1 min-h-screen bg-[#0B0D0F]">
        <Navbar onMenuClick={() => setMobileNavOpen(true)} />
        {children}
      </div>
    </div>
  );
};

export default Layout;