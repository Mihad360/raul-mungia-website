/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { message } from "antd";
import { Loader } from "@/components/shared/Loader";
import RichEditor from "@/components/ui/RichEditor";
import { useGetAllShippingPolicyQuery } from "@/redux/api/settingsApi";
import {
  useUpdateShippingPolicyMutation,
  useGetStoreSettingsQuery,
  useUpdateStoreSettingsMutation,
} from "@/redux/api/adminApi";

export default function ShippingPolicyPage() {
  const [description, setDescription] = useState<string>("");
  const [freeShippingEnabled, setFreeShippingEnabled] = useState(true);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(150);

  const { data: shippingData, isLoading } =
    useGetAllShippingPolicyQuery(undefined);
  const [updateShippingPolicy, { isLoading: isUpdating }] =
    useUpdateShippingPolicyMutation();

  const { data: storeSettingsData, isLoading: isLoadingSettings } =
    useGetStoreSettingsQuery(undefined);
  const [updateStoreSettings, { isLoading: isUpdatingSettings }] =
    useUpdateStoreSettingsMutation();

  const shippingContent: any = Array.isArray(shippingData?.data)
    ? shippingData?.data?.[0]
    : shippingData?.data;

  const storeSettings = storeSettingsData?.data as
    | {
        freeShippingEnabled?: boolean;
        freeShippingThreshold?: number;
      }
    | undefined;

  useEffect(() => {
    if (shippingContent?.description) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDescription(shippingContent.description);
    }
  }, [shippingContent?.description]);

  useEffect(() => {
    if (!storeSettings) return;
    if (typeof storeSettings.freeShippingEnabled === "boolean") {
      setFreeShippingEnabled(storeSettings.freeShippingEnabled);
    }
    if (typeof storeSettings.freeShippingThreshold === "number") {
      setFreeShippingThreshold(storeSettings.freeShippingThreshold);
    }
  }, [storeSettings]);

  const handleSave = async () => {
    if (
      !description ||
      description === "<p></p>" ||
      description.trim() === ""
    ) {
      message.error("Shipping Policy content cannot be empty");
      return;
    }

    try {
      await updateShippingPolicy({ description }).unwrap();
      message.success("Shipping Policy updated successfully!");
    } catch (err: any) {
      message.error(
        err?.data?.message ||
          err?.message ||
          "Failed to update Shipping Policy",
      );
    }
  };

  const handleSaveFreeShipping = async () => {
    const threshold = Number(freeShippingThreshold);
    if (Number.isNaN(threshold) || threshold < 0) {
      message.error("Threshold must be a valid number (0 or greater)");
      return;
    }

    try {
      await updateStoreSettings({
        freeShippingEnabled,
        freeShippingThreshold: threshold,
      }).unwrap();
      message.success(
        freeShippingEnabled
          ? `Free shipping enabled over $${threshold}`
          : "Free shipping turned off",
      );
    } catch (err: any) {
      message.error(
        err?.data?.message ||
          err?.message ||
          "Failed to update free shipping settings",
      );
    }
  };

  if (isLoading || isLoadingSettings) {
    return (
      <div className="bg-white rounded-lg border border-gray-100 p-12 flex justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Free shipping controls */}
      <div className="bg-white rounded-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Free Shipping</h2>
          <p className="text-sm text-gray-500 mt-1">
            Turn free shipping on or off, and set the order subtotal threshold.
          </p>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Free shipping after threshold
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                When off, customers always pay normal shipping rates.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={freeShippingEnabled}
              aria-label="Toggle free shipping"
              onClick={() => setFreeShippingEnabled((v) => !v)}
              className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                freeShippingEnabled ? "bg-[#C70A24]" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                  freeShippingEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Free shipping threshold ($)
            </label>
            <input
              type="number"
              min={0}
              step={1}
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
              disabled={!freeShippingEnabled}
              className="w-full max-w-xs px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#C70A24] disabled:bg-gray-50 disabled:text-gray-400"
            />
            <p className="text-xs text-gray-400 mt-1">
              Example: 150 means free shipping when cart subtotal is $150 or
              more.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleSaveFreeShipping}
              disabled={isUpdatingSettings}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-50"
              style={{ backgroundColor: "#C70A24" }}
            >
              {isUpdatingSettings ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Free Shipping
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Policy CMS */}
      <div className="bg-white rounded-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Shipping Policy
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your shipping policy. This appears on the public Shipping
            page.
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Shipping Policy Content <span className="text-red-500">*</span>
            </label>

            <RichEditor
              value={description}
              onChange={setDescription}
              placeholder="Write your shipping policy here..."
              minHeight={400}
            />

            <p className="text-xs text-gray-400">
              Use the toolbar to format text with headings, lists, alignment,
              and more.
            </p>
          </div>

          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={handleSave}
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
                  Update Shipping Policy
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
