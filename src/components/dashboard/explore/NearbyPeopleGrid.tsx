"use client";
import React from "react";
import NearbyPersonCard, { Person } from "./NearbyPersonCard";

const dummyPeople: Person[] = [
  {
    name: "Terrylucas",
    avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    distance: "0.5 miles away",
    backgroundUrl: "https://picsum.photos/seed/person1/400/600",
  },
  {
    name: "Terrylucas",
    avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    distance: "0.5 miles away",
    backgroundUrl: "https://picsum.photos/seed/person2/400/600",
  },
  {
    name: "Terrylucas",
    avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    distance: "0.5 miles away",
    backgroundUrl: "https://picsum.photos/seed/person3/400/600",
  },
  {
    name: "Terrylucas",
    avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    distance: "0.5 miles away",
    backgroundUrl: "https://picsum.photos/seed/person4/400/600",
  },
];

const NearbyPeopleGrid = () => {
  return (
    <div className="">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Nearby for you</h3>
      <div className="grid grid-cols-1 md:grid-cols-2  gap-1">
        {dummyPeople.map((person, index) => (
          <NearbyPersonCard key={index} person={person} />
        ))}
      </div>
    </div>
  );
};

export default NearbyPeopleGrid;
