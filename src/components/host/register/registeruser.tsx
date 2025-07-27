"use client";

import { useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";
import GlobalTextInput from "@/components/global/GlobalTextInput";
import { apiRequest } from "@/lib/api";
import Link from "next/link";
import toast from "react-hot-toast";

interface UserData {
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
}

const registeruser = () => {
  const [selectedIdType, setSelectedIdType] = useState("passport");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [idDocuments, setIdDocuments] = useState<File[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      fullLegalName: userData?.name || "",
      email: userData?.email || "",
      phoneNumber: userData?.phone || "",
      country: userData?.country || "",
      city: userData?.city || "",
    },
  });
  useEffect(() => {
    const user = localStorage.getItem("user");
    const parsedUser = user ? JSON.parse(user) : null;
    setUserData(parsedUser);
    if (parsedUser) {
      reset({
        fullLegalName: parsedUser.name || "",
        email: parsedUser.email || "",
        phoneNumber: parsedUser.phone || "",
        country: parsedUser.country || "",
        city: parsedUser.city || "",
      });
    }
  }, []);

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("full_name", data.fullLegalName);
    formData.append("email", data.email);
    formData.append("phone_number", data.phoneNumber);
    formData.append("country", data.country);
    formData.append("city", data.city);
    formData.append("id_type", selectedIdType);

    if (profilePicture) {
      formData.append("profile_picture", profilePicture);
    }
    if (idDocuments.length > 0) {
      idDocuments.forEach((file) => {
        formData.append("government_id_file", file); // Use correct key
      });
    }

    const token = localStorage.getItem("token") || "<PASTE_VALID_TOKEN_HERE>";

    const response = await fetch("https://api.hightribe.com/api/host-profiles", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: formData,
    });
    const responseData = await response.json();
    if (responseData.status == true) {
      toast.success(responseData.message);
      // window.location.href = "/host/approval";
    } else {
      toast.error(responseData.message);
    }
  };

  const handleProfilePictureUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleIdDocumentsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setIdDocuments((prev) => [...prev, ...files].slice(0, 5)); // Max 5 files
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="flex flex-col items-center justify-center w-full max-w-4xl bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Create Host Page
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-8">
          <Link
            href="/host/home"
            className="text-lg font-medium flex justify-end text-red-600 underline"
          >
            skip for now
          </Link>
          <div className="flex flex-col gap-4">
            <GlobalTextInput
              label="Full Legal Name *"
              placeholder=" "
              error={errors.fullLegalName?.message as string}
              {...register("fullLegalName")}
            />
            <GlobalTextInput
              label="Email *"
              placeholder=" "
              error={errors.email?.message as string}
              {...register("email")}
            />
            <GlobalTextInput
              label="Phone Number"
              placeholder=" "
              error={errors.phoneNumber?.message as string}
              {...register("phoneNumber")}
            />
            <GlobalTextInput
              label="Country"
              placeholder=" "
              error={errors.country?.message as string}
              {...register("country")}
            />
            <GlobalTextInput
              label="City"
              placeholder=" "
              error={errors.city?.message as string}
              {...register("city")}
            />
          </div>

          {/* Profile Picture Section */}
          <div className="w-38 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureUpload}
              className="hidden"
              id="profile-picture"
            />
            <label htmlFor="profile-picture" className="cursor-pointer">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                  {profilePicture ? (
                    <img
                      src={URL.createObjectURL(profilePicture)}
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-gray-600">Upload a photo</span>
              </div>
            </label>
          </div>

          {/* Government ID Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Government-Issued ID*</h2>

            {/* ID Type Selection */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Select ID type</h3>
              <div className="flex gap-4 justify-around ">
                <label className="flex items-center space-x-3 cursor-pointer ">
                  <input
                    type="radio"
                    name="idType"
                    value="passport"
                    checked={selectedIdType === "passport"}
                    onChange={(e) => setSelectedIdType(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>Passport</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="idType"
                    value="nationalId"
                    checked={selectedIdType === "nationalId"}
                    onChange={(e) => setSelectedIdType(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>National ID (e.g. CNIC)</span>
                </label>
              </div>
            </div>

            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.mpeg,.mov"
                multiple
                onChange={handleIdDocumentsUpload}
                className="hidden"
                id="id-documents"
              />
              <label htmlFor="id-documents" className="cursor-pointer">
                <div className="flex flex-col items-center space-y-4">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      Drag & drop or click to upload
                    </p>
                    <p className="text-sm text-gray-500">
                      Max 5 files .JPG, .PNG, .MPEG, .Mov
                    </p>
                  </div>
                </div>
              </label>
            </div>

            {/* Display uploaded files */}
            {idDocuments.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Uploaded files:</h4>
                <div className="space-y-1">
                  {idDocuments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <span className="text-sm">{file.name}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setIdDocuments((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default registeruser;
