"use client";

import React, { useState } from "react";

// Types for booking data
export interface Booking {
  id: string;
  guestName: string;
  status: "booked" | "checked-out" | "canceled";
  bookingId: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPayout: string;
  adults: number;
  children: number;
}

interface BookingsTableProps {
  bookings?: Booking[];
}

const BookingsTable: React.FC<BookingsTableProps> = ({ bookings = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(10);

  // Mock data based on the image
  const mockBookings: Booking[] = [
    {
      id: "1",
      guestName: "Tvler jennison",
      status: "booked",
      bookingId: "1245678910",
      checkIn: "Sep 1, 2025",
      checkOut: "Sep 2, 2025",
      nights: 1,
      totalPayout: "$106.00",
      adults: 2,
      children: 0,
    },
    {
      id: "2",
      guestName: "Tvler jennison",
      status: "booked",
      bookingId: "1245678910",
      checkIn: "Sep 1, 2025",
      checkOut: "Sep 2, 2025",
      nights: 1,
      totalPayout: "$106.00",
      adults: 2,
      children: 0,
    },
    {
      id: "3",
      guestName: "Tvler jennison",
      status: "checked-out",
      bookingId: "1245678910",
      checkIn: "Sep 1, 2025",
      checkOut: "Sep 2, 2025",
      nights: 1,
      totalPayout: "$106.00",
      adults: 2,
      children: 0,
    },
    {
      id: "4",
      guestName: "Tvler jennison",
      status: "booked",
      bookingId: "1245678910",
      checkIn: "Sep 1, 2025",
      checkOut: "Sep 2, 2025",
      nights: 1,
      totalPayout: "$106.00",
      adults: 2,
      children: 0,
    },
    {
      id: "5",
      guestName: "Tvler jennison",
      status: "canceled",
      bookingId: "1245678910",
      checkIn: "Sep 1, 2025",
      checkOut: "Sep 2, 2025",
      nights: 1,
      totalPayout: "$106.00",
      adults: 2,
      children: 0,
    },
    {
      id: "6",
      guestName: "Tvler jennison",
      status: "booked",
      bookingId: "1245678910",
      checkIn: "Sep 1, 2025",
      checkOut: "Sep 2, 2025",
      nights: 1,
      totalPayout: "$106.00",
      adults: 2,
      children: 0,
    },
    {
      id: "7",
      guestName: "Tvler jennison",
      status: "booked",
      bookingId: "1245678910",
      checkIn: "Sep 1, 2025",
      checkOut: "Sep 2, 2025",
      nights: 1,
      totalPayout: "$106.00",
      adults: 2,
      children: 0,
    },
    {
      id: "8",
      guestName: "Tvler jennison",
      status: "booked",
      bookingId: "1245678910",
      checkIn: "Sep 1, 2025",
      checkOut: "Sep 2, 2025",
      nights: 1,
      totalPayout: "$106.00",
      adults: 2,
      children: 0,
    },
    {
      id: "9",
      guestName: "Tvler jennison",
      status: "checked-out",
      bookingId: "1245678910",
      checkIn: "Sep 1, 2025",
      checkOut: "Sep 2, 2025",
      nights: 1,
      totalPayout: "$106.00",
      adults: 2,
      children: 0,
    },
    {
      id: "10",
      guestName: "Tvler jennison",
      status: "booked",
      bookingId: "1245678910",
      checkIn: "Sep 1, 2025",
      checkOut: "Sep 2, 2025",
      nights: 1,
      totalPayout: "$106.00",
      adults: 2,
      children: 0,
    },
    {
      id: "11",
      guestName: "Tvler jennison",
      status: "canceled",
      bookingId: "1245678910",
      checkIn: "Sep 1, 2025",
      checkOut: "Sep 2, 2025",
      nights: 1,
      totalPayout: "$106.00",
      adults: 2,
      children: 0,
    },
    {
      id: "12",
      guestName: "Tvler jennison",
      status: "booked",
      bookingId: "1245678910",
      checkIn: "Sep 1, 2025",
      checkOut: "Sep 2, 2025",
      nights: 1,
      totalPayout: "$106.00",
      adults: 2,
      children: 0,
    },
    {
      id: "13",
      guestName: "Tvler jennison",
      status: "booked",
      bookingId: "1245678910",
      checkIn: "Sep 1, 2025",
      checkOut: "Sep 2, 2025",
      nights: 1,
      totalPayout: "$106.00",
      adults: 2,
      children: 0,
    },
  ];

  const displayBookings = bookings.length > 0 ? bookings : mockBookings;

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "booked":
        return "bg-gray-800 text-white";
      case "checked-out":
        return "bg-cyan-500 text-white";
      case "canceled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusText = (status: Booking["status"]) => {
    switch (status) {
      case "booked":
        return "Booked";
      case "checked-out":
        return "Checked out";
      case "canceled":
        return "Canceled";
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200 font-bold">
            <tr>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                Guest name
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                Booking ID
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                Check-in
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                Check-out
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                Nights
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                Total payout
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                Adults
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                Children
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {booking.guestName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {getStatusText(booking.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {booking.bookingId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {booking.checkIn}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {booking.checkOut}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {booking.nights}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {booking.totalPayout}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {booking.adults}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {booking.children}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button className="text-gray-400 hover:text-gray-600 rotate-90">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">{displayBookings.length}</span> of{" "}
              <span className="font-medium">{displayBookings.length}</span>{" "}
              results
            </p>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Next</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Footer with pagination info */}
      <div className="bg-white px-4 py-3 flex items-center justify-end border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">1 on 1</span>
          <button className="px-3 py-1 text-sm border border-blue-300 text-blue-600 rounded hover:bg-blue-50">
            See the entries
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingsTable;
