"use client";
import React, { useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";

// =============================
// Types
// =============================
export interface Booking {
  id: string;
  guestName: string;
  status: "booked" | "checked-out" | "canceled";
  bookingId: string;
  checkIn: string; // ISO yyyy-mm-dd
  checkOut: string; // ISO yyyy-mm-dd
  nights: number;
  totalPayout: number; // numeric for formatting
  adults: number;
  children: number;
}

// Raw shape from API (inside { data: RawBooking[] })
type RawBooking = {
  id: number;
  guest_name: string;
  property_id: number;
  property_name: string;
  site_id: number;
  site_name: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  check_in: string;
  check_out: string;
  total_price: string; // e.g. "164.00"
  adults: number;
  children: number;
  infants: number;
};

interface ApiResponse {
  data: RawBooking[];
}

interface BookingsTableProps {
  /** If provided, component will not fetch */
  bookings?: Booking[];
  /** If provided, component will use these static dates for fetch; otherwise it uses the static defaults below */
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
}

// =============================
// Utils
// =============================
const currencyFmt = (n: number) =>
  Number.isFinite(n)
    ? new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n)
    : "--";

const mapStatus = (s: RawBooking["status"]): Booking["status"] => {
  if (s === "completed") return "checked-out";
  if (s === "cancelled") return "canceled";
  // treat pending/confirmed as upcoming
  return "booked";
};

const nightsBetween = (checkIn: string, checkOut: string) => {
  const inD = new Date(checkIn);
  const outD = new Date(checkOut);
  const ms = outD.getTime() - inD.getTime();
  return ms > 0 ? Math.round(ms / (1000 * 60 * 60 * 24)) : 0;
};

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

// =============================
// Component
// =============================
const BookingsTable: React.FC<BookingsTableProps> = ({ bookings: bookingsProp, startDate, endDate }) => {
  const [bookings, setBookings] = useState<Booking[]>(bookingsProp ?? []);
  const [loading, setLoading] = useState<boolean>(!bookingsProp);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(10);

  // Fetch only when bookings are not passed in
  useEffect(() => {
    if (bookingsProp) return; // external data provided

    const controller = new AbortController();
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ Static dates (override-able by props)
        const s = startDate ?? "2025-08-01";
        const e = endDate ?? "2025-08-31";

        // Call your Next.js API route/proxy (token stays server-side)
        const url = `host/bookings?start_date=${s}&end_date=${e}`;
        const res = await apiRequest<ApiResponse>(url, { method: "GET" });

        const normalized: Booking[] = (res?.data ?? []).map((b) => ({
          id: String(b.id),
          guestName: b.guest_name,
          status: mapStatus(b.status),
          bookingId: String(b.id), // adjust if you have a separate booking code
          checkIn: b.check_in,
          checkOut: b.check_out,
          nights: nightsBetween(b.check_in, b.check_out),
          totalPayout: Number(b.total_price ?? 0),
          adults: b.adults,
          children: b.children,
        }));

        setBookings(normalized);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setError(err?.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
    return () => controller.abort();
  }, [bookingsProp, startDate, endDate]);

  // Pagination math + slice
  const totalResults = bookings.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / entriesPerPage));
  const page = Math.min(currentPage, totalPages);
  const startIdx = (page - 1) * entriesPerPage;
  const endIdx = Math.min(startIdx + entriesPerPage, totalResults);

  const displayBookings = useMemo(() => bookings.slice(startIdx, endIdx), [bookings, startIdx, endIdx]);

  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header / states */}
      <div className="px-6 pt-5 pb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Bookings</h2>
        {loading && <span className="text-sm text-gray-500">Loading…</span>}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200 font-bold">
            <tr>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Guest name</th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Booking ID</th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Check-in</th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Check-out</th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Nights</th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Total payout</th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Adults</th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Children</th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.guestName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {getStatusText(booking.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.bookingId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.checkIn}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.checkOut}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.nights}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{currencyFmt(booking.totalPayout)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.adults}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.children}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button className="text-gray-400 hover:text-gray-600 rotate-90" aria-label="Row actions">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
            {!loading && displayBookings.length === 0 && (
              <tr>
                <td colSpan={10} className="px-6 py-10 text-center text-sm text-gray-500">
                  No bookings found for the selected range.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button onClick={goPrev} disabled={page === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
          <button onClick={goNext} disabled={page === totalPages} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{totalResults === 0 ? 0 : startIdx + 1}</span> to {" "}
              <span className="font-medium">{endIdx}</span> of {" "}
              <span className="font-medium">{totalResults}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button onClick={goPrev} disabled={page === 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Previous page">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <span className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 select-none">
                Page {page} / {totalPages}
              </span>
              <button onClick={goNext} disabled={page === totalPages} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Next page">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Footer with pagination info */}
      <div className="bg-white px-4 py-3 flex items-center justify-end border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Page {page} of {totalPages}</span>
          <button className="px-3 py-1 text-sm border border-blue-300 text-blue-600 rounded hover:bg-blue-50" onClick={() => setCurrentPage(1)}>
            Go to first page
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingsTable;
