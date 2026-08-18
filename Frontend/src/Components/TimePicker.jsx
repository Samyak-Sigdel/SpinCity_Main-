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
        className={`w-full h-[44px] text-left border rounded-[4px] bg-[#F7F5EF] px-3 text-[15px] transition-colors ${
          open ? "border-[#C9A24D]" : "border-[#E5E1D8] hover:border-[#C9A24D]/60"
        } ${value ? "text-[#172033]" : "text-[#98A2B3]"}`}
      >
        {value || "Select time"}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-72 bg-white border border-[#E5E1D8] rounded-[8px] shadow-[0_8px_24px_rgba(23,32,51,0.10)] z-50 overflow-hidden">
          {label && (
            <div className="px-4 py-3 border-b border-[#E5E1D8] text-center bg-[#F5E9C9]/40">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#C9A24D]">
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
                className={`px-3 py-2.5 rounded-[4px] text-[13px] font-medium transition-colors ${
                  value === slot
                    ? "bg-[#C9A24D] text-[#172033]"
                    : "bg-[#F7F5EF] text-[#344054] hover:bg-[#F5E9C9]/60 hover:text-[#172033]"
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