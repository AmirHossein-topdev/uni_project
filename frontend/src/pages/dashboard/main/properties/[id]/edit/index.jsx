// frontend/src/pages/dashboard/main/properties/[id]/edit/index.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import PropertyStepper from "../../../../components/stepper/PropertyStepper";
import {
  setIdentity,
  setLegalStatus,
  setOwnership,
  setLocation,
  setBoundaries,
  setAdditionalInfo,
  setStatus, // <--- این رو اضافه کن
  resetDraft,
} from "../../../../../../redux/features/propertyDraftSlice";
import DashboardLayout from "@/pages/dashboard/layout";

export default function EditPropertyPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const draft = useSelector((state) => state.propertyDraft); // <--- اصلاح به propertyDraft

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [propertyId, setPropertyId] = useState(null);

  // وقتی router آماده شد، id را ست می‌کنیم
  useEffect(() => {
    if (router.isReady) {
      setPropertyId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  // fetch property
  useEffect(() => {
    if (!propertyId) return;

    const fetchProperty = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `http://localhost:7000/api/properties/${propertyId}/full`
        );
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData?.error || "خطا در دریافت اطلاعات ملک");
        }
        const data = await res.json();

        dispatch(setStatus(data.status || {}));
        dispatch(setIdentity(data.identity || {}));
        dispatch(setLegalStatus(data.legalStatus || {}));
        dispatch(setOwnership(data.ownership || {}));
        dispatch(setLocation(data.location || {}));
        dispatch(setBoundaries(data.boundaries || {}));
        dispatch(setAdditionalInfo(data.additionalInfo || {}));
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId, dispatch]);

  // ارسال نهایی و بروزرسانی ملک
  const handleSubmit = async () => {
    try {
      // پاک کردن فیلدهای خالی از enum
      const cleanLegalStatus = { ...(draft.legalStatus || {}) };
      if (!cleanLegalStatus.ordinaryDocumentType)
        delete cleanLegalStatus.ordinaryDocumentType;
      if (!cleanLegalStatus.noDocumentType)
        delete cleanLegalStatus.noDocumentType;

      const payload = {
        status: draft.status,
        identity: draft.identity || {},
        location: draft.location || {},
        legalStatus: cleanLegalStatus,
        ownership: draft.ownership || {},
        boundaries: draft.boundaries || {},
        additionalInfo: draft.additionalInfo || {},
      };

      const res = await fetch(
        `http://localhost:7000/api/properties/${propertyId}`,
        {
          // <--- id به propertyId تغییر کرد
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "خطا در بروزرسانی ملک");

      // پاک کردن Draft بعد از موفقیت
      dispatch(resetDraft());

      await Swal.fire({
        icon: "success",
        title: "ویرایش موفق",
        text: "ملک با موفقیت بروزرسانی شد",
        confirmButtonText: "باشه",
      });

      router.push("/dashboard/main/properties");
    } catch (err) {
      console.error("خطا در ویرایش ملک:", err);
      await Swal.fire({
        icon: "error",
        title: "ویرایش ناموفق",
        text: err.message || "عملیات انجام نشد",
        confirmButtonText: "باشه",
      });
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg animate-pulse">
          در حال بارگذاری اطلاعات ملک...
        </p>
      </div>
    );

  return (
    <DashboardLayout>
      <div className="min-h-screen p-6 bg-[#f8fafc]">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold mb-6">ویرایش ملک</h1>
          {/* Stepper فرم */}
          <PropertyStepper />{" "}
          {/* <--- propها رو برداشتم چون لازم نیستن، اما اگر لازم داری، در فایل بعدی تعریف کن */}
          {/* دکمه نهایی ثبت و بروزرسانی */}
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all"
            >
              بروزرسانی ملک
            </button>
            <button
              onClick={() => router.push("/dashboard/main/properties")}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all"
            >
              لغو
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
