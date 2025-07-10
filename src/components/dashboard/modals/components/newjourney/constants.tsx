import React from "react";
import PlaneIcon from "@/components/dashboard/svgs/PlaneIcon";
import TrainIcon from "@/components/dashboard/svgs/TrainIcon";
import CarIcon from "@/components/dashboard/svgs/CarIcon";
import BusIcon from "@/components/dashboard/svgs/BusIcon";
import WalkIcon from "@/components/dashboard/svgs/WalkIcon";
import BikeIcon from "@/components/dashboard/svgs/BikeIcon";
import FaqInfoIcon from "@/components/dashboard/svgs/FaqInfoIcon";
import { TravelMedium, NewJourneyForm } from "./types";

export const TAGS = [
  "🏛️ Cultural Exploration",
  "🏰 Historical Sites",
  "🍛 Local Cuisine",
  "🎨 Art & Crafts",
  "🛍️ Shopping Spree",
  "🌳 Nature Walks",
  "🏙️ City Tours",
  "🎉 Positive Celebrations",
  "📸 Photography Spots",
  "🎵 Local Music",
  "🛒 Traditional Markets",
  "🌺 Relaxing Parks",
];

export const TRAVEL_MODES: TravelMedium[] = [
  {
    name: "plane",
    icon: (
      <PlaneIcon className="w-[18px] h-[18px] text-black hover:text-[#2379FC] cursor-pointer" />
    ),
  },
  {
    name: "train",
    icon: (
      <TrainIcon className="w-[18px] h-[18px] text-black hover:text-[#2379FC] cursor-pointer" />
    ),
  },
  {
    name: "car",
    icon: (
      <CarIcon className="w-[18px] h-[18px] text-black hover:text-[#2379FC] cursor-pointer" />
    ),
  },
  {
    name: "bus",
    icon: (
      <BusIcon className="w-[18px] h-[18px] text-black hover:text-[#2379FC] cursor-pointer" />
    ),
  },
  {
    name: "walk",
    icon: (
      <WalkIcon className="w-[18px] h-[18px] text-black hover:text-[#2379FC] cursor-pointer" />
    ),
  },
  {
    name: "bike",
    icon: (
      <BikeIcon className="w-[18px] h-[18px] text-black hover:text-[#2379FC] cursor-pointer" />
    ),
  },
  {
    name: "info",
    icon: (
      <FaqInfoIcon className="w-[18px] h-[18px] text-black hover:text-[#2379FC] cursor-pointer" />
    ),
  },
];

export const DEFAULT_FORM_VALUES: NewJourneyForm = {
  title: "",
  startLocation: "",
  endLocation: "",
  startDate: "",
  endDate: "",
  description: "",
  steps: [
    {
      name: "Stop 1",
      location: { coords: null, name: "" },
      notes: "",
      media: [],
      mediumOfTravel: "",
      startDate: "",
      endDate: "",
      category: "",
    },
  ],
  summary: "",
  summaryMedia: [],
  friends: [],
  tags: [],
};

export const MAPBOX_GEOCODE_URL =
  "https://api.mapbox.com/geocoding/v5/mapbox.places/";

// SVG Icons
export const PlusIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="7"
    height="7"
    fill="none"
    viewBox="0 0 7 7"
  >
    <path
      fill="#fff"
      d="M4.123 3.12h2.61v1.245h-2.61v2.61H2.878v-2.61H.283V3.12h2.595V.525h1.245z"
    />
  </svg>
);

export const EditIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="11"
    height="12"
    fill="none"
    viewBox="0 0 11 12"
  >
    <g fill="#fff" clipPath="url(#clip0_552_58635)">
      <path d="M.653 10.263A.327.327 0 0 1 .327 9.9l.251-2.287a.33.33 0 0 1 .095-.193l5.345-5.344a1.045 1.045 0 0 1 1.48 0l1.016 1.016a1.045 1.045 0 0 1 0 1.48L3.172 9.913a.33.33 0 0 1-.192.095l-2.287.251zm.566-2.467-.196 1.77 1.77-.195 5.26-5.26a.39.39 0 0 0 0-.556l-1.02-1.019a.39.39 0 0 0-.554 0z" />
      <path d="M7.514 5.43a.33.33 0 0 1-.232-.094L5.253 3.301a.328.328 0 1 1 .464-.464l2.036 2.035a.327.327 0 0 1-.239.559M5.255 4.874 2.71 7.417l.462.462 2.544-2.543zM9.801 10.263H4.574a.327.327 0 1 1 0-.654H9.8a.327.327 0 0 1 0 .654" />
    </g>
    <defs>
      <clipPath id="clip0_552_58635">
        <path fill="#fff" d="M0 .788h10.454v10.454H0z" />
      </clipPath>
    </defs>
  </svg>
);

export const DeleteIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="17"
    fill="none"
    viewBox="0 0 17 17"
  >
    <path
      fill="#fff"
      d="M12.402 6.699v-1.48a.313.313 0 0 0-.312-.313h-2.07V3.89a.313.313 0 0 0-.313-.312H7.363a.313.313 0 0 0-.312.312v1.016H4.98a.313.313 0 0 0-.313.312v1.48c0 .173.14.313.312.313h.09v6.254c0 .172.14.312.312.312h5.42A1.2 1.2 0 0 0 12 12.38V7.011h.09c.172 0 .312-.14.312-.312M7.676 4.203h1.718v.703H7.676zm3.7 8.176a.574.574 0 0 1-.574.573H5.695v-5.94h5.68zm.4-5.993H5.294v-.855h6.484z"
    />
    <path
      fill="#fff"
      d="M7.285 8.265H6.66v3.672h.625zM8.847 8.265h-.625v3.672h.625zM10.41 8.265h-.625v3.672h.625z"
    />
  </svg>
);

export const ExpandIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="10"
    height="10"
    fill="none"
    viewBox="0 0 10 10"
  >
    <path
      fill="#fff"
      d="M5.092 1.617v5.884L3.094 5.503a.377.377 0 1 0-.534.534L5.203 8.68a.377.377 0 0 0 .534 0l2.642-2.643a.376.376 0 0 0 0-.534.377.377 0 0 0-.533 0L5.847 7.501V1.617a.378.378 0 0 0-.755 0"
    />
  </svg>
);

export const ChevronDownIcon = (
  <svg
    className="w-4 h-4 ml-2"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);
