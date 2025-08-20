"use client";

import { FC } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  A11y,
  Keyboard,
} from "swiper/modules";

// Swiper core styles (must be imported in a Client Component)
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Card = { img: string; alt?: string };

interface Props {
  cards: Card[];
}

const CardsSwiper: FC<Props> = ({ cards }) => {
  return (
    <div className="relative w-full max-w-[120px] sm:max-w-xl md:max-w-3xl px-4">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, A11y, Keyboard]}
        slidesPerView={1}
        spaceBetween={20}
        loop
        navigation
        pagination={false}
        keyboard={{ enabled: true }}
        autoplay={{
          delay: 2500,
          pauseOnMouseEnter: true,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 10 },
          1024: { slidesPerView: 3, spaceBetween: 10 },
          1440: { slidesPerView: 4, spaceBetween: 10 },
        }}
        className="px-4"
      >
        {cards.map((card, i) => (
          <SwiperSlide key={i} className="!h-auto">
            <div className="h-[80px] w-[80px] sm:h-[80px] sm:w-[120px] md:h-[130px] md:w-[140px]">
              <Image
                src={card.img}
                alt={card.alt ?? `Card ${i + 1}`}
                width={100}
                height={100}
                className="w-[100px] h-[100px] rounded-2xl object-cover shadow-sm"
                unoptimized
                priority={i < 3}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Optional: tweak Swiper's default arrow positions with Tailwind */}
      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          @apply text-black h-5 w-5 bg-white/80 rounded-full shadow-md;
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 16px;
        }
        .swiper-button-prev {
          left: -0.05rem;
          background-color: #ffffff80;
          border-radius: 50%;
          aspect-ratio: 1/1;
          color: #5b5b5b;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .swiper-button-next {
          right: 0.25rem;
          background-color: #ffffff80;
          border-radius: 50%;
          aspect-ratio: 1/1;
          color: #5b5b5b;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .swiper-pagination-bullet {
          @apply !bg-black/40;
        }
        .swiper-pagination-bullet-active {
          @apply !bg-black;
        }
      `}</style>
    </div>
  );
};

export default CardsSwiper;
