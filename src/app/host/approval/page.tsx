import React from 'react'
import Image from 'next/image'
import waiting from '../../../../public/waiting.png'
import Link from 'next/link'

const page = () => {
    return (
        <div className="min-h-screen bg-white p-6">
            {/* Top Left Section */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Hello Umar hussain
                </h1>
                <p className="text-gray-700 text-sm leading-relaxed max-w-md">
                    In a prime location in the Mission district of San Francisco, this is an airy 1200 square foot space with breathtaking views over the Mission.
                </p>
            </div>

            {/* Centered Approval Status */}
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                {/* Hourglass Icon */}
                <div className="mb-6">
                    <Image
                        src={waiting}
                        alt="Hourglass"
                        width={64}
                        height={64}
                    />
                </div>

                {/* Status Text */}
                <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-3">
                        Wait for approval!
                    </h2>
                    <p className="text-gray-700 text-sm leading-relaxed max-w-md">
                        Your Host Profile has been submitted for verification. You'll be notified once approved.
                    </p>
                </div>

                {/* Refresh Button */}
                <Link href="/host/home" className="px-6 py-2 border border-blue-400 text-blue-500 bg-white rounded-md hover:bg-blue-50 transition-colors duration-200">
                    Refresh
                </Link>
            </div>
        </div>
    )
}

export default page