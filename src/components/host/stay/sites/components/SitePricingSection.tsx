"use client";
import React, { useState } from "react";
import GlobalTextInput from "../../../../global/GlobalTextInput";
import GlobalInputStepper from "../../../../global/GlobalInputStepper";
import GlobalRadioGroup from "../../../../global/GlobalRadioGroup";
import GlobalSelect from "../../../../global/GlobalSelect";
import GlobalTextArea from "../../../../global/GlobalTextArea";
import { useSitesForm } from "../contexts/SitesFormContext";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

interface SitePricingSectionProps {
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

interface ValidationErrors {
  siteSize?: string;
  guestCapacity?: string;
  totalBeds?: string;
  hostingType?: string;
  exchangeServices?: string;
  artistServices?: string;
  wellnessServices?: string;
  volunteerServices?: string;
  currency?: string;
  nightlyPrice?: string;
  paymentType?: string;
  refundDays?: string;
  otherBedType?: string;
  otherExchangeService?: string;
  otherArtistService?: string;
  otherWellnessService?: string;
  otherVolunteerService?: string;
  drivewaySurfaceOther?: string;
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
    updateFormData,
  } = useSitesForm();

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [isSaving, setIsSaving] = useState(false);

  const bedTypes = [
    "Couch / Sofa Bed",
    "Floor Mattress",
    "Hammock",
    "Futon",
    "Bunk Bed",
    "Double Bed",
    "Queen Bed",
    "King Bed",
    "Other",
  ];

  const hookupTypeOptions = ["Pull Thru", "Back In"];

  const drivewaySurfaceOptions = ["Gravel", "Grass", "Dirt", "Paved", "Other"];

  const hostingTypeOptions = [
    "Paid stay",
    "Exchange-based stay",
    "Artist-in-residence friendly",
    "Wellness/retreat center",
    "Volunteer/community-based hosting",
  ];

  const searchParams = useSearchParams();
  const propertyId = searchParams ? searchParams.get("propertyId") : null;
  const siteId = searchParams ? searchParams.get("siteId") : null;

