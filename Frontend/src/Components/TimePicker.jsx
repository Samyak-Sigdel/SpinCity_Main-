import React, { useState, useRef, useEffect } from "react";

const generateSlots = () => {
  const slots = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let min of [0, 30]) {
      const period = hour < 12 ? "AM" : "PM";
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      const displayMin = min === 0 ? "00" : "30";
      slots.push(`${displayHour}:${displayMin} ${period}`);
    }
  }
  return slots;
};

const SLOTS = generateSlots();

/**
 * Time picker matching the Spin City "reservation panel" styling:
 * dark glass field + a scrollable grid of 30-minute slots on a
 * dark popover, gold accents for the active state.
 */
const TimePicker = ({ label, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (slot) => {
    onChange(slot);
    setOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full h-[54px] text-left border bg-[#181D21] px-4 text-sm transition-colors ${
          open ? "border-[#D6B36A]" : "border-white/10 hover:border-[#D6B36A]/60"
        } ${value ? "text-[#F5F3EE]" : "text-[#70767C]"}`}
      >
        {value || "Select time"}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-72 bg-[#101417] border border-white/10 shadow-2xl z-50 overflow-hidden">
          {label && (
            <div className="px-4 py-3 border-b border-white/10 text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#D6B36A]">
                {label}
              </p>
            </div>
          )}
          <div className="max-h-64 overflow-y-auto p-3 grid grid-cols-2 gap-2">
            {SLOTS.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => handleSelect(slot)}
                className={`px-3 py-2.5 text-sm font-medium transition-colors ${
                  value === slot
                    ? "bg-[#D6B36A] text-[#0B0D0F]"
                    : "bg-[#181D21] text-[#B5B8BB] hover:bg-white/5 hover:text-[#F5F3EE]"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimePicker;