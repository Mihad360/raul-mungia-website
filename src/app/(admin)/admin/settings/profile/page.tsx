/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { Camera, Save, Loader2 } from "lucide-react";
import { message } from "antd";
import Image from "next/image";
import RmForm from "@/components/ui/RmForm";
import RmInput from "@/components/ui/RmInput";
import RmModal from "@/components/ui/RmModal";
import { Loader } from "@/components/shared/Loader";
import { useGetMyProfileQuery } from "@/redux/api/authApi";
import { useEditProfileMutation } from "@/redux/api/userApi";
import Link from "next/link";

export default function ProfileSettingsPage() {
  // ─── Local UI state ──────────────────────────────────────
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  // ─── API hooks ────────────────────────────────────────────
  const { data: profileData, isLoading } = useGetMyProfileQuery(undefined);
  const [editProfile, { isLoading: isUpdating }] = useEditProfileMutation();

  const user = profileData?.data;

  // ─── Sync avatar preview with user profile image ──────────
  useEffect(() => {
    if (user?.profileImage && !avatarFile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAvatarPreview(user.profileImage);
    }
  }, [user?.profileImage, avatarFile]);

  // ─── Cleanup blob URLs ───────────────────────────────────
  useEffect(() => {
    return () => {
      if (avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  // ─── Avatar selection ────────────────────────────────────
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      message.error("File size must be less than 5MB");
      return;
    }

    // Revoke previous blob URL if exists
    if (avatarPreview.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // ─── Submit handler ──────────────────────────────────────
  const handleProfileSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          name: data.name?.trim(),
          phone: data.phone?.trim() || "",
          address: data.address?.trim() || "", // ← ADD
        }),
      );

      if (avatarFile) {
        formData.append("image", avatarFile);
      }
      // ─── DEBUG ───
      console.log("File being sent:", avatarFile);
      console.log("FormData entries:");
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }
      const res = await editProfile(formData).unwrap();
      console.log(res);
      // Clear local file — backend version now reflects upload
      setAvatarFile(null);
      message.success("Profile updated successfully!");
    } catch (err: any) {
      message.error(
        err?.data?.message || err?.message || "Failed to update profile",
      );
    }
  };

  // ─── Loading state ───────────────────────────────────────
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-100 p-12 flex justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-lg border border-gray-100 p-12 text-center">
        <p className="text-gray-500">
          Unable to load profile. Please refresh the page.
        </p>
      </div>
    );
  }

  // ─── Helper: get initials ────────────────────────────────
  const getInitials = (name: string): string => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">
          Profile Settings
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Update your personal information
        </p>
      </div>
      <div className="p-6">
        {/* ─── Avatar Section ─── */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
          <div className="relative">
            <div
              className="w-24 h-24 rounded-full overflow-hidden relative flex items-center justify-center"
              style={{ backgroundColor: "#C70A24" }}
            >
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt={user.name || "Profile"}
                  fill
                  className="object-cover"
                  sizes="96px"
                  unoptimized={avatarPreview.startsWith("blob:")}
                />
              ) : (
                <span className="text-white text-2xl font-bold">
                  {getInitials(user.name)}
                </span>
              )}
            </div>
            <label
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full text-white flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity border-2 border-white"
              style={{ backgroundColor: "#C70A24" }}
            >
              <Camera size={14} />
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Profile Avatar</p>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG, GIF, or WebP. Max 2MB.
            </p>
            {avatarFile && (
              <p className="text-xs text-green-600 mt-1 font-medium">
                ✓ New image selected — click Save to upload
              </p>
            )}
          </div>
        </div>

        {/* ─── Profile Form ─── */}
        <RmForm
          onSubmit={handleProfileSubmit}
          defaultValues={{
            name: user.name || "",
            phone: user.phone || "",
            address: user.address || "",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RmInput
              name="name"
              label="Full Name"
              placeholder="Enter your full name"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={user.email || ""}
                disabled
                className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm bg-gray-50 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">
                Email cannot be changed here
              </p>
            </div>

            <RmInput
              name="phone"
              label="Phone Number"
              placeholder="(555) 123-4567"
              type="tel"
            />
            <RmInput
              name="address"
              label="Address"
              placeholder="Street address, city, state, ZIP code, country"
              rows={2}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <input
                type="text"
                value={user.role || ""}
                disabled
                className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm bg-gray-50 cursor-not-allowed capitalize"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value="••••••••"
                  disabled
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm bg-gray-50 cursor-not-allowed"
                />
                <Link
                  href="/change-password"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors cursor-pointer flex items-center"
                >
                  Change Password
                </Link>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={isUpdating}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-50"
              style={{ backgroundColor: "#C70A24" }}
            >
              {isUpdating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </RmForm>
      </div>
      {/* ─── Change Password Modal ─── */}
      {/* <RmModal
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
              placeholder="Enter new password (min 8 characters)"
              required
            />
            <RmInput
              name="confirmPassword"
              label="Confirm New Password"
              type="password"
              placeholder="Re-enter new password"
              required
            />
          </div>
        </RmForm>
      </RmModal> */}
    </div>
  );
}
