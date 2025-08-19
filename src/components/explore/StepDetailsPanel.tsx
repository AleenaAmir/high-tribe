import React from "react";
import Image from "next/image";
import { Step } from "@/components/dashboard/modals/components/newjourney/types";

interface StepDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  step: Step | null;
  dayIndex: number;
  stepIndex: number;
}

const StepDetailsPanel: React.FC<StepDetailsPanelProps> = ({
  isOpen,
  onClose,
  step,
  dayIndex,
  stepIndex,
}) => {
  if (!isOpen || !step) return null;

  return (
    <div
      className={`fixed right-0 top-30 bottom-2 z-40 w-[600px] bg-white rounded-l-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {step.location.name || step.name}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Mission District, San Francisco, CA
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
              Event Space
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
              Top-rated
            </button>
          </div>

          {/* Rating and Reviews */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-medium text-gray-900">5.0</span>
            </div>
            <span className="text-sm text-gray-600">10 reviews</span>
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
              <span className="text-sm text-gray-600">10</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Images */}
          <div className="p-6">
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="col-span-2 h-64 bg-gray-200 rounded-lg overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <div className="text-center text-white">
                    <svg
                      className="w-12 h-12 mx-auto mb-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm">Main Image</p>
                  </div>
                </div>
              </div>
              <div className="h-32 bg-gray-200 rounded-lg overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center">
                  <div className="text-center text-white">
                    <svg
                      className="w-8 h-8 mx-auto mb-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                    <p className="text-xs">Person</p>
                  </div>
                </div>
              </div>
              <div className="h-32 bg-gray-200 rounded-lg overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                  <div className="text-center text-white">
                    <svg
                      className="w-8 h-8 mx-auto mb-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                    <p className="text-xs">Room</p>
                  </div>
                </div>
              </div>
            </div>

            {/* About the Space */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                About the Space
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                1000 square foot space with breathtaking views over the Mission,
                Twin Peaks and downtown. Inspiring artwork and high ceilings,
                two-story high glass windows, and a deck to enjoy the view.
                Ideal space for events, meetings, presentations, creative
                brainstorming, workshops and more.
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-700">
                  <strong>Amenities:</strong>
                </p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>• 48" flat-screen monitors with HDMI connections</li>
                  <li>• Kitchenette</li>
                  <li>• Cooler for 6 bottles</li>
                  <li>• Additional adjacent kitchen and prep space</li>
                  <li>• 25 padded folding matching chairs</li>
                  <li>• Two sofas</li>
                  <li>• Assorted chairs</li>
                  <li>• 10' rolling rectangular utility table</li>
                </ul>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2">
                Read more
              </button>
            </div>

            {/* Food and Beverage */}
            <div className="mb-6">
              <div className="flex items-center justify-between cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900">
                  Food and Beverage
                </h3>
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              <div className="mt-3 space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Rules for food and non-alcoholic beverages
                  </p>
                  <p className="text-sm text-gray-600">
                    Outside food and non-alcoholic beverages allowed
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Rules for cooking and food preparation
                  </p>
                  <p className="text-sm text-gray-600">
                    Only food preparation is allowed on-site
                  </p>
                </div>
              </div>
            </div>

            {/* Alcoholic Beverages */}
            <div className="mb-6">
              <div className="flex items-center justify-between cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900">
                  Alcoholic Beverages
                </h3>
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Restrooms */}
            <div className="mb-6">
              <div className="flex items-center justify-between cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900">
                  Restrooms
                </h3>
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepDetailsPanel;
