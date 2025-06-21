"use client";
import React, { useState } from "react";

const ReadyToHost = () => {
  const [activeCard, setActiveCard] = useState(1);

  const cardDetails = [
    {
      id: 0,
      bgColor: "/dashboard/cardbg1.png",
      title: "Host an Food Experience",
      description: "Share your culinary skills with others",
    },
    {
      id: 1,
      bgColor: "/dashboard/cardbg2.png",
      title: "Host an Experience",
      description: "Share your local knowledge with travelers",
      longText:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dumm",
      readMore: true,
    },
    {
      id: 2,
      bgColor: "/dashboard/cardbg3.png",
      title: "Host Tours & Trips",
      description: "Guide travelers through unique adventures",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 my-4">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Ready to Host?</h2>
          <p className="text-custom-gray mt-1">
            Connect with travelers by sharing what you love about your location.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="text-gray-500 hover:text-gray-800 text-2xl"
            title="More options"
          >
            ...
          </button>
          <button
            className="text-gray-500 hover:text-gray-800 text-2xl"
            title="Close"
          >
            ×
          </button>
        </div>
      </div>

      <div className="relative flex justify-center items-center h-[28rem] md:h-64">
        {cardDetails.map((card) => {
          const offset = card.id - activeCard;
          const isActive = offset === 0;

          let transform = "";
          if (isActive) {
            transform = "scale-105";
          } else if (offset === 1 || offset === -2) {
            transform =
              "scale-95 translate-y-[75%] md:translate-y-0 md:translate-x-[60%]";
          } else {
            // offset === -1 || offset === 2
            transform =
              "scale-95 -translate-y-[75%] md:translate-y-0 md:-translate-x-[60%]";
          }

          const zIndex = isActive ? "z-20" : "z-10";
          const opacity = isActive ? "opacity-100" : "opacity-70";

          return (
            <div
              key={card.id}
              onClick={() => setActiveCard(card.id)}
              style={{ backgroundImage: `url(${card.bgColor})` }}
              className={`
               
                absolute p-6 rounded-2xl text-white bg-cover bg-center bg-no-repeat
                 max-w-[390px] w-full  min-h-60 h-fit flex flex-col
                transition-all duration-300 ease-in-out cursor-pointer
                ${zIndex} ${opacity} ${transform}
              `}
            >
              <h3 className="text-2xl font-bold max-w-[215px]">{card.title}</h3>
              <p className=" text-[16px] max-w-[215px]">{card.description}</p>
              {isActive && card.longText && (
                <p className="text-xs mt-1 font-light max-w-[215px]">
                  {card.longText}
                </p>
              )}
              {isActive && card.readMore && (
                <a href="#" className="text-[10px] mt-auto underline">
                  Read more
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReadyToHost;
