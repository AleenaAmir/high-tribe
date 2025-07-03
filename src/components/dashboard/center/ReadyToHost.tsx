"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { MoreOptionsIcon } from "./PostCard";
import React from "react";

const cardDetails = [
  {
    img: "/dashboard/cardbgblue.svg",
  },
  {
    img: "/dashboard/cardbgorange.svg",
  },
  {
    img: "/dashboard/cardbgyellow.svg",
  },
];

const participants = [
  { avatarUrl: "https://randomuser.me/api/portraits/men/51.jpg" },
  { avatarUrl: "https://randomuser.me/api/portraits/women/52.jpg" },
  { avatarUrl: "https://randomuser.me/api/portraits/men/53.jpg" },
  { avatarUrl: "https://randomuser.me/api/portraits/women/54.jpg" },
  { avatarUrl: "https://randomuser.me/api/portraits/men/55.jpg" },
];

const star = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="10"
    height="9"
    fill="none"
    viewBox="0 0 10 9"
  >
    <path
      fill="#F28321"
      d="m5 7.638-2.075 1.25a.45.45 0 0 1-.288.075.5.5 0 0 1-.262-.1.6.6 0 0 1-.175-.219.44.44 0 0 1-.025-.294l.55-2.362L.887 4.4a.48.48 0 0 1-.137-.537.53.53 0 0 1 .15-.225.5.5 0 0 1 .275-.113L3.6 3.313l.937-2.225a.45.45 0 0 1 .194-.225A.54.54 0 0 1 5 .788q.136 0 .268.075t.194.225L6.4 3.313l2.425.212a.5.5 0 0 1 .275.113.54.54 0 0 1 .169.506.47.47 0 0 1-.157.256L7.275 5.988l.55 2.362a.44.44 0 0 1-.025.294.6.6 0 0 1-.175.219.5.5 0 0 1-.263.1.45.45 0 0 1-.287-.075z"
    ></path>
  </svg>
);

export default function ReadyToHost() {
  return (
    <section className="bg-white overflow-hidden rounded-[10px] shadow-md">
      <div className="p-4 md:p-6 flex items-center justify-between gap-4">
        <div className="text-[#656565]">
          <p className="text-[14px] md:text-[20px] font-semibold font-roboto">
            Ready to Host?
          </p>
          <p className="text-[10px] md:text-[12px]">
            Connect with travelers by sharing what you love about your location.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[#656565]">
          <span className="text-sm ">
            <MoreOptionsIcon className="hover:text-[#0F62DE]" />
          </span>
          <button className="text-2xl text-gray-500">&times;</button>
        </div>
      </div>
      <div className="grid grid-cols-1 border-t border-[#EEEEEE] lg:grid-cols-2 items-center gap-[20px] md:gap-[60px]  p-4 md:pl-10 md:py-6 md:pr-0 overflow-hidden ">
        {/* Left Side */}
        <div className="flex flex-col justify-center h-full ">
          <div className="flex items-center gap-2">
            {/* Avatars */}
            <div className="flex -space-x-2">
              {participants.slice(0, 5).map((p, i) => (
                <Image
                  key={i}
                  src={p.avatarUrl}
                  alt={`participant ${i}`}
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-white object-cover"
                  unoptimized
                />
              ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 ml-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>{star}</span>
                ))}
              </div>
              <span className="ml-2 text-xs text-[#888]">
                1000+ Happy Hosts
              </span>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#222] mb-2 leading-tight">
            Ready to Host?
          </h2>
          <p className="text-[#696969] text-base font-normal max-w-xs">
            Connect with travelers by sharing what you love about your location.
          </p>
        </div>
        {/* Right Side: Swiper Carousel */}
        <div className="flex flex-col items-center justify-center w-full h-full relative">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={10}
            slidesPerView={1.5}
            centeredSlides={false}
            loop={true}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              el: ".swiper-pagination",
              bulletClass: "swiper-pagination-bullet",
              bulletActiveClass: "swiper-pagination-bullet-active",
            }}
            className="w-full md:min-w-[330px] max-w-[330px]"
            style={
              {
                // Swiper custom properties
                // @ts-ignore
                "--swiper-pagination-color": "#247CFF",
                "--swiper-pagination-bullet-inactive-color": "#D9D9D9",
                "--swiper-pagination-bullet-inactive-opacity": "1",
                "--swiper-pagination-bullet-size": "16px",
                "--swiper-pagination-bullet-horizontal-gap": "8px",
              } as React.CSSProperties
            }
          >
            {cardDetails.map((card, idx) => (
              <SwiperSlide
                key={idx}
                style={{ width: 230, maxWidth: 360, height: 230 }}
              >
                <Image
                  src={card.img}
                  height={200}
                  width={205}
                  alt="Image"
                  className="object-contain min-w-[210px]"
                />
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Swiper Pagination Dots */}
          <div className="swiper-pagination lg:flex gap-2 justify-center absolute -bottom-5 hidden "></div>
        </div>
      </div>
    </section>
  );
}
