"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import GlobalSelect from "@/components/global/GlobalSelect";
import { apiFormDataWrapper } from "@/lib/api";
import GlobalTextInput from "@/components/global/GlobalTextInput";
import GlobalTextArea from "@/components/global/GlobalTextArea";

// Currency interface
interface Currency {
  code: string;
  name: string;
  symbol: string;
}

// Zod validation schema
const sitePricingSchema = z
  .object({
    hostingType: z.string().min(1, "Hosting type is required"),
    currency: z.string().optional(),
    price: z.number().optional(),
    discountType: z
      .union([z.literal("percentage"), z.literal("fixed"), z.literal("")])
      .optional(),

    discountName: z.string().optional(),
    discountAmount: z
      .number()
      .min(0, "Discount amount must be positive")
      .optional(),
    startDate: z.string().optional(),
    expirationDate: z.string().optional(),
    promoCode: z.string().optional(),
    discountPrice: z
      .number()
      .min(0, "Discount price must be positive")
      .optional(),
    exchangeService: z.string().optional(),
    otherService: z.string().optional(),
    exchangeDescription: z
      .string()
      .max(1000, "Description must be less than 1000 characters")
      .optional(),
    artistService: z.string().optional(),
    otherArtistService: z.string().optional(),
    artistDescription: z
      .string()
      .max(1000, "Description must be less than 1000 characters")
      .optional(),
  })
  .refine(
    (data) => {
      // If hosting type is "paid", currency and price are required
      if (data.hostingType === "paid") {
        return (
          data.currency &&
          data.currency.length > 0 &&
          data.price &&
          data.price > 0
        );
      }
      // If hosting type is "exchange", exchangeService is required
      if (data.hostingType === "exchange") {
        return data.exchangeService && data.exchangeService.length > 0;
      }
      // If hosting type is "artist", artistService is required
      if (data.hostingType === "artist") {
        return data.artistService && data.artistService.length > 0;
      }
      // For "free" hosting type, no additional validation needed
      return true;
    },
    {
      message:
        "Please fill in all required fields for the selected hosting type",
      path: ["hostingType"],
    }
  );

type SitePricingFormData = z.infer<typeof sitePricingSchema>;

