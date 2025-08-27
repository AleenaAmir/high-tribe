'use client'
import Image from 'next/image'

const Reviiews = [
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
  {
    name: 'Brad',
    date: 'Aug 16, 2025',
    image: '/images/admin3.jpg',
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
  {
    name: 'Brad',
    date: 'Aug 16, 2025',
    image: '/images/admin3.jpg',
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
  return (
    <section className='bg-white border border-gray-200 mt-2 rounded-xl'>
      <div className='flex justify-between items-center px-2 py-3 border-b border-gray-200'>
        <h1 className='font-semibold text-sm text-gray-600'>Reviiews</h1>

        {/* Buttons */}
        <div className='flex justify-end gap-2'>
          <button className='bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-transform duration-300 border text-[8px] py-1 px-3 rounded-4xl text-white'>
            Received
          </button>
          <button className='text-[8px] border border-gray-300 rounded-4xl py-1 px-3 hover:from-purple-600 hover:to-pink-600 transition-transform duration-300'>
            Given
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2'>
        {Reviiews.map((review, index) => (
          <div
            key={index}
            className='bg-white rounded-xl p-2 border border-gray-200'
          >
            {/* Header */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Image
                  src={review.image}
                  alt={review.name}
                  width={30}
                  height={30}
                  className='rounded-full bg-white outline-2 border-2 border-white outline-purple-500'
                />
                <div>
                  <h1 className='font-semibold text-xs'>{review.name}</h1>
                </div>
              </div>
            </div>

            {/* Dating. Rating and Title */}
            <div className='flex gap-2 mt-2'>
              <p className='text-[8px] text-gray-400'>{review.date}</p>
              <p className='text-gray-400 text-[8px] border-l border-r pl-1.5 pr-2.5 border-gray-400'>{review.title}</p>
              <p className='text-[8px] font-bold'>
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
