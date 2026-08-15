import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

// Vite/webpack break Leaflet's default marker icon paths — point at the CDN instead
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const DEFAULT_CENTER = [27.7172, 85.324]; // Kathmandu — adjust if your primary market differs

// Recenters the map whenever the selected position changes externally
// (e.g. after "Current Location" or picking a search suggestion)
const RecenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 15);
  }, [position, map]);
  return null;
};

// Captures clicks anywhere on the map to drop/move the pin
const MapClickHandler = ({ onPick }) => {
  useMapEvents({
    click(e) {
      onPick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const reverseGeocode = async (lat, lng) => {
  const { data } = await axios.get("https://nominatim.openstreetmap.org/reverse", {
    params: { lat, lon: lng, format: "json" },
  });
  return data.display_name;
};

/**
 * Full location picker: search + current location + click-on-map, all
 * backed by OpenStreetMap / Nominatim (free, no API key).
 *
 * onConfirm receives { address, lat, lon } when the user hits Continue.
 */
const LocationPickerModal = ({ isOpen, onClose, onConfirm, initialAddress = "" }) => {
  const [query, setQuery] = useState(initialAddress);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [position, setPosition] = useState(null); // [lat, lng]
  const [address, setAddress] = useState(initialAddress);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setQuery(initialAddress);
    setAddress(initialAddress);
  }, [isOpen, initialAddress]);

  if (!isOpen) return null;

  const fetchSuggestions = async (value) => {
    if (value.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    setSearching(true);
    try {
      const { data } = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: { q: value, format: "json", addressdetails: 1, limit: 5 },
      });
      setSuggestions(data);
    } catch (error) {
      console.error("Location search failed:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 400);
  };

  const selectSuggestion = (place) => {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    setPosition([lat, lon]);
    setAddress(place.display_name);
    setQuery(place.display_name);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handlePickOnMap = async (latlng) => {
    setPosition(latlng);
    try {
      const resolved = await reverseGeocode(latlng[0], latlng[1]);
      setAddress(resolved);
      setQuery(resolved);
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      setAddress(`${latlng[0].toFixed(5)}, ${latlng[1].toFixed(5)}`);
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation isn't supported by your browser");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const latlng = [pos.coords.latitude, pos.coords.longitude];
        await handlePickOnMap(latlng);
        setLocating(false);
      },
      (error) => {
        console.error(error);
        alert("Couldn't get your current location. Please allow location access.");
        setLocating(false);
      }
    );
  };

  const handleConfirm = () => {
    if (!position) return;
    onConfirm({ address, lat: position[0], lon: position[1] });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#101417] border border-white/10 rounded-none w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#D6B36A] mb-1">
              Reserve your ride
            </p>
            <h2 className="font-serif text-2xl text-[#F5F3EE]">
              Choose a location
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#858B91] hover:text-[#D6B36A] transition-colors"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-6 pt-5 relative">
          <label className="block text-[10px] uppercase tracking-[0.18em] text-[#858B91] mb-2">
            Location
          </label>
          <input
            value={query}
            onChange={handleQueryChange}
            onFocus={() => query.length >= 3 && setShowSuggestions(true)}
            placeholder="Search for an address, city, or landmark"
            className="w-full h-[54px] bg-[#181D21] border border-white/10 px-4 text-sm text-[#F5F3EE] placeholder:text-[#5C6167] focus:outline-none focus:border-[#D6B36A] transition-colors"
          />

          {showSuggestions && query.length >= 3 && (
            <div className="absolute left-6 right-6 top-full mt-1 bg-[#181D21] border border-white/10 shadow-2xl z-10 max-h-56 overflow-y-auto">
              {searching && (
                <p className="px-4 py-3 text-xs text-[#858B91]">Searching...</p>
              )}
              {!searching && suggestions.length === 0 && (
                <p className="px-4 py-3 text-xs text-[#858B91]">No locations found</p>
              )}
              {!searching &&
                suggestions.map((place) => (
                  <button
                    key={place.place_id}
                    type="button"
                    onClick={() => selectSuggestion(place)}
                    className="w-full text-left px-4 py-3 text-sm text-[#F5F3EE] hover:bg-[#20262B] border-b border-white/5 last:border-b-0 flex items-start gap-2 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 12 12" fill="none" className="mt-0.5 shrink-0">
                      <path d="M6 0.75C3.79 0.75 2 2.54 2 4.75c0 3 4 6.5 4 6.5s4-3.5 4-6.5c0-2.21-1.79-4-4-4z" stroke="#D6B36A" strokeWidth="1" />
                      <circle cx="6" cy="4.75" r="1.3" stroke="#D6B36A" strokeWidth="1" />
                    </svg>
                    {place.display_name}
                  </button>
                ))}
            </div>
          )}
        </div>

        {/* Current location */}
        <div className="px-6 pt-4">
          <button
            type="button"
            onClick={useCurrentLocation}
            disabled={locating}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#181D21] border border-white/10 text-sm font-medium text-[#F5F3EE] hover:border-[#D6B36A]/60 transition-colors disabled:opacity-60"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="2" fill="#D6B36A" />
              <circle cx="8" cy="8" r="6" stroke="#D6B36A" strokeWidth="1.3" />
              <path d="M8 0v2.5M8 13.5V16M0 8h2.5M13.5 8H16" stroke="#D6B36A" strokeWidth="1.3" />
            </svg>
            {locating ? "Locating..." : "Use Current Location"}
          </button>
        </div>

        {/* Map */}
        <div className="px-6 py-5 flex-1 min-h-0">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#858B91] mb-2">
            Or click on the map to drop a pin
          </p>
          <div className="h-64 overflow-hidden border border-white/10">
            <MapContainer
              center={position || DEFAULT_CENTER}
              zoom={position ? 15 : 12}
              scrollWheelZoom
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapClickHandler onPick={handlePickOnMap} />
              {position && <Marker position={position} icon={markerIcon} />}
              <RecenterMap position={position} />
            </MapContainer>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-white/10 flex items-center justify-between gap-4">
          <p className="text-xs text-[#858B91] truncate">
            {address || "No location selected yet"}
          </p>
          <button
            onClick={handleConfirm}
            disabled={!position}
            className="shrink-0 h-[46px] px-7 bg-[#D6B36A] hover:bg-[#E5C783] text-[#0B0D0F] text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors disabled:opacity-40 flex items-center gap-3"
          >
            Continue
            <span className="text-base">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPickerModal;