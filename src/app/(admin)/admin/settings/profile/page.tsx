/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Camera, Save, X } from "lucide-react";
import { message } from "antd";
import RmForm from "@/components/ui/RmForm";
import RmInput from "@/components/ui/RmInput";
import RmModal from "@/components/ui/RmModal";
import Image from "next/image";

export default function ProfileSettingsPage() {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        message.error("File size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      message.success("Avatar updated successfully!");
    }
  };

  const handleProfileSubmit = (data: any) => {
    console.log("Profile data:", data);
    message.success("Profile updated successfully!");
  };

  const handlePasswordChange = (data: any) => {
    console.log("Password data:", data);
    message.success("Password changed successfully!");
    setIsPasswordModalOpen(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">
          Profile Settings
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Update your personal information
        </p>
      </div>

      <div className="p-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-900 text-white flex items-center justify-center text-2xl font-bold">
              {avatarPreview ? (
                <Image 
                  src={avatarPreview}
                  alt="Preview"
                  fill
                  className="object-contain rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                "AU"
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors">
              <Camera size={14} />
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Change Avatar</p>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG or GIF. Max size 2MB
            </p>
          </div>
        </div>

        {/* Profile Form */}
        <RmForm
          onSubmit={handleProfileSubmit}
          defaultValues={{
            firstName: "Admin",
            lastName: "User",
            email: "admin@business.com",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RmInput
              name="firstName"
              label="First Name"
              placeholder="Enter first name"
              required
            />
            <RmInput
              name="lastName"
              label="Last Name"
              placeholder="Enter last name"
              required
            />
            <RmInput
              name="email"
              label="Email Address"
              type="email"
              placeholder="Enter email address"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value="********"
                  disabled
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm bg-gray-50 cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  Change
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: "#C70A24" }}
            >
              <Save size={16} />
              Save Changes
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </RmForm>
      </div>

      {/* Change Password Modal */}
      <RmModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Password"
        width="max-w-md"
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => setIsPasswordModalOpen(false)}
              className="flex-1 py-2.5 rounded-lg text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="password-form"
              className="flex-1 py-2.5 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: "#C70A24" }}
            >
              Update Password
            </button>
          </div>
        }
      >
        <RmForm id="password-form" onSubmit={handlePasswordChange}>
          <div className="space-y-4">
            <RmInput
              name="currentPassword"
              label="Current Password"
              type="password"
              placeholder="Enter current password"
              required
            />
            <RmInput
              name="newPassword"
              label="New Password"
              type="password"
              placeholder="Enter new password"
              required
            />
            <RmInput
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Confirm new password"
              required
            />
          </div>
        </RmForm>
      </RmModal>
    </div>
  );
}
