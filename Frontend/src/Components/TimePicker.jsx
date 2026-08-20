import React, {
  useState,
  useRef,
  useEffect,
} from "react";

/* =========================================================
   GENERATE TIME SLOTS
========================================================= */

const generateSlots = () => {
  const slots = [];

  for (let hour = 0; hour < 24; hour++) {
    for (let min of [0, 30]) {
      const period =
        hour < 12 ? "AM" : "PM";

      const displayHour =
        hour % 12 === 0
          ? 12
          : hour % 12;

      const displayMin =
        min === 0 ? "00" : "30";

      slots.push(
        `${displayHour}:${displayMin} ${period}`
      );
    }
  }

  return slots;
};

const SLOTS = generateSlots();

/* =========================================================
   TIME PICKER
========================================================= */

const TimePicker = ({
  label,
  value,
  onChange,
}) => {
  const [open, setOpen] =
    useState(false);

  const wrapperRef =
    useRef(null);

  /* =========================================================
     CLOSE WHEN CLICKING OUTSIDE
  ========================================================== */

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =========================================================
     SELECT TIME
  ========================================================== */

  const handleSelect = (slot) => {
    onChange(slot);
    setOpen(false);
  };

  /* =========================================================
     RENDER
  ========================================================== */

  return (
    <div
      className="relative"
      ref={wrapperRef}
    >
      {/* =====================================================
          SELECT BUTTON
      ====================================================== */}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`
          w-full
          h-[54px]
          flex
          items-center
          justify-between
          text-left
          border
          rounded-[7px]
          bg-white
          px-4
          font-['Inter']
          text-[13px]
          transition-all
          focus:outline-none
          ${
            open
              ? "border-[#145A4A] ring-[3px] ring-[#EDF5F1]"
              : "border-[#E5E2D9] hover:border-[#145A4A]"
          }
          ${
            value
              ? "text-[#142033]"
              : "text-[#64748B]"
          }
        `}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>
          {value || "Select time"}
        </span>

        {/* CHEVRON */}

        <svg
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          className={`
            shrink-0
            text-[#64748B]
            transition-transform
            duration-200
            ${
              open
                ? "rotate-180"
                : ""
            }
          `}
        >
          <path
            d="m5 7.5 5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* =====================================================
          DROPDOWN
      ====================================================== */}

      {open && (
        <div
          className="
            absolute
            left-0
            top-full
            mt-2
            w-[280px]
            max-w-[calc(100vw-32px)]
            bg-white
            border
            border-[#E5E2D9]
            rounded-[9px]
            shadow-[0_12px_30px_rgba(20,32,51,0.14)]
            z-[100]
            overflow-hidden
          "
        >
          {/* =================================================
              DROPDOWN HEADER
          ================================================== */}

          {label && (
            <div
              className="
                px-4
                py-3
                border-b
                border-[#E5E2D9]
                bg-[#EDF5F1]
              "
            >
              <p
                className="
                  font-['Inter']
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-[#145A4A]
                  text-center
                "
              >
                {label}
              </p>
            </div>
          )}

          {/* =================================================
              TIME OPTIONS
          ================================================== */}

          <div
            className="
              max-h-[270px]
              overflow-y-auto
              p-3
              grid
              grid-cols-2
              gap-2
              bg-white
            "
          >
            {SLOTS.map((slot) => {
              const selected =
                value === slot;

              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() =>
                    handleSelect(slot)
                  }
                  className={`
                    h-[39px]
                    px-3
                    rounded-[6px]
                    font-['Inter']
                    text-[12px]
                    font-medium
                    transition-all
                    ${
                      selected
                        ? "bg-[#145A4A] text-white"
                        : "bg-[#F8F7F2] text-[#142033] hover:bg-[#EDF5F1] hover:text-[#145A4A]"
                    }
                  `}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimePicker;