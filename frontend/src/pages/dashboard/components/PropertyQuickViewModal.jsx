"use client";
import React from "react";
import { createPortal } from "react-dom";
import {
  X,
  MapPin,
  User,
  Building2,
  Hash,
  ShieldCheck,
  Zap,
  ArrowLeft,
  Ruler,
  FileText,
} from "lucide-react";

// کارت‌های کوچک اطلاعاتی
const InfoCard = ({ icon: Icon, label, value, colorClass }) => (
  <div className="flex items-center gap-4 p-4 rounded-[2rem] bg-slate-50/50 border border-slate-100 transition-all hover:bg-white hover:shadow-md group">
    <div
      className={`p-3 rounded-2xl ${colorClass} bg-white shadow-sm group-hover:scale-110 transition-transform`}
    >
      <Icon size={20} />
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        {label}
      </span>
      <span className="text-sm font-black text-slate-700 truncate max-w-[150px]">
        {value || "---"}
      </span>
    </div>
  </div>
);

export default function PropertyQuickViewModal({ property, isOpen, onClose }) {
  if (!isOpen || !property || typeof window === "undefined") return null;

  // استخراج داده‌ها بر اساس ساختار API ارسالی شما
  const {
    status,
    ownership,
    identity,
    location,
    legalStatus,
    boundaries,
    additionalInfo,
  } = property;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay با تاری شدید X1 */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* محفظه اصلی مودال */}
      <div className="relative w-full max-w-3xl bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25)] border border-white overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header - بخش رنگی بالای مودال */}
        <div className="relative h-36 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-8 flex items-end">
          <button
            onClick={onClose}
            className="absolute top-6 left-6 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-xl text-white transition-all"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-5">
            <div className="p-4 bg-white/20 backdrop-blur-md rounded-[1.5rem] text-white">
              <Building2 size={36} />
            </div>
            <div className="text-white">
              <h3 className="text-2xl font-black">
                {identity?.title || "بدون عنوان"}
              </h3>
              <div className="flex gap-4 mt-1 opacity-80 text-xs font-bold">
                <span className="flex items-center gap-1">
                  <Hash size={12} /> کد: {status?.propertyIdCode}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={12} /> {location?.city}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Body - نمایش شبکه‌ای اطلاعات مهم */}
        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoCard
              icon={User}
              label="مالک"
              value={ownership?.ownerName}
              colorClass="text-blue-500"
            />
            <InfoCard
              icon={ShieldCheck}
              label="وضعیت حقوقی"
              value={legalStatus?.legalStatus}
              colorClass="text-emerald-500"
            />
            <InfoCard
              icon={FileText}
              label="نوع سند"
              value={legalStatus?.officialDocumentType}
              colorClass="text-purple-500"
            />
            <InfoCard
              icon={Ruler}
              label="متراژ بنا"
              value={`${boundaries?.buildingArea} متر`}
              colorClass="text-orange-500"
            />
            <InfoCard
              icon={MapPin}
              label="محله"
              value={location?.neighborhood}
              colorClass="text-pink-500"
            />
            <InfoCard
              icon={ShieldCheck}
              label="سطح حفاظتی"
              value={additionalInfo?.securityLevel}
              colorClass="text-red-500"
            />
          </div>

          {/* بخش آدرس کامل - استایل اختصاصی X1 */}
          <div className="bg-slate-100/50 p-6 rounded-[2.5rem] border border-slate-100">
            <h4 className="text-[10px] font-black text-slate-400 mb-2 px-2 uppercase tracking-[2px]">
              نشانی دقیق ملک
            </h4>
            <p className="text-sm font-bold text-slate-600 leading-relaxed px-2">
              {location?.fullAddress || "آدرس ثبت نشده است."}
            </p>
          </div>

          {/* انشعابات و زیرساخت */}
          <div className="flex flex-wrap gap-3">
            {additionalInfo?.utilities &&
              Object.entries(additionalInfo.utilities).map(
                ([key, val]) =>
                  val === true && (
                    <div
                      key={key}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-100 rounded-full shadow-sm"
                    >
                      <Zap size={14} className="text-yellow-500" />
                      <span className="text-xs font-black text-slate-700">
                        {key === "water"
                          ? "آب شهری"
                          : key === "electricity"
                          ? "برق"
                          : key === "gas"
                          ? "گاز"
                          : "فاضلاب"}
                      </span>
                    </div>
                  )
              )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50/80 border-t border-slate-100 flex justify-between items-center px-10">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold">
              آخرین بروزرسانی
            </span>
            <span className="text-xs font-black text-slate-600">
              {new Date(status?.updatedAt).toLocaleDateString("fa-IR")}
            </span>
          </div>
          <button
            onClick={() =>
              (window.location.href = `/dashboard/main/properties/${status?._id}/edit`)
            }
            className="group flex items-center gap-3 px-8 py-3.5 bg-slate-900 text-white rounded-[1.5rem] text-sm font-bold hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            مشاهده پرونده کامل
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
