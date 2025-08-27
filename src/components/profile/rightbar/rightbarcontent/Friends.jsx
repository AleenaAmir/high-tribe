'use client'
import { useState } from 'react'
import { IoIosMore } from 'react-icons/io'
import Image from 'next/image'
import { GoSmiley } from 'react-icons/go'

const FriendData = [
  { name: 'Admin 1', friends: '2', image: '/images/admin1.jpg' },
  { name: 'Admin 2', friends: '2', image: '/images/admin2.jpg' },
  { name: 'Admin 3', friends: '2', image: '/images/admin3.jpg' },
  { name: 'Admin 4', friends: '5', image: '/images/admin1.jpg' },
  { name: 'Admin 5', friends: '3', image: '/images/admin2.jpg' },
  { name: 'Admin 6', friends: '8', image: '/images/admin3.jpg' },
  { name: 'Admin 7', friends: '4', image: '/images/admin1.jpg' },
  { name: 'Admin 8', friends: '6', image: '/images/admin2.jpg' },
  { name: 'Admin 9', friends: '1', image: '/images/admin3.jpg' },
  { name: 'Admin 10', friends: '7', image: '/images/admin1.jpg' },
]

export default function Friends() {
  const [showAll, setShowAll] = useState(false)

  // show only 6 friends first
  const visibleFriends = showAll ? FriendData : FriendData.slice(0, 6)

  return (
    <section className='border border-gray-200 bg-gray-100 mt-2 rounded-xl px-2 py-4'>
      {/* Header */}
      <div className='flex justify-between'>
        <div className='flex gap-2 items-center font-semibold'>
          <h1 className='text-[13px]'>Friends</h1>
          <p className='text-blue-500 text-[13px]'>{FriendData.length}</p>
        </div>
        <button>
          <IoIosMore />
        </button>
      </div>

      {/* Friends-section */}
      <div className='flex flex-col divide-y divide-gray-200 mt-4'>
        {visibleFriends.map((friend, index) => (
          <div
            key={index}
            className='flex items-center justify-between p-1 gap-2'
          >
            <div className='flex items-center gap-2'>
              {/* Gradient border wrapper */}
              <div className='p-[2px] rounded-full bg-gradient-to-r from-purple-500 to-pink-500'>
                <Image
                  src={friend.image}
                  alt={friend.name}
                  width={40}
                  height={40}
                  className='rounded-full bg-white'
                />
              </div>

              <div className='flex flex-col'>
                <h4 className='text-xs font-semibold'>{friend.name}</h4>
                <p className='text-[10px] text-gray-500'>
                  {friend.friends} mutual friends
                </p>
              </div>
            </div>

            <button>
              <GoSmiley className='text-gray-400 text-xl' />
            </button>
          </div>
        ))}

        {/* Toggle Button */}
        <div className='flex justify-center items-center pt-3'>
          <button
            onClick={() => setShowAll(!showAll)}
            className='bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-transform duration-300 py-1 px-3 text-[10px] rounded-2xl text-white'
          >
            {showAll ? 'Show Less' : 'See all Friends'}
          </button>
        </div>
      </div>
    </section>
  )
}
