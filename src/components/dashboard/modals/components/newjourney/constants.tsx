import React from "react";
import PlaneIcon from "@/components/dashboard/svgs/PlaneIcon";
import TrainIcon from "@/components/dashboard/svgs/TrainIcon";
import CarIcon from "@/components/dashboard/svgs/CarIcon";
import BusIcon from "@/components/dashboard/svgs/BusIcon";
import WalkIcon from "@/components/dashboard/svgs/WalkIcon";
import BikeIcon from "@/components/dashboard/svgs/BikeIcon";
import FaqInfoIcon from "@/components/dashboard/svgs/FaqInfoIcon";
import {
  TravelMedium,
  NewJourneyForm,
  ExistingJourney,
  ExistingJourneyListItem,
} from "./types";

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

// Mock data for existing journeys - matching NewJourneyForm structure
export const MOCK_EXISTING_JOURNEYS: ExistingJourney[] = [
  {
    id: "1",
    title: "Lahore to Hunza Adventure",
    description:
      "An amazing journey through northern Pakistan exploring beautiful landscapes and cultural sites.",
    startLocation: {
      coords: [74.3587, 31.5204],
      name: "Lahore, Pakistan",
    },
    endLocation: {
      coords: [74.6506, 36.3167],
      name: "Hunza Valley, Pakistan",
    },
    startDate: "2024-01-15",
    endDate: "2024-01-25",
    steps: [
      {
        name: "Islamabad Stopover",
        location: {
          coords: [73.0479, 33.6844],
          name: "Islamabad, Pakistan",
        },
        notes: "Quick rest and preparation for mountain journey",
        media: [],
        mediumOfTravel: "car",
        startDate: "2024-01-16",
        endDate: "2024-01-16",
        category: "1",
      },
      {
        name: "Naran Valley",
        location: {
          coords: [73.6553, 34.9069],
          name: "Naran, Pakistan",
        },
        notes: "Beautiful mountain views and lake visit",
        media: [],
        mediumOfTravel: "car",
        startDate: "2024-01-17",
        endDate: "2024-01-19",
        category: "3",
      },
      {
        name: "Gilgit City",
        location: {
          coords: [74.3063, 35.9206],
          name: "Gilgit, Pakistan",
        },
        notes: "Local markets and cultural experience",
        media: [],
        mediumOfTravel: "car",
        startDate: "2024-01-20",
        endDate: "2024-01-22",
        category: "1",
      },
    ],
    visibility: "public",
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-25T18:00:00Z",
    userId: "user-1",
    friends: [
      { id: 1, name: "Ahmad Ali", email: "ahmad@example.com" },
      { id: 2, name: "Sara Khan", email: "sara@example.com" },
    ],
    tags: ["🏔️ Mountains", "🚗 Road Trip", "🎨 Culture"],
    totalDistance: 1200,
    totalDuration: "10 days",
    status: "draft",
  },
  {
    id: "2",
    title: "USA Coast to Coast",
    description:
      "Epic road trip across the United States from east coast to west coast.",
    startLocation: {
      coords: [-74.006, 40.7128],
      name: "New York, NY, USA",
    },
    endLocation: {
      coords: [-118.2437, 34.0522],
      name: "Los Angeles, CA, USA",
    },
    startDate: "2023-06-01",
    endDate: "2023-06-20",
    steps: [
      {
        name: "Philadelphia Historic Tour",
        location: {
          coords: [-75.1652, 39.9526],
          name: "Philadelphia, PA, USA",
        },
        notes: "Liberty Bell and Independence Hall visit",
        media: [],
        mediumOfTravel: "car",
        startDate: "2023-06-02",
        endDate: "2023-06-03",
        category: "2",
      },
      {
        name: "Chicago Deep Dish",
        location: {
          coords: [-87.6298, 41.8781],
          name: "Chicago, IL, USA",
        },
        notes: "Must try deep dish pizza and explore downtown",
        media: [],
        mediumOfTravel: "car",
        startDate: "2023-06-05",
        endDate: "2023-06-07",
        category: "1",
      },
      {
        name: "Rocky Mountains",
        location: {
          coords: [-104.9903, 39.7392],
          name: "Denver, CO, USA",
        },
        notes: "Hiking and mountain views in Rocky Mountain National Park",
        media: [],
        mediumOfTravel: "car",
        startDate: "2023-06-10",
        endDate: "2023-06-13",
        category: "3",
      },
      {
        name: "Grand Canyon South Rim",
        location: {
          coords: [-112.1401, 36.0544],
          name: "Grand Canyon, AZ, USA",
        },
        notes: "Sunrise and sunset photography at the canyon",
        media: [],
        mediumOfTravel: "car",
        startDate: "2023-06-16",
        endDate: "2023-06-18",
        category: "3",
      },
    ],
    visibility: "tribe",
    createdAt: "2023-05-20T10:00:00Z",
    updatedAt: "2023-06-21T20:00:00Z",
    userId: "user-1",
    friends: [{ id: 3, name: "Mike Johnson", email: "mike@example.com" }],
    tags: ["🚗 Road Trip", "🇺🇸 USA", "📸 Photography"],
    totalDistance: 2800,
    totalDuration: "20 days",
    status: "draft",
  },
  {
    id: "3",
    title: "Greek Islands Paradise",
    description:
      "Island hopping adventure through the most beautiful Greek islands with rich history and stunning beaches.",
    startLocation: {
      coords: [23.7275, 37.9755],
      name: "Athens, Greece",
    },
    endLocation: {
      coords: [25.3737, 36.3932],
      name: "Santorini, Greece",
    },
    startDate: "2024-05-01",
    endDate: "2024-05-15",
    steps: [
      {
        name: "Acropolis & Ancient Athens",
        location: {
          coords: [23.7265, 37.9715],
          name: "Acropolis, Athens, Greece",
        },
        notes: "Explore ancient history and visit Parthenon",
        media: [],
        mediumOfTravel: "walk",
        startDate: "2024-05-02",
        endDate: "2024-05-02",
        category: "2",
      },
      {
        name: "Mykonos Beaches",
        location: {
          coords: [25.3289, 37.4467],
          name: "Mykonos, Greece",
        },
        notes: "Paradise Beach and vibrant nightlife experience",
        media: [],
        mediumOfTravel: "plane",
        startDate: "2024-05-04",
        endDate: "2024-05-07",
        category: "3",
      },
      {
        name: "Naxos Traditional Village",
        location: {
          coords: [25.3756, 37.1036],
          name: "Naxos, Greece",
        },
        notes: "Authentic Greek culture and amazing local food",
        media: [],
        mediumOfTravel: "plane",
        startDate: "2024-05-08",
        endDate: "2024-05-11",
        category: "1",
      },
      {
        name: "Paros Marble Quarries",
        location: {
          coords: [25.1448, 37.0857],
          name: "Paros, Greece",
        },
        notes: "Historic marble quarries and fishing villages",
        media: [],
        mediumOfTravel: "plane",
        startDate: "2024-05-12",
        endDate: "2024-05-13",
        category: "2",
      },
    ],
    visibility: "private",
    createdAt: "2024-04-15T09:00:00Z",
    updatedAt: "2024-05-16T16:00:00Z",
    userId: "user-1",
    friends: [],
    tags: ["🏝️ Islands", "🇬🇷 Greece", "🏛️ History", "🏖️ Beaches"],
    totalDistance: 800,
    totalDuration: "15 days",
    status: "draft",
  },
];

export const MOCK_JOURNEY_LIST: ExistingJourneyListItem[] =
  MOCK_EXISTING_JOURNEYS.map((journey) => ({
    id: journey.id,
    title: journey.title,
    startLocation: journey.startLocation.name,
    endLocation: journey.endLocation.name,
    startDate: journey.startDate,
    endDate: journey.endDate,
    status: journey.status,
    totalSteps: journey.steps.length,
  }));
