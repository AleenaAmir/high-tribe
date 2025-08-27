import Image from 'next/image'
import { MdMoreHoriz } from 'react-icons/md'

const Journeys = [
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
]

const RightJourneys = [
  {
    id: 1,
    image: '/images/pic1.png',
    countries: 23,
    footprints: 160,
    days: 222,
    title: 'Round the World 2015',
    duration: 'March – October 2015',
  },
  {
    id: 2,
    image: '/images/pic2.png',
    countries: 15,
    footprints: 95,
    days: 180,
    title: 'Asia Expedition',
    duration: 'Jan – June 2018',
  },
  {
    id: 3,
    image: '/images/pic1.png',
    countries: 10,
    footprints: 75,
    days: 120,
    title: 'Europe Trip',
    duration: 'July – Dec 2019',
  },
  {
    id: 4,
    image: '/images/pic2.png',
    countries: 18,
    footprints: 110,
    days: 200,
    title: 'Africa Adventure',
    duration: 'Feb – Sept 2020',
  },
]

export default function Journey() {
  return (
    <section className='bg-white border border-gray-200 mt-2 rounded-xl'>
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

          {/* Image Button */}
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

      {/* left Side */}
      <main className='p-2 flex gap-4'>
        {/* Left column */}
        <div className='w-1/3'>
          <div className='p-2'>
            {Journeys.map((journey, index) => (
              <div
                key={index}
                className='bg-white p-2 border-b border-gray-200 flex items-center justify-between'
              >
                {/* Left side: Image + Name/Date */}
                <div className='flex items-center gap-2'>
                  <Image
                    src={journey.image}
                    alt={journey.name}
                    width={30}
                    height={30}
                    className='rounded-full bg-white outline-2 border-2 border-white outline-purple-500'
                  />
                  <div className='flex flex-col'>
                    <p className='text-xs'>{journey.name}</p>
                    <p className='text-[8px] text-gray-400'>{journey.date}</p>
                  </div>
                </div>

                {/* Right side: Button */}
                <button>
                  <MdMoreHoriz />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side */}
        <div className='w-2/3 grid grid-cols-2 gap-4 bg-gray-100 p-2 rounded-xl'>
          {RightJourneys.map((trip) => (
            <div
              key={trip.id}
              className='relative rounded-xl overflow-hidden shadow-md'
            >
              <Image
                src={trip.image}
                alt={trip.title}
                width={400}
                height={250}
                className='object-cover w-full h-30'
              />
              {/* Overlay */}
              <div className='absolute bottom-0 left-0 w-full h-1/2 bg-black/40 flex flex-col items-center justify-center text-white text-center p-2'>
                <div className='flex gap-6 text-sm font-semibold'>
                  <div>
                    <p className='text-xs'>{trip.countries}</p>
                    <p className='text-[8px]'>Countries</p>
                  </div>
                  <div>
                    <p className='text-xs'>{trip.footprints}</p>
                    <p className='text-[8px]'>Footprints</p>
                  </div>
                  <div>
                    <p className='text-xs'>{trip.days}</p>
                    <p className='text-[8px]'>Days</p>
                  </div>
                </div>
                <p className='mt-1 text-[10px] font-semibold'>{trip.title}</p>
                <p className='text-[8px]'>{trip.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </section>
  )
}
