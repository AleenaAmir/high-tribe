import React from 'react'
import Image from 'next/image'
import { BsChatLeftDots } from 'react-icons/bs'

const chatroomsData = [
  {
    name: 'Admin 1',
    date: 'Aug 18, 2025',
    image: '/images/admin1.jpg',
  },
  {
    name: 'Admin 2',
    date: 'Aug 17, 2025',
    image: '/images/admin2.jpg',
  },
  {
    name: 'Admin 3',
    date: 'Aug 16, 2025',
    image: '/images/admin3.jpg',
  },
]

export default function Chatrooms() {
  return (
    <section className='border border-gray-200 mt-2 rounded-xl'>
      {/* Header */}
      <div className='border-b border-gray-300 px-2 py-4'>
        <h1 className='font-semibold text-[13px]'>Chatrooms</h1>
      </div>

      {/* Chatroom Items */}
      <div className='flex flex-col divide-y divide-gray-200'>
        {chatroomsData.map((chat, index) => (
          <div
            key={index}
            className='flex items-center justify-between py-1 px-3 gap-2'
          >
            <div className='flex items-center gap-2'>
              {/* Gradient border wrapper */}
              <div className='p-[2px] rounded-full bg-gradient-to-r from-purple-500 to-pink-500'>
                <Image
                  src={chat.image}
                  alt={chat.name}
                  width={40}
                  height={40}
                  className='rounded-full bg-white'
                />
              </div>

              <div className='flex flex-col'>
                <h4 className='text-xs font-semibold'>{chat.name}</h4>
                <p className='text-[10px] text-gray-500'>{chat.date}</p>
              </div>
            </div>

            <BsChatLeftDots className='text-gray-400 text-xl' />
          </div>
        ))}
      </div>
    </section>
  )
}
