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

    const response = await fetch(
      "https://api.hightribe.com/api/host-profiles",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      }
    );
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
      <div className="flex flex-col items-center justify-center w-full max-w-4xl bg-white rounded-lg shadow-sm ">
        <div className="flex justify-between w-full flex-wrap py-2 px-4 md:px-8 md:py-4 lg:py-6 lg:px-10 border-b border-[#F9F9F9]">
          <h1 className="text-[20px] font-bold text-center">
            Create Host Page
          </h1>
          <Link
            href="/host/home"
            className="text-lg font-medium flex justify-end text-[#1C231F] underline"
          >
            Skip
          </Link>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full space-y-2  max-w-[500px] mx-auto py-2 px-4 md:px-8 md:py-4 lg:py-6 lg:px-10"
        >
          <div>
            {" "}
            <h3 className="text-lg font-bold text-[#1C231F] text-center">
              Setup Your Host Profile
            </h3>
            <p className="text-[10px] max-w-[220px] mx-auto text-center text-[#1C231F]">
              To start hosting, please complete your Host Profile and verify
              your identity.
            </p>
          </div>
          <div className="flex flex-col w-full">
            <GlobalTextInput
              label={
                <span>
                  Full Legal Name<span className="text-red-500">*</span>
                </span>
              }
              placeholder=" "
              error={errors.fullLegalName?.message as string}
              {...register("fullLegalName")}
            />
            <GlobalTextInput
              label={
                <span>
                  Email<span className="text-red-500">*</span>
                </span>
              }
              placeholder=" "
              error={errors.email?.message as string}
              {...register("email")}
            />
            <GlobalTextInput
              label={
                <span>
                  Phone Number<span className="text-red-500">*</span>
                </span>
              }
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
          <div>
            <label
              htmlFor="profile-picture"
              className="text-sm font-medium text-[#1C231F]"
            >
              Profile Picture<span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 mt-3 md:mt-5">
              <div className="w-[55px] cursor-pointer h-[55px] border border-[#A3A3A3] rounded-lg flex items-center justify-center overflow-hidden text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  className="hidden"
                  id="profile-picture"
                />
                <label htmlFor="profile-picture" className="cursor-pointer">
                  <div className="rounded-full flex items-center justify-center">
                    {profilePicture ? (
                      <img
                        src={URL.createObjectURL(profilePicture)}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="21"
                        height="21"
                        fill="none"
                        viewBox="0 0 21 21"
                      >
                        <g clipPath="url(#clip0_1284_5843)">
                          <path
                            fill="#838181"
                            d="M13.005 11.092c1.75-1.077 2.88-3.204 2.88-5.169 0-2.8-2.288-5.923-5.384-5.923S5.116 3.123 5.116 5.923c0 1.965 1.131 4.092 2.881 5.17A9.71 9.71 0 0 0 .81 20.461a.54.54 0 0 0 .538.538h18.308a.54.54 0 0 0 .538-.538 9.71 9.71 0 0 0-7.188-9.37M6.193 5.923c0-2.773 2.289-4.846 4.308-4.846 2.02 0 4.308 2.073 4.308 4.846S12.52 10.77 10.5 10.77c-2.02 0-4.308-2.073-4.308-4.846m-4.28 14c.269-4.496 4.038-8.077 8.588-8.077s8.32 3.58 8.588 8.077z"
                          ></path>
                        </g>
                        <defs>
                          <clipPath id="clip0_1284_5843">
                            <path fill="#fff" d="M0 0h21v21H0z"></path>
                          </clipPath>
                        </defs>
                      </svg>
                    )}
                  </div>
                </label>
              </div>
              <label
                htmlFor="profile-picture"
                className="text-xs font-medium cursor-pointer"
              >
                Upload a photo
              </label>
            </div>
          </div>

          {/* Government ID Section */}
          <div className="space-y-2">
            <h2 className="text-[12px] font-semibold">
              Government-Issued ID<span className="text-red-500">*</span>
            </h2>

            {/* ID Type Selection */}
            <div className="space-y-2">
              <h3 className="text-[12px] font-medium">Select ID type</h3>
              <div className="flex gap-4 md:gap-10">
                <label className="flex items-center space-x-3 cursor-pointer ">
                  <input
                    type="radio"
                    name="idType"
                    value="passport"
                    checked={selectedIdType === "passport"}
                    onChange={(e) => setSelectedIdType(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-[12px]">Passport</span>
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
                  <span className="text-[12px]">
                    National ID{" "}
                    <span className="text-[#979494]">(e.g. CNIC)</span>
                  </span>
                </label>
              </div>
            </div>

            {/* File Upload Area */}
            <div className="border-2 border-dashed border-[#A6A4A4] rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.mpeg,.mov"
                multiple
                onChange={handleIdDocumentsUpload}
                className="hidden"
                id="id-documents"
              />
              <label htmlFor="id-documents" className="cursor-pointer">
                <div className="flex flex-col items-center space-y-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 16 16"
                  >
                    <path
                      stroke="#000"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.667 10.667 8.001 8l-2.667 2.667M8 8v6"
                    ></path>
                    <path
                      stroke="#000"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.594 12.26A3.333 3.333 0 0 0 12.001 6h-.84a5.33 5.33 0 0 0-7.666-3.375 5.333 5.333 0 0 0-1.494 8.242"
                    ></path>
                    <path
                      stroke="#000"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.667 10.667 8.001 8l-2.667 2.667"
                    ></path>
                  </svg>
                  <div className="">
                    <p className="text-[6px]">Drag & drop or click to upload</p>
                    <p className="text-[7px] ">
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
          <div className="pt-3 flex justify-center">
            <button
              type="submit"
              className="w-fit mx-auto bg-blue-600 text-white py-2 px-6 md:px-10 rounded-lg hover:bg-blue-700 transition-colors font-medium"
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
