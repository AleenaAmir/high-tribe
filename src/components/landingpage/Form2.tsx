
"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import bgImg from "../../../public/dashboard/landingpage/formimage.png";

type Country = {
  name: string;
  dialCode: string;
  iso: string;
  flag: string;
};

const COUNTRIES: Country[] = [
  { name: "United States", dialCode: "+1", iso: "us", flag: "https://flagcdn.com/w40/us.png" },
  { name: "United Kingdom", dialCode: "+44", iso: "gb", flag: "https://flagcdn.com/w40/gb.png" },
  { name: "Canada", dialCode: "+1", iso: "ca", flag: "https://flagcdn.com/w40/ca.png" },
  { name: "Australia", dialCode: "+61", iso: "au", flag: "https://flagcdn.com/w40/au.png" },
  { name: "India", dialCode: "+91", iso: "in", flag: "https://flagcdn.com/w40/in.png" },
  { name: "Germany", dialCode: "+49", iso: "de", flag: "https://flagcdn.com/w40/de.png" },
  { name: "France", dialCode: "+33", iso: "fr", flag: "https://flagcdn.com/w40/fr.png" },
  { name: "Japan", dialCode: "+81", iso: "jp", flag: "https://flagcdn.com/w40/jp.png" },
];

export default function Form2() {
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [showCountryDropdown, setShowCountryDropdown] = useState<boolean>(false);
  const [countryInput, setCountryInput] = useState<string>(COUNTRIES[0].name);
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowCountryDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setCountryInput(selectedCountry.name);
  }, [selectedCountry]);

  const countriesByDialDesc = [...COUNTRIES].sort((a, b) => b.dialCode.length - a.dialCode.length);

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.trim();

    if (raw.startsWith("+")) {
      const match = countriesByDialDesc.find((c) => raw.startsWith(c.dialCode));
      if (match) {
        setSelectedCountry(match);
        setCountryInput(match.name);
        setPhoneNumber(raw.slice(match.dialCode.length).trim());
        return;
      }
      setPhoneNumber(raw.replace(/^\+?\d+\s*/, ""));
      return;
    }
    setPhoneNumber(raw.replace(/[^\d\s\-\(\)]/g, ""));
  };

  const handleCountryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCountryInput(val);

    const q = val.trim().toLowerCase();
    if (!q) return;

    const match = COUNTRIES.find((c) => c.name.toLowerCase().startsWith(q));
    if (match) {
      setSelectedCountry(match);
    }
  };

  const handleSelectCountry = (c: Country) => {
    setSelectedCountry(c);
    setCountryInput(c.name);
    setShowCountryDropdown(false);
  };

  return (
    <div className="w-full min-h-screen bg-black flex flex-col lg:flex-row">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 relative p-4 lg:p-6">
        <Image src={bgImg} alt="Hero" fill className="object-cover" />
        {/* Black overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-40 lg:w-32 lg:h-64 bg-black/20 rounded-full" />
        </div>
        <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8 xl:px-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 lg:mb-6 text-white leading-tight">
            <span className="text-pink-400">Light the First Fire</span>
            <br />
            <span className="text-pink-400">- Join the Waitlist</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white max-w-lg leading-relaxed">
            Be one of the first in our founding circle. Waitlist for
            <br className="hidden sm:block" />
            early access closes September 15, 2025.
            <br className="hidden sm:block" />
            Secure yours now!
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
          <div className="bg-[#161616] rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-700">
            <form className="space-y-4 sm:space-y-6" onSubmit={(e) => e.preventDefault()}>
              {/* Full name + Email */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-white text-sm mb-2">Full name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#161616] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-gray-600 text-sm sm:text-base"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-white text-sm mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#161616] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-gray-600 text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Phone + Country */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Phone */}
                <div className="flex-1">
                  <label className="block text-white text-sm mb-2">Phone number</label>
                  <div className="relative" ref={dropdownRef}>
                    {/* Flag + Dropdown toggle */}
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <img
                        src={selectedCountry.flag}
                        alt={`${selectedCountry.name} flag`}
                        width={20}
                        height={14}
                        className="rounded-sm sm:w-6 sm:h-4"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCountryDropdown((s) => !s)}
                        className="text-gray-300 hover:text-white text-sm sm:text-base"
                      >
                        ▼
                      </button>
                    </div>

                    {/* Dropdown */}
                    {showCountryDropdown && (
                      <div className="absolute top-full left-0 mt-2 bg-[#161616] border border-gray-700 rounded-lg shadow-xl z-50 w-full max-h-48 sm:max-h-56 overflow-y-auto">
                        {COUNTRIES.map((c) => (
                          <button
                            key={c.iso}
                            type="button"
                            onClick={() => handleSelectCountry(c)}
                            className="w-full px-3 py-2 sm:py-3 text-left text-white hover:bg-gray-800 flex items-center gap-2 sm:gap-3 border-b border-gray-700 last:border-b-0 text-sm sm:text-base"
                          >
                            <img src={c.flag} alt={c.name} width={20} height={14} className="rounded-sm sm:w-6 sm:h-4" />
                            <span className="flex-1">{c.name}</span>
                            <span className="text-gray-400 text-xs sm:text-sm">{c.dialCode}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Phone Input */}
                    <input
                      type="tel"
                      value={`${selectedCountry.dialCode}${phoneNumber ? " " + phoneNumber : ""}`}
                      onChange={handlePhoneInputChange}
                      placeholder="555 123 4567"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 pl-16 sm:pl-20 bg-[#161616] border border-gray-700 rounded-lg text-white placeholder-gray-400 text-sm sm:text-base"
                    />
                  </div>
                </div>

                {/* Country Search */}
                <div className="flex-1">
                  <label className="block text-white text-sm mb-2">Country</label>
                  <input
                    type="text"
                    value={countryInput}
                    onChange={handleCountryInputChange}
                    placeholder="Enter Country"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#161616] border border-gray-700 rounded-lg text-white placeholder-gray-400 text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-white font-semibold text-base sm:text-lg">What interests you most?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {["Travel", "Community", "Events", "Networking", "Adventure", "Culture"].map((item) => (
                    <label key={item} className="flex items-center space-x-2 sm:space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-3 h-3 sm:w-4 sm:h-4 text-pink-500 bg-gray-700 border-gray-600 rounded focus:ring-pink-400"
                      />
                      <span className="text-white text-sm sm:text-base">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-base sm:text-lg rounded-lg hover:from-purple-700 hover:to-pink-600 transition-transform duration-200 transform hover:scale-105 shadow-lg"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
