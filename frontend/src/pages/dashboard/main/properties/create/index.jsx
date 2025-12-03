"use client";
import React from "react";
import DashboardLayout from "../../../layout";
import PropertyForm from "../../../components/forms/PropertyForm";

export default function CreatePropertyPage() {
  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">ایجاد ملک جدید</h2>
        <PropertyForm />
      </div>
    </DashboardLayout>
  );
}
