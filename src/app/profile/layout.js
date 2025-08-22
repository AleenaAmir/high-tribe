import './globals.css'
import { Poppins } from 'next/font/google'
import Header from '@/components/profile/Header'
import LeftSidebar from '@/components/profile/LeftSidebar'
import RightSidebar from '@/components/profile/RightSidebar'

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: '300',
})

export const metadata = {
  title: 'My App',
  description: 'Generated layout in Next.js 15',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${poppins.className} h-full w-full flex flex-col overflow-x-hidden`}>
        <Header />

        {/* Row with sidebars + main */}
        <div className="flex flex-1 pt-14 min-h-0">
          {/* Left Sidebar (fixed inside component) */}
          <LeftSidebar />

          {/* Main scrollable content */}
          <main className="flex-1 min-h-0 overflow-y-auto scrollbar-hide ml-[280px] mr-[280px]">
            {children}
          </main>

          {/* Right Sidebar (fixed inside component) */}
          <RightSidebar />
        </div>
      </body>
    </html>
  )
}
