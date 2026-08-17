import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { VendorContext } from "../Context/VendorContext";
import AddVehicleForm from "../Components/AddVehicleForm";

const AddVehiclePage = () => {
  const navigate = useNavigate();
  const { getDashboardStats } = useContext(VendorContext);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-xl">
        <h2 className="font-serif text-xl text-[#F5F3EE] mb-6 text-center">Add a Vehicle</h2>
        <AddVehicleForm
          onAdded={() => {
            getDashboardStats();
            navigate("/vehicles");
          }}
        />
      </div>
    </div>
  );
};

export default AddVehiclePage;