'use client'
import Image from 'next/image'

const Bookings = [
  {
    date: 'Aug 18, 2025',
    status: 'Live',
    rent: 'Paid',
    image: '/images/admin1.jpg',
    rooms: '2',
    persons: '2',
  },
  {
    date: 'Aug 18, 2025',
    status: 'Live',
    rent: 'Not Paid',
    image: '/images/admin1.jpg',
    rooms: '2',
    persons: '2',
  },
  {
    date: 'Aug 18, 2025',
    status: 'Live',
    rent: 'Paid',
    image: '/images/admin1.jpg',
    rooms: '2',
    persons: '2',
  },
  {
    date: 'Aug 18, 2025',
    status: 'Live',
    rent: 'Paid',
    image: '/images/admin1.jpg',
    rooms: '2',
    persons: '2',
  },
  {
    date: 'Aug 18, 2025',
    status: 'Live',
    rent: 'Not Paid',
    image: '/images/admin1.jpg',
    rooms: '2',
    persons: '2',
  },
  {
    date: 'Aug 18, 2025',
    status: 'Live',
    rent: 'Paid',
    image: '/images/admin1.jpg',
    rooms: '2',
    persons: '2',
  },
  {
    date: 'Aug 18, 2025',
    status: 'Live',
    rent: 'Not Paid',
    image: '/images/admin1.jpg',
    rooms: '2',
    persons: '2',
  },
  {
    date: 'Aug 18, 2025',
    status: 'Live',
    rent: 'Paid',
    image: '/images/admin1.jpg',
    rooms: '2',
    persons: '2',
  },
  {
    date: 'Aug 18, 2025',
    status: 'Live',
    rent: 'Not Paid',
    image: '/images/admin1.jpg',
    rooms: '2',
    persons: '2',
  },
  {
    date: 'Aug 18, 2025',
    status: 'Live',
    rent: 'Paid',
    image: '/images/admin1.jpg',
    rooms: '2',
    persons: '2',
  },
]

export default function UpcomingBookings() {
  return (
    <section className='bg-white border border-gray-200 mt-2 rounded-xl'>
      <div className=' items-center px-2 py-3 border-b border-gray-200'>
        <h1 className='font-semibold text-sm text-gray-600'>
          Upcoming Booking
        </h1>
      </div>

      {/* Booking Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2'>
        {Bookings.map((bookings, index) => (
          <div
            key={index}
            className='bg-white rounded-xl p-2 border border-gray-200'
          >
            {/* Header */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Image
                  src={bookings.image}
                  alt={bookings.name}
                  width={30}
                  height={30}
                  className='rounded-full bg-white outline-2 border-2 border-white outline-purple-500'
                />
                <div>
                  <p className='text-[8px] text-gray-400'>{bookings.date}</p>
                </div>
                <div>
                  <p className='text-[8px] bg-green-100 px-2 text-green-600 rounded-md'>
                    {bookings.status}
                  </p>
                </div>
              </div>
            </div>

            {/* Review Text */}
            <p className='text-[10px] text-gray-900 mt-4'>
              {bookings.rooms} Rooms, {bookings.persons} Adults
            </p>

            <div className='mt-4'>
              <p
                className={`text-[8px] px-2  text-center rounded-md ${
                  bookings.rent === 'Paid'
                    ? 'bg-green-100 text-green-600 w-8'
                    : 'bg-red-100 text-red-600 w-14 '
                }`}
              >
                {bookings.rent}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
