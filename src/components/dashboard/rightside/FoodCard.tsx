"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
// keep your own import if you have it
// import { MoreOptionsIcon } from "../center/PostCard";

type FoodCard = {
  id: number;
  title: string;
  price: string;
  host: string;
  hostImage: string; // put files in /public/dashboard/*
  foodImage: string; // put files in /public/dashboard/*
};

const Food: React.FC = () => {
  const cards: FoodCard[] = [
    {
      id: 1,
      title: "Karahi Chicken",
      price: "$395",
      host: "Usama",
      hostImage: "/dashboard/Profile-2.jpg",
      foodImage: "/dashboard/Food.svg",
    },
    {
      id: 2,
      title: "Biryani Special",
      price: "$450",
      host: "Ahmad",
      hostImage: "/dashboard/Profile.svg",
      foodImage: "/dashboard/Food.svg",
    },
    {
      id: 3,
      title: "BBQ Platter",
      price: "$520",
      host: "Ali",
      hostImage: "/dashboard/Profile-2.jpg",
      foodImage: "/dashboard/Food.svg",
    },
  ];

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-play (pauses on hover)
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % cards.length);
    }, 3500);
    return () => clearInterval(id);
  }, [paused, cards.length]);

  return (
    <section className="w-full">
      <div className="mx-auto bg-white rounded-xl shadow-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-sm md:max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Food</h2>
          {/* Replace with your icon if needed */}
          <div className="h-6 w-6 rounded-full grid place-items-center text-gray-600 hover:text-[#0F62DE]">
            •••
          </div>
        </div>

        {/* Carousel */}
        <div
          className="relative rounded-3xl overflow-hidden shadow-xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          aria-live="polite"
        >
          <div className="relative w-full overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {cards.map((card) => (
                <article key={card.id} className="relative w-full flex-shrink-0">
                  {/* Keep a consistent card shape on all screens */}
                  <div className="relative w-full aspect-[5/5]">
                    <Image
                      src={card.foodImage}
                      alt={card.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 33vw"
                      priority={card.id === 1}
                    />
                    {/* Readability overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Host */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-white">
                        <Image
                          src={card.hostImage}
                          alt={`${card.host} profile`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="text-white leading-tight">
                        <p className="text-[10px] opacity-90">Hosted by</p>
                        <p className="text-sm font-semibold">{card.host}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="absolute top-5 right-5 text-white">
                      <p className="text-lg sm:text-xl font-bold">{card.price}</p>
                    </div>

                    {/* Title */}
                    <h3 className=" mb-3 absolute bottom-16 left-1/2 -translate-x-1/2 text-center text-white text-base sm:text-lg font-semibold">
                      {card.title}
                    </h3>

                    {/* CTA */}
                    <div className="absolute left-4 right-4 bottom-4 flex justify-center">
                      <button className=" mb-3 w-full sm:w-2/3 h-9 sm:h-10 rounded-full text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-opacity">
                        Book
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 w-2 rounded-full transition-all ${i === index ? "bg-white" : "bg-white/60"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Food;
