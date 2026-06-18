/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { message } from "antd";
import { Loader } from "@/components/shared/Loader";
import RichEditor from "@/components/ui/RichEditor";
import { useGetExplorePurityQuery } from "@/redux/api/settingsApi";
import { useUpdateExplorePurityMutation } from "@/redux/api/adminApi";

export default function ExplorePurityPage() {
  const [description, setDescription] = useState<string>("");

  const { data: purityData, isLoading } = useGetExplorePurityQuery(undefined);
  const [updatePurity, { isLoading: isUpdating }] =
    useUpdateExplorePurityMutation();

  const purityContent: any = Array.isArray(purityData?.data)
    ? purityData?.data?.[0]
    : purityData?.data;

  useEffect(() => {
    if (purityContent?.description) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDescription(purityContent.description);
    }
  }, [purityContent?.description]);

  const handleSave = async () => {
    if (
      !description ||
      description === "<p></p>" ||
      description.trim() === ""
    ) {
      message.error("Content cannot be empty");
      return;
    }

    try {
      await updatePurity({ description }).unwrap();
      message.success("Explore Purity updated successfully!");
    } catch (err: any) {
      message.error(
        err?.data?.message || err?.message || "Failed to update Explore Purity",
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
        <h2 className="text-xl font-semibold text-gray-900">Explore Purity</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage your purity information and standards. This appears on the
          public Explore Purity page.
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Content <span className="text-red-500">*</span>
          </label>

          <RichEditor
            value={description}
            onChange={setDescription}
            placeholder="Write about your purity standards, certifications, testing..."
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
                Update Explore Purity
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
