// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import Image from "next/image";
// import bgImg from "../../../public/dashboard/landingpage/formimage.png";

// type Country = {
//   name: string;
//   dialCode: string;
//   iso: string;
//   flag: string;
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
//   const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
//   const [phoneNumber, setPhoneNumber] = useState<string>("");
//   const [showCountryDropdown, setShowCountryDropdown] = useState<boolean>(false);
//   const [countryInput, setCountryInput] = useState<string>(COUNTRIES[0].name);
//   const [fullName, setFullName] = useState<string>("");
//   const [email, setEmail] = useState<string>("");
//   const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

//   const dropdownRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
//         setShowCountryDropdown(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     setCountryInput(selectedCountry.name);
//   }, [selectedCountry]);

//   const countriesByDialDesc = [...COUNTRIES].sort((a, b) => b.dialCode.length - a.dialCode.length);

//   const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const raw = e.target.value.trim();

//     if (raw.startsWith("+")) {
//       const match = countriesByDialDesc.find((c) => raw.startsWith(c.dialCode));
//       if (match) {
//         setSelectedCountry(match);
//         setCountryInput(match.name);
//         setPhoneNumber(raw.slice(match.dialCode.length).trim());
//         return;
//       }
//       setPhoneNumber(raw.replace(/^\+?\d+\s*/, ""));
//       return;
//     }
//     setPhoneNumber(raw.replace(/[^\d\s\-\(\)]/g, ""));
//   };

//   const handleCountryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const val = e.target.value;
//     setCountryInput(val);

//     const q = val.trim().toLowerCase();
//     if (!q) return;

//     const match = COUNTRIES.find((c) => c.name.toLowerCase().startsWith(q));
//     if (match) {
//       setSelectedCountry(match);
//     }
//   };

//   const handleSelectCountry = (c: Country) => {
//     setSelectedCountry(c);
//     setCountryInput(c.name);
//     setShowCountryDropdown(false);
//   };

//   const handleTypeChange = (type: string) => {
//     setSelectedTypes(prev => 
//       prev.includes(type) 
//         ? prev.filter(t => t !== type)
//         : [...prev, type]
//     );
//   };

//   const userTypes = [
//     "Curious Explorer",
//     "Hospitable Host", 
//     "Story teller",
//     "Artist at Heart",
//     "Mindful Influencer",
//     "Community Builder"
//   ];

//   return (
//     <div className="w-full min-h-screen bg-white flex flex-col lg:flex-row">
//       {/* Left Section - Text Content */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-12">
//         <div className="max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-2xl">
//           <h1 className="font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-gray-900 mb-6 sm:mb-8 lg:mb-10">
//             Become a Part of the Founding Tribe
//           </h1>
//           <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-8 sm:mb-10">
//             Be one of the first in our founding circle. Waitlist for early access closes{" "}
//             <span className="text-[#BA50C0] font-semibold">September 15, 2025</span>. Secure yours now!
//           </p>
//           <div className="flex items-center gap-3 text-red-600">
//             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//             </svg>
//             <span className="text-sm sm:text-base font-medium">Limited spots available - Don't miss your chance to be a founding member</span>
//           </div>
//         </div>
//       </div>

//       {/* Right Section - Form */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-12">
//         <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
//           <div className="bg-white rounded-xl p-6 sm:p-8 lg:p-10 shadow-lg border border-gray-100">
//             <form className="space-y-4 sm:space-y-6" onSubmit={(e) => e.preventDefault()}>
//               {/* Row 1: Full name + Email Address */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                 <div>
//                   <label className="block text-gray-700 text-sm sm:text-base font-medium mb-2">Full name</label>
//                                      <input
//                      type="text"
//                      value={fullName}
//                      onChange={(e) => setFullName(e.target.value)}
//                      placeholder="Your full name"
//                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-[#E6E6E6] rounded-lg text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:outline-none text-sm sm:text-base"
//                    />
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 text-sm sm:text-base font-medium mb-2">Email Address</label>
//                                      <input
//                      type="email"
//                      value={email}
//                      onChange={(e) => setEmail(e.target.value)}
//                      placeholder="Enter your email"
//                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-[#E6E6E6] rounded-lg text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:outline-none text-sm sm:text-base"
//                    />
//                 </div>
//               </div>


//                   <div className="max-w-4xl mx-auto p-6">
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        
//      <div>
//           <label className="block text-gray-700 text-sm sm:text-base font-medium mb-2">
//             Phone number
//           </label>
//           <div className="flex bg-gray-50 border border-[#E6E6E6] rounded-lg focus-within:border-gray-400">
            
