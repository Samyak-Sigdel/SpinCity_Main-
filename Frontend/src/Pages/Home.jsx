import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import LocationPickerModal from "../Components/LocationPickerModal";
import TimePicker from "../Components/TimePicker";
import { CustomerContext } from "../Context/CustomerContext";

const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1778182295955-9fbc87a7053a?auto=format&fit=crop&w=1600&q=80";

const FEATURES = [
  {
    title: "Well Maintained",
    desc: "Regularly serviced vehicles",
    icon: (
      <path d="M12 2 4 5v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V5l-8-3Z" stroke="#C9A24D" strokeWidth="1.5" strokeLinejoin="round" />
    ),
  },
  {
    title: "Best Prices",
    desc: "Affordable rates, no hidden fees",
    icon: <path d="M4 12h16M8 6l-4 6 4 6M16 6l4 6-4 6" stroke="#C9A24D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    title: "Flexible Rentals",
    desc: "Hourly, daily or weekly",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" stroke="#C9A24D" strokeWidth="1.5" />
        <path d="M12 7v5l3 2" stroke="#C9A24D" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "24/7 Support",
    desc: "We're here to help anytime",
    icon: (
      <>
        <path d="M4 13a8 8 0 0 1 16 0" stroke="#C9A24D" strokeWidth="1.5" />
        <rect x="3" y="13" width="4" height="6" rx="1" stroke="#C9A24D" strokeWidth="1.5" />
        <rect x="17" y="13" width="4" height="6" rx="1" stroke="#C9A24D" strokeWidth="1.5" />
      </>
    ),
  },
];

const STEPS = [
  { n: "01", title: "Search", desc: "Choose your location, dates and find the perfect vehicle." },
  { n: "02", title: "Book", desc: "Select your vehicle and complete your booking securely." },
  { n: "03", title: "Ride", desc: "Pick up your vehicle and enjoy your journey." },
];

