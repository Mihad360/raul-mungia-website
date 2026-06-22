/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { message } from "antd";
import { Loader } from "@/components/shared/Loader";
import RichEditor from "@/components/ui/RichEditor";
import { useGetAllShippingPolicyQuery } from "@/redux/api/settingsApi";
import { useUpdateShippingPolicyMutation } from "@/redux/api/adminApi";

export default function ShippingPolicyPage() {
  const [description, setDescription] = useState<string>("");

  const { data: shippingData, isLoading } =
    useGetAllShippingPolicyQuery(undefined);
  const [updateShippingPolicy, { isLoading: isUpdating }] =
    useUpdateShippingPolicyMutation();

  const shippingContent: any = Array.isArray(shippingData?.data)
    ? shippingData?.data?.[0]
    : shippingData?.data;

  useEffect(() => {
    if (shippingContent?.description) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDescription(shippingContent.description);
    }
  }, [shippingContent?.description]);

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

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-100 p-12 flex justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">Shipping Policy</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage your shipping policy. This appears on the public Shipping page.
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
            Use the toolbar to format text with headings, lists, alignment, and
            more.
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
  );
}