//                          {/* Country Section */}
//              <div 
//                className="flex items-center px-3 bg-gray-50 border-r border-[#E6E6E6] cursor-pointer hover:bg-gray-100 rounded-l-lg min-w-fit relative"
//                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
//              >
//                <img
//                  src={selectedCountry.flag}
//                  alt={`${selectedCountry.name} flag`}
//                  width={24}
//                  height={18}
//                  className="rounded-sm w-6 h-4 mr-2"
//                />
//                <span className="text-gray-500 mr-2 text-xs">▼</span>
//                <span className="text-gray-700 font-medium text-sm">({selectedCountry.dialCode})</span>
               
//                {/* Dropdown */}
//                {showCountryDropdown && (
//                  <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-xl z-50 w-[210px] max-h-48 overflow-y-auto">
//                    {COUNTRIES.map((c) => (
//                      <button
//                        key={c.iso}
//                        type="button"
//                        onClick={() => handleSelectCountry(c)}
//                        className="w-full px-3 py-2 text-left text-gray-900 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-200 last:border-b-0"
//                      >
//                        <img src={c.flag} alt={c.name} width={20} height={14} className="rounded-sm" />
//                        <span className="flex-1">{c.name}</span>
//                        <span className="text-gray-500 text-sm">({c.dialCode})</span>
//                      </button>
//                    ))}
//                  </div>
//                )}
//              </div>
            
//             {/* Phone Input */}
//             <input
//               type="tel"
//               value={phoneNumber}
//               onChange={handlePhoneInputChange}
//               placeholder="22234 123423"
//               // className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-transparent border-none rounded-r-lg text-gray-900 placeholder-gray-500 focus:outline-none text-sm sm:text-base"
//  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-[#E6E6E6] rounded-lg text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:outline-none text-sm sm:text-base"
//             />
//           </div>
//         </div>
//           {/* Country Input */}
//         <div>
//           <label className="block text-gray-700 text-sm sm:text-base font-medium mb-2">
//             Country
//           </label>
//           <div className="relative">
//             <input
//               type="text"
//               value={countryInput}
//               onChange={handleCountryInputChange}
//               placeholder="Enter Country"
//               className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-[#E6E6E6] rounded-lg text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:outline-none text-sm sm:text-base"
//             />
//             {/* <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
//               ▼
//             </div> */}
//           </div>
//         </div>
//    </div>
//       </div>

//       {/* Alternative Better Layout */} 
       

//               {/* Which one are you? */}
//               <div className="space-y-3 sm:space-y-4">
//                 <h3 className="text-gray-900 font-semibold text-base sm:text-lg lg:text-xl">Which one are you?</h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                   {userTypes.map((type) => (
//                     <label key={type} className="flex items-center space-x-2 sm:space-x-3 cursor-pointer">
//                          <input
//                          type="checkbox"
//                          checked={selectedTypes.includes(type)}
//                          onChange={() => handleTypeChange(type)}
//                          className="accent-[#BA50C0]   w-4 h-4 text-[#BA50C0] bg-gray-100  rounded checked:bg-[#BA50C0]  checked:text-[#BA50C0]"
//                        />
//                       <span className="text-gray-700 text-sm sm:text-base">{type}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 className="w-full max-w-[595px] h-16 bg-[#BA50C0] text-white font-semibold text-base sm:text-lg lg:text-xl rounded-full hover:bg-[#FFACE4] transition-all duration-200 transform hover:scale-105 shadow-lg px-6 py-3.5"
//               >
//                 Secure Early Access
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }














'use client'
import React, { useState, useEffect, useRef } from "react";
type Country = {
  name: string;
  dialCode: string;
  iso: string;
  flag: string;
};