const PopularVehicleCard = ({ vehicle }) => (
  <Link
    to={`/vehicles/${vehicle._id}`}
    className="group bg-white border border-[#E5E1D8] rounded-[8px] p-4 shadow-[0_2px_8px_rgba(23,32,51,0.06)] hover:shadow-[0_4px_16px_rgba(23,32,51,0.08)] hover:border-[#C9A24D]/50 transition-all"
  >
    <div className="aspect-[4/3] bg-white border border-[#E5E1D8] rounded-[8px] flex items-center justify-center p-4 overflow-hidden">
      <img
        src={vehicle.image}
        alt={vehicle.name}
        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
      />
    </div>
    <div className="flex items-start justify-between mt-3">
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold text-[#172033] truncate">{vehicle.name}</h3>
        <p className="text-[12px] text-[#667085]">{vehicle.category}</p>
      </div>
      <p className="text-[14px] font-semibold text-[#172033] whitespace-nowrap shrink-0">
        Rs. {vehicle.pricePerDay}
        <span className="text-[11px] font-normal text-[#667085]">/day</span>
      </p>
    </div>
    <div className="flex items-center gap-2 mt-2">
      <span
        className={`inline-flex px-2 py-0.5 rounded-[4px] text-[10px] font-medium uppercase ${
          (vehicle.quantityAvailable ?? 0) > 0
            ? "bg-[#E5F3ED] text-[#3E8B73]"
            : "bg-[#FBEAEA] text-[#C75C5C]"
        }`}
      >
        {(vehicle.quantityAvailable ?? 0) > 0 ? "Available" : "Unavailable"}
      </span>
    </div>
  </Link>
);

const Home = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(CustomerContext);

  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00 AM");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("10:00 AM");

  const [popularVehicles, setPopularVehicles] = useState([]);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const { data } = await axios.get(backendUrl + "/api/user/products");
        if (data.success) setPopularVehicles(data.products.slice(0, 4));
      } catch (error) {
        console.error(error);
      }
    };
    if (backendUrl) fetchPopular();
  }, [backendUrl]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) {
      params.set("lat", location.lat);
      params.set("lng", location.lon);
      params.set("address", location.address);
    }
    if (pickupDate) params.set("pickupDate", pickupDate);
    if (pickupTime) params.set("pickupTime", pickupTime);
    if (returnDate) params.set("returnDate", returnDate);
    if (returnTime) params.set("returnTime", returnTime);
    navigate(`/vehicles?${params.toString()}`);
  };

  const today = new Date().toISOString().split("T")[0];

  const shortAddress = (address) =>
    !address ? "" : address.split(",").slice(0, 2).join(",").trim();

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#172033]">

      {/* =====================================================
          HERO — full-bleed image with overlaid copy
      ====================================================== */}
      <section className="relative bg-[#F7F5EF]">
        {/* Background image + gradient wash */}
        <div className="relative h-[360px] md:h-[420px] w-full overflow-hidden">
          <img
            src={HERO_IMAGE_URL}
            alt="Rider on a SpinCity motorcycle at sunset"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-90"
          />
          {/* Left-to-right wash so the copy stays legible over the photo — lightened so the bright photo still reads through */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F7F5EF] via-[#F7F5EF]/70 to-transparent" />
          {/* Bottom wash so the floating card reads cleanly against the image */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#F7F5EF]/90 via-transparent to-transparent" />
          {/* Warm gold glow — the signature accent, not a navy wash */}
          <div className="pointer-events-none absolute -right-20 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#C9A24D]/15 blur-[100px]" />

          <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-10 h-full flex items-center">
            <div className="max-w-xl">
              <h1 className="font-serif font-semibold text-4xl md:text-6xl leading-[1.04] text-[#172033]">
                Find Your
                <br />
                <span className="italic text-[#C9A24D]">Perfect Ride.</span>
              </h1>

              <p className="mt-5 text-[15px] leading-relaxed text-[#667085] max-w-md">
                Premium bikes and scooters for every journey. Book your ride
                and get moving.
              </p>
            </div>
          </div>
        </div>

        {/* Floating booking card — overlaps the bottom of the hero image */}
        <div className="relative z-20 max-w-[1280px] mx-auto px-6 md:px-10 -mt-6 pb-6">
          <form
            onSubmit={handleSearch}
            className="bg-white border border-[#E5E1D8] border-t-2 border-t-[#C9A24D] rounded-[10px] shadow-[0_8px_30px_rgba(23,32,51,0.10)] p-4 md:p-5"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#C9A24D] mb-3">
              Reserve Your Ride
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr_1fr_auto] gap-3 items-end">

              {/* Location */}
              <div className="min-w-0">
                <label className="block text-[10px] uppercase tracking-[0.14em] text-[#667085] mb-2">
                  Pick-up Location
                </label>
                <button
                  type="button"
                  onClick={() => setLocationModalOpen(true)}
                  className="w-full h-[52px] flex items-center gap-3 border border-[#E5E1D8] bg-white rounded-[4px] px-4 text-left transition-colors hover:border-[#C9A24D]"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
                    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" stroke="#C9A24D" strokeWidth="1.5" />
                    <circle cx="12" cy="10" r="2.5" stroke="#C9A24D" strokeWidth="1.5" />
                  </svg>
                  <span className={`text-sm truncate ${location ? "text-[#172033]" : "text-[#98A2B3]"}`}>
                    {location ? shortAddress(location.address) : "Select location"}
                  </span>
                </button>
              </div>

              {/* Pickup */}
              <div className="min-w-0">
                <label className="block text-[10px] uppercase tracking-[0.14em] text-[#667085] mb-2">
                  Pickup Date &amp; Time
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={pickupDate}
                    min={today}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full h-[52px] bg-white border border-[#E5E1D8] rounded-[4px] text-[#172033] px-3 text-sm focus:outline-none focus:border-[#C9A24D]"
                  />
                  <TimePicker label="Select pickup time" value={pickupTime} onChange={setPickupTime} />
                </div>
              </div>

              {/* Return */}
              <div className="min-w-0">
                <label className="block text-[10px] uppercase tracking-[0.14em] text-[#667085] mb-2">
                  Return Date &amp; Time
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={returnDate}
                    min={pickupDate || today}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full h-[52px] bg-white border border-[#E5E1D8] rounded-[4px] text-[#172033] px-3 text-sm focus:outline-none focus:border-[#C9A24D]"
                  />
                  <TimePicker label="Select return time" value={returnTime} onChange={setReturnTime} />
                </div>
              </div>

              {/* Search button */}
              <button
                type="submit"
                className="h-[52px] min-w-[150px] bg-[#C9A24D] hover:brightness-95 text-[#172033] px-6 rounded-[4px] text-[13px] font-semibold uppercase tracking-[0.06em] transition-all flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="#172033" strokeWidth="2" />
                  <path d="m21 21-4.3-4.3" stroke="#172033" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Search Vehicles
              </button>
            </div>
          </form>
        </div>
      </section>

      <LocationPickerModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        onConfirm={(place) => setLocation(place)}
        initialAddress={location?.address || ""}
      />

      {/* =====================================================
          FEATURE STRIP
      ====================================================== */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-10 mt-8 md:mt-10">
        <div className="bg-white border border-[#E5E1D8] rounded-[8px] shadow-[0_2px_8px_rgba(23,32,51,0.06)] p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-full bg-[#F5E9C9]/50 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">{f.icon}</svg>
              </div>
              <div>
                <h4 className="text-[15px] font-semibold text-[#172033]">{f.title}</h4>
                <p className="text-[13px] text-[#667085] mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-10 py-20 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#C9A24D] mb-3">
          How It Works
        </p>
        <h2 className="font-serif font-semibold text-3xl md:text-4xl text-[#172033] mb-14">
          Rent in 3 simple steps
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {STEPS.map((step) => (
            <div key={step.n} className="flex flex-col items-center">
              <div className="relative w-20 h-20 rounded-full bg-[#F5E9C9]/50 flex items-center justify-center mb-5">
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#C9A24D] text-[#172033] text-[11px] font-bold flex items-center justify-center">
                  {step.n[1]}
                </span>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#C9A24D" strokeWidth="1.5" />
                </svg>
              </div>
              <h3 className="text-[16px] font-semibold text-[#172033]">{step.title}</h3>
              <p className="text-[13px] text-[#667085] mt-1.5 max-w-[220px]">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          POPULAR VEHICLES
      ====================================================== */}
      {popularVehicles.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-6 md:px-10 pb-20">
          <div className="flex items-end justify-between mb-7">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#C9A24D] mb-2">
                Popular Vehicles
              </p>
              <h2 className="font-serif font-semibold text-3xl text-[#172033]">
                Top picks for you
              </h2>
            </div>
            <Link
              to="/vehicles"
              className="hidden sm:inline-flex items-center gap-2 text-[13px] font-medium text-[#C9A24D] hover:text-[#9A7628] transition-colors"
            >
              View all vehicles <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {popularVehicles.map((v) => (
              <PopularVehicleCard key={v._id} vehicle={v} />
            ))}
          </div>
        </section>
      )}

      {/* =====================================================
          TRUST / STATS
      ====================================================== */}
      <section className="bg-[#F7F5EF] py-16 border-y border-[#E5E1D8]/70">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 bg-white border border-[#E5E1D8] rounded-[12px] shadow-[0_4px_16px_rgba(23,32,51,0.08)] p-8 md:p-10">

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#F5E9C9] flex items-center justify-center shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2 4 5v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V5l-8-3Z" stroke="#C9A24D" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h3 className="text-[17px] font-semibold text-[#172033]">Trusted by 1000+ riders</h3>
                <p className="text-[13px] text-[#667085] max-w-xs mt-1">
                  Join thousands of happy customers who trust SpinCity for their journeys.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
              {[
                ["1000+", "Happy Customers"],
                ["1500+", "Trips Completed"],
                ["50+", "Vehicles"],
                ["4.8 ★", "Average Rating"],
              ].map(([stat, label]) => (
                <div key={label}>
                  <p className="text-2xl font-semibold text-[#C9A24D]">{stat}</p>
                  <p className="text-[12px] text-[#667085] mt-1">{label}</p>
                </div>
              ))}
            </div>

            <div className="text-center lg:text-right shrink-0">
              <Link
                to="/vehicles"
                className="inline-block bg-[#C9A24D] hover:brightness-95 text-[#172033] px-6 py-3 rounded-[4px] text-[12px] font-semibold uppercase tracking-[0.08em] transition-all"
              >
                List Your Vehicle
              </Link>
              <p className="text-[11px] text-[#667085] mt-2">Grow your business with SpinCity</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;