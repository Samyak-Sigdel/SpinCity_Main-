import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { CustomerContext } from "../Context/CustomerContext";
import PopularVehicles from "../Components/PopularVehicles";

const COLORS = {
  bg: "#F7F7F3",
  white: "#FFFFFF",
  emerald: "#08785F",
  emeraldDark: "#06654F",
  emeraldLight: "#E8F3EF",
  navy: "#172033",
  text: "#344054",
  muted: "#667085",
  border: "#E5E5DE",
  input: "#FAFAF7",
  danger: "#C75C5C",
};

const VehicleDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { backendUrl, token } = useContext(CustomerContext);

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [popularVehicles, setPopularVehicles] = useState([]);

  const fetchVehicle = async () => {
    setLoading(true);

    try {
      const { data } = await axios.get(
        backendUrl + `/api/user/products/${productId}`
      );

      if (data.success) {
        setVehicle(data.product);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load vehicle.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularVehicles = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/user/products"
      );

      if (data.success) {
        setPopularVehicles(
          data.products
            .filter((p) => p._id !== productId)
            .slice(0, 4)
        );
      }
    } catch (error) {
      console.error(
        "Error fetching vehicles:",
        error
      );
    }
  };

  useEffect(() => {
    fetchVehicle();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  useEffect(() => {
    if (backendUrl) {
      fetchPopularVehicles();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backendUrl, productId]);

  const totalDays =
    startDate && endDate
      ? Math.ceil(
          (new Date(endDate) - new Date(startDate)) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const rentalSubtotal =
    vehicle && totalDays > 0
      ? vehicle.pricePerDay * totalDays * quantity
      : 0;

  const isAvailable =
    vehicle && vehicle.quantityAvailable > 0;

  const showQuantityField =
    vehicle && vehicle.quantityAvailable > 1;

  const decrementQty = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  const incrementQty = () => {
    setQuantity((q) =>
      Math.min(
        vehicle?.quantityAvailable ?? 1,
        q + 1
      )
    );
  };

  const handleBooking = (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please log in to book a vehicle");
      navigate("/login");
      return;
    }

    if (totalDays <= 0) {
      toast.error("End date must be after start date");
      return;
    }

    navigate(`/checkout/${productId}`, {
      state: {
        startDate,
        endDate,
        quantity,
      },
    });
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: COLORS.bg }}
      >
        <p
          className="text-sm"
          style={{ color: COLORS.muted }}
        >
          Loading vehicle...
        </p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: COLORS.bg }}
      >
        <p
          className="text-sm"
          style={{ color: COLORS.muted }}
        >
          Vehicle not found.
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: COLORS.bg }}
    >
      <div className="max-w-[1220px] mx-auto px-6 md:px-8 py-7">

        {/* =====================================================
            BREADCRUMB
        ===================================================== */}
        <nav
          className="
            flex
            items-center
            gap-[8px]
            flex-wrap
            text-[14px]
            mb-[22px]
          "
          style={{ color: COLORS.muted }}
        >
          <Link
            to="/"
            className="hover:text-[#08785F] transition-colors"
          >
            Home
          </Link>

          <span>/</span>

          <Link
            to="/vehicles"
            className="hover:text-[#08785F] transition-colors"
          >
            Fleet
          </Link>

          <span>/</span>

          <span>{vehicle.category}</span>

          <span>/</span>

          <span
            className="font-medium"
            style={{ color: COLORS.navy }}
          >
            {vehicle.name}
          </span>
        </nav>

        {/* =====================================================
            MAIN VEHICLE SECTION
        ===================================================== */}
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]
            gap-[42px]
          "
        >

          {/* =================================================
              LEFT — VEHICLE IMAGES
          ================================================= */}
          <div className="flex gap-[12px] h-[400px]">

            {/* Thumbnail column */}
            <div className="w-[88px] shrink-0 flex flex-col gap-[10px]">

              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="
                    flex-1
                    bg-white
                    border
                    rounded-[7px]
                    overflow-hidden
                    flex
                    items-center
                    justify-center
                    cursor-pointer
                    transition-all
                    duration-200
                  "
                  style={{
                    borderColor:
                      index === 0
                        ? COLORS.emerald
                        : COLORS.border,
                  }}
                >
                  <img
                    src={vehicle.image}
                    alt={`${vehicle.name} thumbnail ${
                      index + 1
                    }`}
                    className="
                      w-full
                      h-full
                      object-contain
                      p-[5px]
                    "
                  />
                </div>
              ))}
            </div>

            {/* Main vehicle image */}
            <div
              className="
                flex-1
                bg-white
                border
                rounded-[7px]
                overflow-hidden
                flex
                items-center
                justify-center
              "
              style={{
                borderColor: COLORS.border,
              }}
            >
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="
                  w-full
                  h-full
                  object-contain
                  p-[12px]
                  transition-transform
                  duration-500
                  hover:scale-[1.015]
                "
              />
            </div>
          </div>

          {/* =================================================
              RIGHT — VEHICLE INFORMATION
          ================================================= */}
          <div className="pt-[2px]">

            {/* Category */}
            <div className="flex items-center gap-[12px] mb-[5px]">
              <span
                className="w-[34px] h-px"
                style={{
                  backgroundColor: COLORS.emerald,
                }}
              />

              <span
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.24em]
                  font-medium
                "
                style={{
                  color: COLORS.emerald,
                }}
              >
                {vehicle.category}
              </span>
            </div>

            {/* Vehicle title */}
            <h1
              className="
                font-['Oswald']
                text-[32px]
                leading-[1.05]
                tracking-[-0.02em]
                font-semibold
              "
              style={{
                color: COLORS.navy,
              }}
            >
              {vehicle.name}
            </h1>

            {/* Price + availability */}
            <div className="flex items-center gap-[10px] mt-[10px]">

              <div
                className="
                  text-[25px]
                  leading-[30px]
                  font-bold
                "
                style={{
                  color: COLORS.navy,
                }}
              >
                Rs. {vehicle.pricePerDay}

                <span
                  className="
                    text-[12px]
                    font-normal
                    ml-[3px]
                  "
                  style={{
                    color: COLORS.muted,
                  }}
                >
                  / day
                </span>
              </div>

              <span
                className="
                  inline-flex
                  items-center
                  px-[9px]
                  py-[4px]
                  rounded-[4px]
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.03em]
                "
                style={{
                  backgroundColor: isAvailable
                    ? COLORS.emeraldLight
                    : "#FBEAEA",
                  color: isAvailable
                    ? COLORS.emerald
                    : COLORS.danger,
                }}
              >
                {isAvailable
                  ? "Available"
                  : "Unavailable"}
              </span>
            </div>

            {/* Stock */}
            {isAvailable && (
              <p
                className="text-[12px] mt-[2px]"
                style={{
                  color: COLORS.muted,
                }}
              >
                {vehicle.quantityAvailable} of{" "}
                {vehicle.quantityTotal} in stock
              </p>
            )}

            {/* =================================================
                BOOKING SECTION
            ================================================= */}
            <div
              className="
                border-t
                mt-[22px]
                pt-[21px]
              "
              style={{
                borderColor: COLORS.border,
              }}
            >
              <form
                onSubmit={handleBooking}
                className="flex flex-col gap-[14px]"
              >

                {/* Pick-up / Return */}
                <div className="grid grid-cols-2 gap-[12px]">

                  {/* Pick-up */}
                  <div>
                    <label
                      className="
                        block
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.14em]
                        mb-[7px]
                      "
                      style={{
                        color: COLORS.muted,
                      }}
                    >
                      Pick-up
                    </label>

                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) =>
                        setStartDate(e.target.value)
                      }
                      min={
                        new Date()
                          .toISOString()
                          .split("T")[0]
                      }
                      required
                      className="
                        w-full
                        h-[44px]
                        rounded-[4px]
                        px-[12px]
                        text-[12px]
                        focus:outline-none
                        transition-colors
                      "
                      style={{
                        backgroundColor:
                          COLORS.input,
                        border: `1px solid ${COLORS.border}`,
                        color: COLORS.navy,
                      }}
                    />
                  </div>

                  {/* Return */}
                  <div>
                    <label
                      className="
                        block
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.14em]
                        mb-[7px]
                      "
                      style={{
                        color: COLORS.muted,
                      }}
                    >
                      Return
                    </label>

                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) =>
                        setEndDate(e.target.value)
                      }
                      min={
                        startDate ||
                        new Date()
                          .toISOString()
                          .split("T")[0]
                      }
                      required
                      className="
                        w-full
                        h-[44px]
                        rounded-[4px]
                        px-[12px]
                        text-[12px]
                        focus:outline-none
                        transition-colors
                      "
                      style={{
                        backgroundColor:
                          COLORS.input,
                        border: `1px solid ${COLORS.border}`,
                        color: COLORS.navy,
                      }}
                    />
                  </div>
                </div>

                {/* Quantity */}
                {showQuantityField && (
                  <div>
                    <label
                      className="
                        block
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.14em]
                        mb-[7px]
                      "
                      style={{
                        color: COLORS.muted,
                      }}
                    >
                      Number of vehicles
                    </label>

                    <div
                      className="
                        inline-flex
                        items-center
                        rounded-[4px]
                        overflow-hidden
                      "
                      style={{
                        backgroundColor:
                          COLORS.input,
                        border: `1px solid ${COLORS.border}`,
                      }}
                    >
                      <button
                        type="button"
                        onClick={decrementQty}
                        className="
                          w-[38px]
                          h-[40px]
                          flex
                          items-center
                          justify-center
                          text-[18px]
                          transition-colors
                        "
                        style={{
                          color: COLORS.navy,
                        }}
                      >
                        −
                      </button>

                      <span
                        className="
                          w-[42px]
                          h-[40px]
                          flex
                          items-center
                          justify-center
                          text-[12px]
                        "
                        style={{
                          color: COLORS.navy,
                          borderLeft: `1px solid ${COLORS.border}`,
                          borderRight: `1px solid ${COLORS.border}`,
                        }}
                      >
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={incrementQty}
                        className="
                          w-[38px]
                          h-[40px]
                          flex
                          items-center
                          justify-center
                          text-[18px]
                        "
                        style={{
                          color: COLORS.navy,
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Rental summary */}
                {totalDays > 0 && (
                  <div
                    className="
                      border-t
                      pt-[12px]
                      flex
                      flex-col
                      gap-[6px]
                      text-[12px]
                    "
                    style={{
                      borderColor: COLORS.border,
                    }}
                  >
                    <div
                      className="
                        flex
                        items-center
                        justify-between
                      "
                      style={{
                        color: COLORS.muted,
                      }}
                    >
                      <span>
                        {totalDays} day
                        {totalDays > 1 ? "s" : ""}
                        {quantity > 1
                          ? ` × ${quantity} vehicles`
                          : ""}
                      </span>

                      <span>
                        Rs. {rentalSubtotal}
                      </span>
                    </div>

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        border-t
                        pt-[8px]
                        font-semibold
                        text-[14px]
                      "
                      style={{
                        borderColor: COLORS.border,
                        color: COLORS.navy,
                      }}
                    >
                      <span>
                        Estimated total
                      </span>

                      <span>
                        Rs. {rentalSubtotal}
                      </span>
                    </div>
                  </div>
                )}

                {/* BOOK BUTTON */}
                <button
                  type="submit"
                  disabled={
                    vehicle.quantityAvailable === 0
                  }
                  className="
                    w-full
                    h-[46px]
                    rounded-[4px]
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[0.12em]
                    transition-all
                    duration-200
                    disabled:opacity-50
                  "
                  style={{
                    backgroundColor:
                      COLORS.emerald,
                    color: "#FFFFFF",
                  }}
                  onMouseEnter={(e) => {
                    if (
                      vehicle.quantityAvailable > 0
                    ) {
                      e.currentTarget.style.backgroundColor =
                        COLORS.emeraldDark;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      COLORS.emerald;
                  }}
                >
                  {vehicle.quantityAvailable === 0
                    ? "Currently Unavailable"
                    : "Book This Vehicle"}
                </button>

                {!token &&
                  vehicle.quantityAvailable > 0 && (
                    <p
                      className="
                        text-[11px]
                        text-center
                        -mt-[5px]
                      "
                      style={{
                        color: COLORS.muted,
                      }}
                    >
                      You'll be asked to log in
                      before confirming your booking.
                    </p>
                  )}
              </form>
            </div>
          </div>
        </div>

        {/* =====================================================
            INFORMATION BELOW VEHICLE
        ===================================================== */}
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-[1.1fr_0.9fr]
            gap-[42px]
            mt-[42px]
            pt-[30px]
            border-t
          "
          style={{
            borderColor: COLORS.border,
          }}
        >

          {/* About */}
          <div>
            <h2
              className="
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.16em]
                mb-[8px]
              "
              style={{
                color: COLORS.navy,
              }}
            >
              About this vehicle
            </h2>

            <p
              className="
                text-[13px]
                leading-[22px]
              "
              style={{
                color: COLORS.muted,
              }}
            >
              {vehicle.description}
            </p>
          </div>

          {/* Vendor + location */}
          <div
            className="
              bg-white
              border
              rounded-[7px]
              px-[16px]
              py-[14px]
              flex
              flex-col
              gap-[10px]
              h-fit
            "
            style={{
              borderColor: COLORS.border,
            }}
          >

            {/* Vendor */}
            {vehicle.owner?.shopName && (
              <div
                className="text-[12px]"
                style={{
                  color: COLORS.muted,
                }}
              >
                Listed by{" "}
                <span
                  className="font-medium"
                  style={{
                    color: COLORS.navy,
                  }}
                >
                  {vehicle.owner.shopName}
                </span>
              </div>
            )}

            {/* Location */}
            {vehicle.location?.address && (
              <div
                className="
                  flex
                  items-start
                  gap-[8px]
                  text-[12px]
                  leading-[18px]
                "
                style={{
                  color: COLORS.muted,
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mt-[1px] shrink-0"
                >
                  <path
                    d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"
                    stroke={COLORS.emerald}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <circle
                    cx="12"
                    cy="10"
                    r="2.5"
                    stroke={COLORS.emerald}
                    strokeWidth="2"
                  />
                </svg>

                <span>
                  Pickup at {vehicle.location.address}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          POPULAR VEHICLES
      ====================================================== */}
      <PopularVehicles vehicles={popularVehicles} />
    </div>
  );
};

export default VehicleDetails;