const COUNTRIES: Country[] = [
  { name: "United States", dialCode: "+1", iso: "us", flag: "🇺🇸" },
  { name: "United Kingdom", dialCode: "+44", iso: "gb", flag: "🇬🇧" },
  { name: "Canada", dialCode: "+1", iso: "ca", flag: "🇨🇦" },
  { name: "Australia", dialCode: "+61", iso: "au", flag: "🇦🇺" },
  { name: "India", dialCode: "+91", iso: "in", flag: "🇮🇳" },
  { name: "Germany", dialCode: "+49", iso: "de", flag: "🇩🇪" },
  { name: "France", dialCode: "+33", iso: "fr", flag: "🇫🇷" },
  { name: "Japan", dialCode: "+81", iso: "jp", flag: "🇯🇵" },
];


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
export default function FoundingTribeForm() {
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]); 
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [showCountryDropdown, setShowCountryDropdown] = useState<boolean>(false);
  const [countryInput, setCountryInput] = useState<string>(COUNTRIES[0].name);
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d\s\-\(\)]/g, "");
    setPhoneNumber(raw);
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
    setSearchQuery("");
  };

  const handleTypeChange = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  // Filter countries based on search query
  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.dialCode.includes(searchQuery) ||
    country.iso.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const userTypes = [
    "Curious Explorer",
    "Artist at Heart",
    "Hospitable Host", 
    "Mindful Influencer",
    "Story teller",
    "Community Builder"
  ];

  const handleSubmit = () => {
    console.log({
      fullName,
      email,
      phone: `${selectedCountry.dialCode} ${phoneNumber}`,
      country: countryInput,
      selectedTypes
    });
    alert('Form submitted! Check console for details.');
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Left Section - Text Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 xl:p-16 bg-white">
        <div className="max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-2xl">
          <h1 className="font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-gray-900 mb-6 sm:mb-8 lg:mb-10 leading-tight">
            Become a Part of the Founding Tribe
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-8 sm:mb-10 leading-relaxed">
            Be one of the first in our founding circle. Waitlist for early access closes{" "}
            <span className="text-[#BA50C0] font-semibold">September 15, 2025</span>. Secure yours now!
          </p>
          <div className="flex items-start gap-3 text-red-600 bg-red-50 p-4 rounded-lg">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm sm:text-base font-medium">Limited spots available - Don't miss your chance to be a founding member</span>
          </div>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 xl:p-16">
        <div className="w-full max-w-lg sm:max-w-xl lg:max-w-2xl">
          <div className="bg-white rounded-2xl p-8 sm:p-10 lg:p-12 shadow-xl border border-gray-200">
            <div className="space-y-8">
              {/* Row 1: Full name + Email Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500  focus:ring-opacity-20 focus:outline-none text-sm transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your Email"
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500  focus:ring-opacity-20 focus:outline-none text-sm transition-all"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Phone number + Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Phone Number */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Phone number
                  </label>
                  <div className="relative">
                    {/* Country Flag and Dropdown */}
                    <div 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center cursor-pointer z-10 bg-gray-50 px-2 py-1 rounded-l-lg"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      ref={dropdownRef}
                    >
                      <span className="text-lg mr-1" style={{fontSize: '18px'}}>{selectedCountry.flag}</span>
                      <span className="text-gray-700 font-medium text-xs mr-1">({selectedCountry.dialCode})</span>
                      <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                      </svg>
                      
                      {/* Enhanced Dropdown */}
                      {showCountryDropdown && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl z-50 w-80 max-h-64 overflow-hidden">
                          {/* Search Input */}
                          <div className="p-3 border-b border-gray-200">
                            <input
                              type="text"
                              placeholder="Search country or code..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none  focus:border-transparent"
                              autoFocus
                            />
                          </div>
                          
                          {/* Countries List */}
                          <div className="max-h-48 overflow-y-auto">
                            {filteredCountries.length > 0 ? (
                              filteredCountries.map((c) => (
                                <button
                                  key={c.iso}
                                  type="button"
                                  onClick={() => handleSelectCountry(c)}
                                  className="w-full px-4 py-3 text-left text-gray-900 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0 text-sm transition-colors"
                                >
                                  <span className="text-xl flex-shrink-0" style={{fontSize: '20px'}}>{c.flag}</span>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">{c.name}</div>
                                  </div>
                                  <span className="text-gray-500 text-xs font-mono flex-shrink-0">({c.dialCode})</span>
                                </button>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-gray-500 text-sm text-center">
                                No countries found
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Phone Input - Enhanced with better padding */}
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={handlePhoneInputChange}
                      placeholder="Enter phone number"
                      className="w-full pl-28 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-opacity-20 focus:outline-none text-sm transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Country Input */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={countryInput}
                    onChange={handleCountryInputChange}
                    placeholder="Enter Country"
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-gray-50 border border-[#E6E6E6] rounded-lg text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:outline-none text-sm sm:text-base"
                    required
                  />
                </div>
              </div>

              {/* Which one are you? */}
              <div className="space-y-6">
                <h3 className="text-gray-900 font-semibold text-lg">Which one are you?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {userTypes.map((type) => (
                    <label key={type} className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => handleTypeChange(type)}
                        className="accent-[#BA50C0] w-4 h-4 text-[#BA50C0] bg-gray-100 rounded checked:bg-[#BA50C0]  checked:text-[#BA50C0]"
                      />
                      <span className="text-gray-700 text-sm group-hover:text-gray-900 transition-colors">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full h-16 bg-gradient-to-r from-[#BA50C0] to-[#D863DF] text-white font-semibold text-lg rounded-full hover:from-[#A844AC] hover:to-[#C455D1] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Secure Early Access
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}