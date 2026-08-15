import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import LocationPickerModal from "../Components/LocationPickerModal";
import TimePicker from "../Components/TimePicker";
import { VEHICLE_CATEGORIES } from "../Context/CustomerContext";

// Replace this with your actual Spin City motorcycle/scooter image.
// Recommended: a wide cinematic image with bikes/scooters positioned on the right.
const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=2200&q=85";

const Home = () => {
  const navigate = useNavigate();

  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [location, setLocation] = useState(null);

  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00 AM");

  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("10:00 AM");

  // Spin City only rents bikes and scooters — cars are excluded from the fleet.
  const rideCategories = VEHICLE_CATEGORIES.filter(
    (category) => !/car/i.test(category)
  );

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (location) {
      params.set("lat", location.lat);
      params.set("lng", location.lon);
      params.set("address", location.address);
    }

    if (pickupDate) {
      params.set("pickupDate", pickupDate);
    }

    if (pickupTime) {
      params.set("pickupTime", pickupTime);
    }

    if (returnDate) {
      params.set("returnDate", returnDate);
    }

    if (returnTime) {
      params.set("returnTime", returnTime);
    }

    navigate(`/vehicles?${params.toString()}`);
  };

  const today = new Date().toISOString().split("T")[0];

  const shortAddress = (address) => {
    if (!address) return "";

    return address
      .split(",")
      .slice(0, 2)
      .join(",")
      .trim();
  };

  return (
    <div className="bg-[#0B0D0F] text-[#F5F3EE]">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative min-h-[720px] md:min-h-[780px] overflow-visible">

        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `
              linear-gradient(
                90deg,
                rgba(7, 9, 11, 0.97) 0%,
                rgba(7, 9, 11, 0.82) 32%,
                rgba(7, 9, 11, 0.42) 68%,
                rgba(7, 9, 11, 0.72) 100%
              ),
              linear-gradient(
                180deg,
                rgba(7, 9, 11, 0.25) 0%,
                rgba(7, 9, 11, 0.05) 45%,
                rgba(7, 9, 11, 0.96) 100%
              ),
              url(${HERO_IMAGE_URL})
            `,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-3 md:px-8 pt-25 md:pt-25">

    

          {/* Heading */}
          <h1 className="
            font-serif
            text-5xl
            sm:text-6xl
            md:text-7xl
            lg:text-[82px]
            leading-[0.94]
            tracking-[-0.035em]
            max-w-3xl
          ">
            Find Your
            <br />

            <span className="text-[#D6B36A] italic">
              Perfect Ride.
            </span>
          </h1>

          {/* Description */}
          <p className="
            mt-6
            text-[#B5B8BB]
            text-sm
            md:text-base
            leading-relaxed
            max-w-lg
          ">
            Premium bikes and scooters for every journey.
            Book your ride and get moving.
          </p>

        </div>
1`z`
        {/* =====================================================
            CENTERED SEARCH / BOOKING PANEL
        ====================================================== */}

        <div
          className="
            relative
            z-30
            max-w-6xl
            mx-auto
            px-5
            md:px-8
            mt-20
            md:mt-24
          "
        >

          <form
            onSubmit={handleSearch}
            className="
              relative
              bg-[#101417]/95
              backdrop-blur-xl
              border border-white/10
              shadow-2xl
              p-5
              md:p-6
            "
          >

            {/* Header */}
            <div className="
              flex
              flex-col
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-2
              mb-6
            ">

              <div>

                <p className="
                  text-[10px]
                  uppercase
                  tracking-[0.28em]
                  text-[#D6B36A]
                ">
                  Reserve your ride
                </p>

                <p className="
                  mt-1
                  text-sm
                  text-[#F5F3EE]
                ">
                  Where are you riding?
                </p>

              </div>

              <span className="
                hidden
                sm:block
                text-[9px]
                uppercase
                tracking-[0.25em]
                text-[#60666C]
              ">
                SPIN CITY
              </span>

            </div>

            {/* Search fields */}
            <div className="
              grid
              grid-cols-1
              lg:grid-cols-[1.45fr_1fr_1fr_auto]
              gap-3
              items-end
            ">

              {/* =================================================
                  LOCATION
              ================================================== */}

              <div className="min-w-0">

                <label className="
                  block
                  text-[10px]
                  uppercase
                  tracking-[0.18em]
                  text-[#858B91]
                  mb-2
                ">
                  Pickup Location
                </label>

                <button
                  type="button"
                  onClick={() => setLocationModalOpen(true)}
                  className="
                    w-full
                    h-[54px]
                    flex
                    items-center
                    gap-3
                    border
                    border-white/10
                    bg-[#181D21]
                    px-4
                    text-left
                    transition-colors
                    hover:border-[#D6B36A]/60
                  "
                >

                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="shrink-0"
                  >
                    <path
                      d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
                      stroke="#D6B36A"
                      strokeWidth="1.5"
                    />

                    <circle
                      cx="12"
                      cy="10"
                      r="2.5"
                      stroke="#D6B36A"
                      strokeWidth="1.5"
                    />
                  </svg>

                  <span
                    className={
                      location
                        ? "text-[#F5F3EE] text-sm truncate"
                        : "text-[#70767C] text-sm truncate"
                    }
                  >
                    {location
                      ? shortAddress(location.address)
                      : "Choose pickup location"}
                  </span>

                </button>

              </div>

              {/* =================================================
                  PICKUP
              ================================================== */}

              <div className="min-w-0">

                <label className="
                  block
                  text-[10px]
                  uppercase
                  tracking-[0.18em]
                  text-[#858B91]
                  mb-2
                ">
                  Pickup
                </label>

                <div className="grid grid-cols-2 gap-2">

                  <input
                    type="date"
                    value={pickupDate}
                    min={today}
                    onChange={(e) =>
                      setPickupDate(e.target.value)
                    }
                    className="
                      w-full
                      h-[54px]
                      bg-[#181D21]
                      border
                      border-white/10
                      text-[#F5F3EE]
                      px-3
                      text-sm
                      focus:outline-none
                      focus:border-[#D6B36A]
                      [color-scheme:dark]
                    "
                  />

                  <div className="relative z-[100]">
                    <TimePicker
                      label="Select pickup time"
                      value={pickupTime}
                      onChange={setPickupTime}
                    />
                  </div>

                </div>

              </div>

              {/* =================================================
                  RETURN
              ================================================== */}

              <div className="min-w-0">

                <label className="
                  block
                  text-[10px]
                  uppercase
                  tracking-[0.18em]
                  text-[#858B91]
                  mb-2
                ">
                  Return
                </label>

                <div className="grid grid-cols-2 gap-2">

                  <input
                    type="date"
                    value={returnDate}
                    min={pickupDate || today}
                    onChange={(e) =>
                      setReturnDate(e.target.value)
                    }
                    className="
                      w-full
                      h-[54px]
                      bg-[#181D21]
                      border
                      border-white/10
                      text-[#F5F3EE]
                      px-3
                      text-sm
                      focus:outline-none
                      focus:border-[#D6B36A]
                      [color-scheme:dark]
                    "
                  />

                  <div className="relative z-[100]">
                    <TimePicker
                      label="Select return time"
                      value={returnTime}
                      onChange={setReturnTime}
                    />
                  </div>

                </div>

              </div>

              {/* =================================================
                  SEARCH BUTTON
              ================================================== */}

              <button
                type="submit"
                className="
                  h-[54px]
                  min-w-[150px]
                  bg-[#D6B36A]
                  hover:bg-[#E5C783]
                  text-[#0B0D0F]
                  px-7
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  transition-colors
                  flex
                  items-center
                  justify-center
                  gap-3
                "
              >
                Search

                <span className="text-base">
                  →
                </span>
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
        onClose={() => setLocationModalOpen(false)}
        onConfirm={(place) => setLocation(place)}
        initialAddress={location?.address || ""}
      />

   

      <section className="bg-[#0B0D0F] py-24">

        <div className="
          max-w-7xl
          mx-auto
          px-5
          md:px-8
        ">

          <div className="
            border
            border-white/10
            p-8
            md:p-16
            text-center
          ">

            <span className="
              text-[10px]
              uppercase
              tracking-[0.3em]
              text-[#D6B36A]
            ">
              Your next journey starts here
            </span>

            <h2 className="
              font-serif
              text-4xl
              md:text-6xl
              text-[#F5F3EE]
              mt-5
            ">
              The road is yours.
            </h2>

            <p className="
              text-[#858B90]
              text-sm
              max-w-lg
              mx-auto
              mt-5
            ">
              Choose your vehicle and start exploring
              with Spin City.
            </p>

            <Link
              to="/vehicles"
              className="
                inline-flex
                mt-8
                bg-[#D6B36A]
                hover:bg-[#E5C783]
                text-[#0B0D0F]
                px-8
                py-3.5
                text-xs
                font-semibold
                uppercase
                tracking-[0.2em]
                transition-colors
              "
            >
              Explore the Fleet →
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Home;