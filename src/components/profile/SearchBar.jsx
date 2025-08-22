"use client"
import { FiSearch } from "react-icons/fi"
import Image from "next/image"

export default function SearchBar() {
  return (
    <div className="w-full flex items-center justify-between p-2 rounded-xl shadow-md bg-gradient-to-r from-white to-blue-100">
      
      {/* Search Input */}
      <div className="flex items-center gap-2 w-full max-w-md rounded-lg ">
        <FiSearch className="text-gray-500 text-lg" />
        <input
          type="text"
          placeholder="Search here..."
          className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Right Side Image */}
      <div className="ml-4">
        <Image
          src='/images/searchBarImg.png'
          alt="Right Side"
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
      </div>
    </div>
  )
}
