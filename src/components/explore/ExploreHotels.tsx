import Image from "next/image";
import React from "react";

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
    },
    {
      title: "Lahore Fort",
      category: "Attraction",
      location: "Lahore, Pakistan",
      rating: "4.6 (26)",
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Lahore Fort",
      category: "Attraction",
      location: "Lahore, Pakistan",
      rating: "4.6 (26)",
      image:
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Lahore Fort",
      category: "Attraction",
      location: "Lahore, Pakistan",
      rating: "4.6 (26)",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Lahore Fort",
      category: "Attraction",
      location: "Lahore, Pakistan",
      rating: "4.6 (26)",
      image:
        "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Lahore Fort",
      category: "Attraction",
      location: "Lahore, Pakistan",
      rating: "4.6 (26)",
      image:
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop",
    },
  ];

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
                className="rounded-xl border border-gray-100 bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
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
    </div>
  );
}
