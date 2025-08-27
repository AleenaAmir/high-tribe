'use client'
import Image from 'next/image'
import { RxCross2 } from 'react-icons/rx'
import { MdDone } from 'react-icons/md'
import { useState } from 'react'

const reviews = [
  {
    name: 'Tylor',
    date: 'Aug 18, 2025',
    image: '/images/admin1.jpg',
    title: 'Hosted item title',
    rating: '4.9',
    review:
      'Lorem ipsum dolor sit amet consectetur. Venenatis in ligula tempus et diam vel viverra et. Nunc habitant maecenas at magna pulvinar velit.',
  },
  {
    name: 'Jasmine',
    date: 'Aug 17, 2025',
    image: '/images/admin2.jpg',
    title: 'Hosted item title',
    rating: '4.9',
    review:
      'Lorem ipsum dolor sit amet consectetur. Venenatis in ligula tempus et diam vel viverra et. Nunc habitant maecenas at magna pulvinar velit.',
  },
  {
    name: 'Brad',
    date: 'Aug 16, 2025',
    image: '/images/admin3.jpg',
    title: 'Hosted item title',
    rating: '4.9',
    review:
      'Lorem ipsum dolor sit amet consectetur. Venenatis in ligula tempus et diam vel viverra et. Nunc habitant maecenas at magna pulvinar velit.',
  },
]

export default function Recommendations() {
  const [activeTab, setActiveTab] = useState('Testimonials')

  return (
    <section className='border border-gray-200 mt-2 rounded-xl'>
      <div className='px-2 py-4'>
        <h1 className='font-semibold text-[13px]'>Recommendations & Reviews</h1>
      </div>

      {/* Tabs */}
      <div className='p-2 border-b border-gray-300 gap-4 flex'>
        {['Testimonials', 'Reviews'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-xs pb-1 border-b-2 transition-colors duration-200 ${
              activeTab === tab
                ? 'border-black text-gray-900 font-semibold'
                : 'border-transparent text-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Buttons */}
      <div className='flex justify-end p-2 gap-2'>
        <button className='bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-transform duration-300 border text-[8px] py-1 px-3 rounded-4xl text-white'>
          Received
        </button>
        <button className='text-[8px] border border-gray-300 rounded-4xl py-1 px-3 hover:from-purple-600 hover:to-pink-600 transition-transform duration-300'>
          Given
        </button>
      </div>

      {/* Testimonial & Reviews */}
      <div className='divide-y divide-gray-200'>
        {reviews.map((review, index) => (
          <div key={index} className='px-2 py-4'>
            {/* Header */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Image
                  src={review.image}
                  alt={review.name}
                  width={40}
                  height={40}
                  className='rounded-full bg-white outline-2 border-2 border-white outline-purple-500'
                />
                <div>
                  <h1 className='font-semibold text-xs'>{review.name}</h1>
                  <p className='text-[10px] text-gray-500'>{review.date}</p>
                </div>
              </div>
              <div className='flex gap-1.5'>
                <button className='bg-gray-300 text-white rounded-full p-1 text-xs'>
                  <RxCross2 />
                </button>
                <button className='bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-transform duration-300 text-white rounded-full p-1 text-xs'>
                  <MdDone />
                </button>
              </div>
            </div>

            {/* Rating and Title */}
            <div className='flex gap-2 mt-2 '>
              <p className='text-gray-400 text-[10px]'>{review.title}</p>
              <p className='border-l text-[10px] border-gray-400 pl-2.5 font-bold'>
                {review.rating}
              </p>
            </div>

            {/* Review Text */}
            <p className='text-[10px] text-gray-900 mt-2'>{review.review}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
