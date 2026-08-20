import React, { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

/* =========================================================
   LEAFLET MARKER ICON
========================================================= */

const markerIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

/* =========================================================
   DEFAULT MAP CENTER
========================================================= */

const DEFAULT_CENTER = [27.7172, 85.324];

/* =========================================================
   RECENTER MAP
========================================================= */

const RecenterMap = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 15);
    }
  }, [position, map]);

  return null;
};

/* =========================================================
   MAP CLICK HANDLER
========================================================= */

const MapClickHandler = ({ onPick }) => {
  useMapEvents({
    click(e) {
      onPick([e.latlng.lat, e.latlng.lng]);
    },
  });

  return null;
};

/* =========================================================
   REVERSE GEOCODING
========================================================= */

const reverseGeocode = async (lat, lng) => {
  const { data } = await axios.get(
    "https://nominatim.openstreetmap.org/reverse",
    {
      params: {
        lat,
        lon: lng,
        format: "json",
      },
    }
  );

  return data.display_name;
};

/* =========================================================
   LOCATION PICKER MODAL
========================================================= */

const LocationPickerModal = ({
  isOpen,
  onClose,
  onConfirm,
  initialAddress = "",
}) => {
  const [query, setQuery] = useState(initialAddress);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] =
    useState(false);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState(initialAddress);

  const debounceRef = useRef(null);

  /* =========================================================
     RESET WHEN MODAL OPENS
  ========================================================== */

  useEffect(() => {
    if (!isOpen) return;

    setQuery(initialAddress);
    setAddress(initialAddress);
    setSuggestions([]);
    setShowSuggestions(false);
    setPosition(null);
  }, [isOpen, initialAddress]);

  /* =========================================================
     CLEAN DEBOUNCE
  ========================================================== */

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  /* =========================================================
     FETCH LOCATION SUGGESTIONS
  ========================================================== */

  const fetchSuggestions = async (value) => {
    if (value.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    setSearching(true);

    try {
      const { data } = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: value,
            format: "json",
            addressdetails: 1,
            limit: 5,
          },
        }
      );

      setSuggestions(data);
    } catch (error) {
      console.error(
        "Location search failed:",
        error
      );

      setSuggestions([]);
    } finally {
      setSearching(false);
    }
  };

  /* =========================================================
     SEARCH INPUT
  ========================================================== */

  const handleQueryChange = (e) => {
    const value = e.target.value;

    setQuery(value);
    setShowSuggestions(true);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 400);
  };

  /* =========================================================
     SELECT SUGGESTION
  ========================================================== */

  const selectSuggestion = (place) => {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);

    setPosition([lat, lon]);
    setAddress(place.display_name);
    setQuery(place.display_name);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  /* =========================================================
     MAP PICK
  ========================================================== */

  const handlePickOnMap = async (latlng) => {
    setPosition(latlng);

    try {
      const resolved = await reverseGeocode(
        latlng[0],
        latlng[1]
      );

      setAddress(resolved);
      setQuery(resolved);
    } catch (error) {
      console.error(
        "Reverse geocoding failed:",
        error
      );

      const fallback = `${latlng[0].toFixed(
        5
      )}, ${latlng[1].toFixed(5)}`;

      setAddress(fallback);
      setQuery(fallback);
    }
  };

  /* =========================================================
     CURRENT LOCATION
  ========================================================== */

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert(
        "Geolocation isn't supported by your browser"
      );
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const latlng = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];

        await handlePickOnMap(latlng);

        setLocating(false);
      },
      (error) => {
        console.error(error);

        alert(
          "Couldn't get your current location. Please allow location access."
        );

        setLocating(false);
      }
    );
  };

  /* =========================================================
     CONFIRM
  ========================================================== */

  const handleConfirm = () => {
    if (!position) return;

    onConfirm({
      address,
      lat: position[0],
      lon: position[1],
    });

    onClose();
  };

  /* =========================================================
     RENDER
  ========================================================== */

  return (
    <div
      className="
        fixed
        inset-0
        z-[999]
        bg-[#142033]/45
        backdrop-blur-[3px]
        flex
        items-center
        justify-center
        p-4
      "
    >
      <div
        className="
          bg-white
          border
          border-[#E5E2D9]
          rounded-[12px]
          w-full
          max-w-[620px]
          overflow-hidden
          flex
          flex-col
          max-h-[92vh]
          shadow-[0_20px_50px_rgba(20,32,51,0.16)]
        "
      >
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div
          className="
            px-6
            md:px-7
            py-5
            border-b
            border-[#E5E2D9]
            flex
            items-center
            justify-between
            shrink-0
          "
        >
          <div>
            <p
              className="
                font-['Inter']
                text-[10px]
                uppercase
                tracking-[0.22em]
                font-semibold
                text-[#145A4A]
                mb-[5px]
              "
            >
              Reserve your ride
            </p>

            <h2
              className="
                font-['Oswald']
                text-[27px]
                font-semibold
                leading-none
                text-[#142033]
              "
            >
              Choose a location
            </h2>
          </div>

          {/* CLOSE BUTTON */}

          <button
            type="button"
            onClick={onClose}
            className="
              w-[38px]
              h-[38px]
              rounded-full
              flex
              items-center
              justify-center
              text-[#64748B]
              bg-[#F8F7F2]
              hover:bg-[#EDF5F1]
              hover:text-[#145A4A]
              transition-colors
            "
            aria-label="Close"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* =====================================================
            SEARCH
        ====================================================== */}

        <div className="px-6 md:px-7 pt-5 relative">
          <label
            className="
              block
              font-['Inter']
              text-[11px]
              uppercase
              tracking-[0.10em]
              text-[#142033]
              font-semibold
              mb-2
            "
          >
            Location
          </label>

          <div className="relative">
            {/* SEARCH ICON */}

            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="
                absolute
                left-[15px]
                top-1/2
                -translate-y-1/2
                text-[#64748B]
                pointer-events-none
              "
            >
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="m16.5 16.5 4 4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>

            <input
              value={query}
              onChange={handleQueryChange}
              onFocus={() =>
                query.length >= 3 &&
                setShowSuggestions(true)
              }
              placeholder="Search for an address, city, or landmark"
              className="
                w-full
                h-[52px]
                bg-white
                border
                border-[#E5E2D9]
                rounded-[7px]
                pl-[45px]
                pr-4
                font-['Inter']
                text-[14px]
                text-[#142033]
                placeholder:text-[#64748B]
                focus:outline-none
                focus:border-[#145A4A]
                focus:ring-[3px]
                focus:ring-[#EDF5F1]
                transition-all
              "
            />
          </div>

          {/* ===================================================
              SUGGESTIONS
          ==================================================== */}

          {showSuggestions &&
            query.length >= 3 && (
              <div
                className="
                  absolute
                  left-6
                  right-6
                  md:left-7
                  md:right-7
                  top-full
                  mt-2
                  bg-white
                  border
                  border-[#E5E2D9]
                  rounded-[8px]
                  shadow-[0_12px_30px_rgba(20,32,51,0.12)]
                  z-50
                  max-h-[230px]
                  overflow-y-auto
                "
              >
                {searching && (
                  <div
                    className="
                      px-4
                      py-4
                      font-['Inter']
                      text-[13px]
                      text-[#64748B]
                    "
                  >
                    Searching...
                  </div>
                )}

                {!searching &&
                  suggestions.length === 0 && (
                    <div
                      className="
                        px-4
                        py-4
                        font-['Inter']
                        text-[13px]
                        text-[#64748B]
                      "
                    >
                      No locations found
                    </div>
                  )}

                {!searching &&
                  suggestions.map((place) => (
                    <button
                      key={place.place_id}
                      type="button"
                      onClick={() =>
                        selectSuggestion(place)
                      }
                      className="
                        w-full
                        text-left
                        px-4
                        py-3
                        text-[13px]
                        font-['Inter']
                        text-[#142033]
                        hover:bg-[#EDF5F1]
                        border-b
                        border-[#E5E2D9]
                        last:border-b-0
                        flex
                        items-start
                        gap-3
                        transition-colors
                      "
                    >
                      {/* LOCATION ICON */}

                      <div
                        className="
                          w-[28px]
                          h-[28px]
                          rounded-full
                          bg-[#EDF5F1]
                          flex
                          items-center
                          justify-center
                          shrink-0
                        "
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M6 .75C3.79.75 2 2.54 2 4.75c0 3 4 6.5 4 6.5s4-3.5 4-6.5c0-2.21-1.79-4-4-4Z"
                            stroke="#145A4A"
                            strokeWidth="1"
                          />

                          <circle
                            cx="6"
                            cy="4.75"
                            r="1.3"
                            stroke="#145A4A"
                            strokeWidth="1"
                          />
                        </svg>
                      </div>

                      <span className="leading-[1.45]">
                        {place.display_name}
                      </span>
                    </button>
                  ))}
              </div>
            )}
        </div>

        {/* =====================================================
            CURRENT LOCATION
        ====================================================== */}

        <div className="px-6 md:px-7 pt-4">
          <button
            type="button"
            onClick={useCurrentLocation}
            disabled={locating}
            className="
              flex
              items-center
              gap-2
              px-4
              h-[42px]
              bg-[#EDF5F1]
              border
              border-[#D8EAE3]
              rounded-[7px]
              font-['Inter']
              text-[13px]
              font-medium
              text-[#145A4A]
              hover:bg-[#E1F0EA]
              transition-colors
              disabled:opacity-60
            "
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 16 16"
              fill="none"
            >
              <circle
                cx="8"
                cy="8"
                r="2"
                fill="#145A4A"
              />

              <circle
                cx="8"
                cy="8"
                r="6"
                stroke="#145A4A"
                strokeWidth="1.3"
              />

              <path
                d="M8 0v2.5M8 13.5V16M0 8h2.5M13.5 8H16"
                stroke="#145A4A"
                strokeWidth="1.3"
              />
            </svg>

            {locating
              ? "Locating..."
              : "Use Current Location"}
          </button>
        </div>

        {/* =====================================================
            MAP
        ====================================================== */}

        <div className="px-6 md:px-7 py-5 flex-1 min-h-0">
          <p
            className="
              font-['Inter']
              text-[11px]
              uppercase
              tracking-[0.10em]
              text-[#64748B]
              font-medium
              mb-2
            "
          >
            Or click on the map to drop a pin
          </p>

          <div
            className="
              h-[250px]
              overflow-hidden
              border
              border-[#E5E2D9]
              rounded-[9px]
              bg-[#F8F7F2]
            "
          >
            <MapContainer
              center={
                position || DEFAULT_CENTER
              }
              zoom={position ? 15 : 12}
              scrollWheelZoom
              style={{
                height: "100%",
                width: "100%",
              }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapClickHandler
                onPick={handlePickOnMap}
              />

              {position && (
                <Marker
                  position={position}
                  icon={markerIcon}
                />
              )}

              <RecenterMap
                position={position}
              />
            </MapContainer>
          </div>
        </div>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <div
          className="
            px-6
            md:px-7
            py-4
            border-t
            border-[#E5E2D9]
            flex
            flex-col
            sm:flex-row
            sm:items-center
            justify-between
            gap-4
            shrink-0
          "
        >
          <div className="min-w-0">
            <p
              className="
                font-['Inter']
                text-[12px]
                text-[#64748B]
                truncate
                max-w-[360px]
              "
            >
              {address ||
                "No location selected yet"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!position}
            className="
              shrink-0
              h-[46px]
              px-7
              bg-[#145A4A]
              hover:bg-[#0D3F35]
              text-white
              rounded-[7px]
              font-['Inter']
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.10em]
              transition-all
              disabled:opacity-40
              disabled:cursor-not-allowed
              flex
              items-center
              justify-center
              gap-3
            "
          >
            Continue

            <span className="text-[17px]">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPickerModal;