"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./StoriesBar.css";

const stories = [
  {
    name: "Sarah T.",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
    live: true,
  },
  {
    name: "Nadir K.",
    img: "https://randomuser.me/api/portraits/men/68.jpg",
    live: true,
  },
  {
    name: "Elena P.",
    img: "https://randomuser.me/api/portraits/women/69.jpg",
    live: true,
  },
  { name: "Tokyo", img: "https://randomuser.me/api/portraits/men/69.jpg" },
  { name: "Hunza", img: "https://randomuser.me/api/portraits/women/70.jpg" },
  { name: "Barcelona", img: "https://randomuser.me/api/portraits/men/70.jpg" },
  { name: "Sydney", img: "https://randomuser.me/api/portraits/women/71.jpg" },
  { name: "John D.", img: "https://randomuser.me/api/portraits/men/71.jpg" },
  { name: "Jane S.", img: "https://randomuser.me/api/portraits/women/72.jpg" },
  { name: "Hunza", img: "https://randomuser.me/api/portraits/women/70.jpg" },
  { name: "Barcelona", img: "https://randomuser.me/api/portraits/men/70.jpg" },
  { name: "Sydney", img: "https://randomuser.me/api/portraits/women/71.jpg" },
  { name: "John D.", img: "https://randomuser.me/api/portraits/men/71.jpg" },
  { name: "Jane S.", img: "https://randomuser.me/api/portraits/women/72.jpg" },
];

const StoriesBar = () => {
  return (
    <div className="p-2 bg-white rounded-lg shadow-md relative">
      <h2 className="text-lg font-semibold text-[#696969] mb-4">
        Stories from the Tribe
      </h2>
      <Swiper
        modules={[Navigation]}
        spaceBetween={10}
        slidesPerView="auto"
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        className="!pb-4"
      >
        <SwiperSlide className="!w-auto">
          <div className="flex flex-col items-center gap-2 cursor-pointer">
            <div className="relative">
              <Image
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Your Story"
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover"
                unoptimized
              />
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white border-2 border-white">
                +
              </div>
            </div>
          </div>
        </SwiperSlide>
        {stories.map((story, index) => (
          <SwiperSlide key={index} className="!w-auto">
            <div className="flex flex-col items-center gap-2 cursor-pointer">
              <div
                className={`w-16 h-16 rounded-full p-0.5 ${
                  story.live
                    ? "bg-gradient-to-tr from-purple-500 to-pink-500"
                    : ""
                }`}
              >
                <div className="bg-white p-0.5 rounded-full">
                  <Image
                    src={story.img}
                    alt={story.name}
                    width={64}
                    height={64}
                    className="w-full h-full rounded-full object-cover"
                    unoptimized
                  />
                </div>
              </div>
              <span className="text-xs text-gray-600">{story.name}</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="swiper-button-next-custom absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  );
};

export default StoriesBar;
