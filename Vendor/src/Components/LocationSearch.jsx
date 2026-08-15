import React, { useState, useRef } from "react";
import axios from "axios";

/**
 * Location search input with autocomplete suggestions via OpenStreetMap's
 * free Nominatim API (no API key / billing required).
 *
 * onSelect receives { address, lat, lon } when the user picks a suggestion.
 */
const LocationSearch = ({ placeholder = "City, address, area...", onSelect, initialValue = "" }) => {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const fetchSuggestions = async (value) => {
    if (value.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: value,
          format: "json",
          addressdetails: 1,
          limit: 5,
        },
      });
      setSuggestions(data);
    } catch (error) {
      console.error("Location search failed:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowDropdown(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 400);
  };

  const handleSelect = (place) => {
    setQuery(place.display_name);
    setShowDropdown(false);
    setSuggestions([]);
    onSelect({
      address: place.display_name,
      lat: parseFloat(place.lat),
      lon: parseFloat(place.lon),
    });
  };

  return (
    <div className="relative w-full">
      <input
        value={query}
        onChange={handleChange}
        onFocus={() => query.length >= 3 && setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        placeholder={placeholder}
        className="w-full h-[54px] bg-[#181D21] border border-white/10 text-[#F5F3EE] placeholder:text-[#70767C] px-4 text-sm focus:outline-none focus:border-[#D6B36A] transition-colors"
      />

      {showDropdown && query.length >= 3 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-[#101417] border border-white/10 shadow-2xl z-50 max-h-64 overflow-y-auto">
          {loading && (
            <p className="px-4 py-3 text-xs text-[#858B91] uppercase tracking-[0.15em]">
              Searching...
            </p>
          )}
          {!loading && suggestions.length === 0 && (
            <p className="px-4 py-3 text-xs text-[#858B91] uppercase tracking-[0.15em]">
              No locations found
            </p>
          )}
          {!loading &&
            suggestions.map((place) => (
              <button
                key={place.place_id}
                type="button"
                onMouseDown={() => handleSelect(place)}
                className="w-full text-left px-4 py-3 text-sm text-[#F5F3EE] hover:bg-white/5 border-b border-white/5 last:border-b-0 transition-colors"
              >
                {place.display_name}
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;