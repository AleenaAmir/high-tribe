'use client'

import ModalPortal from './ModalPortal'
import { RxCross2 } from 'react-icons/rx'
import { LuCloudUpload } from 'react-icons/lu'
import Image from 'next/image'

export default function UploadProfile({ open, onClose }) {
  return (
    <ModalPortal open={open} onClose={onClose}>
      {/* Overlay (no close on click now, just visual) */}
      <div className='absolute inset-0 bg-black/70 backdrop-blur-sm' />

      {/* Modal box */}
      <div className='relative z-10 bg-white p-6 rounded-md shadow-lg w-150'>
        {/* Close icon */}
        <button
          onClick={onClose}
          className='absolute top-2 right-2 text-gray-400 hover:text-gray-800'
        >
          <RxCross2 size={20} />
        </button>

        {/* HEADING */}
        <div className='flex justify-center items-center'>
          <h2 className='text-sm font-semibold mb-4'>Choose Profile Picture</h2>
        </div>

        {/* BUTTONS */}
        <div className='flex justify-center items-center text-[10px] gap-3'>
          <button className='px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-transform duration-300 rounded-4xl text-white flex gap-2 items-center'>
            <Image
              src='/images/uploadPic.png'
              alt='Upload Profile'
              width={16}
              height={16}
              className='w-4 h-4'
            />
            View or Upload Picture
          </button>

          <button className='px-4 py-2 border border-dotted hover:from-purple-600 hover:to-pink-600 transition-transform duration-300 rounded-4xl flex gap-2'>
            <Image
              src='/images/createAvatar.png'
              alt='Upload Profile'
              width={16}
              height={16}
              className='w-3 h-4'
            />{' '}
            Create AI Avatar
          </button>
        </div>

        {/* SUGGESTION PHOTOS */}
        <div className='mt-4'>
          <h1 className='text-[10px] font-semibold py-2'>Suggested Photos</h1>
          <div className='flex justify-between items-center gap-2'>
            {[
              '/images/sug1.png',
              '/images/sug1.png',
              '/images/sug1.png',
              '/images/sug1.png',
              '/images/sug1.png',
            ].map((pic, idx) => (
              <div key={idx} className='w-25 h-25 rounded-md overflow-hidden '>
                <Image
                  src={pic}
                  alt={`Pic${idx + 1}`}
                  width={56}
                  height={56}
                  className='object-cover w-full h-full transition-transform duration-500 hover:scale-110'
                />
              </div>
            ))}
          </div>

          {/* More link */}
          <div className='flex justify-end mt-2'>
            <button className='text-[10px] text-blue-600 hover:underline'>
              More
            </button>
          </div>
        </div>

        {/* upload */}
        <div className='mb-4 w-full'>
          <h1 className='text-[10px] font-semibold py-2'>Upload</h1>
          <label
            htmlFor='fileUpload'
            className='flex flex-col items-center justify-center w-full h-32 border-1 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100'
          >
            <span className='flex flex-col justify-center text-[8px] text-center items-center'>
              <LuCloudUpload size={15} />
              <br />
              Drag & Drop or Click to Upload
              <br />
              Max 5 files , JPG, PNG or mov
            </span>
            <input
              id='fileUpload'
              type='file'
              accept='image/*'
              className='hidden'
            />
          </label>
        </div>

        {/* BUTTONS */}
        <div className='flex justify-between items-center'>
          <p className='text-[8px]'>This Profile is Public</p>
          <div className='flex gap-2'>
            <button
              onClick={onClose}
              className='px-6 py-1 rounded-4xl border-1  hover:bg-gray-300 text-[10px] font-semibold'
            >
              Cancel
            </button>
            <button className='px-6 py-1 border-1 border-transparent rounded-4xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-transform duration-300 text-white text-[10px] font-semibold'>
              Save
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  )
}
