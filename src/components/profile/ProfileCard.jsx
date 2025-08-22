'use client'
import { useState } from 'react'
import Image from 'next/image'
import { RiCake2Fill } from 'react-icons/ri'
import { FaCrown } from 'react-icons/fa6'
import { TiStarFullOutline } from 'react-icons/ti'
import { IoIosMore } from 'react-icons/io'
import { BsPlusCircle } from 'react-icons/bs'
import { FaChevronDown } from 'react-icons/fa6'
import { FaInstagram } from 'react-icons/fa'
import { FaFacebookF } from 'react-icons/fa6'
import { AiFillYoutube } from 'react-icons/ai'
import { CiCamera } from 'react-icons/ci'
import { RiEdit2Fill } from "react-icons/ri";

import UploadProfile from './UploadProfile'
import AboutModal from './AboutModal'

const UserData = {
  name: 'Umer',
  image: '/images/founder.png',
  birth: 'March 15, 1995',
  points: 20,
  badge: 'Travel Badge',
}

export default function ProfileCard() {
  const [openUpload, setOpenUpload] = useState(false)
  const [openAbout, setOpenAbout] = useState(false)   // state for about modal

  return (
    <div className='flex flex-col rounded-xl p-4 items-center justify-center bg-gray-100 shadow-md'>
      {/* Profile Image Wrapper */}
      <div className='relative'>
        <Image
          src={UserData.image}
          alt='Profile-img'
          width={120}
          height={120}
          className='rounded-full border-8 border-slate-200'
        />

        {/* Camera Button */}
        <button
          onClick={() => setOpenUpload(true)}
          className='absolute right-0 top-1/2 -translate-y-1/2 
          bg-white rounded-full p-1 shadow-md cursor-pointer 
          hover:scale-110 transition w-7 h-7 flex items-center justify-center'
        >
          <CiCamera className='text-gray-700 text-lg' />
        </button>
      </div>

      {/* User Info */}
      <div className='flex flex-col items-center mt-3 gap-2'>
        <p className='font-semibold text-lg'>Good Morning {UserData.name}</p>

        {/* Birthday */}
        <p className='flex gap-2 items-center text-sm text-gray-600'>
          <RiCake2Fill className='text-blue-500' />
          {UserData.birth}
        </p>

        {/* Points & Badge */}
        <div className='flex items-center gap-2 mt-2'>
          <p className='flex items-center justify-center gap-1 font-semibold text-xs text-blue-500'>
            <FaCrown className='text-orange-400' />
            {UserData.points}K Points
          </p>
          <p className='flex items-center justify-center font-semibold  text-xs text-green-600'>
            <TiStarFullOutline className='text-green-600' />
            {UserData.badge}
          </p>
        </div>

        {/* About */}
        <div className='mt-1'>
          <div className='flex gap-4 items-center'>
            <h4 className='text-blue-500 text-xs font-semibold'>About Bio</h4>

            {/* Edit icon button */}
            <button onClick={() => setOpenAbout(true)}>
              <RiEdit2Fill className='text-md text-green-900 hover:text-green-700 cursor-pointer' />
            </button>
          </div>
          <p className='justify-left text-[10px]'>
            Adventure seeker and digital nomad exploring the world one city at a
            time. Love connecting with locals and discovering hidden gems!
          </p>
        </div>

        {/* Buttons */}
        <div className='flex flex-col text-xs border-t border-b border-gray-300 w-full py-2'>
          <button className='bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-transform duration-300 border-2 py-2 px-2 rounded-4xl text-white text-xs flex items-center justify-center gap-2'>
            <BsPlusCircle />
            Add new Journey
            <FaChevronDown />
          </button>
          <div className='flex items-center justify-center gap-2 mt-2'>
            <button className='bg-black border-2 border-blue-500 py-2 px-2 rounded-4xl text-white text-xs flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-transform duration-300'>
              Open to
              <FaChevronDown />
            </button>
            <button className='border-2 border-black py-2 px-2 rounded-xl text-xs hover:bg-black hover:text-white transition-transform duration-300'>
              <IoIosMore />
            </button>
          </div>
        </div>

        {/* Social-Media Buttons */}
        <div className='flex items-center justify-center gap-2'>
          <FaInstagram className='rounded-full bg-pink-600 text-3xl p-1 text-white hover:scale-110  transition-transform duration-300 hover:shadow-lg' />
          <FaFacebookF className='rounded-full bg-blue-600 text-3xl p-1 text-white hover:scale-110  transition-transform duration-300 hover:shadow-lg' />
          <AiFillYoutube className='rounded-full bg-red-600 text-3xl p-1 text-white hover:scale-110  transition-transform duration-300 hover:shadow-lg' />
        </div>
      </div>

      {/* Upload Profile Modal */}
      {openUpload && (
        <UploadProfile open={openUpload} onClose={() => setOpenUpload(false)} />
      )}

      {/* About Modal (placeholder for now) */}
      {openAbout && (
        <AboutModal open={openAbout} onClose={() => setOpenAbout(false)} />
      )}
    </div>
  )
}
