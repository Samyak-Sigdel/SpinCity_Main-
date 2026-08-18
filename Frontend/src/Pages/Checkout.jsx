import React, { useContext, useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { CustomerContext } from "../Context/CustomerContext";

const COUNTRY_CODES = [
  { code: "+977", flag: "🇳🇵", label: "Nepal" },
  { code: "+91", flag: "🇮🇳", label: "India" },
  { code: "+1", flag: "🇺🇸", label: "USA" },
  { code: "+44", flag: "🇬🇧", label: "UK" },
];

const COUNTRIES = ["Nepal", "India", "United States", "United Kingdom", "China", "Other"];

const Field = ({ label, children, required = true }) => (
  <div>
    <label className="block text-sm font-medium text-[#172033] mb-1.5">
      {label} {required && <span className="text-[#C75C5C]">*</span>}
    </label>
    {children}
  </div>
);

const CheckIcon = () => (
  <span className="w-5 h-5 rounded-full bg-[#3E8B73] flex items-center justify-center shrink-0">
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path d="M1.5 5.5l2.5 2.5 5.5-5.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);

const Checkout = () => {
  const { productId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { backendUrl, token } = useContext(CustomerContext);

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [licensePreview, setLicensePreview] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    countryCode: "+977",
    phone: "",
    age: "",
    countryOfResidence: "Nepal",
  });

  useEffect(() => {
    if (!token) {
      toast.error("Please log in to continue booking");
      navigate("/login");
      return;
    }
    if (!state?.startDate || !state?.endDate) {
      toast.error("Please select your trip dates first");
      navigate(`/vehicles/${productId}`);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const { data } = await axios.get(backendUrl + `/api/user/products/${productId}`);
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
    fetchVehicle();
  }, [backendUrl, productId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLicenseChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLicenseFile(file);
    setLicensePreview(URL.createObjectURL(file));
  };

  const totalDays =
    state?.startDate && state?.endDate
      ? Math.ceil((new Date(state.endDate) - new Date(state.startDate)) / (1000 * 60 * 60 * 24))
      : 0;
  const quantity = state?.quantity || 1;
  const estimatedTotal = vehicle ? vehicle.pricePerDay * totalDays * quantity : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.email !== formData.confirmEmail) {
      toast.error("Email addresses don't match");
      return;
    }
    if (!licenseFile) {
      toast.error("Please upload a photo of your driver's license");
      return;
    }
    if (Number(formData.age) < 18) {
      toast.error("Driver must be at least 18 years old");
      return;
    }

    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("productId", productId);
      payload.append("startDate", state.startDate);
      payload.append("endDate", state.endDate);
      payload.append("quantity", quantity);
      payload.append("firstName", formData.firstName);
      payload.append("lastName", formData.lastName);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone);
      payload.append("countryCode", formData.countryCode);
      payload.append("age", formData.age);
      payload.append("countryOfResidence", formData.countryOfResidence);
      payload.append("licenseImage", licenseFile);

      const { data } = await axios.post(backendUrl + "/api/user/book", payload, {
        headers: { ctoken: token },
      });

      if (data.success) {
        toast.success("Booking confirmed!");
        navigate("/my-bookings");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create booking.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#F7F5EF] min-h-screen">
        <p className="text-sm text-[#667085] p-8 text-center">Loading...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="bg-[#F7F5EF] min-h-screen">
        <p className="text-sm text-[#667085] p-8 text-center">Vehicle not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F5EF] min-h-screen">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">

        {/* Driver details form */}
        <div>
          <Link to={`/vehicles/${productId}`} className="text-xs text-[#667085] hover:text-[#172033]">
            ← Back to vehicle
          </Link>

          <form
            onSubmit={handleSubmit}
            className="bg-white border border-[#E5E1D8] rounded-[8px] shadow-[0_2px_8px_rgba(23,32,51,0.06)] p-6 mt-4"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C9A24D]" />
                <h1 className="font-serif text-lg font-semibold text-[#172033]">
                  Driver Details
                </h1>
              </div>
              <span className="text-xs text-[#667085]">As shown on driver's license</span>
            </div>
            <div className="border-t border-[#E5E1D8] my-4" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="First name">
                <div className="relative">
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full border border-[#E5E1D8] rounded-[4px] px-4 py-3 pr-10 text-sm focus:outline-none focus:border-[#C9A24D]"
                  />
                  {formData.firstName && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <CheckIcon />
                    </div>
                  )}
                </div>
              </Field>

              <Field label="Last name">
                <div className="relative">
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full border border-[#E5E1D8] rounded-[4px] px-4 py-3 pr-10 text-sm focus:outline-none focus:border-[#C9A24D]"
                  />
                  {formData.lastName && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <CheckIcon />
                    </div>
                  )}
                </div>
              </Field>

              <Field label="Email address">
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-[#E5E1D8] rounded-[4px] px-4 py-3 pr-10 text-sm focus:outline-none focus:border-[#C9A24D]"
                  />
                  {formData.email && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <CheckIcon />
                    </div>
                  )}
                </div>
                <p className="text-xs text-[#667085] mt-1">
                  Your booking confirmation will be sent here.
                </p>
              </Field>

              <Field label="Confirm email">
                <div className="relative">
                  <input
                    type="email"
                    name="confirmEmail"
                    value={formData.confirmEmail}
                    onChange={handleChange}
                    required
                    className="w-full border border-[#E5E1D8] rounded-[4px] px-4 py-3 pr-10 text-sm focus:outline-none focus:border-[#C9A24D]"
                  />
                  {formData.confirmEmail &&
                    formData.confirmEmail === formData.email && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <CheckIcon />
                      </div>
                    )}
                </div>
              </Field>
            </div>

            <div className="mt-4">
              <Field label="Phone">
                <div className="flex gap-2">
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className="border border-[#E5E1D8] rounded-[4px] px-3 py-3 text-sm focus:outline-none focus:border-[#C9A24D] bg-white"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Phone Number *"
                    className="flex-1 border border-[#E5E1D8] rounded-[4px] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A24D]"
                  />
                </div>
              </Field>
            </div>

            {/* Age + residence, plus license upload */}
            <div className="mt-5 bg-[#F5E9C9]/30 border border-[#E5E1D8] rounded-[8px] p-4">
              <p className="text-xs text-[#344054] flex items-start gap-2 mb-4">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-0.5 shrink-0">
                  <circle cx="7" cy="7" r="6" stroke="#C9A24D" strokeWidth="1.2" />
                  <path d="M7 6.3v3.5M7 4.3v.3" stroke="#C9A24D" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                These details affect pricing and availability. Changes may require a new search.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Driver's age">
                  <div className="relative">
                    <input
                      type="number"
                      name="age"
                      min="18"
                      value={formData.age}
                      onChange={handleChange}
                      required
                      className="w-full border border-[#E5E1D8] rounded-[4px] px-4 py-3 pr-10 text-sm focus:outline-none focus:border-[#C9A24D] bg-white"
                    />
                    {formData.age && Number(formData.age) >= 18 && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <CheckIcon />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-[#667085] mt-1">
                    Out-of-range ages may not be available at this location.
                  </p>
                </Field>

                <Field label="Country of residence">
                  <select
                    name="countryOfResidence"
                    value={formData.countryOfResidence}
                    onChange={handleChange}
                    className="w-full border border-[#E5E1D8] rounded-[4px] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A24D] bg-white"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-[#667085] mt-1">
                    Affects taxes, age policy, and license requirements.
                  </p>
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Driver's license photo">
                  <label
                    htmlFor="license-image"
                    className="flex items-center justify-center w-full h-32 border border-dashed border-[#C9A24D]/50 rounded-[4px] cursor-pointer overflow-hidden bg-white hover:border-[#C9A24D] transition-colors"
                  >
                    {licensePreview ? (
                      <img
                        src={licensePreview}
                        alt="License preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-sm text-[#667085]">
                        Click to upload a clear photo of your license
                      </span>
                    )}
                  </label>
                  <input
                    id="license-image"
                    type="file"
                    accept="image/*"
                    onChange={handleLicenseChange}
                    className="hidden"
                  />
                  <p className="text-xs text-[#667085] mt-1">
                    Used only to verify your eligibility to drive — kept private.
                  </p>
                </Field>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full bg-[#C9A24D] text-[#172033] py-3.5 rounded-[4px] text-sm font-semibold uppercase tracking-[0.06em] hover:brightness-95 transition-all disabled:opacity-60"
            >
              {submitting ? "Confirming Booking..." : "Continue"}
            </button>
          </form>
        </div>

        {/* Trip summary */}
        <div>
          <div className="border border-[#E5E1D8] rounded-[8px] bg-white shadow-[0_8px_24px_rgba(23,32,51,0.10)] p-6 sticky top-24">
            <div className="flex gap-3">
              <div className="w-20 h-16 rounded-[4px] overflow-hidden bg-[#F7F5EF] shrink-0">
                <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#172033] truncate">{vehicle.name}</p>
                <p className="text-xs text-[#667085]">{vehicle.category}</p>
              </div>
            </div>

            <div className="border-t border-[#E5E1D8] my-4" />

            <p className="text-2xl font-semibold text-[#172033]">
              Rs. {estimatedTotal}
              <span className="text-sm text-[#667085] font-normal"> total</span>
            </p>
            <p className="text-xs text-[#667085] mt-1">Before taxes</p>

            <div className="border-t border-[#E5E1D8] my-4" />

            <h3 className="text-sm font-semibold text-[#172033] mb-3">Your trip</h3>

            <div className="text-xs text-[#667085] space-y-2">
              <div className="flex justify-between">
                <span>Trip start</span>
                <span className="text-[#172033] font-medium">
                  {state?.startDate && new Date(state.startDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Trip end</span>
                <span className="text-[#172033] font-medium">
                  {state?.endDate && new Date(state.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Duration</span>
                <span className="text-[#172033] font-medium">{totalDays} day(s)</span>
              </div>
            </div>

            {vehicle.location?.address && (
              <>
                <div className="border-t border-[#E5E1D8] my-4" />
                <h3 className="text-sm font-semibold text-[#172033] mb-2">Pickup & return</h3>
                <p className="text-xs text-[#667085]">{vehicle.location.address}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;