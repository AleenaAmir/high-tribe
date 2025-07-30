"use client";
import React, { useState, useEffect } from "react";
import { HostCard } from "./HostCard";

export const data = [
  {
    head: "Stay Host",
    text: "Offer your space to travelers",
    link: "/host/stay",
    img: "https://res.cloudinary.com/dtfzklzek/image/upload/v1752968031/Rectangle_4972_cellxp.png",
    status: true,
  },
  {
    head: "Cooking Experience",
    text: "Offer your space to travelers",
    link: "/host/cooking",
    img: "https://res.cloudinary.com/dtfzklzek/image/upload/v1752968031/Frame_2147226312_u45crc.png",
    status: false,
  },
  {
    head: "Guided Tours",
    text: "Offer your space to travelers",
    link: "/host/guide",
    img: "https://res.cloudinary.com/dtfzklzek/image/upload/v1752968031/Frame_2147226313_ovshga.png",
    status: false,
  },
  {
    head: "Events",
    text: "Offer your space to travelers",
    link: "/host/events",
    img: "https://res.cloudinary.com/dtfzklzek/image/upload/v1752968031/Frame_2147226314_q6xpsk.png",
    status: false,
  },
  {
    head: "Travel Community",
    text: "Offer your space to travelers",
    link: "/host/community",
    img: "https://res.cloudinary.com/dtfzklzek/image/upload/v1752968032/Frame_2147226315_kyopi3.png",
    status: false,
  },
];

export default function HostHome() {
  const [userName, setUserName] = useState<string>("Guest");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const name = localStorage.getItem("name");
      if (name) {
        setUserName(name);
      }
    }
  }, []);

  return (
    <div className="">
      <div className="bg-white p-3 md:px-6 md:py-3 lg:px-8 lg:pt-4 lg:pb-0">
        <h3 className="text-[16px] font-bold text-[#1C231F] lg:text-[20px] capitalize">
          Hello {userName}
        </h3>
        <p className="text-[8px] lg:text-[10px] text-[#1C231F] max-w-[350px]">
          In a prime location in the NE Mission Arts district of San Francisco,
          this is an airy 1300 square foot space with breathtaking views over
          the Mission,
        </p>
      </div>
      <div className="flex items-center gap-4 flex-wrap p-3 md:px-6 md:py-3 lg:px-8 lg:pt-4 lg:pb-0">
        {data.map((item) => (
          <HostCard key={item.head} {...item} />
        ))}
      </div>
    </div>
  );
}
