// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import VendorLayout from "./Components/VendorLayout";
import Overview from "./Pages/Overview";
import VehiclesPage from "./Pages/VehiclesPage";
import AddVehiclePage from "./Pages/AddVehiclePage";
import BookingsPage from "./Pages/BookingsPage";
import EarningsPage from "./Pages/EarningsPage";
import ProfilePage from "./Pages/ProfilePage";

const App = () => {
  return (
    <div className="bg-[#F8F7F2] min-h-screen flex flex-col">
      <ToastContainer position="top-right" />
      <Navbar />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<VendorLayout />}>
            <Route index element={<Navigate to="/overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="vehicles" element={<VehiclesPage />} />
            <Route path="vehicles/add" element={<AddVehiclePage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="earnings" element={<EarningsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Route>
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

export default App;