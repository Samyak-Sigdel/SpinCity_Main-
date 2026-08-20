import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0E3B2E] border-t border-[#1C4E3E] text-[#C9D4CE]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-16">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-9 h-9 border border-[#D4A24D] rotate-45 flex items-center justify-center">
                <span className="-rotate-45 text-[#D4A24D] text-lg font-serif font-semibold">S</span>
              </div>
              <span className="font-serif text-xl font-semibold text-white">
                Spin<span className="text-[#D4A24D]">City</span>
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-[13px] leading-6 text-[#A9B8B0]">
              Premium two-wheeler rental platform connecting riders with trusted vehicle owners.
            </p>

            <div className="flex items-center gap-3 mt-5">
              {[FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn].map((Icon, idx) => (
                <span
                  key={idx}
                  className="w-8 h-8 rounded-full border border-[#3C6656] flex items-center justify-center text-[#D4A24D] hover:border-[#D4A24D] hover:text-[#E6BC6E] transition-colors cursor-pointer"
                >
                  <Icon size={12} />
                </span>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white mb-4">
              Company
            </h4>
            <ul className="space-y-3 text-[13px]">
              <li><Link to="/" className="hover:text-[#D4A24D] transition-colors">About Us</Link></li>
              <li><Link to="/" className="hover:text-[#D4A24D] transition-colors">How It Works</Link></li>
              <li><Link to="/" className="hover:text-[#D4A24D] transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link to="/" className="hover:text-[#D4A24D] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3 text-[13px]">
              <li className="flex items-center gap-2">
                <Phone size={14} strokeWidth={1.75} className="text-[#D4A24D]" />
                01-4567890
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} strokeWidth={1.75} className="text-[#D4A24D]" />
                support@spincity.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={14} strokeWidth={1.75} className="text-[#D4A24D]" />
                Kathmandu, Nepal
              </li>
            </ul>
          </div>

        </div>

        <div className="h-px bg-[#1C4E3E] my-10" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-[#8FA69B]">
            © {new Date().getFullYear()} SpinCity. All rights reserved.
          </p>
          <span className="text-[11px] uppercase tracking-[0.12em] text-[#D4A24D]">
            Ride. Explore. Repeat.
          </span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;