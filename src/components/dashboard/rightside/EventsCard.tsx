"use client";
import React from "react";
import Image from "next/image";

// --- SVG ICONS ---
const CalendarIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.333 1.333V3.333M10.667 1.333V3.333M2.667 6H13.333"
      stroke="#0F62DE"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 6.333v6a2.667 2.667 0 01-2.667 2.667H4.667A2.667 2.667 0 012 12.333v-6C2 3.667 3.667 2 4.667 2h6.666C12.333 2 14 3.667 14 6.333z"
      stroke="#0F62DE"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.831 9.467H9.837M9.831 11.467H9.837M7.997 9.467H8.003M7.997 11.467H8.003M6.162 9.467H6.168M6.162 11.467H6.168"
      stroke="#0F62DE"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LocationPinIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 8.667c.736 0 1.333-.597 1.333-1.334C9.333 6.597 8.737 6 8 6s-1.333.597-1.333 1.333c0 .737.597 1.334 1.333 1.334z"
      stroke="#F35735"
      strokeWidth="1.5"
    />
    <path
      d="M8 14.667C10.24 12.427 12.667 10.027 12.667 8.133c0-2.934-2.2-6.133-4.667-6.133S3.333 5.2 3.333 8.133c0 1.894 2.427 4.294 4.667 6.534z"
      stroke="#F35735"
      strokeWidth="1.5"
    />
  </svg>
);

const EventsCard = () => {
  const event = {
    title: "Barcelona Tapas Tour",
    description:
      "Lorem ipsum dolor sit amet consectetur. Venenatis in ligula tempus et diam vel viverra et. Nunc habitant maecenas at magna pulvinar velit. Fringilla amet commodo tincidunt quis.",
    time: "Tonight, 7:00 PM",
    location: "Gothic Quarter",
    tags: ["Food", "Culture", "Spirituality"],
    imageUrl: "/dashboard/group-2.svg",
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-58 ">
        <Image
          src={event.imageUrl}
          alt={event.title}
          layout="fill"
          className="object-cover"
        
        />
      </div>
      <div className="px-2 py-4">
        <div className="flex justify-between items-center text-[12px] text-[#696969] mb-4">
          <span className="flex items-center gap-1 font-poppins">
            <CalendarIcon />
            {event.time}
          </span>
          <span className="flex items-center gap-1 font-poppins">
            <LocationPinIcon />
            {event.location}
          </span>
        </div>
        <h3 className="text-[15px] text-[#000000] font-roboto">{event.title}</h3>
                 <p className="text-[12px] text-[#959595] font-poppins">{event.description}</p>
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="bg-[#D1D4D9 text-[#030303] text-[8px]  px-2 py-1 rounded-xl border border-[#D1D4D9] mb-4 w-[60px] h-[26px] flex items-center justify-center text-center"
            >
              {tag}
            </span>
          ))}
        </div>
        <button className="bg-gradient-to-r from-[#9243AC] via-[#B6459F] to-[#E74294] text-white font-bold py-1 rounded-2xl w-[230px] h-[32px] hover:opacity-90 transition-opacity font-gilroy">
          Join Events
        </button>
      </div>
    </div>
  );
};

export default EventsCard;