export default function SitesPricingForm({
  propertyId,
  siteId,
  onSuccess,
  siteData,
  isEditMode,
}: {
  propertyId: string;
  siteId: string;
  onSuccess?: () => void;
  siteData?: any;
  isEditMode?: boolean;
}) {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);
  const [dataSent, setDataSent] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SitePricingFormData>({
    resolver: zodResolver(sitePricingSchema),
    defaultValues: {
      hostingType: "",
      currency: "",
      price: 0,
      discountType: "",
      discountName: "",
      discountAmount: 0,
      startDate: "",
      expirationDate: "",
      promoCode: "",
      discountPrice: 0,
      exchangeService: "",
      otherService: "",
      exchangeDescription: "",
      artistService: "",
      otherArtistService: "",
      artistDescription: "",
    },
  });

  // Populate form data when siteData is available in edit mode
  useEffect(() => {
    if (isEditMode && siteData?.pricing) {
      reset({
        hostingType: siteData.pricing.hosting_type || "",
        currency: siteData.pricing.currency || "",
        price: siteData.pricing.base_price || 0,
        discountType: siteData.pricing.discount_type || "",
        discountName: siteData.pricing.discount_name || "",
        discountAmount: siteData.pricing.amount || 0,
        startDate: siteData.pricing.start_date || "",
        expirationDate: siteData.pricing.end_date || "",
        promoCode: siteData.pricing.discount_code || "",
        discountPrice: siteData.pricing.discount_price || 0,
        exchangeService: siteData.pricing.service || "",
        otherService: "",
        exchangeDescription: siteData.pricing.hosting_description || "",
        artistService: siteData.pricing.service || "",
        otherArtistService: "",
        artistDescription: siteData.pricing.hosting_description || "",
      });
    }
  }, [siteData, isEditMode, reset]);

  const currentHostingType = watch("hostingType");

  useEffect(() => {
    if (currentHostingType) {
      reset({
        hostingType: currentHostingType, // Keep selected type
        currency: "",
        price: 0,
        discountType: "",
        discountName: "",
        discountAmount: 0,
        startDate: "",
        expirationDate: "",
        promoCode: "",
        discountPrice: 0,
        exchangeService: "",
        otherService: "",
        exchangeDescription: "",
        artistService: "",
        otherArtistService: "",
        artistDescription: "",
      });
    }
  }, [currentHostingType, reset]);

  // Fetch currencies from open-source API
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setLoadingCurrencies(true);
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=currencies"
        );
        const data = await response.json();

        // Extract unique currencies with symbols
        const currencyMap = new Map();
        data.forEach((country: any) => {
          if (country.currencies) {
            Object.entries(country.currencies).forEach(
              ([code, currency]: [string, any]) => {
                if (!currencyMap.has(code)) {
                  currencyMap.set(code, {
                    code: code.toUpperCase(),
                    name: currency.name,
                    symbol: currency.symbol || code.toUpperCase(),
                  });
                }
              }
            );
          }
        });

        // Convert to array and sort by code
        const currenciesArray = Array.from(currencyMap.values()).sort((a, b) =>
          a.code.localeCompare(b.code)
        );
        setCurrencies(currenciesArray);
      } catch (error) {
        console.error("Error fetching currencies:", error);
        // Fallback currencies if API fails
        setCurrencies([
          { code: "USD", name: "US Dollar", symbol: "$" },
          { code: "EUR", name: "Euro", symbol: "€" },
          { code: "GBP", name: "British Pound", symbol: "£" },
          { code: "PKR", name: "Pakistani Rupee", symbol: "₨" },
        ]);
      } finally {
        setLoadingCurrencies(false);
      }
    };

    fetchCurrencies();
  }, []);

  const onSubmit = async (data: SitePricingFormData) => {
    try {
      const formData = new FormData();

      // Add site_id
      if (siteId) {
        formData.append("site_id", siteId);
      }

      // Add site_id for edit mode
      if (isEditMode && siteData?.id) {
        formData.append("site_id", siteData.id.toString());
      }

      // Add hosting_type (mapped from hostingType)
      formData.append("hosting_type", data.hostingType);
      if (data.exchangeService) {
        formData.append("service", data.exchangeService);
      }
      if (data.artistService && data.artistService.length > 0) {
        formData.append("service", data.artistService);
      }

      if (data.exchangeDescription) {
        formData.append("hosting_description", data.exchangeDescription);
      }
      if (data.artistDescription) {
        formData.append("hosting_description", data.artistDescription);
      }

      // Add hosting_description (using a default value or description field)

      // Add currency (only if it exists)
      if (data.currency) {
        formData.append("currency", data.currency);
      }

      // Add base_price (mapped from price, only if it exists)
      if (data.price) {
        formData.append("base_price", data.price.toString());
      }

      // Add discount_type
      if (data.discountType && data.hostingType === "paid") {
        formData.append("discount_type", data.discountType);
      }

      // Add amount (mapped from discountAmount)
      if (data.discountAmount) {
        formData.append("amount", data.discountAmount.toString());
      }

      // Add discount_name (mapped from discountName)
      if (data.discountName) {
        formData.append("discount_name", data.discountName);
      }
      if (data.startDate) {
        formData.append("start_date", data.startDate);
      }
      if (data.expirationDate) {
        formData.append("end_date", data.expirationDate);
      }

      // Add discount_code (mapped from promoCode)
      if (data.promoCode) {
        formData.append("discount_code", data.promoCode);
      }

      // Add description (empty for now as per API image)
      formData.append("description", "");

      const response = await apiFormDataWrapper<{
        success: boolean;
        message: string;
      }>(
        `properties/${propertyId}/sites/pricing`,
        formData,
        isEditMode
          ? "Site pricing updated successfully!"
          : "Site pricing saved successfully!"
      );

      console.log("Form submitted successfully:", response);

      // Mark section as completed
      if (onSuccess) {
        onSuccess();
      }
      setDataSent(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      // Error handling is already done by apiFormDataWrapper
    }
  };

  const handleSaveClick = async () => {
    // Trigger form validation and submission
    const isValid = await handleSubmit(onSubmit)();
    return isValid;
  };

  const discountType = watch("discountType");
  const exchangeService = watch("exchangeService");
  const artistService = watch("artistService");

  return (
    <div>
      <h4 className="text-[14px] md:text-[16px] text-[#1C231F] font-semibold">
        Site Pricing
      </h4>
      <div className="mt-4">
        <div className="border border-[#E1E1E1] bg-white p-2 md:p-4 rounded-[7px]">
          <p className="text-[12px] md:text-[14px] text-[#1C231F] font-bold">
            Pricing
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <GlobalSelect
              label={
                <span>
                  Hosting Type<span className="text-red-500">*</span>
                </span>
              }
              {...register("hostingType")}
              error={errors.hostingType?.message}
            >
              <option value="">Select hosting type</option>
              <option value="paid">Paid stay</option>
              <option value="free">Free Stay</option>
              <option value="exchange">Exchange-based stay</option>
              <option value="artist">Artist-in-residence friendly</option>
            </GlobalSelect>
          </div>
          <div className="mt-4">
            {watch("hostingType") === "paid" && (
              <div>
                <p className="text-[14px] md:text-[16px] text-[#1C231F] font-bold">
                  Paid Stay
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  <GlobalSelect
                    label={
                      <span>
                        Currency<span className="text-red-500">*</span>
                      </span>
                    }
                    {...register("currency")}
                    error={errors.currency?.message}
                  >
                    <option value="">Select currency</option>
                    {loadingCurrencies ? (
                      <option value="" disabled>
                        Loading currencies...
                      </option>
                    ) : (
                      currencies.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </option>
                      ))
                    )}
                  </GlobalSelect>
                  <GlobalTextInput
                    label={
                      <span>
                        Price<span className="text-red-500">*</span>
                      </span>
                    }
                    type="number"
                    {...register("price", { valueAsNumber: true })}
                    error={errors.price?.message}
                  />
                </div>

                {/* Discount Type Section */}
                <div className="mt-4">
                  <p className="text-[14px] md:text-[16px] text-[#1C231F] font-bold mb-3">
                    Discount Type
                  </p>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        value="percentage"
                        {...register("discountType")}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Percentage</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        value="fixed"
                        {...register("discountType")}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        Fixed amount
                      </span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 space-x-2">
                  {/* Discount Details */}

                  <GlobalTextInput
                    label="Discount Name"
                    {...register("discountName")}
                    error={errors.discountName?.message}
                  />

                  <div className="relative">
                    <GlobalTextInput
                      label="Enter Discount"
                      type="number"
                      {...register("discountAmount", { valueAsNumber: true })}
                      error={errors.discountAmount?.message}
                    />
                    <div className="absolute right-3 top-8 text-gray-500">
                      {discountType === "percentage" ? "%" : watch("currency")}
                    </div>
                  </div>

                  <GlobalTextInput
                    label="Start Date of Discount"
                    type="date"
                    {...register("startDate")}
                    error={errors.startDate?.message}
                  />
                  <GlobalTextInput
                    label="Expiration Date"
                    type="date"
                    {...register("expirationDate")}
                    error={errors.expirationDate?.message}
                  />
                </div>

                {/* Promo Code Section */}
                <div className="mt-4">
                  <p className="text-[14px] md:text-[16px] text-[#1C231F] font-bold mb-3">
                    Promo code
                  </p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    <GlobalTextInput
                      label="Promo code"
                      {...register("promoCode")}
                      error={errors.promoCode?.message}
                    />
                    <div className="relative">
                      <GlobalTextInput
                        label="Discount Price"
                        type="number"
                        {...register("discountPrice", { valueAsNumber: true })}
                        error={errors.discountPrice?.message}
                      />
                      <div className="absolute right-3 top-8 text-gray-500">
                        {discountType === "percentage"
                          ? "%"
                          : watch("currency")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {watch("hostingType") === "exchange" && (
              <div>
                <p className="text-[14px] md:text-[16px] text-[#1C231F] font-bold mb-3">
                  Exchange-based stay
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Select the services you'd like to receive from the guest in
                  exchange for their stay. Select at least 1.
                </p>

                {/* Service Options */}
                <div className="space-y-3 mb-6">
                  {[
                    "Photography",
                    "Videography or content creation",
                    "Mural painting or creative decoration",
                    "Yoga or movement sessions for other guests",
                    "Musical performance or DJ sets",
                    "Help with permaculture or gardening",
                    "General maintenance or handywork",
                    "Help around the house or hosting",
                    "Teaching a skill or workshop",
                    "Social media or marketing support",
                    "Web, tech, or design help",
                    "Animal care",
                    "Charity or community work",
                    "Other",
                  ].map((service) => (
                    <label
                      key={service}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        value={service}
                        {...register("exchangeService")}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{service}</span>
                      {service === "Other" && exchangeService === "Other" && (
                        <GlobalTextInput
                          placeholder="Specify other service"
                          {...register("otherService")}
                          error={errors.otherService?.message}
                          className="ml-2 flex-1"
                        />
                      )}
                    </label>
                  ))}
                  {errors.exchangeService && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.exchangeService.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <GlobalTextArea
                    placeholder="Describe the exchange arrangement..."
                    {...register("exchangeDescription")}
                    error={errors.exchangeDescription?.message}
                    rows={4}
                    maxLength={1000}
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    limit 1000
                  </div>
                </div>
              </div>
            )}

            {watch("hostingType") === "artist" && (
              <div>
                <p className="text-[14px] md:text-[16px] text-[#1C231F] font-bold mb-3">
                  Artist-in-residence friendly
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Select the services you'd like to receive from the guest in
                  exchange for their stay. Select at least 1.
                </p>

                {/* Artist Service Options */}
                <div className="space-y-3 mb-6">
                  {[
                    "Create an artwork inspired by the location",
                    "Leave behind a piece for the host/property",
                    "Run a workshop or class for local community",
                    "Host an open studio or exhibition",
                    "Collaborate with local artists or guests",
                    "Document the residency (photos/video/blog)",
                    "Allow photos of the process for host promotion",
                    "Offer a talk or presentation about their work",
                    "Help with creative decoration of the space",
                    "Develop a site-specific installation",
                    "Other",
                  ].map((service) => (
                    <label
                      key={service}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        value={service}
                        {...register("artistService")}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{service}</span>
                      {service === "Other" && artistService === "Other" && (
                        <GlobalTextInput
                          placeholder="Specify other service"
                          {...register("otherArtistService")}
                          error={errors.otherArtistService?.message}
                          className="ml-2 flex-1"
                        />
                      )}
                    </label>
                  ))}
                  {errors.artistService && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.artistService.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <GlobalTextArea
                    placeholder="Describe the artist residency arrangement..."
                    {...register("artistDescription")}
                    error={errors.artistDescription?.message}
                    rows={4}
                    maxLength={1000}
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    limit 1000
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleSaveClick}
              disabled={isSubmitting}
              className={` w-[158px] mt-2 h-[35px] font-[500] text-[14px] text-white px-4 md:px-10 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                dataSent ? "bg-[#237AFC]" : "bg-[#BABBBC]"
              }`}
            >
              {dataSent
                ? "Saved"
                : isSubmitting
                ? "Saving..."
                : isEditMode
                ? "Update"
                : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
