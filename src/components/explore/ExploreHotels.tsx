import Image from "next/image";
import React, { useMemo, useState } from "react";

export default function ExploreHotels({
  setIsExplorePanelOpen,
}: {
  setIsExplorePanelOpen: (isOpen: boolean) => void;
}) {
  const experiences = [
    {
      title: "Lahore Fort",
      category: "Attraction",
      location: "Lahore, Pakistan",
      rating: "4.6 (26)",
      image:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop",
      price: 165,
      images: [
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
      ],
    },
    {
      title: "Lahore Fort",
      category: "Attraction",
      location: "Lahore, Pakistan",
      rating: "4.6 (26)",
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
      price: 180,
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1200&auto=format&fit=crop",
      ],
    },
    {
      title: "Lahore Fort",
      category: "Attraction",
      location: "Lahore, Pakistan",
      rating: "4.6 (26)",
      image:
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop",
      price: 140,
      images: [
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop",
      ],
    },
    {
      title: "Lahore Fort",
      category: "Attraction",
      location: "Lahore, Pakistan",
      rating: "4.6 (26)",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
      price: 210,
      images: [
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
      ],
    },
    {
      title: "Lahore Fort",
      category: "Attraction",
      location: "Lahore, Pakistan",
      rating: "4.6 (26)",
      image:
        "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1200&auto=format&fit=crop",
      price: 175,
      images: [
        "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
      ],
    },
    {
      title: "Lahore Fort",
      category: "Attraction",
      location: "Lahore, Pakistan",
      rating: "4.6 (26)",
      image:
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop",
      price: 190,
      images: [
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop",
      ],
    },
  ];

  const [selected, setSelected] = useState<(typeof experiences)[number] | null>(
    null
  );

  const description = useMemo(
    () =>
      "In a prime location in the Mission district of San Francisco, this open-air venue offers the perfect backdrop for a variety of events. The space is bright and welcoming with an open layout and exceptional lighting, making it ideal for receptions, workshops, and intimate gatherings.",
    []
  );

  return (
    <div>
      <div className="fixed left-0 top-30 bottom-2 z-40 w-[524px] bg-white rounded-r-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Search */}
        <div className="p-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
              </div>
              <input
                className="w-full bg-gray-100/80 focus:bg-gray-100 transition rounded-full pl-9 pr-3 py-2 text-[12px] outline-none"
                placeholder="Search"
              />
            </div>
            <button
              className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              onClick={() => setIsExplorePanelOpen(false)}
              aria-label="Close"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Heading */}
        <div className="px-3 pb-2">
          <div className="text-[12px] font-semibold text-gray-800">
            Explore new experiences
          </div>
          <div className="text-[10px] text-gray-500 leading-snug">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's
          </div>
        </div>

        {/* Cards */}
        <div className="h-full overflow-auto px-3 pb-4">
          <div className="grid grid-cols-2 gap-3">
            {experiences.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-gray-100 bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)] cursor-pointer"
                onClick={() => setSelected(item)}
              >
                {/* Image */}
                <div className="relative h-36 w-full">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  {/* Top-left round badge */}
                  <div className="absolute left-2 top-2 h-6 w-6 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-gray-700"
                    >
                      <path d="M12 2 2 7l10 5 10-5-10-5Z"></path>
                      <path d="M2 17l10 5 10-5"></path>
                      <path d="M2 12l10 5 10-5"></path>
                    </svg>
                  </div>
                  {/* Heart */}
                  <button className="absolute right-2 top-2 h-6 w-6 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-gray-700"
                    >
                      <path d="M19 14c-1.67 1.67-5 4-7 4s-5.33-2.33-7-4a5 5 0 0 1 7-7 5 5 0 0 1 7 7Z" />
                    </svg>
                  </button>
                  {/* Dots */}
                  <button className="absolute right-2 bottom-2 h-6 w-6 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-gray-600"
                    >
                      <circle cx="5" cy="12" r="2" />
                      <circle cx="12" cy="12" r="2" />
                      <circle cx="19" cy="12" r="2" />
                    </svg>
                  </button>
                  {/* Image pager dots */}
                  <div className="absolute left-2 bottom-2 flex gap-1">
                    {[...Array(6)].map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 w-1.5 rounded-full ${
                          i === 1 ? "bg-white" : "bg-white/60"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Meta */}
                <div className="px-2.5 py-2">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-semibold text-gray-800 truncate">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {item.rating}
                    </div>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-gray-700">
                    <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-gray-900 text-white text-[9px]">
                      🏰
                    </span>
                    <span className="truncate">{item.category}</span>
                  </div>
                  <div className="text-[10px] text-gray-500 truncate">
                    {item.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Details Drawer */}
      {selected && (
        <div className="fixed left-[524px] right-4 top-30 bottom-2 z-50 rounded-2xl bg-white border border-gray-100 shadow-2xl overflow-hidden">
          <div className="h-full w-full overflow-auto">
            <div className="relative">
              <button
                className="absolute right-3 top-3 h-9 w-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur shadow"
                onClick={() => setSelected(null)}
                aria-label="Close details"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </div>

            <div className="p-4 md:p-6 lg:p-8">
              {/* Header */}
              <div className="flex items-center gap-2 mb-4">
                {/* <span className="px-3 py-1 text-[11px] rounded-full bg-blue-50 text-blue-700 font-medium">
                  Event Space
                </span>
                <span className="px-3 py-1 text-[11px] rounded-full bg-gray-100 text-gray-700">
                  Top rated
                </span> */}
              </div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xl font-semibold text-gray-900">
                    {selected.title}
                  </div>
                  <div className="text-sm text-gray-600">
                    {selected.location}
                  </div>
                </div>
                <div className="hidden md:block text-sm text-gray-600">
                  {selected.rating}
                </div>
              </div>

              {/* Gallery + Booking */}
              <div className="">
                {/* Gallery */}
                <div className="">
                  <div className="grid grid-cols-3 gap-3 h-[180px] md:h-[220px] lg:h-[240px]">
                    <div className="relative rounded-xl overflow-hidden">
                      <Image
                        src={selected.images?.[0] || selected.image}
                        alt={selected.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative rounded-xl overflow-hidden">
                      <Image
                        src={selected.images?.[1] || selected.image}
                        alt={selected.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative rounded-xl overflow-hidden">
                      <Image
                        src={selected.images?.[2] || selected.image}
                        alt={selected.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-4">
                    <div className="lg:col-span-2">
                      {/* About */}
                      <div className="mt-6">
                        <div className="text-lg font-semibold text-gray-900 mb-2">
                          About the Space
                        </div>
                        <p className="text-sm leading-6 text-gray-700">
                          {description}
                        </p>
                      </div>

                      {/* Accordions */}
                      <div className="mt-6 divide-y divide-gray-100 border-y border-gray-100 rounded-lg">
                        {[
                          "Food and Beverages",
                          "Alcoholic Beverages",
                          "Restrooms",
                          "AV and Music",
                          "Event Rules",
                          "Parking",
                          "Host Rules",
                        ].map((title) => (
                          <details key={title} className="group">
                            <summary className="list-none cursor-pointer select-none flex items-center justify-between py-3 text-sm font-medium text-gray-900">
                              <span>{title}</span>
                              <span className="transition-transform group-open:rotate-180">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <path d="m6 9 6 6 6-6" />
                                </svg>
                              </span>
                            </summary>
                            <div className="pb-4 text-sm text-gray-600">
                              Rules include food and non-alcoholic beverages;
                              outside food may be allowed depending on host
                              discretion.
                            </div>
                          </details>
                        ))}
                      </div>
                    </div>
                    {/* Booking Card */}
                    <div className="lg:col-span-1">
                      <div className="lg:sticky lg:top-6 border border-gray-100 rounded-xl p-4 shadow-[0_8px_24px_rgba(0,0,0,0.06)] bg-white max-w-[360px] mx-auto lg:mx-0">
                        <div className="text-right">
                          <div className="text-2xl font-semibold text-gray-900">
                            ${selected.price?.toFixed?.(0) || "782"}.93
                          </div>
                          <div className="text-xs text-gray-500">
                            Estimated total
                          </div>
                        </div>

                        <div className="mt-4 space-y-2">
                          <label className="text-xs text-gray-700">
                            Date and time (required)
                          </label>
                          <input
                            type="date"
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="time"
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                            />
                            <input
                              type="time"
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                            />
                          </div>
                          <button className="text-[12px] text-blue-600 hover:underline inline-flex items-center gap-1">
                            Extend a day
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M9 18l6-6-6-6" />
                            </svg>
                          </button>
                        </div>

                        <div className="mt-4 text-xs text-gray-600 flex items-start gap-2">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="mt-0.5"
                          >
                            <path d="M8 2v4" />
                            <path d="M16 2v4" />
                            <rect width="18" height="18" x="3" y="4" rx="2" />
                            <path d="M3 10h18" />
                          </svg>
                          <span>
                            5 hr minimum. If you request fewer, the host might
                            still require 5 hrs.
                          </span>
                        </div>

                        <div className="mt-4 border-t border-gray-100 pt-4 text-sm">
                          <div className="text-xs text-gray-500 pb-1">
                            Price details
                          </div>
                          <div className="flex items-center justify-between py-1 text-gray-700">
                            <span>Space</span>
                            <span>$640.00</span>
                          </div>
                          <div className="flex items-center justify-between py-1 text-gray-700">
                            <span>Cleaning Fee</span>
                            <span>$75.00</span>
                          </div>
                          <div className="flex items-center justify-between py-1 text-gray-700">
                            <span>VAT (13%)</span>
                            <span>$67.93</span>
                          </div>
                          <div className="flex items-center justify-between py-2 font-semibold text-gray-900 border-t border-gray-100 mt-2">
                            <span>Total before taxes</span>
                            <span>
                              ${selected.price?.toFixed?.(0) || "782"}.93
                            </span>
                          </div>
                        </div>

                        <button className="mt-3 w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 shadow-[0_8px_16px_rgba(37,99,235,0.35)]">
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
