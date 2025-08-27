import Image from 'next/image'
import { MdMoreHoriz } from 'react-icons/md'

const NetworkData = [
  {
    image: '/images/admin1.jpg',
    name: 'Alex',
    location: 'Paris',
    date: 'August 18, 2025',
  },
  {
    image: '/images/admin1.jpg',
    name: 'Sam',
    location: 'London',
    date: 'September 2, 2025',
  },
  {
    image: '/images/admin1.jpg',
    name: 'John',
    location: 'Rome',
    date: 'October 10, 2025',
  },
  {
    image: '/images/admin1.jpg',
    name: 'Emma',
    location: 'Berlin',
    date: 'November 22, 2025',
  },
  {
    image: '/images/admin1.jpg',
    name: 'Emma',
    location: 'Berlin',
    date: 'November 22, 2025',
  },
  {
    image: '/images/admin1.jpg',
    name: 'Emma',
    location: 'Berlin',
    date: 'November 22, 2025',
  },
  {
    image: '/images/admin1.jpg',
    name: 'Emma',
    location: 'Berlin',
    date: 'November 22, 2025',
  },
  {
    image: '/images/admin1.jpg',
    name: 'Emma',
    location: 'Berlin',
    date: 'November 22, 2025',
  },
  {
    image: '/images/admin1.jpg',
    name: 'Emma',
    location: 'Berlin',
    date: 'November 22, 2025',
  },
  {
    image: '/images/admin1.jpg',
    name: 'Emma',
    location: 'Berlin',
    date: 'November 22, 2025',
  },
  {
    image: '/images/admin1.jpg',
    name: 'Emma',
    location: 'Berlin',
    date: 'November 22, 2025',
  },
  {
    image: '/images/admin1.jpg',
    name: 'Emma',
    location: 'Berlin',
    date: 'November 22, 2025',
  },
  {
    image: '/images/admin1.jpg',
    name: 'Emma',
    location: 'Berlin',
    date: 'November 22, 2025',
  },
]

export default function Network() {
  return (
    <section className='bg-white border border-gray-200 mt-2 rounded-xl'>
      {/* Header */}
      <div className='flex justify-between items-center px-2 py-3 border-b border-gray-200'>
        <h1 className='font-semibold text-sm text-gray-600'>My Commotions</h1>

        {/* Buttons */}
        <div className='flex justify-end gap-2'>
          <button className='bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-transform duration-300 border text-[8px] py-1 px-3 rounded-4xl text-white'>
            Connections
          </button>
          <button className='text-[8px] border border-gray-300 rounded-4xl py-1 px-3 hover:from-purple-600 hover:to-pink-600 transition-transform duration-300'>
            Following
          </button>
          <button className='text-[8px] border border-gray-300 rounded-4xl py-1 px-3 hover:from-purple-600 hover:to-pink-600 transition-transform duration-300'>
            Followers
          </button>
          <button className='flex items-center justify-center hover:scale-95 hover:cursor-pointer transition-transform duration-300'>
            <Image
              src='/images/Filter.png'
              alt='Filter Icon'
              width={18}
              height={18}
              className='object-contain '
            />
          </button>
          <button className='flex items-center justify-center hover:scale-95 hover:cursor-pointer transition-transform duration-300'>
            <Image
              src='/images/Sort.png'
              alt='Sort Icon'
              width={18}
              height={18}
              className='object-contain '
            />
          </button>
        </div>
      </div>

      {/* Grid of Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-2'>
        {NetworkData.map((network, index) => (
          <div
            key={index}
            className='bg-white border-b border-gray-300 p-2 flex items-center justify-between hover:shadow-md transition'
          >
            {/* Left side: Image + Name/Date */}
            <div className='flex items-center gap-2'>
              <Image
                src={network.image}
                alt={network.name}
                width={30}
                height={30}
                className='rounded-full bg-white outline-2 border-2 border-white outline-purple-500'
              />
              <div className='flex flex-col'>
                <p className='text-xs font-medium'>{network.name}</p>
                <div className='flex'>
                  <p className='text-[8px] text-gray-400'>{network.location}</p>
                  <p className='text-[8px] text-gray-400 border-l ml-1 pl-1'>
                    {network.date}
                  </p>
                </div>
              </div>
            </div>

            {/* Right side: Button */}
            <button>
              <MdMoreHoriz />
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
