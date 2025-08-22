import Image from 'next/image'
import { LuFootprints } from 'react-icons/lu'
import { TbMapRoute } from 'react-icons/tb'
import { FiAlertTriangle } from 'react-icons/fi'
import { HiOutlineLightBulb } from 'react-icons/hi'

export default function PostFootprints() {
  return (
    <section className='mt-4 rounded-xl shadow-md overflow-hidden'>
      <div className='bg-white px-2 py-5 border-b border-gray-200'>
        <h1 className='text-xl font-semibold'>Post Footprint</h1>
      </div>
      <div className='bg-white flex justify-between p-3'>
        <div className='flex gap-2'>
          <Image
            src='/images/founder.png'
            alt='User'
            width={60}
            height={50}
            className='rounded-full'
          />
          <input type='text' placeholder='What is in you mind' />
        </div>
          <button className='py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-transform duration-300 flex rounded-4xl justify-between text-white text-sm font-semibold items-center gap-5'>
            Footprint
            <LuFootprints className='rounded-full bg-white text-blue-500 text-2xl p-1' />
          </button>
      </div>
      <div className='p-2 flex justify-end gap-1'>
        <button className='flex gap-2 justify-center items-center text-xs font-semibold p-2 bg-white rounded-4xl'>
          <TbMapRoute className='text-green-500 text-xl' />
          Journey Mapping
        </button>
        <button className='flex gap-2 justify-center items-center text-xs font-semibold p-2 bg-white rounded-4xl'>
          <FiAlertTriangle className='text-pink-600' />
          Travel Advisory
        </button>
        <button className='flex gap-2 justify-center items-center text-xs font-semibold p-2 bg-white rounded-4xl'>
          <HiOutlineLightBulb className='text-yellow-500' />
          Travel Tip
        </button>
      </div>
    </section>
  )
}
