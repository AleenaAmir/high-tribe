"use client";
import React from "react";
import Image from "next/image";

type EventData = {
  title: string;
  description: string;
  time: string;
  location: string;
  tags: string[];
  imageUrl: string;
};

const EventsCard = () => {
  const event: EventData = {
    title: "Barcelona Tapas Tour",
    description:
      "Enjoy a walking food tour through hidden alleys and lively squares. Taste authentic tapas, sip Spanish wines, and discover the story behind each dish.",
    time: "Today, 7:00 PM",
    location: "Gothic Quarter",
    tags: ["Food", "Culture", "Spirituality"],
    imageUrl: "/dashboard/group-2.svg",
  };

  return (
    <article
      className="
        w-full
        max-w-[22rem] sm:max-w-md md:max-w-lg lg:max-w-xl
        bg-white rounded-2xl shadow-md overflow-hidden
        transition hover:shadow-lg
      "
      aria-label={event.title}
    >
      {/* Image */}
      <div className="relative w-full aspect-[16/9]">
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width:1024px) 60vw, 40vw"
          priority
        />
      </div>

      {/* Content */}
      <div className="p-2 sm:p-5">
        {/* Meta row */}
        <div className="flex items-center justify-between gap-3 text-[10px] sm:text-sm text-[#656565]">
          <span className="inline-flex items-center gap-2 whitespace-nowrap max-w-[50%]  text-ellipsis">
            <Image src="/dashboard/calendar.png" alt="calendar" width={16} height={16} />
            {event.time}
          </span>
          <span className="inline-flex items-center gap-2 whitespace-nowrap max-w-[50%]  text-ellipsis justify-end">
            <Image src="/dashboard/location.png" alt="location" width={15} height={15} />
            {event.location}
          </span>
        </div>


        {/* Title */}
        <h3 className="mt-3 text-[13px] sm:text-md md:text-[13px] font-roboto text-black">
          {event.title}
        </h3>

        {/* Description */}
        <p className="mt-2 text-[11px] sm:text-sm text-[#5F5E5E] font-poppins leading-relaxed">
          {event.description}
        </p>

        {/* Tags */}
        {/* Tags — fixed 3 columns, equal widths */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="
        flex w-full h-9 items-center justify-center
        rounded-2xl border border-[#D1D4D9] bg-white
        text-[#000] text-[10px] sm:text-xs truncate
      "
              title={tag}
            >
              {tag}
            </span>
          ))}
        </div>


        {/* CTA */}
        <button
          className="
            mt-4 sm:mt-5 w-full h-9 sm:h-10
            rounded-2xl font-semibold text-white
            bg-gradient-to-r from-[#9243AC] via-[#B6459F] to-[#E74294]
            hover:opacity-90 transition-opacity
            font-gilroy
          "
        >
          Join Events
        </button>
      </div>
    </article>
  );
};

export default EventsCard;
