"use client";
import React from "react";
import GlobalTextInput from "../../../../global/GlobalTextInput";
import GlobalInputStepper from "../../../../global/GlobalInputStepper";
import GlobalRadioGroup from "../../../../global/GlobalRadioGroup";
import GlobalSelect from "../../../../global/GlobalSelect";
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

  const hookupTypeOptions = [
    "30 Amp",
    "50 Amp",
    "20 Amp",
    "No Hookup",
    "Water Only",
    "Sewer Only",
  ];

  const drivewaySurfaceOptions = [
    "Concrete",
    "Asphalt",
    "Gravel",
    "Dirt",
    "Grass",
    "Paved",
  ];

  const hostingTypeOptions = [
    "Exchange-based stay",
    "Paid hosting",
    "Free hosting",
    "Work exchange",
  ];

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("site_id", "16");
    formData.append("guest_capacity_min", state.guestMin || "1");
    formData.append("guest_capacity_max", state.guestMax || "1");

    // Total Beds
    const totalBeds = state.bedCounts.reduce(
      (a, b) => a + (parseInt(b.toString()) || 0),
      0
    );
    formData.append("total_beds", totalBeds.toString());

    // Bed types in backend format
    const bedTypeKeys = [
      "sofa_bed",
      "floor_mattress",
      "hammock",
      "futon",
      "bunk_bed",
      "queen_bed",
      "king_bed",
    ];

    state.bedCounts.forEach((count, idx) => {
      const parsedCount = parseInt(count.toString(), 10);
      if (parsedCount > 0) {
        formData.append(
          `bed_types[${bedTypeKeys[idx]}]`,
          parsedCount.toString()
        );
      }
    });
    // RV details
    if (state.rvDetails.hookupType) formData.append("hookup_type", "back_in");
    if (state.rvDetails.amperes)
      formData.append("amperes", state.rvDetails.amperes);
    if (state.rvDetails.maxLength)
      formData.append("max_length", state.rvDetails.maxLength);
    if (state.rvDetails.maxWidth)
      formData.append("max_width", state.rvDetails.maxWidth);
    if (state.rvDetails.drivewaySurface)
      formData.append("driveway_surface", "gravel");

    // Hosting
    if (state.pricingType) formData.append("hosting_type", "paid");

    // Refund policy
    if (state.refundType) formData.append("refund_policy", state.refundType);
    if (state.refundType === "days") formData.append("refund_days", "3");

    // Other assumed defaults
    formData.append("currency", "USD");
    formData.append("payment_type", "advance");
    formData.append("base_price", "49.5"); // optional, change accordingly

    // API Call
    try {
      const response = await fetch(
        "http://3.6.115.88/api/properties/2/sites/pricing",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error("❌ Validation Error:", error);
        alert("Failed: " + JSON.stringify(error));
      } else {
        const result = await response.json();
        console.log("✅ Success:", result);
        alert("Pricing saved successfully!");
      }
    } catch (error) {
      console.error("❌ API Error:", error);
      alert("An error occurred while saving pricing.");
    }
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
            <p className="text-[#1C231F] font-bold">
              Let guests know which amenities are in this site.
            </p>
            <GlobalTextInput
              label="Site Capacity"
              type="number"
              min="1"
              value={state.siteCapacity}
              onChange={(e) => updateSiteCapacity(e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-[220px]">
            <p className="text-[#1C231F] font-bold">Guests Capacity</p>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <div className="flex gap-2">
                  <GlobalTextInput
                    label="Minimum"
                    type="number"
                    min="1"
                    max={state.guestMax || undefined}
                    value={state.guestMin}
                    onChange={(e) => updateGuestMin(e.target.value)}
                  />
                  <GlobalTextInput
                    label="Maximum"
                    type="number"
                    min={state.guestMin || 1}
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
          <p className="text-[#1C231F] font-bold">Total Number of Beds</p>

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
          <p className="text-[#1C231F] font-bold">RV Details</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-0 mt-4">
            <GlobalSelect
              label="Hookup Type"
              value={state.rvDetails.hookupType}
              onChange={(e) =>
                updateRvDetails({
                  ...state.rvDetails,
                  hookupType: e.target.value,
                })
              }
            >
              <option value="">Select hookup type</option>
              {hookupTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </GlobalSelect>
            <GlobalTextInput
              label="Amperes"
              type="number"
              value={state.rvDetails.amperes}
              onChange={(e) =>
                updateRvDetails({
                  ...state.rvDetails,
                  amperes: e.target.value,
                })
              }
            />
            <GlobalTextInput
              label="Maximum RV Length Allowed"
              type="number"
              value={state.rvDetails.maxLength}
              onChange={(e) =>
                updateRvDetails({
                  ...state.rvDetails,
                  maxLength: e.target.value,
                })
              }
            />
            <GlobalTextInput
              label="Maximum RV Width Allowed"
              type="number"
              value={state.rvDetails.maxWidth}
              onChange={(e) =>
                updateRvDetails({
                  ...state.rvDetails,
                  maxWidth: e.target.value,
                })
              }
            />
            <GlobalSelect
              label="Driveway Surface"
              value={state.rvDetails.drivewaySurface}
              onChange={(e) =>
                updateRvDetails({
                  ...state.rvDetails,
                  drivewaySurface: e.target.value,
                })
              }
            >
              <option value="">Select driveway surface</option>
              {drivewaySurfaceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </GlobalSelect>
            <GlobalTextInput
              label="Turning Radius / Clearance Warnings"
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
        <div className="max-w-[435px]">
          <p className="text-[#1C231F] font-bold">Pricing</p>
          <GlobalSelect
            label="Hosting Type"
            value={state.pricingType || "Exchange-based stay"}
            onChange={(e) => updatePricingType(e.target.value)}
          >
            <option value="">Select hosting type</option>
            {hostingTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </GlobalSelect>
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

          <div className="mt-4">
            <p className="text-[#1C231F] font-bold mb-4">Allow refunds</p>
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
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm shadow-sm"
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
