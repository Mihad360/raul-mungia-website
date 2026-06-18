/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { message } from "antd";
import { Loader } from "@/components/shared/Loader";
import RichEditor from "@/components/ui/RichEditor";
import {
  useGetAllAboutQuery,
} from "@/redux/api/settingsApi";
import { useUpdateAboutMutation } from "@/redux/api/adminApi";

export default function AboutUsPage() {
  const [description, setDescription] = useState<string>("");

  // ─── API hooks ────────────────────────────────────────────
  const { data: aboutData, isLoading } = useGetAllAboutQuery(undefined);
  const [updateAbout, { isLoading: isUpdating }] = useUpdateAboutMutation();

  // Handle both response shapes — array or single object
  const aboutContent: any = Array.isArray(aboutData?.data)
    ? aboutData?.data?.[0]
    : aboutData?.data;

  // ─── Sync editor with fetched content ────────────────────
  useEffect(() => {
    if (aboutContent?.description) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDescription(aboutContent.description);
    }
  }, [aboutContent?.description]);

  // ─── Save handler ────────────────────────────────────────
  const handleSave = async () => {
    if (
      !description ||
      description === "<p></p>" ||
      description.trim() === ""
    ) {
      message.error("Description cannot be empty");
      return;
    }

    try {
      await updateAbout({ description }).unwrap();
      message.success("About page updated successfully!");
    } catch (err: any) {
      message.error(
        err?.data?.message || err?.message || "Failed to update about page",
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

  return (
    <div className="bg-white rounded-lg border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">About Us</h2>
        <p className="text-sm text-gray-500 mt-1">
          Update your company story. This content appears on the public About
          page.
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>

          <RichEditor
            value={description}
            onChange={setDescription}
            placeholder="Write your company story here..."
            minHeight={400}
            // toolbarTopOffset={2} // ← Adjust to your admin header height
          />

          <p className="text-xs text-gray-400">
            Use the toolbar to format text with headings, lists, links, and
            more.
          </p>
        </div>

        {/* Action button */}
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
                Update About
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
