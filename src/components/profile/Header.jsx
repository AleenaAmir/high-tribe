import Image from 'next/image'
import SearchBar from './SearchBar'
import ProfileHeader from './ProfileHeader'

export default function Header() {
  return (
    <header className='h-14 bg-white flex items-center justify-between px-4 py-2 fixed top-0 left-0 right-0 z-50 border-b border-gray-200'>
      {/* Logo */}
      <div className='flex items-center gap-4'>
        <Image src='/images/Logo.png' alt='Logo' width={120} height={120} />

        {/* SearchBar placed right after logo */}
        <SearchBar />
      </div>
      <ProfileHeader />
    </header>
  )
}
