"use client";
import React from "react";
import GlobalTextInput from "../../../../global/GlobalTextInput";
import GlobalInputStepper from "../../../../global/GlobalInputStepper";
import GlobalRadioGroup from "../../../../global/GlobalRadioGroup";
import { useSitesForm } from "../contexts/SitesFormContext";

interface SitePricingSectionProps {
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

const SitePricingSection: React.FC<SitePricingSectionProps> = ({
  sectionRef,
}) => {
  const {
    state,
    updateSiteCapacity,
    updateGuestMin,
    updateGuestMax,
    updateBedCounts,
    updateRvDetails,
    updatePricingType,
    updateAllowRefunds,
    updateRefundType,
    updateAutoRefunds,
    saveSection,
  } = useSitesForm();

  const bedTypes = [
    "Couch / Sofa Bed",
    "Floor Mattress",
    "Hammock",
    "Futon",
    "Bunk Bed",
    "Queen Bed",
    "King Bed",
  ];

  const handleSave = async () => {
    const pricingData = {
      siteCapacity: state.siteCapacity,
      guestMin: state.guestMin,
      guestMax: state.guestMax,
      bedCounts: state.bedCounts,
      rvDetails: state.rvDetails,
      pricingType: state.pricingType,
      allowRefunds: state.allowRefunds,
      refundType: state.refundType,
      autoRefunds: state.autoRefunds,
    };

    await saveSection("pricing", pricingData);
  };

  return (
    <div ref={sectionRef}>
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Site Pricing and Capacity
        </h2>
      </div>
      <div className="p-6 bg-white rounded-lg shadow-sm mt-4 space-y-8">
        {/* Amenities and Guest Capacity */}
        <div className="flex flex-wrap gap-8 mb-2">
          <div className="flex-1 min-w-[220px]">
            <GlobalTextInput
              label="Let guests know which amenities are in this site."
              placeholder="Site Capacity"
              value={state.siteCapacity}
              onChange={(e) => updateSiteCapacity(e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-[220px]">
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="block text-[13px] font-medium mb-1">
                  Guests Capacity
                </label>
                <div className="flex gap-2">
                  <GlobalTextInput
                    placeholder="Minimum"
                    type="number"
                    value={state.guestMin}
                    onChange={(e) => updateGuestMin(e.target.value)}
                  />
                  <GlobalTextInput
                    placeholder="Maximum"
                    type="number"
                    value={state.guestMax}
                    onChange={(e) => updateGuestMax(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Bed Types */}
        <div>
          <label className="block font-medium mb-2">Total Number of Beds</label>
          <div className="grid grid-cols-7 gap-2">
            {bedTypes.map((type, idx) => (
              <GlobalInputStepper
                key={type}
                label={type}
                value={state.bedCounts[idx]}
                onChange={(val) => {
                  const newCounts = [...state.bedCounts];
                  newCounts[idx] = val;
                  updateBedCounts(newCounts);
                }}
                min={0}
                max={5}
              />
            ))}
          </div>
        </div>
        {/* RV Details */}
        <div>
          <label className="block font-medium mb-2">RV Details</label>
          <div className="grid grid-cols-2 gap-4">
            <GlobalTextInput
              placeholder="Hookup Type"
              value={state.rvDetails.hookupType}
              onChange={(e) =>
                updateRvDetails({
                  ...state.rvDetails,
                  hookupType: e.target.value,
                })
              }
            />
            <GlobalTextInput
              placeholder="Antennas"
              value={state.rvDetails.antennas}
              onChange={(e) =>
                updateRvDetails({
                  ...state.rvDetails,
                  antennas: e.target.value,
                })
              }
            />
            <GlobalTextInput
              placeholder="Maximum RV Length Allowed"
              value={state.rvDetails.maxLength}
              onChange={(e) =>
                updateRvDetails({
                  ...state.rvDetails,
                  maxLength: e.target.value,
                })
              }
            />
            <GlobalTextInput
              placeholder="Maximum RV Width Allowed"
              value={state.rvDetails.maxWidth}
              onChange={(e) =>
                updateRvDetails({
                  ...state.rvDetails,
                  maxWidth: e.target.value,
                })
              }
            />
            <GlobalTextInput
              placeholder="Driveway Surface"
              value={state.rvDetails.drivewaySurface}
              onChange={(e) =>
                updateRvDetails({
                  ...state.rvDetails,
                  drivewaySurface: e.target.value,
                })
              }
            />
            <GlobalTextInput
              placeholder="Turning Radius / Clearance Warnings"
              value={state.rvDetails.turningRadius}
              onChange={(e) =>
                updateRvDetails({
                  ...state.rvDetails,
                  turningRadius: e.target.value,
                })
              }
            />
          </div>
        </div>
        {/* Pricing */}
        <div>
          <label className="block font-medium mb-2">Pricing</label>
          <GlobalTextInput
            label="Hosting Type"
            placeholder="Exchange-based stay"
            value={state.pricingType}
            onChange={(e) => updatePricingType(e.target.value)}
          />
        </div>
        {/* Refunds */}
        <div>
          <GlobalRadioGroup
            name="allowRefunds"
            value={state.allowRefunds}
            onChange={updateAllowRefunds}
            options={[
              {
                label: "No, I'll respond to each request",
                value: "no",
              },
              { label: "Allow refunds", value: "yes" },
            ]}
          />

          <div className="mt-2">
            <label className="block font-medium mb-2">Allow refunds</label>
            <GlobalRadioGroup
              name="refundType"
              value={state.refundType}
              onChange={updateRefundType}
              options={[
                {
                  label: "Days before the booked date",
                  value: "days",
                },
                { label: "Automatic Refunds", value: "auto" },
              ]}
            />
          </div>
        </div>
        {/* Auto Refunds */}
        <div>
          <label className="block font-medium mb-2">
            Automatically approve refund requests for bookings if the property
            booking balance can cover the request. If turned off, you must
            respond to all refund requests within five days.
          </label>
          <GlobalRadioGroup
            name="autoRefunds"
            value={state.autoRefunds}
            onChange={updateAutoRefunds}
            options={[
              { label: "Yes, automate refunds", value: "yes" },
              {
                label: "No, I'll respond to each request",
                value: "no",
              },
            ]}
          />
        </div>
        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="button"
            className="btn btn-primary px-8"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SitePricingSection;
