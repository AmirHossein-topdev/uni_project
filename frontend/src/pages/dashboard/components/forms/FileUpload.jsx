"use client";
import React from "react";
import { MdDriveFolderUpload } from "react-icons/md";

export default function FileUpload({
  label,
  multiple = false,
  files,
  onChange,
}) {
  return (
    <div className="mt-4">
      <label className="mb-1 font-semibold text-gray-700 block">{label}</label>
      <label className="flex items-center gap-3 border border-gray-300 rounded-lg p-3 cursor-pointer bg-gray-50 text-gray-700 hover:border-green-500 hover:ring-2 hover:ring-green-500 transition duration-150 w-full">
        <MdDriveFolderUpload size={24} className="text-green-600" />
        <span className="text-gray-600">
          {files && files.length > 0
            ? multiple
              ? `${files.length} فایل انتخاب شد`
              : `فایل انتخاب شده: ${files[0].name}`
            : multiple
            ? "آپلود چند فایل (PNG, JPG)"
            : "آپلود فایل (PNG, JPG)"}
        </span>
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={onChange}
          className="hidden"
        />
      </label>

      {multiple && files?.length > 0 && (
        <ul className="mt-2 list-disc list-inside text-gray-700">
          {files.map((file, idx) => (
            <li key={idx}>{file.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