  const handleInputChange = (field: string, value: string | string[]) => {
    updateFormData(field, value);
    // Clear validation error when user starts typing/selecting
    if (validationErrors[field as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Validate site size
    if (!state.formData.siteSize || state.formData.siteSize.trim() === "") {
      errors.siteSize = "Site size is required";
    }

    // Validate guest capacity
    if (!state.guestMin || !state.guestMax) {
      errors.guestCapacity =
        "Both minimum and maximum guest capacity are required";
    } else if (parseInt(state.guestMin) > parseInt(state.guestMax)) {
      errors.guestCapacity =
        "Minimum capacity cannot be greater than maximum capacity";
    }

    // Validate total beds
    const totalBeds = state.bedCounts.reduce(
      (a, b) => a + (parseInt(b.toString()) || 0),
      0
    );
    if (totalBeds === 0) {
      errors.totalBeds = "At least one bed is required";
    }

    // Validate hosting type
    if (!state.pricingType) {
      errors.hostingType = "Please select a hosting type";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fix the validation errors before saving");
      return;
    }

    setIsSaving(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();

    // @ts-ignore
    formData.append("site_id", siteId);
    formData.append("site_size", state.formData.siteSize || "");
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
      "double_bed",
      "queen_bed",
      "king_bed",
      "other_bed",
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
    if (state.rvDetails.hookupType)
      formData.append("hookup_type", state.rvDetails.hookupType);
    if (state.rvDetails.amperes)
      formData.append("amperes", state.rvDetails.amperes);
    if (state.rvDetails.maxLength)
      formData.append("max_length", state.rvDetails.maxLength);
    if (state.rvDetails.maxWidth)
      formData.append("max_width", state.rvDetails.maxWidth);
    if (state.rvDetails.drivewaySurface)
      formData.append("driveway_surface", state.rvDetails.drivewaySurface);
    if (state.rvDetails.turningRadius)
      formData.append("turning_radius", state.rvDetails.turningRadius);

    // Hosting type
    if (state.pricingType) formData.append("hosting_type", state.pricingType);

    // API Call
    try {
      const response = await fetch(
        `https://api.hightribe.com/api/properties/${propertyId}/sites/pricing`,
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
        toast.error("Failed: " + JSON.stringify(error));
      } else {
        const result = await response.json();
        console.log("✅ Success:", result);
        toast.success("Pricing saved successfully!");
      }
    } catch (error) {
      console.error("❌ API Error:", error);
      toast.error("An error occurred while saving pricing.");
    } finally {
      setIsSaving(false);
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
        {/* Site Capacity */}
        <div className="flex flex-wrap gap-8 mb-2">
          <div className="flex-1 min-w-[220px]">
            <p className="text-[#1C231F] font-bold mb-2">
              Site Size <span className="text-red-500">*</span>
            </p>
            <GlobalTextInput
              label=""
              type="text"
              value={state.formData.siteSize || ""}
              onChange={(e) => handleInputChange("siteSize", e.target.value)}
              placeholder="Enter site size"
            />
            {validationErrors.siteSize && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.siteSize}
              </p>
            )}
          </div>
          <div className="flex-1 min-w-[220px]">
            <p className="text-[#1C231F] font-bold mb-2">
              Guests Capacity <span className="text-red-500">*</span>
            </p>
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
                {validationErrors.guestCapacity && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.guestCapacity}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bed Types */}
        <div>
          <p className="text-[#1C231F] font-bold mb-4">
            Total Number of Beds <span className="text-red-500">*</span>
          </p>
          <div className="grid grid-cols-3 gap-4">
            {bedTypes.map((type, idx) => (
              <div key={type} className="flex items-center gap-2">
                <GlobalInputStepper
                  label={type}
                  value={state.bedCounts[idx]}
                  onChange={(val) => {
                    const newCounts = [...state.bedCounts];
                    newCounts[idx] = val;
                    updateBedCounts(newCounts);
                  }}
                  min={0}
                  max={10}
                />
                {type === "Other" && state.bedCounts[idx] > 0 && (
                  <GlobalTextInput
                    label=""
                    type="text"
                    placeholder="Specify bed type"
                    value={state.formData.otherBedType || ""}
                    onChange={(e) =>
                      handleInputChange("otherBedType", e.target.value)
                    }
                  />
                )}
              </div>
            ))}
          </div>
          {validationErrors.totalBeds && (
            <p className="text-red-500 text-sm mt-2">
              {validationErrors.totalBeds}
            </p>
          )}
        </div>

        {/* Stay Duration */}
        <div className="flex flex-wrap gap-8">
          <div className="flex-1 min-w-[220px]">
            <p className="text-[#1C231F] font-bold mb-2">
              Minimum Stay Duration (Optional)
            </p>
            <GlobalTextInput
              label=""
              type="number"
              min="1"
              max="365"
              value={state.formData.minStayDuration || ""}
              onChange={(e) =>
                handleInputChange("minStayDuration", e.target.value)
              }
              placeholder="Minimum nights"
            />
          </div>
          <div className="flex-1 min-w-[220px]">
            <p className="text-[#1C231F] font-bold mb-2">
              Maximum Stay Duration (Optional)
            </p>
            <GlobalTextInput
              label=""
              type="number"
              min="1"
              max="365"
              value={state.formData.maxStayDuration || ""}
              onChange={(e) =>
                handleInputChange("maxStayDuration", e.target.value)
              }
              placeholder="Maximum nights"
            />
          </div>
        </div>

        {/* RV Details */}
        <div>
          <p className="text-[#1C231F] font-bold mb-4">RV Details</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
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
              type="text"
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
              type="text"
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
              type="text"
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
        <div>
          <p className="text-[#1C231F] font-bold mb-4">
            Pricing <span className="text-red-500">*</span>
          </p>
          <div className="max-w-[435px] mb-4">
            <GlobalSelect
              label="Hosting Type"
              value={state.pricingType || ""}
              onChange={(e) => updatePricingType(e.target.value)}
            >
              <option value="">Select hosting type</option>
              {hostingTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </GlobalSelect>
            {validationErrors.hostingType && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.hostingType}
              </p>
            )}
          </div>
        </div>

        {/* Refund Policy */}
        <div>
          <p className="text-[#1C231F] font-bold mb-2">
            Set your refund policy
          </p>
          <p className="text-sm text-gray-600 mb-4">
            After your property is published, you can only update your policy to
            make it more flexible for your guests.
          </p>

          <GlobalRadioGroup
            name="allowRefunds"
            value={state.allowRefunds}
            onChange={updateAllowRefunds}
            options={[
              { label: "Allow refunds", value: "yes" },
              { label: "Don't allow refunds", value: "no" },
            ]}
          />

          {state.allowRefunds === "yes" && (
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-[#1C231F] font-bold mb-2">
                  Days before the booked date
                </p>
                <GlobalTextInput
                  label=""
                  type="number"
                  min="1"
                  max="30"
                  value={state.formData.refundDays || ""}
                  onChange={(e) =>
                    handleInputChange("refundDays", e.target.value)
                  }
                  placeholder="Set how many days (1 to 30) before the booked date your guests can request refunds"
                />
              </div>

              <div>
                <p className="text-[#1C231F] font-bold mb-2">
                  Automatically approve refund requests for bookings if the
                  property booking balance can cover the request. If turned off,
                  you must respond to all refund requests within five days.
                </p>
                <GlobalRadioGroup
                  name="autoRefunds"
                  value={state.autoRefunds}
                  onChange={updateAutoRefunds}
                  options={[
                    { label: "Yes, automate refunds", value: "yes" },
                    { label: "No, I'll respond to each request", value: "no" },
                  ]}
                />
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="button"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SitePricingSection;
