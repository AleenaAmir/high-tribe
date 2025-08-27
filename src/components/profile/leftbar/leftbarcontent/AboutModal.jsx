'use client'
import { useState } from 'react'
import ModalPortal from './ModalPortal'
import { RxCross2 } from 'react-icons/rx'
import { RiEdit2Fill } from 'react-icons/ri'
import { BsFacebook } from 'react-icons/bs'
import { RiInstagramFill } from 'react-icons/ri'

export default function AboutModal({ open, onClose }) {
  const [isEditingBio, setIsEditingBio] = useState(false)
  const [isEditingDob, setIsEditingDob] = useState(false)
  const [isEditingVisibility, setisEditingVisibility] = useState(false)
  const [isEditingJoin, setIsEditingJoin] = useState(false)
  const [isEditingSocial, setIsEditingSocial] = useState(false)

  const [bio, setBio] = useState(
    'Adventure seeker and digital nomad exploring the world one city at a time.'
  )
  const [dob, setDob] = useState('2003-08-21')

  const [visibility, setvisibilty] = useState('none')

  const [join, setjoin] = useState('2003-08-21')

  return (
    <ModalPortal open={open} onClose={onClose}>
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
        <div className='flex justify-center items-center mb-4'>
          <h2 className='text-sm font-semibold'>About</h2>
        </div>

        {/* BIO */}
        <div className='mb-4 border-b border-gray-100'>
          <div className='flex justify-between items-center gap-2'>
            <h4 className='text-xs font-semibold'>Bio</h4>
            {!isEditingBio && (
              <button onClick={() => setIsEditingBio(true)}>
                <RiEdit2Fill
                  size={15}
                  className='text-md text-blue-500 cursor-pointer'
                />
              </button>
            )}
          </div>

          {!isEditingBio ? (
            <p className='text-[10px] text-gray-700 mt-1'>{bio}</p>
          ) : (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows='3'
              className='w-full bg-gray-100 rounded-md p-2 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 mt-1'
              placeholder='Write something about yourself'
            />
          )}
        </div>

        {/* DOB */}
        <div className='mb-4 border-b border-gray-100'>
          <div className='flex justify-between items-center gap-2'>
            <h4 className='text-xs font-semibold'>Date of Birth</h4>
            {!isEditingDob && (
              <button onClick={() => setIsEditingDob(true)}>
                <RiEdit2Fill
                  size={15}
                  className='text-md text-blue-500 cursor-pointer'
                />
              </button>
            )}
          </div>

          {!isEditingDob ? (
            <p className='text-[10px] text-gray-700 mt-1'>
              {new Date(dob).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          ) : (
            <input
              type='date'
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className='w-full bg-gray-100 rounded-md p-2 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 mt-1'
            />
          )}
        </div>

        {/* Visibility */}
        <div className='mb-4 border-b border-gray-100'>
          <div className='flex justify-between items-center gap-2'>
            <h4 className='text-xs font-semibold'>Visibility</h4>
            {!isEditingVisibility && (
              <button onClick={() => setisEditingVisibility(true)}>
                <RiEdit2Fill
                  size={15}
                  className='text-md text-blue-500 cursor-pointer'
                />
              </button>
            )}
          </div>
          {!isEditingVisibility ? (
            <p className='text-[10px] text-gray-700 mt-1'>{visibility}</p>
          ) : (
            <select className='text-[10px] rounded-xs'>
              <option value='tribe'>Tribe Only</option>
              <option value='public'>Public</option>
              <option value='private'>Private</option>
            </select>
          )}
        </div>

        {/* Joining date */}
        <div className='mb-4 border-b border-gray-100'>
          <div className='flex justify-between items-center gap-2'>
            <h4 className='text-xs font-semibold'>Joining Date</h4>
            {!isEditingJoin && (
              <button onClick={() => setIsEditingJoin(true)}>
                <RiEdit2Fill
                  size={15}
                  className='text-md text-blue-500 cursor-pointer'
                />
              </button>
            )}
          </div>

          {!isEditingJoin ? (
            <p className='text-[10px] text-gray-700 mt-1'>
              {new Date(join).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          ) : (
            <input
              type='date'
              value={join}
              onChange={(e) => setDob(e.target.value)}
              className='w-full bg-gray-100 rounded-md p-2 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 mt-1'
            />
          )}
        </div>

        {/* Soicial Media */}
        {/* Social Media */}
        <div className='mb-4 border-b border-gray-100'>
          <div className='flex justify-between items-center gap-2'>
            <h4 className='text-xs font-semibold'>Social Media</h4>
            {!isEditingSocial && (
              <button onClick={() => setIsEditingSocial(true)}>
                <RiEdit2Fill
                  size={15}
                  className='text-md text-blue-500 cursor-pointer'
                />
              </button>
            )}
          </div>

          {!isEditingSocial ? (
            <p className='text-[10px] text-gray-700 mt-1'>
              No social links added
            </p>
          ) : (
            <div className='space-y-3 mt-2'>
              {/* Facebook */}
              <div className='flex items-center gap-2 border rounded-md px-2 py-1'>
                <BsFacebook className='text-blue-600' size={18} />
                <input
                  type='url'
                  placeholder='Add Facebook link'
                  className='flex-1 text-xs focus:outline-none'
                />
              </div>

              {/* Instagram */}
              <div className='flex items-center gap-2 border rounded-md px-2 py-1'>
                <RiInstagramFill className='text-pink-600' size={18} />
                <input
                  type='url'
                  placeholder='Add Instagram link'
                  className='flex-1 text-xs focus:outline-none'
                />
              </div>

              {/* YouTube */}
              <div className='flex items-center gap-2 border rounded-md px-2 py-1'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='text-red-600'
                  width='18'
                  height='18'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M23.498 6.186a2.974 2.974 0 0 0-2.093-2.107C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.405.579a2.974 2.974 0 0 0-2.093 2.107C0 8.1 0 12 0 12s0 3.9.502 5.814a2.974 2.974 0 0 0 2.093 2.107C4.495 20.5 12 20.5 12 20.5s7.505 0 9.405-.579a2.974 2.974 0 0 0 2.093-2.107C24 15.9 24 12 24 12s0-3.9-.502-5.814ZM9.75 15.568V8.432L15.818 12 9.75 15.568Z' />
                </svg>
                <input
                  type='url'
                  placeholder='Add YouTube link'
                  className='flex-1 text-xs focus:outline-none'
                />
              </div>
            </div>
          )}
        </div>

        {/* BUTTONS */}
        <div className='flex justify-between items-center mt-6'>
          <p className='text-[8px]'>This Profile is Public</p>
          <div className='flex gap-2'>
            <button
              onClick={() => {
                setIsEditingBio(false)
                setIsEditingDob(false)
                onClose()
              }}
              className='px-4 py-1 rounded-4xl border hover:bg-gray-300 text-[10px] font-semibold'
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setIsEditingBio(false)
                setIsEditingDob(false)
              }}
              className='px-4 py-1 rounded-4xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-transform duration-300 text-white text-[10px] font-semibold'
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  )
}
