import React, { useState } from "react";
import Image from "next/image";

interface Booking {
  id: string;
  name: string;
  image: string;
  category: string;
  host: {
    name: string;
    avatar: string;
  };
  price: number;
  description?: string;
}

interface JourneyBookingsProps {
  journeyData: any;
}

const JourneyBookings: React.FC<JourneyBookingsProps> = ({ journeyData }) => {
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);

  // Sample booking data
  const bookings: Booking[] = [
    {
      id: "1",
      name: "Badshahi Masque",
      image: "/dashboard/hotdeal.png", // Hotel room image
      category: "accommodation",
      host: {
        name: "Host",
        avatar: "/dashboard/landingpage/Avatar.png",
      },
      price: 200,
      description: "Luxury hotel accommodation",
    },
    {
      id: "2",
      name: "Badshahi Masque",
      image: "/dashboard/cart.png", // Car image
      category: "transport",
      host: {
        name: "Host",
        avatar: "/dashboard/landingpage/Avatar.png",
      },
      price: 50,
      description: "Private car service",
    },
    {
      id: "3",
      name: "Badshahi Masque",
      image: "/dashboard/wishlist.png", // Food image
      category: "restaurant",
      host: {
        name: "Host",
        avatar: "/dashboard/landingpage/Avatar.png",
      },
      price: 100,
      description: "Traditional local cuisine",
    },
    {
      id: "4",
      name: "Badshahi Masque",
      image: "/dashboard/achivment.png", // Mosque/building image
      category: "attraction",
      host: {
        name: "Host",
        avatar: "/dashboard/landingpage/Avatar.png",
      },
      price: 300,
      description: "Historical mosque visit",
    },
    {
      id: "5",
      name: "Badshahi Masque",
      image: "/dashboard/cardbg3.png", // Adventure activity image
      category: "activity",
      host: {
        name: "Host",
        avatar: "/dashboard/landingpage/Avatar.png",
      },
      price: 250,
      description: "Rock climbing adventure",
    },
    {
      id: "6",
      name: "Badshahi Masque",
      image: "/dashboard/dashboardmap.png", // Mountain view image
      category: "attraction",
      host: {
        name: "Host",
        avatar: "/dashboard/landingpage/Avatar.png",
      },
      price: 280,
      description: "Mountain peak experience",
    },
  ];

  const getCategoryIcons = (category: string) => {
    const icons = {
      accommodation: ["bg-purple-400", "bg-blue-400", "bg-purple-800"],
      transport: ["bg-blue-400", "bg-green-400", "bg-blue-600"],
      restaurant: ["bg-orange-400", "bg-red-400", "bg-orange-600"],
      attraction: ["bg-purple-400", "bg-blue-400", "bg-purple-800"],
      activity: ["bg-green-400", "bg-blue-400", "bg-green-600"],
    };
    return icons[category as keyof typeof icons] || icons.attraction;
  };

  const handleBookingToggle = (bookingId: string) => {
    setSelectedBookings((prev) =>
      prev.includes(bookingId)
        ? prev.filter((id) => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  const totalAmount = selectedBookings.reduce((total, bookingId) => {
    const booking = bookings.find((b) => b.id === bookingId);
    return total + (booking?.price || 0);
  }, 0);

  return (
    <div className="flex flex-col h-full">
      {/* Bookings List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className={`bg-white rounded-lg border-2 transition-all cursor-pointer ${
                selectedBookings.includes(booking.id)
                  ? "border-blue-500 shadow-lg"
                  : "border-[#E7E7E7] hover:border-gray-300"
              }`}
              onClick={() => handleBookingToggle(booking.id)}
            >
              <div className="flex items-center gap-2">
                {/* Left: Image */}
                <div className="flex-shrink-0 rounded-lg overflow-hidden mx-2 w-16">
                  <Image
                    src={booking.image}
                    alt={booking.name}
                    width={42}
                    height={39}
                    className="w-full h-full object-contain max-h-[39px] max-w-[42px] m-auto"
                  />
                </div>

                {/* Middle: Content */}
                <div className="flex-1 min-w-0 ">
                  <h3 className="text-[14px] font-bold text-[#7F7C7C]">
                    {booking.name}
                  </h3>

                  {/* Category Icons */}
                  <div className="flex items-center gap-1">
                    {getCategoryIcons(booking.category).map(
                      (colorClass, index) => (
                        <div
                          key={index}
                          className={`w-3 h-3 rounded-full ${colorClass}`}
                        />
                      )
                    )}
                  </div>
                </div>

                {/* Right: Host, Price, Menu */}
                <div className="flex items-center gap-3 h-full">
                  {/* Host */}
                  <div className="flex items-center gap-2 p-4 h-full">
                    <div className="w-6 h-6 rounded-full overflow-hidden">
                      <Image
                        src={booking.host.avatar}
                        alt={booking.host.name}
                        width={24}
                        height={24}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[8px] font-semibold text-[#0F0F0F]">
                      {booking.host.name}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="text-right p-4 border-x border-[#E7E7E7] h-full">
                    <div className="text-[12px] font-bold text-[#7F7C7C]">
                      ${booking.price}
                    </div>
                  </div>

                  {/* Menu Icon */}
                  <button
                    className=" text-black hover:text-gray-600 p-4 h-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle menu click
                    }}
                  >
                    <svg
                      className="w-4 h-4 rotate-90"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer: Total Amount and Add to Cart */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="flex items-center justify-end mb-4">
          <div className="text-right">
            <span className="text-sm font-medium text-gray-900">
              Total Amount: ${totalAmount}
            </span>
          </div>
        </div>

        <button
          className="w-full max-w-[290px] flex items-center justify-center mx-auto text-[13px] bg-[#2767E7] text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          onClick={() => {
            // Handle add to cart
            console.log("Adding to cart:", selectedBookings);
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default JourneyBookings;
