'use client'
import { useState } from 'react'
import Image from 'next/image'

const MediaData = [
  { image: '/images/img1.png' },
  { image: '/images/img2.png' },
  { image: '/images/img3.png' },
  { image: '/images/img4.png' },
  { image: '/images/img5.png' },
  { image: '/images/img6.png' },
  { image: '/images/img7.png' },
  { image: '/images/img1.png' },
  { image: '/images/img2.png' },
  { image: '/images/img3.png' },
  { image: '/images/img4.png' },
  { image: '/images/img4.png' },
  { image: '/images/img5.png' },
  { image: '/images/img6.png' },
  { image: '/images/img7.png' },
  { image: '/images/img2.png' },
  { image: '/images/img6.png' },
  { image: '/images/img1.png' },
  { image: '/images/img1.png' },
  { image: '/images/img1.png' },
  { image: '/images/img1.png' },
]

const Tabs = ['Your Photos', 'Albums', 'Videos']

export default function Media() {
  const [activeTab, setActiveTab] = useState('Your Photos')

  return (
    <section className='bg-white border border-gray-200 mt-2 rounded-xl'>
      {/* Header */}
      <div className='flex justify-between items-center px-2 py-3 border-b border-gray-200'>
        <h1 className='font-semibold text-sm text-gray-600'>Media</h1>
      </div>

      {/* Tabs */}
      <div className='border-b border-gray-300'>
        <ul className='flex text-[10px] gap-6 p-2 font-semibold'>
          {Tabs.map((tab) => (
            <li
              key={tab}
              className={`cursor-pointer relative pb-1 transition-colors duration-300 ${
                activeTab === tab
                  ? 'text-purple-600'
                  : 'text-gray-500 hover:text-purple-500'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {activeTab === tab && (
                <span className='absolute left-0 bottom-0 w-full h-[2px] bg-purple-600 rounded-full'></span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Grid of Images */}
      <div className='grid grid-cols-7 gap-2 p-2'>
        {MediaData.map((item, index) => (
          <div
            key={index}
            className='w-full h-24 relative overflow-hidden rounded-md group'
          >
            <Image
              src={item.image}
              alt={`Media ${index}`}
              fill
              className='object-cover rounded-md transform transition-transform duration-300 group-hover:scale-110'
            />
          </div>
        ))}
      </div>
    </section>
  )
}
