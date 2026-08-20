import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LocationPickerModal from "../Components/LocationPickerModal";
import TimePicker from "../Components/TimePicker";
import PopularVehicles from "../Components/PopularVehicles";
import { CustomerContext } from "../Context/CustomerContext";
import {
  MapPin,
  Search,
  CalendarDays,
  UsersRound,
} from "lucide-react";

const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1778182295955-9fbc87a7053a?auto=format&fit=crop&w=1600&q=80";

/* =========================================================
   HOME COMPONENT
========================================================= */

const Home = () => {
  const navigate = useNavigate();

  const { backendUrl } = useContext(CustomerContext);

  /* =========================================================
     STATES
  ========================================================= */

  const [locationModalOpen, setLocationModalOpen] =
    useState(false);

  const [location, setLocation] = useState(null);

  const [pickupDate, setPickupDate] = useState("");

  const [pickupTime, setPickupTime] =
    useState("10:00 AM");

  const [returnDate, setReturnDate] = useState("");

  const [returnTime, setReturnTime] =
    useState("10:00 AM");

  const [popularVehicles, setPopularVehicles] =
    useState([]);

  /* =========================================================
     TODAY
  ========================================================= */

  const today = new Date()
    .toISOString()
    .split("T")[0];

  /* =========================================================
     FETCH VEHICLES
  ========================================================= */

  useEffect(() => {
    const fetchPopularVehicles = async () => {
      try {
        const { data } = await axios.get(
          backendUrl + "/api/user/products"
        );

        if (data.success) {
          setPopularVehicles(
            data.products.slice(0, 4)
          );
        }
      } catch (error) {
        console.error(
          "Error fetching vehicles:",
          error
        );
      }
    };

    if (backendUrl) {
      fetchPopularVehicles();
    }
  }, [backendUrl]);

  /* =========================================================
     SEARCH HANDLER
  ========================================================= */

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (location) {
      params.set("lat", location.lat);
      params.set("lng", location.lon);
      params.set(
        "address",
        location.address
      );
    }

    if (pickupDate) {
      params.set(
        "pickupDate",
        pickupDate
      );
    }

    if (pickupTime) {
      params.set(
        "pickupTime",
        pickupTime
      );
    }

    if (returnDate) {
      params.set(
        "returnDate",
        returnDate
      );
    }

    if (returnTime) {
      params.set(
        "returnTime",
        returnTime
      );
    }

    navigate(
      `/vehicles?${params.toString()}`
    );
  };

  /* =========================================================
     LOCATION TEXT
  ========================================================= */

  const shortAddress = (address) => {
    if (!address) return "";

    return address
      .split(",")
      .slice(0, 2)
      .join(",")
      .trim();
  };

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <div
      className="
        min-h-screen
        bg-[#F8F7F2]
        text-[#142033]
      "
    >

      {/* =====================================================
          HERO SECTION
      ====================================================== */}

      <section className="relative">

        {/* HERO IMAGE */}

        <div
          className="
            relative
            h-[400px]
            md:h-[450px]
            lg:h-[470px]
            w-full
            overflow-hidden
          "
        >

          <img
            src={HERO_IMAGE_URL}
            alt="SpinCity riders"
            className="
              absolute
              inset-0
              w-full
              h-full
              object-cover
              object-center
            "
          />

          {/* LEFT WHITE GRADIENT */}

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-[#FFFFFF]
              via-[#FFFFFF]/95
              via-[42%]
              to-transparent
            "
          />

          {/* BOTTOM FADE */}

          <div
            className="
              absolute
              inset-x-0
              bottom-0
              h-[180px]
              bg-gradient-to-t
              from-[#F8F7F2]
              to-transparent
            "
          />

          {/* HERO CONTENT */}

          <div
            className="
              relative
              z-10
              max-w-[1280px]
              mx-auto
              px-6
              md:px-10
              h-full
              flex
              items-center
            "
          >

            <div
              className="
                max-w-[530px]
                pt-0
              "
            >

              {/* HEADING */}

              <h1
                className="
                  font-['Oswald']
                  font-semibold
                  text-[48px]
                  sm:text-[54px]
                  md:text-[62px]
                  lg:text-[68px]
                  leading-[0.98]
                  tracking-[-0.025em]
                  text-[#142033]
                "
              >
                Find Your

                <br />

                <span
                  className="
                    italic
                    text-[#145A4A]
                  "
                >
                  Perfect Ride.
                </span>
              </h1>

              {/* DESCRIPTION */}

              <p
                className="
                  mt-[25px]
                  max-w-[440px]
                  font-['Inter']
                  text-[15px]
                  md:text-[16px]
                  leading-[1.65]
                  text-[#142033]
                "
              >
                Premium bikes and scooters for
                every journey.
                <br />
                Book your ride and get moving.
              </p>

            </div>

          </div>

        </div>


        {/* ===================================================
            SEARCH / RESERVE CARD
        ==================================================== */}

        <div
          className="
            relative
            z-20
            max-w-[1280px]
            mx-auto
            px-5
            md:px-10
            -mt-[42px]
            pb-[28px]
          "
        >

          <form
            onSubmit={handleSearch}
            className="
              bg-white
              border
              border-[#E5E2D9]
              rounded-[12px]
              shadow-[0_8px_30px_rgba(20,32,51,0.10)]
              px-[24px]
              md:px-[28px]
              pt-[25px]
              pb-[25px]
            "
          >

            {/* SEARCH TITLE */}

            <p
              className="
                font-['Inter']
                text-[13px]
                font-semibold
                uppercase
                tracking-[0.20em]
                text-[#145A4A]
                mb-[20px]
              "
            >
              Reserve Your Ride
            </p>


            {/* SEARCH GRID */}

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                lg:grid-cols-[1.35fr_1.1fr_1.1fr_auto]
                gap-[12px]
                items-end
              "
            >

              {/* =================================================
                  LOCATION
              ================================================== */}

              <div>

                <label
                  className="
                    block
                    font-['Inter']
                    text-[11px]
                    font-medium
                    uppercase
                    tracking-[0.10em]
                    text-[#142033]
                    mb-[8px]
                  "
                >
                  Pick-up Location
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setLocationModalOpen(true)
                  }
                  className="
                    w-full
                    h-[54px]
                    flex
                    items-center
                    gap-[11px]
                    bg-white
                    border
                    border-[#E5E2D9]
                    rounded-[7px]
                    px-[16px]
                    text-left
                    transition-all
                    hover:border-[#145A4A]
                    focus:outline-none
                  "
                >

                  <MapPin
                    size={19}
                    strokeWidth={1.8}
                    className="
                      text-[#145A4A]
                      shrink-0
                    "
                  />

                  <span
                    className={`
                      font-['Inter']
                      text-[14px]
                      truncate
                      ${
                        location
                          ? "text-[#142033]"
                          : "text-[#64748B]"
                      }
                    `}
                  >
                    {location
                      ? shortAddress(
                          location.address
                        )
                      : "Select location"}
                  </span>

                </button>

              </div>


              {/* =================================================
                  PICKUP DATE + TIME
              ================================================== */}

              <div>

                <label
                  className="
                    block
                    font-['Inter']
                    text-[11px]
                    font-medium
                    uppercase
                    tracking-[0.10em]
                    text-[#142033]
                    mb-[8px]
                  "
                >
                  Pickup Date & Time
                </label>

                <div
                  className="
                    grid
                    grid-cols-2
                    gap-[8px]
                  "
                >

                  {/* DATE */}

                  <div className="relative">

                    <CalendarDays
                      size={17}
                      className="
                        absolute
                        left-[13px]
                        top-1/2
                        -translate-y-1/2
                        text-[#64748B]
                        pointer-events-none
                      "
                    />

                    <input
                      type="date"
                      value={pickupDate}
                      min={today}
                      onChange={(e) =>
                        setPickupDate(
                          e.target.value
                        )
                      }
                      className="
                        w-full
                        h-[54px]
                        bg-white
                        border
                        border-[#E5E2D9]
                        rounded-[7px]
                        font-['Inter']
                        text-[13px]
                        text-[#142033]
                        pl-[39px]
                        pr-[8px]
                        focus:outline-none
                        focus:border-[#145A4A]
                      "
                    />

                  </div>

                  {/* TIME */}

                  <TimePicker
                    label="Select pickup time"
                    value={pickupTime}
                    onChange={setPickupTime}
                  />

                </div>

              </div>


              {/* =================================================
                  RETURN DATE + TIME
              ================================================== */}

              <div>

                <label
                  className="
                    block
                    font-['Inter']
                    text-[11px]
                    font-medium
                    uppercase
                    tracking-[0.10em]
                    text-[#142033]
                    mb-[8px]
                  "
                >
                  Return Date & Time
                </label>

                <div
                  className="
                    grid
                    grid-cols-2
                    gap-[8px]
                  "
                >

                  {/* DATE */}

                  <div className="relative">

                    <CalendarDays
                      size={17}
                      className="
                        absolute
                        left-[13px]
                        top-1/2
                        -translate-y-1/2
                        text-[#64748B]
                        pointer-events-none
                      "
                    />

                    <input
                      type="date"
                      value={returnDate}
                      min={
                        pickupDate ||
                        today
                      }
                      onChange={(e) =>
                        setReturnDate(
                          e.target.value
                        )
                      }
                      className="
                        w-full
                        h-[54px]
                        bg-white
                        border
                        border-[#E5E2D9]
                        rounded-[7px]
                        font-['Inter']
                        text-[13px]
                        text-[#142033]
                        pl-[39px]
                        pr-[8px]
                        focus:outline-none
                        focus:border-[#145A4A]
                      "
                    />

                  </div>

                  {/* TIME */}

                  <TimePicker
                    label="Select return time"
                    value={returnTime}
                    onChange={setReturnTime}
                  />

                </div>

              </div>


              {/* =================================================
                  SEARCH BUTTON
              ================================================== */}

              <button
                type="submit"
                className="
                  h-[54px]
                  min-w-[158px]
                  bg-[#145A4A]
                  hover:bg-[#0D3F35]
                  text-white
                  px-[20px]
                  rounded-[7px]
                  font-['Inter']
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                  transition-all
                  flex
                  items-center
                  justify-center
                  gap-[8px]
                  hover:shadow-[0_6px_18px_rgba(20,90,74,0.20)]
                "
              >

                <Search
                  size={17}
                  strokeWidth={2}
                />

                Search Vehicles

              </button>

            </div>

          </form>

        </div>

      </section>


      {/* =====================================================
          LOCATION MODAL
      ====================================================== */}

      <LocationPickerModal
        isOpen={locationModalOpen}
        onClose={() =>
          setLocationModalOpen(false)
        }
        onConfirm={(place) =>
          setLocation(place)
        }
        initialAddress={
          location?.address || ""
        }
      />


      {/* =====================================================
          POPULAR VEHICLES
      ====================================================== */}

      <PopularVehicles vehicles={popularVehicles} />


      {/* =====================================================
          TRUSTED BY 1000+ RIDERS
      ====================================================== */}

      <section
        className="
          bg-[#F8F7F2]
          pb-[65px]
          pt-[5px]
        "
      >

        <div
          className="
            max-w-[1280px]
            mx-auto
            px-5
            md:px-10
          "
        >

          <div
            className="
              relative
              overflow-hidden
              bg-[#FFFFFF]
              border
              border-[#E5E2D9]
              rounded-[10px]
              min-h-[96px]
              flex
              items-center
              px-[30px]
              md:px-[38px]
            "
          >

            {/* LEFT CONTENT */}

            <div
              className="
                flex
                items-center
                gap-[18px]
              "
            >

              {/* ICON */}

              <div
                className="
                  w-[46px]
                  h-[46px]
                  rounded-full
                  bg-[#EDF5F1]
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >

                <UsersRound
                  size={24}
                  strokeWidth={1.7}
                  className="text-[#145A4A]"
                />

              </div>

              {/* TEXT */}

              <div>

                <h3
                  className="
                    font-['Inter']
                    text-[18px]
                    md:text-[20px]
                    font-semibold
                    text-[#142033]
                  "
                >
                  Trusted by 1000+ riders
                </h3>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Home;