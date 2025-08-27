'use client'
import { useState } from 'react'
import Image from 'next/image'
import { FaHeart } from 'react-icons/fa6'

const TravelCardData = [
  {
    image: '/images/dubai.png',
    country: 'Dubai',
    about:
      'Experience luxury, skyscrapers, desert safaris, and vibrant nightlife.',
    participants: '3',
  },
  {
    image: '/images/pakistan.png',
    country: 'Pakistan',
    about:
      'Discover majestic mountains, cultural heritage, food, and warm hospitality.',
    participants: '5',
  },
  {
    image: '/images/bangkok.png',
    country: 'Bangkok',
    about:
      'Enjoy street food, temples, nightlife, shopping, and tropical vibes.',
    participants: '4',
  },
  {
    image: '/images/dubai.png',
    country: 'Dubai',
    about:
      'Luxury escapes, desert adventures, and world-class shopping experiences.',
    participants: '2',
  },
  {
    image: '/images/pakistan.png',
    country: 'Pakistan',
    about:
      'Natural wonders, history, culture, and unmatched hospitality await you.',
    participants: '6',
  },
  {
    image: '/images/bangkok.png',
    country: 'Bangkok',
    about: 'Bustling city life with serene temples and great food.',
    participants: '3',
  },
]

export default function TravelCard() {
  const [showAll, setShowAll] = useState(false)

  // Show only 3 if not expanded
  const visibleCards = showAll ? TravelCardData : TravelCardData.slice(0, 3)

  return (
    <section className='mt-4'>
      <div className='grid grid-cols-3 gap-4'>
        {visibleCards.map((card, index) => (
          <div
            key={index}
            className='rounded-lg overflow-hidden shadow-md flex flex-col'
          >
            <div className='relative'>
              <Image
                src={card.image}
                alt={card.country}
                width={100}
                height={100}
                className='w-full h-40 object-cover'
              />
              <FaHeart className='absolute top-2 right-2 text-pink-600 bg-white p-1 rounded-full text-xl cursor-pointer drop-shadow-md' />
            </div>

            <div className='p-3 flex-1 flex flex-col bg-white'>
              <h2 className='font-semibold text-sm'>Travel to {card.country}</h2>
              <p className='text-xs text-gray-400 flex-1'>{card.about}</p>
              <p className='text-xs text-gray-500 mt-2'>
                Participants: {card.participants}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* See more button */}
      <div className='flex justify-center mt-4'>
        <button
          onClick={() => setShowAll(!showAll)}
          className='bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-transform duration-300 text-white px-4 py-2 rounded-md text-sm'
        >
          {showAll ? 'See Less' : 'See More'}
        </button>
      </div>
    </section>
  )
}
