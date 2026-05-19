"use client";

import { useState } from "react";
import { Save, X, Upload } from "lucide-react";
import { message } from "antd";
import RmForm from "@/components/ui/RmForm";
import RmInput from "@/components/ui/RmInput";

export default function AboutUsPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        message.error("File size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      message.success("Image uploaded successfully!");
    }
  };

  const handleSubmit = (data: any) => {
    console.log("About Us data:", data);
    message.success("About Us updated successfully!");
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">About Us</h2>
        <p className="text-sm text-gray-500 mt-1">Tell your company story</p>
      </div>

      <div className="p-6">
        <RmForm
          onSubmit={handleSubmit}
          defaultValues={{
            title: "Precision Purity Scientific Integrity",
            description: "tell your company......",
          }}
        >
          <div className="space-y-6">
            <RmInput
              name="title"
              label="Title"
              placeholder="Enter title"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Enter description..."
                rows={6}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300 transition-all bg-gray-50 resize-none"
                defaultValue="tell your company......"
              />
            </div>

            {/* Upload Image Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 transition-colors cursor-pointer">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      Click or drag to upload image
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      JPG, PNG or GIF. Max size 2MB
                    </p>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
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
    </div>
  );
}
