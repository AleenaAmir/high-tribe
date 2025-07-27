"use client";
import React from "react";
import { useSitesForm } from "../hooks/useSitesForm";
import FormError from "./FormError";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

interface SiteAmenitiesSectionProps {
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

const SiteAmenitiesSection: React.FC<SiteAmenitiesSectionProps> = ({
  sectionRef,
}) => {
  const {
    setValue,
    watch,
    formState: { errors },
    saveSection,
  } = useSitesForm();

  const searchParams = useSearchParams();
  const propertyId = searchParams ? searchParams.get("propertyId") : null;
  const siteId = searchParams ? searchParams.get("siteId") : null;

  // Watch form values
  const siteAmenities = watch("siteAmenities") || [];
  const siteFacilities = watch("siteFacilities") || [];
  const safetyItems = watch("safetyItems") || [];
  const otherAmenities = watch("otherAmenities") || "";
  const otherFacilities = watch("otherFacilities") || "";
  const otherSafety = watch("otherSafety") || "";
  const petPolicy = watch("petPolicy") || "";
  const parkingVehicles = watch("parkingVehicles") || "";

  const handleInputChange = (field: string, value: string | string[]) => {
    setValue(field, value);
  };

  const handleSave = async () => {
    try {
      const isValid = await saveSection("amenities");
      if (!isValid) {
        return;
      }

      const formData = new FormData();

      // Append array fields
      siteAmenities.forEach((item: string) =>
        formData.append("amenities[]", item)
      );

      siteFacilities.forEach((item: string) =>
        formData.append("facilities[]", item)
      );

      safetyItems.forEach((item: string) =>
        formData.append("safety_items[]", item)
      );

      // Append other fields
      if (otherAmenities) formData.append("other_amenity", otherAmenities);

      if (otherFacilities) formData.append("other_facility", otherFacilities);

      if (otherSafety) formData.append("other_safety_item", otherSafety);

      if (petPolicy) formData.append("pet_policy", "yes_on_leash");

      if (parkingVehicles)
        formData.append("free_parking_slots", parkingVehicles);

      // Call API
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://api.hightribe.com/api/properties/${propertyId}/sites/amenities`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();
      console.log("API response:", result);

      if (response.ok) {
        toast.success("Amenities saved successfully");
      } else {
        toast.error("Failed to save amenities");
      }
    } catch (error) {
      console.error("Error saving amenities:", error);
      toast.error("An error occurred while saving amenities");
    }
  };

  return (
    <div ref={sectionRef}>
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Site Amenities and Facilities
        </h2>
      </div>
      <div className="p-6 bg-white rounded-lg shadow-sm mt-4">
        <div className="space-y-8">
          {/* Site Amenities */}
          <div>
            <label className="text-sm font-normal text-gray-700 block mb-3">
              Let guests know which amenities are in this site.
            </label>
            <div className="flex items-center flex-wrap gap-2">
              {[
                { id: "wifi", label: "Wi-Fi", checked: false },
                { id: "tv", label: "TV", checked: false },
                { id: "kitchen", label: "Kitchen", checked: false },
                { id: "washer", label: "Washer", checked: false },
                {
                  id: "air-conditioner",
                  label: "Air Conditioner",
                  checked: false,
                },
                {
                  id: "heating-system",
                  label: "Heating System",
                  checked: false,
                },
                {
                  id: "bed-linens",
                  label: "Bed Linens",
                  checked: false,
                },
                {
                  id: "clothing-storage",
                  label: "Clothing Storage",
                  checked: false,
                },
                {
                  id: "extra-pillows",
                  label: "Extra Pillows",
                  checked: false,
                },
                {
                  id: "extra-blankets",
                  label: "Extra Blankets",
                  checked: false,
                },
                { id: "hangers", label: "Hangers", checked: false },
                { id: "iron", label: "Iron", checked: false },
                { id: "bathroom", label: "Bathroom", checked: false },
                {
                  id: "shared-non-ensuite",
                  label: "Shared Non-ensuite",
                  checked: false,
                },
                {
                  id: "private-non-ensuite",
                  label: "Private Non-ensuite",
                  checked: false,
                },
                {
                  id: "private-ensuite",
                  label: "Private Ensuite",
                  checked: false,
                },
                {
                  id: "shared-ensuite",
                  label: "Shared Ensuite",
                  checked: false,
                },
                {
                  id: "other-amenities",
                  label: "Other",
                  checked: false,
                },
              ].map((amenity) => (
                <label
                  key={amenity.id}
                  className="flex items-center justify-center gap-2 px-3 py-2 border border-black rounded-[5px] cursor-pointer hover:bg-gray-50 transition-colors text-gray-800 text-[13px] font-normal whitespace-nowrap"
                >
                  <input
                    type="checkbox"
                    checked={siteAmenities.includes(amenity.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleInputChange("siteAmenities", [
                          ...siteAmenities,
                          amenity.id,
                        ]);
                      } else {
                        handleInputChange(
                          "siteAmenities",
                          siteAmenities.filter((a) => a !== amenity.id)
                        );
                      }
                    }}
                    className="w-4 h-4 border border-gray-400 rounded-sm focus:ring-0 focus:ring-offset-0 mr-1 accent-blue-600"
                    style={{ minWidth: 16, minHeight: 16 }}
                  />
                  <span className="text-[14px]">{amenity.label}</span>
                  {amenity.id === "other-amenities" && (
                    <input
                      type="text"
                      placeholder="Please specify..."
                      className="text-[13px] border  border-[#848484] rounded-[5px] font-normal text-gray-800 bg-transparent  outline-none p-1 ml-2 min-w-[300px]"
                      value={otherAmenities}
                      onChange={(e) =>
                        handleInputChange("otherAmenities", e.target.value)
                      }
                    />
                  )}
                </label>
              ))}
            </div>
            <FormError error={errors.siteAmenities?.message} />
          </div>
          {/* Facilities */}
          <div>
            <label className="text-sm font-medium text-gray-900 block mb-2">
              Do you have any other facilities to which the guests will have
              access? Select all that apply
            </label>
            <div className="flex items-center flex-wrap gap-2">
              {[
                {
                  id: "shared-pool",
                  label: "Shared Pool",
                  checked: false,
                },
                {
                  id: "private-pool",
                  label: "Private Pool",
                  checked: false,
                },
                { id: "hot-tub", label: "Hot Tub", checked: false },
                {
                  id: "outdoor-seating",
                  label: "Outdoor Seating or Patio",
                  checked: false,
                },
                {
                  id: "fire-pit",
                  label: "Fire Pit or Barbecue",
                  checked: false,
                },
                {
                  id: "outdoor-dining",
                  label: "Outdoor Dining Area",
                  checked: false,
                },
                { id: "play-area", label: "Play Area", checked: false },
                {
                  id: "indoor-games",
                  label: "Indoor Games",
                  checked: false,
                },
                {
                  id: "outdoor-games",
                  label: "Outdoor Games",
                  checked: false,
                },
                {
                  id: "indoor-fireplace",
                  label: "Indoor Fireplace",
                  checked: false,
                },
                {
                  id: "musical-instruments",
                  label: "Musical Instruments",
                  checked: false,
                },
                {
                  id: "facility-kitchen",
                  label: "Kitchen",
                  checked: false,
                },
                {
                  id: "shared-bathroom",
                  label: "Shared Bathroom",
                  checked: false,
                },
                { id: "gym", label: "Gym", checked: false },
                {
                  id: "lake-access",
                  label: "Lake Access",
                  checked: false,
                },
                {
                  id: "beach-access",
                  label: "Beach Access",
                  checked: false,
                },
                {
                  id: "outdoor-shower",
                  label: "Outdoor Shower",
                  checked: false,
                },
                {
                  id: "art-studio",
                  label: "Art Studio / Creative Zone",
                  checked: false,
                },
                {
                  id: "wheelchair",
                  label: "Wheelchair",
                  checked: false,
                },
                {
                  id: "dedicated-workspace",
                  label: "Dedicated Workspace",
                  checked: false,
                },
                {
                  id: "free-parking",
                  label: "Free Parking",
                  checked: false,
                },
                {
                  id: "paid-parking",
                  label: "Paid Parking",
                  checked: false,
                },
                {
                  id: "other-facilities",
                  label: "Other",
                  checked: false,
                },
              ].map((facility) => (
                <label
                  key={facility.id}
                  className="flex items-center justify-center gap-2 px-3 py-2 border border-black rounded-[5px] cursor-pointer hover:bg-gray-50 transition-colors text-gray-800 text-[13px] font-normal whitespace-nowrap"
                >
                  <input
                    type="checkbox"
                    checked={siteFacilities.includes(facility.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleInputChange("siteFacilities", [
                          ...siteFacilities,
                          facility.id,
                        ]);
                      } else {
                        handleInputChange(
                          "siteFacilities",
                          siteFacilities.filter((f) => f !== facility.id)
                        );
                      }
                    }}
                    className="w-4 h-4 border border-gray-400 rounded-sm focus:ring-0 focus:ring-offset-0 mr-1 accent-blue-600"
                    style={{ minWidth: 16, minHeight: 16 }}
                  />
                  <span className="text-[14px]">{facility.label}</span>
                  {facility.id === "free-parking" && (
                    <input
                      type="text"
                      placeholder="Number of allowed vehicles"
                      className="flex-1 text-[13px] border border-[#848484] rounded-[5px] font-normal text-gray-400 bg-transparent  outline-none p-1 ml-2 min-w-0 placeholder-gray-400"
                      value={parkingVehicles}
                      onChange={(e) =>
                        handleInputChange("parkingVehicles", e.target.value)
                      }
                    />
                  )}
                </label>
              ))}
            </div>
            <FormError error={errors.siteFacilities?.message} />
          </div>
          {/* Safety Items */}
          <div>
            <label className="text-sm font-medium text-gray-900 block mb-2">
              Do you have any of these safety items?
            </label>
            <div className="flex items-center flex-wrap gap-2">
              {[
                {
                  id: "smoke-alarm",
                  label: "Smoke Alarm",
                  checked: false,
                },
                {
                  id: "first-aid-kit",
                  label: "First Aid Kit",
                  checked: false,
                },
                {
                  id: "fire-extinguisher",
                  label: "Fire Extinguisher",
                  checked: false,
                },
                {
                  id: "carbon-monoxide-alarm",
                  label: "Carbon Monoxide Alarm",
                  checked: false,
                },
                { id: "other-safety", label: "Other", checked: false },
              ].map((safety) => (
                <label
                  key={safety.id}
                  className="flex items-center justify-center gap-2 px-3 py-2 border border-black rounded-[5px] cursor-pointer hover:bg-gray-50 transition-colors text-gray-800 text-[13px] font-normal whitespace-nowrap"
                >
                  <input
                    type="checkbox"
                    checked={safetyItems.includes(safety.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleInputChange("safetyItems", [
                          ...safetyItems,
                          safety.id,
                        ]);
                      } else {
                        handleInputChange(
                          "safetyItems",
                          safetyItems.filter((s) => s !== safety.id)
                        );
                      }
                    }}
                    className="w-4 h-4 border border-gray-400 rounded-sm focus:ring-0 focus:ring-offset-0 mr-1 accent-blue-600"
                    style={{ minWidth: 16, minHeight: 16 }}
                  />
                  <span className="text-[14px]">{safety.label}</span>
                </label>
              ))}
            </div>
            <FormError error={errors.safetyItems?.message} />
          </div>
          {/* Pet Policy */}
          <div>
            <label className="text-sm font-medium text-gray-900 block mb-2">
              Do you allow pet?
            </label>
            <div className="flex items-center flex-wrap gap-2">
              {[
                { id: "yes_on_leash", label: "Yes", checked: false },
                { id: "no_on_leash", label: "No", checked: false },
                {
                  id: "on_leash",
                  label: "On leash",
                  checked: false,
                },
                {
                  id: "pets-without-leash",
                  label: "Without leash",
                  checked: false,
                },
              ].map((pet) => (
                <label
                  key={pet.id}
                  className="flex items-center justify-center gap-2 px-3 py-2 border border-black rounded-[5px] cursor-pointer hover:bg-gray-50 transition-colors text-gray-800 text-[13px] font-normal whitespace-nowrap"
                >
                  <input
                    type="checkbox"
                    checked={petPolicy === pet.id}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleInputChange("petPolicy", pet.id);
                      }
                    }}
                    className="w-4 h-4 border border-gray-400 rounded-sm focus:ring-0 focus:ring-offset-0 mr-1 accent-blue-600"
                    style={{ minWidth: 16, minHeight: 16 }}
                  />
                  <span className="text-[14px]">{pet.label}</span>
                </label>
              ))}
            </div>
            <FormError error={errors.petPolicy?.message} />
          </div>
        </div>
        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm shadow-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SiteAmenitiesSection;
