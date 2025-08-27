'use client'
import Image from 'next/image'
import { RxCross2 } from 'react-icons/rx'
import { MdDone } from 'react-icons/md'
import { useState } from 'react'

const Shoutouts = [
  {
    date: 'Aug 18, 2025',
    image: '/images/admin1.jpg',
    shoutouts:
      'Lorem ipsum dolor sit amet consectetur. Venenatis in ligula tempus et diam vel viverra et. Nunc habitant maecenas at magna pulvinar velit.',
  },
  {
    date: 'Aug 18, 2025',
    image: '/images/admin1.jpg',
    shoutouts:
      'Lorem ipsum dolor sit amet consectetur. Venenatis in ligula tempus et diam vel viverra et. Nunc habitant maecenas at magna pulvinar velit.',
  },
  {
    date: 'Aug 18, 2025',
    image: '/images/admin1.jpg',
    shoutouts:
      'Lorem ipsum dolor sit amet consectetur. Venenatis in ligula tempus et diam vel viverra et. Nunc habitant maecenas at magna pulvinar velit.',
  },
  {
    date: 'Aug 18, 2025',
    image: '/images/admin1.jpg',
    shoutouts:
      'Lorem ipsum dolor sit amet consectetur. Venenatis in ligula tempus et diam vel viverra et. Nunc habitant maecenas at magna pulvinar velit.',
  },
  {
    date: 'Aug 18, 2025',
    image: '/images/admin1.jpg',
    shoutouts:
      'Lorem ipsum dolor sit amet consectetur. Venenatis in ligula tempus et diam vel viverra et. Nunc habitant maecenas at magna pulvinar velit.',
  },
  {
    date: 'Aug 18, 2025',
    image: '/images/admin1.jpg',
    shoutouts:
      'Lorem ipsum dolor sit amet consectetur. Venenatis in ligula tempus et diam vel viverra et. Nunc habitant maecenas at magna pulvinar velit.',
  },
  {
    date: 'Aug 18, 2025',
    image: '/images/admin1.jpg',
    shoutouts:
      'Lorem ipsum dolor sit amet consectetur. Venenatis in ligula tempus et diam vel viverra et. Nunc habitant maecenas at magna pulvinar velit.',
  },
  {
    date: 'Aug 18, 2025',
    image: '/images/admin1.jpg',
    shoutouts:
      'Lorem ipsum dolor sit amet consectetur. Venenatis in ligula tempus et diam vel viverra et. Nunc habitant maecenas at magna pulvinar velit.',
  },
  {
    date: 'Aug 18, 2025',
    image: '/images/admin1.jpg',
    shoutouts:
      'Lorem ipsum dolor sit amet consectetur. Venenatis in ligula tempus et diam vel viverra et. Nunc habitant maecenas at magna pulvinar velit.',
  },

  {
    date: 'Aug 18, 2025',
    image: '/images/admin1.jpg',
    shoutouts:
      'Lorem ipsum dolor sit amet consectetur. Venenatis in ligula tempus et diam vel viverra et. Nunc habitant maecenas at magna pulvinar velit.',
  },
  {
    date: 'Aug 18, 2025',
    image: '/images/admin1.jpg',
    shoutouts:
      'Lorem ipsum dolor sit amet consectetur. Venenatis in ligula tempus et diam vel viverra et. Nunc habitant maecenas at magna pulvinar velit.',
  },
  {
    date: 'Aug 18, 2025',
    image: '/images/admin1.jpg',
    shoutouts:
      'Lorem ipsum dolor sit amet consectetur. Venenatis in ligula tempus et diam vel viverra et. Nunc habitant maecenas at magna pulvinar velit.',
  },
  {
    date: 'Aug 18, 2025',
    image: '/images/admin1.jpg',
    shoutouts:
      'Lorem ipsum dolor sit amet consectetur. Venenatis in ligula tempus et diam vel viverra et. Nunc habitant maecenas at magna pulvinar velit.',
  },
    {
    date: 'Aug 18, 2025',
    image: '/images/admin1.jpg',
    shoutouts:
      'Lorem ipsum dolor sit amet consectetur. Venenatis in ligula tempus et diam vel viverra et. Nunc habitant maecenas at magna pulvinar velit.',
  },
]

export default function Recommendations() {

  return (
    <section className='bg-white border border-gray-200 mt-2 rounded-xl shadow-md'>
      <div className='flex justify-between items-center px-2 py-3 border-b border-gray-200'>
        <h1 className='font-semibold text-sm text-gray-600'>Shoutouts</h1>

        {/* Buttons */}
        <div className='flex justify-end gap-2'>
          <button className='bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-transform duration-300 border text-[8px] py-1 px-3 rounded-4xl text-white'>
            Pending
          </button>
          <button className='text-[8px] border border-gray-300 rounded-4xl py-1 px-3 hover:from-purple-600 hover:to-pink-600 transition-transform duration-300'>
            Accepted
          </button>
        </div>
      </div>

      {/* Shoutouts & Reviews */}
      <div className='grid p-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {Shoutouts.map((shoutouts, index) => (
          <div
            key={index}
            className='bg-white rounded-xl p-2 border border-gray-200'
          >
            {/* Header */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Image
                  src={shoutouts.image}
                  alt={shoutouts.name}
                  width={30}
                  height={30}
                  className='rounded-full bg-white outline-2 border-2 border-white outline-purple-500'
                />
                <div>
                  <p className='text-[10px] text-gray-500'>{shoutouts.date}</p>
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

            {/* Review Text */}
            <p className='text-[10px] text-gray-900 mt-2'>{shoutouts.shoutouts}</p> 
            {/* Shall add overflow - y later */}
          </div>
        ))}
      </div>
    </section>
  )
}
