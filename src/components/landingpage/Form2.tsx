// "use client";

// import React, { useState, useEffect, useRef } from 'react';
// import Image from 'next/image';
// import img from '../../../public/dashboard/landingpage/formimage.png';
// const Form2 = () => {
//   const [selectedCountry, setSelectedCountry] = useState('🇺🇸');
//   const [selectedCountryCode, setSelectedCountryCode] = useState('+1');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [showCountryDropdown, setShowCountryDropdown] = useState(false);
//   const [fullName, setFullName] = useState('');
//   const [email, setEmail] = useState('');
//   const [country, setCountry] = useState('');
//   const [selectedOptions, setSelectedOptions] = useState({});
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   const handleOptionChange = (option: string) => {
//     setSelectedOptions(prev => ({
//       ...prev,
//       [option]: !prev[option as keyof typeof prev]
//     }));
//   };

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setShowCountryDropdown(false);
//       }
//     };

//     if (showCountryDropdown) {
//       document.addEventListener('mousedown', handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showCountryDropdown]);

// const countries = [
//   { code: "US", flag: "🇺🇸", dialCode: "+1", name: "United States" },
//   { code: "GB", flag: "🇬🇧", dialCode: "+44", name: "United Kingdom" },
//   { code: "CA", flag: "🇨🇦", dialCode: "+1", name: "Canada" },
//   { code: "AU", flag: "🇦🇺", dialCode: "+61", name: "Australia" },
//   { code: "IN", flag: "🇮🇳", dialCode: "+91", name: "India" },
//   { code: "DE", flag: "🇩🇪", dialCode: "+49", name: "Germany" },
//   { code: "FR", flag: "🇫🇷", dialCode: "+33", name: "France" },
//   { code: "JP", flag: "🇯🇵", dialCode: "+81", name: "Japan" },
// ];

//   return (
//      <div className="w-full  h-[780px] min-h-screen bg-black flex py-1">
//       {/* Left Section - Background and Text */}
//            <div className="w-1/2 relative">
//             <Image
//              src={img}
//               alt="Logo"
//               fill
//              className="object-cover" 
//   />
//         {/* Warm gradient background */}
//         {/* <div className="absolute inset-0 bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400"></div> */}
        
//         {/* Silhouetted person - placeholder */}
//         <div className="absolute inset-0 flex items-center justify-center">
//           <div className="w-32 h-64 bg-black/20 rounded-full"></div>
//         </div>
        
//         {/* Text Content */}
//         <div className="relative z-10 h-full flex flex-col justify-center px-12 lg:px-16">
//           <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
//             <span className="text-pink-400">Light the First Fire</span>
//             <br />
//             <span className="text-pink-400">- Join the Waitlist</span>
//           </h1>
          
//           <p className="text-lg md:text-xl text-white leading-relaxed max-w-lg">
//             Be among the first to experience our community. Early access registration closes soon. Don't miss out!
//           </p>
//         </div>
//       </div>

//              {/* Right Section - Form */}
//        <div className="w-2/3 flex items-center justify-center p-10">
//          <div className="h-full w-[640px]">
//            <div className="bg-[#161616] backdrop-blur-sm rounded-2xl p-8 border border-[bg-[#161616]]">
//              <form className="space-y-6">
//                {/* Full Name and Email in one row */}
//                <div className="flex gap-4">
//                  <div className="flex-1">
//                    <label className="block text-white text-sm font-medium mb-2">Full name</label>
//                    <input
//                      type="text"
//                      value={fullName}
//                      onChange={(e) => setFullName(e.target.value)}
//                      placeholder="Your full name"
//                      className="w-full px-4 py-3 bg-[#161616] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gray-600 focus:bg-[#161616] transition-colors"
//                    />
//                  </div>
//                  <div className="flex-1">
//                    <label className="block text-white text-sm font-medium mb-2">Email Address</label>
//                    <input
//                      type="email"
//                      value={email}
//                      onChange={(e) => setEmail(e.target.value)}
//                      placeholder="your.email@example.com"
//                      className="w-full px-4 py-3 bg-[#161616] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gray-600 focus:bg-[#161616] transition-colors"
//                    />
//                  </div>
//                </div>

//                {/* Phone Number and Country in one row */}
//                <div className="flex gap-4">
//                  <div className="flex-1">
//                    <label className="block text-white text-sm font-medium mb-2">Phone number</label>
//                    <div className="relative" ref={dropdownRef}>
//                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center">
//                        <span className="text-white mr-2">{selectedCountry}</span>
//                        <button 
//                          type="button"
//                          onClick={() => setShowCountryDropdown(!showCountryDropdown)}
//                          className="text-gray-400 hover:text-white transition-colors"
//                        >
//                          ▼
//                        </button>
//                      </div>
                     
//                      {/* Country Dropdown */}
//                      {showCountryDropdown && (
//                        <div className="absolute top-full left-0 mt-1 bg-[#161616] border border-gray-700 rounded-lg shadow-xl z-50 w-full max-h-60 overflow-y-auto">
//                          {countries.map((country, index) => (
//                            <button
//                              key={index}
//                              type="button"
//                              onClick={() => {
//                                setSelectedCountry(country.flag);
//                                setSelectedCountryCode(country.dialCode);
//                                setShowCountryDropdown(false);
//                              }}
//                              className="w-full px-4 py-3 text-left text-white hover:bg-gray-800 flex items-center space-x-3 transition-colors border-b border-gray-700 last:border-b-0"
//                            >
//                              <span className="text-lg">{country.flag}</span>
//                              <span className="flex-1">{country.name}</span>
//                              <span className="text-gray-400">{country.dialCode}</span>
//                            </button>
//                          ))}
//                        </div>
//                      )}
                     
//                      <input
//                        type="tel"
//                        value={`${selectedCountryCode} ${phoneNumber}`}                       
//                        onChange={(e) => {
//                          const value = e.target.value;
//                          const match = value.match(/\+?\d+\s*(.*)/);
//                          if (match) {
//                            setPhoneNumber(match[1]);
//                          } else {
//                            setPhoneNumber(value);
//                          }
//                        }}
//                        placeholder='555 123 4567'
//                        className="w-full px-4 py-3 pl-16 bg-[#161616] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gray-600 focus:bg-[#161616] transition-colors pr-10"
//                      />
//                      <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
//                        ✕
//                      </button>
//                    </div>
//                  </div>
//                  <div className="flex-1">
//                    <label className="block text-white text-sm font-medium mb-2">Country</label>
//                    <div className="relative">
//                      <input
//                        type="text"
//                        value={country}
//                        onChange={(e) => setCountry(e.target.value)}
//                        placeholder="Enter Country"
//                        className="w-full px-4 py-3 bg-[#161616] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gray-600 focus:bg-[#161616] transition-colors pr-10"
//                      />
//                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
//                        ▼
//                      </div>
//                    </div>
//                  </div>
//                </div>

//                {/* Checkboxes Section */}
//                <div className="space-y-4">
//                  <h3 className="text-white font-semibold text-lg">What interests you most?</h3>
//                  <div className="grid grid-cols-2 gap-4">
//                    <label className="flex items-center space-x-3 cursor-pointer">
//                      <input type="checkbox" className="w-4 h-4 text-pink-500 bg-gray-700 border-gray-600 rounded focus:ring-pink-400" />
//                      <span className="text-white">Travel</span>
//                    </label>
//                    <label className="flex items-center space-x-3 cursor-pointer">
//                      <input type="checkbox" className="w-4 h-4 text-pink-500 bg-gray-700 border-gray-600 rounded focus:ring-pink-400" />
//                      <span className="text-white">Community</span>
//                    </label>
//                    <label className="flex items-center space-x-3 cursor-pointer">
//                      <input type="checkbox" className="w-4 h-4 text-pink-500 bg-gray-700 border-gray-600 rounded focus:ring-pink-400" />
//                      <span className="text-white">Events</span>
//                    </label>
//                    <label className="flex items-center space-x-3 cursor-pointer">
//                      <input type="checkbox" className="w-4 h-4 text-pink-500 bg-gray-700 border-gray-600 rounded focus:ring-pink-400" />
//                      <span className="text-white">Networking</span>
//                    </label>
//                    <label className="flex items-center space-x-3 cursor-pointer">
//                      <input type="checkbox" className="w-4 h-4 text-pink-500 bg-gray-700 border-gray-600 rounded focus:ring-pink-400" />
//                      <span className="text-white">Adventure</span>
//                    </label>
//                    <label className="flex items-center space-x-3 cursor-pointer">
//                      <input type="checkbox" className="w-4 h-4 text-pink-500 bg-gray-700 border-gray-600 rounded focus:ring-pink-400" />
//                      <span className="text-white">Culture</span>
//                    </label>
//                  </div>
//                </div>

//                {/* Submit Button */}
//                <button
//                  type="submit"
//                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
//                >
//                  Submit
//                </button>
//              </form>
//            </div>
//          </div>
//        </div>
//       </div>

//     );
//  };

// export default Form2;


// app/components/Form2.tsx  (or wherever your Form2 lives)












// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import Image from "next/image";
// import bgImg from "../../../public/dashboard/landingpage/formimage.png";

// type Country = {
//   name: string;
//   dialCode: string; // e.g. "+1"
//   iso: string; // e.g. "us"
//   flag: string; // direct URL to small flag image
// };

// const COUNTRIES: Country[] = [
//   { name: "United States", dialCode: "+1", iso: "us", flag: "https://flagcdn.com/w40/us.png" },
//   { name: "United Kingdom", dialCode: "+44", iso: "gb", flag: "https://flagcdn.com/w40/gb.png" },
//   { name: "Canada", dialCode: "+1", iso: "ca", flag: "https://flagcdn.com/w40/ca.png" },
//   { name: "Australia", dialCode: "+61", iso: "au", flag: "https://flagcdn.com/w40/au.png" },
//   { name: "India", dialCode: "+91", iso: "in", flag: "https://flagcdn.com/w40/in.png" },
//   { name: "Germany", dialCode: "+49", iso: "de", flag: "https://flagcdn.com/w40/de.png" },
//   { name: "France", dialCode: "+33", iso: "fr", flag: "https://flagcdn.com/w40/fr.png" },
//   { name: "Japan", dialCode: "+81", iso: "jp", flag: "https://flagcdn.com/w40/jp.png" },
// ];

// export default function Form2() {
//   // selectedCountry contains dialCode and flag etc
//   const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
//   const [phoneNumber, setPhoneNumber] = useState<string>(""); // number without dial code
//   const [showCountryDropdown, setShowCountryDropdown] = useState<boolean>(false);
//   const [countryInput, setCountryInput] = useState<string>(COUNTRIES[0].name);
//   const [fullName, setFullName] = useState<string>("");
//   const [email, setEmail] = useState<string>("");

//   const dropdownRef = useRef<HTMLDivElement | null>(null);

//   // Close dropdown on outside click
//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
//         setShowCountryDropdown(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // keep countryInput synced when selectedCountry changes
//   useEffect(() => {
//     setCountryInput(selectedCountry.name);
//   }, [selectedCountry]);

//   // helper: try match by dial code (longest-first to avoid +1 ambiguity)
//   const countriesByDialDesc = [...COUNTRIES].sort((a, b) => b.dialCode.length - a.dialCode.length);

//   // When user types into phone input, detect leading dial code and update flag
//   const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const raw = e.target.value;
//     const trimmed = raw.trim();

//     if (trimmed.startsWith("+")) {
//       // try to match dial code
//       const match = countriesByDialDesc.find((c) => trimmed.startsWith(c.dialCode));
//       if (match) {
//         setSelectedCountry(match);
//         // remove dial code from display portion
//         const rest = trimmed.slice(match.dialCode.length).trim();
//         setPhoneNumber(rest);
//         return;
//       }
//       // if no exact match, try to remove +digits prefix and keep remainder
//       const restFallback = trimmed.replace(/^\+?\d+\s*/, "");
//       setPhoneNumber(restFallback);
//       return;
//     }

//     // no + at start: just update numeric part (strip illegal chars)
//     setPhoneNumber(trimmed.replace(/[^\d\s\-\(\)]/g, ""));
//   };

//   // When user types into country input, try to match by name
//   const handleCountryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const val = e.target.value;
//     setCountryInput(val);

//     const q = val.trim().toLowerCase();
//     if (q.length === 0) return;

//     const match = COUNTRIES.find((c) => c.name.toLowerCase().startsWith(q));
//     if (match) {
//       setSelectedCountry(match);
//     }
//   };

//   // clicking a country in the dropdown
//   const handleSelectCountry = (c: Country) => {
//     setSelectedCountry(c);
//     setShowCountryDropdown(false);
//     // keep phoneNumber (user typed) unchanged
//   };

//   return (
//     <div className="w-full h-screen bg-black flex">
//       {/* Left Section */}
//       <div className="w-1/2 relative">
//         <Image src={bgImg} alt="Hero" fill className="object-cover" />
//         <div className="absolute inset-0 flex items-center justify-center">
//           <div className="w-32 h-64 bg-black/20 rounded-full" />
//         </div>

//         <div className="relative z-10 h-full flex flex-col justify-center px-8 lg:px-16">
//           <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 text-white">
//             <span className="text-pink-400">Light the First Fire</span>
//             <br />
//             <span className="text-pink-400">- Join the Waitlist</span>
//           </h1>
//           <p className="text-lg md:text-xl text-white leading-relaxed max-w-lg">
//             Be among the first to experience our community. Early access registration closes soon. Don't
//             miss out!
//           </p>
//         </div>
//       </div>

//       {/* Right Section */}
//       <div className="w-1/2 flex items-center justify-center p-8">
//         <div className="w-full max-w-md">
//           <div className="bg-[#161616] backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
//             <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
//               {/* Full name + Email */}
//               <div className="flex gap-4">
//                 <div className="flex-1">
//                   <label className="block text-white text-sm font-medium mb-2">Full name</label>
//                   <input
//                     type="text"
//                     value={fullName}
//                     onChange={(e) => setFullName(e.target.value)}
//                     placeholder="Your full name"
//                     className="w-full px-4 py-3 bg-[#161616] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gray-600"
//                   />
//                 </div>

//                 <div className="flex-1">
//                   <label className="block text-white text-sm font-medium mb-2">Email Address</label>
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="your.email@example.com"
//                     className="w-full px-4 py-3 bg-[#161616] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gray-600"
//                   />
//                 </div>
//               </div>

//               {/* Phone + Country */}
//               <div className="flex gap-4">
//                 {/* Phone */}
//                 <div className="flex-1">
//                   <label className="block text-white text-sm font-medium mb-2">Phone number</label>
//                   <div className="relative" ref={dropdownRef}>
//                     {/* flag + dropdown button */}
//                     <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
//                       {/* use plain <img> for flags to avoid next.config changes */}
//                       <img
//                         src={selectedCountry.flag}
//                         alt={selectedCountry.name}
//                         className="w-6 h-4 object-cover rounded-sm"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowCountryDropdown((s) => !s)}
//                         className="text-gray-300 hover:text-white select-none"
//                         aria-label="Select country"
//                       >
//                         ▼
//                       </button>
//                     </div>

//                     {/* dropdown */}
//                     {showCountryDropdown && (
//                       <div className="absolute top-full left-0 mt-2 bg-[#161616] border border-gray-700 rounded-lg shadow-xl z-50 w-full max-h-56 overflow-y-auto">
//                         {COUNTRIES.map((c) => (
//                           <button
//                             key={c.iso}
//                             type="button"
//                             onClick={() => handleSelectCountry(c)}
//                             className="w-full px-3 py-3 text-left text-white hover:bg-gray-800 flex items-center gap-3 border-b border-gray-700 last:border-b-0"
//                           >
//                             <img src={c.flag} alt={c.name} className="w-6 h-4 object-cover rounded-sm" />
//                             <span className="flex-1">{c.name}</span>
//                             <span className="text-gray-400">{c.dialCode}</span>
//                           </button>
//                         ))}
//                       </div>
//                     )}

//                     {/* phone input value shows selected country's dial code + number */}
//                     <input
//                       type="tel"
//                       value={`${selectedCountry.dialCode}${phoneNumber ? " " + phoneNumber : ""}`}
//                       onChange={handlePhoneInputChange}
//                       placeholder="555 123 4567"
//                       className="w-full px-4 py-3 pl-20 bg-[#161616] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none"
//                     />
//                   </div>
//                 </div>

//                 {/* Country input (auto-filled, can type to search) */}
//                 <div className="flex-1">
//                   <label className="block text-white text-sm font-medium mb-2">Country</label>
//                   <input
//                     type="text"
//                     value={countryInput}
//                     onChange={handleCountryInputChange}
//                     placeholder="Enter Country"
//                     className="w-full px-4 py-3 bg-[#161616] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none"
//                   />
//                 </div>
//               </div>

//               {/* Interests */}
//               <div className="space-y-4">
//                 <h3 className="text-white font-semibold text-lg">What interests you most?</h3>
//                 <div className="grid grid-cols-2 gap-4">
//                   {["Travel", "Community", "Events", "Networking", "Adventure", "Culture"].map((item) => (
//                     <label key={item} className="flex items-center space-x-3 cursor-pointer">
//                       <input
//                         type="checkbox"
//                         className="w-4 h-4 text-pink-500 bg-gray-700 border-gray-600 rounded focus:ring-pink-400"
//                       />
//                       <span className="text-white">{item}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {/* Submit */}
//               <button
//                 type="submit"
//                 className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg rounded-lg hover:from-purple-700 hover:to-pink-600 transition-transform duration-200 transform hover:scale-105 shadow-lg"
//               >
//                 Submit
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



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
    <div className="w-full h-screen bg-black flex">
             {/* Left Section */}
       <div className="w-1/2 relative p-3">
         <Image src={bgImg} alt="Hero" fill className="object-cover" />
         {/* Black overlay for better text readability */}
         <div className="absolute inset-0 bg-black/60 "></div>
         <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-32 h-64 bg-black/20 rounded-full" />
         </div>
        <div className="relative z-10 h-full flex flex-col justify-center px-8 lg:px-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white leading-tight">
            <span className="text-pink-400">Light the First Fire</span>
            <br />
            <span className="text-pink-400">- Join the Waitlist</span>
          </h1>
          <p className="text-lg md:text-xl text-white max-w-lg">
            Be one of the first in our founding circle.Waitlist for
            <br />
            early access closes September 15.2025.
            <br />
            Secure yours now!
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/3 flex items-center justify-center p-8">
        <div className="w-full max-w-lg">
          <div className="bg-[#161616] rounded-2xl p-8 border border-gray-700 w-[650px]">
            <form className="space-y-6 h-[500px] " onSubmit={(e) => e.preventDefault()}>
              {/* Full name + Email */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-white text-sm mb-2">Full name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 bg-[#161616] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-gray-600"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-white text-sm mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 bg-[#161616] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-gray-600"
                  />
                </div>
              </div>

              {/* Phone + Country */}
              <div className="flex gap-4">
                {/* Phone */}
                <div className="flex-1">
                  <label className="block text-white text-sm mb-2">Phone number</label>
                  <div className="relative" ref={dropdownRef}>
                    {/* Flag + Dropdown toggle */}
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <img
                        src={selectedCountry.flag}
                        alt={`${selectedCountry.name} flag`}
                        width={24}
                        height={16}
                        className="rounded-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCountryDropdown((s) => !s)}
                        className="text-gray-300 hover:text-white"
                      >
                        ▼
                      </button>
                    </div>

                    {/* Dropdown */}
                    {showCountryDropdown && (
                      <div className="absolute top-full left-0 mt-2 bg-[#161616] border border-gray-700 rounded-lg shadow-xl z-50 w-full max-h-56 overflow-y-auto">
                        {COUNTRIES.map((c) => (
                          <button
                            key={c.iso}
                            type="button"
                            onClick={() => handleSelectCountry(c)}
                            className="w-full px-3 py-3 text-left text-white hover:bg-gray-800 flex items-center gap-3 border-b border-gray-700 last:border-b-0"
                          >
                            <img src={c.flag} alt={c.name} width={24} height={16} className="rounded-sm" />
                            <span className="flex-1">{c.name}</span>
                            <span className="text-gray-400">{c.dialCode}</span>
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
                      className="w-full px-4 py-3 pl-20 bg-[#161616] border border-gray-700 rounded-lg text-white placeholder-gray-400"
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
                    className="w-full px-4 py-3 bg-[#161616] border border-gray-700 rounded-lg text-white placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold text-lg">What interests you most?</h3>
                <div className="grid grid-cols-2 gap-4">
                  {["Travel", "Community", "Events", "Networking", "Adventure", "Culture"].map((item) => (
                    <label key={item} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-pink-500 bg-gray-700 border-gray-600 rounded focus:ring-pink-400"
                      />
                      <span className="text-white">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg rounded-lg hover:from-purple-700 hover:to-pink-600 transition-transform duration-200 transform hover:scale-105 shadow-lg"
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
