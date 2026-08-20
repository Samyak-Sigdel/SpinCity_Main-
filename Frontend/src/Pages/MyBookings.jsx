import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { CustomerContext } from "../Context/CustomerContext";

const statusStyles = {
  Pending: "bg-[#F5E9C9] text-[#9A7628]",
  Confirmed: "bg-[#E5F3ED] text-[#3E8B73]",
  Active: "bg-[#E5F3ED] text-[#3E8B73]",
  Completed: "bg-[#F7F5EF] text-[#667085]",
  Cancelled: "bg-[#FBEAEA] text-[#C75C5C]",
};

const MyBookings = () => {
  const { backendUrl, token } = useContext(CustomerContext);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);

    try {
      const { data } = await axios.get(
        backendUrl + "/api/user/my-bookings",
        {
          headers: { ctoken: token },
        }
      );

      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-booking",
        { bookingId },
        { headers: { ctoken: token } }
      );

      if (data.success) {
        toast.success("Booking cancelled");
        fetchBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel booking.");
    }
  };

  useEffect(() => {
    if (token) {
      fetchBookings();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  /* =========================================================
     NOT LOGGED IN
  ========================================================= */

  if (!token) {
    return (
      <div className="bg-[#F7F5EF] min-h-screen">
        <div className="max-w-md mx-auto py-24 px-6 text-center">

          <p className="text-base text-[#667085] mb-5">
            Please log in to view your bookings.
          </p>

          <Link
            to="/login"
            className="
              inline-flex
              items-center
              justify-center
              px-6
              py-3
              rounded-[5px]
              bg-[#C9A24D]
              text-[#172033]
              text-sm
              font-semibold
              hover:bg-[#B9913F]
              transition-colors
            "
          >
            Log In
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F5EF] min-h-screen">

      <div
        className="
          max-w-[1320px]
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          py-10
          md:py-12
        "
      >

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <div className="mb-8">

          <h1
            className="
              font-serif
              text-3xl
              md:text-4xl
              font-semibold
              text-[#172033]
            "
          >
            My Bookings
          </h1>

          <p
            className="
              mt-2
              text-base
              text-[#667085]
            "
          >
            View and manage your vehicle rentals.
          </p>

        </div>

        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading ? (

          <div
            className="
              bg-white
              border
              border-[#E5E1D8]
              rounded-[8px]
              py-16
              text-center
            "
          >
            <div
              className="
                mx-auto
                mb-4
                h-7
                w-7
                rounded-full
                border-2
                border-[#E5E1D8]
                border-t-[#C9A24D]
                animate-spin
              "
            />

            <p className="text-base text-[#667085]">
              Loading bookings...
            </p>
          </div>

        ) : bookings.length === 0 ? (

          /* =====================================================
              EMPTY STATE
          ===================================================== */

          <div
            className="
              border
              border-dashed
              border-[#E5E1D8]
              rounded-[8px]
              py-20
              px-6
              text-center
              bg-white
            "
          >

            <div
              className="
                w-14
                h-14
                mx-auto
                mb-5
                rounded-full
                bg-[#F7F5EF]
                flex
                items-center
                justify-center
              "
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M3 13h18M5 13l1.5-6h11L19 13M6 13v5m12-5v5M8 18h8"
                  stroke="#C9A24D"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2
              className="
                text-lg
                font-semibold
                text-[#172033]
              "
            >
              No bookings yet
            </h2>

            <p
              className="
                mt-2
                text-base
                text-[#667085]
                mb-6
              "
            >
              You haven't booked a vehicle yet.
            </p>

            <Link
              to="/vehicles"
              className="
                inline-flex
                items-center
                justify-center
                px-6
                py-3
                rounded-[5px]
                bg-[#C9A24D]
                text-[#172033]
                text-sm
                font-semibold
                hover:bg-[#B9913F]
                transition-colors
              "
            >
              Browse Vehicles
            </Link>

          </div>

        ) : (

          /* =====================================================
              BOOKINGS LIST
          ===================================================== */

          <div
            className="
              bg-white
              border
              border-[#E5E1D8]
              rounded-[10px]
              overflow-hidden
              shadow-[0_2px_8px_rgba(23,32,51,0.04)]
            "
          >

            {/* =================================================
                TABLE HEADER
            ================================================= */}

            <div
              className="
                hidden
                lg:grid
                grid-cols-[2.3fr_1.4fr_1.6fr_1fr_1fr_120px]
                gap-5
                items-center
                px-6
                py-4
                bg-[#FAF9F5]
                border-b
                border-[#E5E1D8]
              "
            >

              <span
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.05em]
                  text-[#667085]
                "
              >
                Vehicle
              </span>

              <span
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.05em]
                  text-[#667085]
                "
              >
                Booking Code
              </span>

              <span
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.05em]
                  text-[#667085]
                "
              >
                Rental Period
              </span>

              <span
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.05em]
                  text-[#667085]
                "
              >
                Total
              </span>

              <span
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.05em]
                  text-[#667085]
                "
              >
                Status
              </span>

              <span
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.05em]
                  text-[#667085]
                  text-right
                "
              >
                Action
              </span>

            </div>

            {/* =================================================
                BOOKING ROWS
            ================================================= */}

            <div>

              {bookings.map((booking, index) => (

                <div
                  key={booking._id}
                  className={`
                    group
                    px-4
                    sm:px-6
                    py-5
                    transition-colors
                    hover:bg-[#FCFBF8]
                    ${
                      index !== bookings.length - 1
                        ? "border-b border-[#E5E1D8]"
                        : ""
                    }
                  `}
                >

                  {/* =================================================
                      DESKTOP ROW
                  ================================================= */}

                  <div
                    className="
                      hidden
                      lg:grid
                      grid-cols-[2.3fr_1.4fr_1.6fr_1fr_1fr_120px]
                      gap-5
                      items-center
                    "
                  >

                    {/* VEHICLE */}

                    <div className="flex items-center min-w-0">

                      <div
                        className="
                          w-[100px]
                          h-[76px]
                          shrink-0
                          rounded-[6px]
                          bg-[#F7F5EF]
                          border
                          border-[#E5E1D8]
                          flex
                          items-center
                          justify-center
                          overflow-hidden
                        "
                      >
                        <img
                          src={booking.product?.image}
                          alt={booking.product?.name}
                          className="
                            w-full
                            h-full
                            object-contain
                            p-2
                          "
                        />
                      </div>

                      <div className="ml-4 min-w-0">

                        <h3
                          className="
                            text-base
                            font-semibold
                            text-[#172033]
                            truncate
                          "
                        >
                          {booking.product?.name}
                        </h3>

                        <p
                          className="
                            text-sm
                            text-[#667085]
                            mt-1
                          "
                        >
                          {booking.product?.category}
                        </p>

                      </div>

                    </div>

                    {/* BOOKING CODE */}

                    <div>

                      <p
                        className="
                          text-sm
                          font-medium
                          text-[#172033]
                          break-all
                        "
                      >
                        {booking.bookingCode}
                      </p>

                    </div>

                    {/* RENTAL PERIOD */}

                    <div>

                      <p
                        className="
                          text-sm
                          text-[#344054]
                          leading-5
                        "
                      >
                        {new Date(
                          booking.startDate
                        ).toLocaleDateString()}
                      </p>

                      <p
                        className="
                          text-xs
                          text-[#98A2B3]
                          mt-0.5
                        "
                      >
                        to{" "}
                        {new Date(
                          booking.endDate
                        ).toLocaleDateString()}
                      </p>

                    </div>

                    {/* TOTAL */}

                    <div>

                      <p
                        className="
                          text-base
                          font-semibold
                          text-[#172033]
                          whitespace-nowrap
                        "
                      >
                        Rs. {booking.totalPrice}
                      </p>

                    </div>

                    {/* STATUS */}

                    <div>

                      <span
                        className={`
                          inline-flex
                          items-center
                          px-3
                          py-1
                          rounded-full
                          text-xs
                          font-semibold
                          ${
                            statusStyles[booking.status] ||
                            statusStyles.Pending
                          }
                        `}
                      >
                        {booking.status}
                      </span>

                    </div>

                    {/* ACTION */}

                    <div className="flex justify-end">

                      {["Pending", "Confirmed"].includes(
                        booking.status
                      ) ? (

                        <button
                          onClick={() =>
                            cancelBooking(booking._id)
                          }
                          className="
                            text-sm
                            font-semibold
                            text-[#C75C5C]
                            hover:text-[#A94444]
                            hover:underline
                            transition-colors
                          "
                        >
                          Cancel
                        </button>

                      ) : (

                        <span
                          className="
                            text-sm
                            text-[#98A2B3]
                          "
                        >
                          —
                        </span>

                      )}

                    </div>

                  </div>

                  {/* =================================================
                      MOBILE / TABLET ROW
                  ================================================= */}

                  <div
                    className="
                      lg:hidden
                      flex
                      flex-col
                      gap-5
                    "
                  >

                    {/* TOP SECTION */}

                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-4
                      "
                    >

                      <div className="flex items-center min-w-0">

                        {/* IMAGE */}

                        <div
                          className="
                            w-[90px]
                            h-[75px]
                            shrink-0
                            rounded-[6px]
                            bg-[#F7F5EF]
                            border
                            border-[#E5E1D8]
                            flex
                            items-center
                            justify-center
                            overflow-hidden
                          "
                        >
                          <img
                            src={booking.product?.image}
                            alt={booking.product?.name}
                            className="
                              w-full
                              h-full
                              object-contain
                              p-2
                            "
                          />
                        </div>

                        {/* NAME */}

                        <div className="ml-4 min-w-0">

                          <h3
                            className="
                              text-base
                              sm:text-lg
                              font-semibold
                              text-[#172033]
                              truncate
                            "
                          >
                            {booking.product?.name}
                          </h3>

                          <p
                            className="
                              text-sm
                              text-[#667085]
                              mt-1
                            "
                          >
                            {booking.product?.category}
                          </p>

                        </div>

                      </div>

                      {/* STATUS */}

                      <span
                        className={`
                          shrink-0
                          inline-flex
                          items-center
                          px-3
                          py-1
                          rounded-full
                          text-xs
                          font-semibold
                          ${
                            statusStyles[booking.status] ||
                            statusStyles.Pending
                          }
                        `}
                      >
                        {booking.status}
                      </span>

                    </div>

                    {/* DETAILS */}

                    <div
                      className="
                        grid
                        grid-cols-2
                        sm:grid-cols-4
                        gap-4
                        pt-4
                        border-t
                        border-[#E5E1D8]
                      "
                    >

                      <div>

                        <p
                          className="
                            text-xs
                            font-medium
                            uppercase
                            tracking-[0.04em]
                            text-[#98A2B3]
                          "
                        >
                          Booking Code
                        </p>

                        <p
                          className="
                            text-sm
                            font-medium
                            text-[#172033]
                            mt-1
                            break-all
                          "
                        >
                          {booking.bookingCode}
                        </p>

                      </div>

                      <div>

                        <p
                          className="
                            text-xs
                            font-medium
                            uppercase
                            tracking-[0.04em]
                            text-[#98A2B3]
                          "
                        >
                          Rental Period
                        </p>

                        <p
                          className="
                            text-sm
                            text-[#344054]
                            mt-1
                          "
                        >
                          {new Date(
                            booking.startDate
                          ).toLocaleDateString()}
                        </p>

                        <p
                          className="
                            text-xs
                            text-[#98A2B3]
                          "
                        >
                          to{" "}
                          {new Date(
                            booking.endDate
                          ).toLocaleDateString()}
                        </p>

                      </div>

                      <div>

                        <p
                          className="
                            text-xs
                            font-medium
                            uppercase
                            tracking-[0.04em]
                            text-[#98A2B3]
                          "
                        >
                          Total
                        </p>

                        <p
                          className="
                            text-base
                            font-semibold
                            text-[#172033]
                            mt-1
                          "
                        >
                          Rs. {booking.totalPrice}
                        </p>

                      </div>

                      <div className="flex items-end sm:justify-end">

                        {["Pending", "Confirmed"].includes(
                          booking.status
                        ) && (
                          <button
                            onClick={() =>
                              cancelBooking(booking._id)
                            }
                            className="
                              text-sm
                              font-semibold
                              text-[#C75C5C]
                              hover:text-[#A94444]
                              hover:underline
                            "
                          >
                            Cancel Booking
                          </button>
                        )}

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        )}

      </div>

    </div>
  );
};

export default MyBookings;