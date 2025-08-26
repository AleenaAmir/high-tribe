"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import GlobalModalBorderLess from "../global/GlobalModalBorderLess";
import GlobalTextInput from "../global/GlobalTextInput";
import GlobalSelect from "../global/GlobalSelect";
import GlobalDateInput from "../global/GlobalDateInput";
import Location from "../dashboard/svgs/Location";
import { toast } from "react-hot-toast";
import { apiRequest } from "@/lib/api";
import GlobalTextArea from "../global/GlobalTextArea";


// ── Validation ────────────────────────────────────────────────────────────────
const stopFormSchema = z.object({
    date: z.string().min(1, "Date is required"),
    category: z.string().min(1, "Category is required"),
    location: z.string().min(2, "Location must be at least 2 characters"),
    modeOfTravel: z.string().min(1, "Mode of travel is required"),
    notes: z.string().optional(),
});

type StopFormData = z.infer<typeof stopFormSchema>;

// ── Component ────────────────────────────────────────────────────────────────
export default function AddStopModal({
    open,
    onClose,
    dayIndex,
    journeyData,
    setSavedSteps,
}: {
    open: boolean;
    onClose: () => void;
    dayIndex: number;
    journeyData: any;
    setSavedSteps: (steps: any) => void;
}) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
        setValue,
    } = useForm<StopFormData>({
        resolver: zodResolver(stopFormSchema),
        defaultValues: {
            date: "",
            category: "",
            location: "",
            modeOfTravel: "",
            notes: "",
        },
    });

    const [stopCategories, setStopCategories] = useState<any[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);

    // Debug (remove in production)
    useEffect(() => {
        setLoadingCategories(true);

        const fetchData = async () => {
            try {
                console.log('Fetching categories...');

                // Fetch categories from API
                const categoriesPromise = apiRequest<any>("posts/stops/categories", { method: "GET" });
                const categoriesData = await categoriesPromise;

                console.log('Categories data received:', categoriesData);

                // Handle categories data structure
                let categories = [];
                if (Array.isArray(categoriesData)) {
                    categories = categoriesData;
                } else if (categoriesData?.categories && Array.isArray(categoriesData.categories)) {
                    categories = categoriesData.categories;
                } else if (categoriesData && typeof categoriesData === 'object' && categoriesData.data && Array.isArray(categoriesData.data)) {
                    categories = categoriesData.data;
                }

                // Map categories to expected structure
                const mappedCategories = categories.map((cat: any) => ({
                    id: cat.id,
                    name: cat.name,
                    label: cat.name,
                }));

                console.log('Processed categories:', mappedCategories);
                setStopCategories(mappedCategories);

            } catch (error) {
                console.error('Error fetching data:', error);

                // Set some default categories for testing
                const defaultCategories = [
                    { id: 1, name: "Hotel", label: "Hotel" },
                    { id: 2, name: "Restaurant", label: "Restaurant" },
                    { id: 3, name: "Tourist Attraction", label: "Tourist Attraction" },
                    { id: 4, name: "Shopping", label: "Shopping" },
                    { id: 5, name: "Entertainment", label: "Entertainment" },
                    { id: 6, name: "Transportation", label: "Transportation" },
                    { id: 7, name: "Other", label: "Other" }
                ];

                console.log('Using default categories:', defaultCategories);
                setStopCategories(defaultCategories);

            } finally {
                setLoadingCategories(false);
            }
        };

        fetchData();
    }, []);

    const onSubmit = async (data: StopFormData) => {
        // Persist
        try {
            const TOKEN =
                typeof window !== "undefined"
                    ? localStorage.getItem("token") || "<PASTE_VALID_TOKEN_HERE>"
                    : "<PASTE_VALID_TOKEN_HERE>";

            const formData = new FormData();

            formData.append("stop_category_id", data.category || "1");
            formData.append("location_name", data.location);
            formData.append("lat", "48.8584");
            formData.append("lng", "2.2945");
            formData.append("transport_mode", data.modeOfTravel || "");
            formData.append("start_date", data.date || "");

            formData.append("notes", data.notes || "");

            const response = await fetch(
                `https://api.hightribe.com/api/journeys/${journeyData.id}/stops`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${TOKEN}`,
                        Accept: "application/json",
                    },
                    body: formData,
                }
            );
            if (response.status === 201) {
                toast.success("Stop saved successfully!");
            }
        } catch (e) {
            console.warn("Save failed (show a toast, keep user in edit):", e);
            return;
        }

        // Switch to preview mode
        setSavedSteps((m: any) => ({ ...m, [`${dayIndex}`]: true }));
    };

    return (
        <div>
            <GlobalModalBorderLess
                isOpen={open}
                onClose={onClose}
                maxWidth="max-w-[949px]"
                customPadding="p-0"
            >
                <div className="overflow-hidden w-full rounded-[20px]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 h-full rounded-lg">
                        {/* Left: Form Panel */}
                        <div className="flex flex-col bg-white h-full">
                            {/* Header */}
                            <div className="flex justify-center items-center p-6 border-b border-gray-200">
                                <h2 className="text-[22px] font-bold font-gilroy text-center">Add new Stop</h2>
                            </div>

                            {/* Form Content */}
                            <div className="flex-1 p-6">
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    {/* Date */}
                                    <div className="relative">
                                        <GlobalDateInput
                                            label="Day 1 (MM/DD/YYYY)"
                                            error={errors.date?.message}
                                            value={watch("date")}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                setValue("date", e.target.value, {
                                                    shouldValidate: true,
                                                })
                                            }
                                        />
                                    </div>

                                    {/* Category */}
                                    <GlobalSelect
                                        label="Category"
                                        value={watch("category")}
                                        onChange={(e) => setValue("category", e.target.value, { shouldValidate: true })}
                                        error={errors.category?.message}
                                    >
                                        <option value="" disabled>
                                            {loadingCategories
                                                ? "Loading categories..."
                                                : stopCategories.length === 0
                                                    ? "No categories available"
                                                    : "Select a category"}
                                        </option>
                                        {stopCategories.map((category) => (
                                            <option key={category.id} value={category.id.toString()}>
                                                {category.name || category.label}
                                            </option>
                                        ))}
                                    </GlobalSelect>

                                    {/* Location */}
                                    <div className="relative">
                                        <GlobalTextInput
                                            label="Add Location"
                                            error={errors.location?.message}
                                            {...register("location")}
                                        />
                                        <div className="absolute right-3 top-9">
                                            <Location className="text-gray-400" />
                                        </div>
                                    </div>

                                    {/* Mode of Travel */}
                                    <GlobalSelect
                                        label="Mode of Travel"
                                        value={watch("modeOfTravel")}
                                        onChange={(e) => setValue("modeOfTravel", e.target.value, { shouldValidate: true })}
                                        error={errors.modeOfTravel?.message}
                                    >
                                        <option value="" disabled>
                                            Select a mode of travel
                                        </option>
                                        <option value="car">Car</option>
                                        <option value="bus">Bus</option>
                                        <option value="train">Train</option>
                                        <option value="plane">Plane</option>
                                        <option value="walking">Walking</option>
                                        <option value="other">Other</option>
                                    </GlobalSelect>

                                    {/* Notes */}
                                    <GlobalTextArea
                                        label="Notes"
                                        rows={3}
                                        placeholder="Add notes about this stop..."
                                        value={watch("notes")}
                                        onChange={(e) => setValue("notes", e.target.value)}
                                        error={errors.notes?.message}
                                    />
                                </form>
                            </div>

                            {/* Footer with Save Button */}
                            <div className="flex justify-end items-center p-6 border-t border-gray-200">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    onClick={handleSubmit(onSubmit)}
                                    className="bg-gradient-to-r from-[#9743AA] to-[#E54295] text-white font-semibold text-[16px] py-2 px-6 rounded-full transition-colors duration-200 disabled:cursor-not-allowed hover:opacity-90"
                                >
                                    {isSubmitting ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </div>

                        {/* Right: Map */}
                        <div className="bg-gray-100 h-full relative">
                            {/* Map placeholder - you can replace this with actual map component */}
                            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mb-4 mx-auto">
                                        <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-600 font-medium">Map View</p>
                                    <p className="text-gray-500 text-sm">Interactive map will be displayed here</p>
                                </div>
                            </div>

                            {/* Close button overlay */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </GlobalModalBorderLess>
        </div>
    );
}
