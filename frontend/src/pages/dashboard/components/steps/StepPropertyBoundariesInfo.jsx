"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBoundaries } from "@/redux/features/propertyDraftSlice";
import dynamic from "next/dynamic";
import {
  Compass,
  Map as MapIcon,
  Maximize2,
  Navigation2,
  MoveUp,
  MoveDown,
  MoveLeft,
  MoveRight,
  Ruler,
  StickyNote,
  ChevronLeft,
  ChevronRight,
  LocateFixed,
} from "lucide-react";

// استایل‌های امضای سبک X1
const inputClasses =
  "w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white/50 text-slate-700 shadow-sm transition-all duration-300 outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50/50 placeholder:text-slate-400 font-medium";

const SectionTitle = ({ icon: Icon, title, color = "blue" }) => (
  <div className="flex items-center gap-3 mb-6 mt-4">
    <div
      className={`p-2.5 bg-${color}-50 rounded-xl text-${color}-600 shadow-sm`}
    >
      <Icon size={22} />
    </div>
    <h3 className="text-lg font-black text-slate-800 tracking-tight">
      {title}
    </h3>
    <div className="flex-1 h-px bg-gradient-to-r from-slate-100 to-transparent"></div>
  </div>
);

const FormField = ({ label, name, children, required = false, icon: Icon }) => (
  <div className="flex flex-col space-y-2 group">
    <label
      htmlFor={name}
      className="text-sm font-bold text-slate-600 px-1 transition-colors group-focus-within:text-blue-600 flex items-center gap-2"
    >
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {children}
      {Icon && (
        <Icon
          className="absolute left-4 top-3.5 text-slate-300 pointer-events-none"
          size={18}
        />
      )}
    </div>
  </div>
);

// --- کمکی‌ها (بدون تغییر) ---
const persianToEnglishDigits = (str = "") => {
  if (!str) return "";
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
  const englishDigits = "0123456789";
  return str
    .split("")
    .map((ch) => {
      const p = persianDigits.indexOf(ch);
      if (p > -1) return englishDigits[p];
      const a = arabicDigits.indexOf(ch);
      if (a > -1) return englishDigits[a];
      return ch;
    })
    .join("");
};

const filterIntegerInput = (raw) => {
  if (raw == null) return "";
  let v = String(raw).replace(/\s+/g, "");
  v = persianToEnglishDigits(v);
  return v.replace(/[^0-9]/g, "");
};

const filterDecimalInput = (raw) => {
  if (raw == null) return "";
  let v = String(raw).replace(/\s+/g, "").replace(/,/g, ".");
  v = persianToEnglishDigits(v);
  v = v.replace(/[^0-9.\-]/g, "");
  const parts = v.split(".");
  if (parts.length > 1) v = parts[0] + "." + parts.slice(1).join("");
  v = v.replace(/(?!^)-/g, "");
  return v;
};

export default function StepPropertyBoundariesInfo({ next, back }) {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const dispatch = useDispatch();
  const boundariesDraft = useSelector(
    (state) => state.propertyDraft.boundaries
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [form, setForm] = useState({
    boundaryStatus: boundariesDraft?.boundaryStatus || "",
    coordinatesX:
      boundariesDraft?.coordinates?.x ?? boundariesDraft?.coordinatesX ?? "",
    coordinatesY:
      boundariesDraft?.coordinates?.y ?? boundariesDraft?.coordinatesY ?? "",
    north: boundariesDraft?.north || "",
    south: boundariesDraft?.south || "",
    east: boundariesDraft?.east || "",
    west: boundariesDraft?.west || "",
    mapProvider: boundariesDraft?.mapProvider || "Google Map",
    landArea: boundariesDraft?.landArea ?? "",
    buildingArea: boundariesDraft?.buildingArea ?? "",
    approvedBufferArea: boundariesDraft?.approvedBufferArea ?? "",
    notes: boundariesDraft?.notes || "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue;

    if (type === "checkbox") {
      newValue = checked;
    } else if (
      ["landArea", "buildingArea", "approvedBufferArea"].includes(name)
    ) {
      newValue = filterIntegerInput(value);
    } else if (["coordinatesX", "coordinatesY"].includes(name)) {
      newValue = filterDecimalInput(value);
    } else {
      newValue = value;
    }

    setForm((prev) => {
      const updated = { ...prev, [name]: newValue };

      // همزمان آپدیت Redux
      dispatch(setBoundaries(updated));

      return updated;
    });
  };

  const openMap = () => setIsMapOpen(true);
  const closeMap = () => setIsMapOpen(false);

  const confirmMapSelection = (position) => {
    setForm((prev) => {
      const updated = {
        ...prev,
        coordinatesY:
          position.lat != null ? position.lat.toFixed(6) : prev.coordinatesY,
        coordinatesX:
          position.lng != null ? position.lng.toFixed(6) : prev.coordinatesX,
      };

      // همزمان آپدیت Redux
      dispatch(setBoundaries(updated));

      return updated;
    });

    closeMap();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      coordinates: {
        x:
          form.coordinatesX !== ""
            ? parseFloat(persianToEnglishDigits(String(form.coordinatesX)))
            : null,
        y:
          form.coordinatesY !== ""
            ? parseFloat(persianToEnglishDigits(String(form.coordinatesY)))
            : null,
      },
      landArea: form.landArea !== "" ? Number(form.landArea) : null,
      buildingArea: form.buildingArea !== "" ? Number(form.buildingArea) : null,
      approvedBufferArea:
        form.approvedBufferArea !== "" ? Number(form.approvedBufferArea) : null,
    };
    dispatch(setBoundaries(payload));
    next();
  };

  const handleBack = () => {
    dispatch(
      setBoundaries({
        ...form,
        coordinates: { x: form.coordinatesX, y: form.coordinatesY },
      })
    );
    back();
  };

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
        loading: () => (
          <div className="p-4 bg-blue-50 rounded-xl animate-pulse text-blue-600 font-bold">
            در حال بارگذاری نقشه...
          </div>
        ),
      }),
    []
  );

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl mx-auto bg-white/40 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white/60 space-y-10"
      >
        {/* هدر */}
        <div className="flex items-center gap-5 border-b border-slate-100 pb-6">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-2xl shadow-lg shadow-blue-100 text-white">
            <Compass size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              حدود و موقعیت ملک
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              تعیین ابعاد دقیق و مختصات جغرافیایی
            </p>
          </div>
        </div>

        {/* بخش ۱: وضعیت و مرجع */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="وضعیت حدود" name="boundaryStatus" required>
            <select
              name="boundaryStatus"
              value={form.boundaryStatus}
              onChange={handleChange}
              required
              className={inputClasses}
            >
              <option value="">انتخاب وضعیت</option>
              <option value="تحدید حدود شده">تحدید حدود شده</option>
              <option value="تحدید حدود نشده">تحدید حدود نشده</option>
            </select>
          </FormField>
          <FormField label="مرجع نقشه" name="mapProvider">
            <select
              name="mapProvider"
              value={form.mapProvider}
              onChange={handleChange}
              className={inputClasses}
            >
              <option value="Google Map">Google Map</option>
              <option value="OpenStreetMap">OpenStreetMap</option>
              <option value="Sanad">سامانه ثبت</option>
            </select>
          </FormField>
        </div>

        {/* بخش ۲: مختصات جغرافیایی */}
        <div className="bg-blue-50/40 p-6 rounded-[2.5rem] border border-blue-100/50">
          <div className="flex justify-between items-center mb-6">
            <SectionTitle icon={Navigation2} title="مختصات جغرافیایی (GPS)" />
            <button
              type="button"
              onClick={openMap}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-2xl transition-all shadow-lg shadow-blue-200 active:scale-95"
            >
              <LocateFixed size={18} />
              انتخاب از روی نقشه
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="مختصات X (طول جغرافیایی)" name="coordinatesX">
              <input
                type="text"
                name="coordinatesX"
                inputMode="decimal"
                value={form.coordinatesX}
                onChange={handleChange}
                className={`${inputClasses} text-center font-mono`}
                placeholder="51.4234"
                dir="ltr"
              />
            </FormField>
            <FormField label="مختصات Y (عرض جغرافیایی)" name="coordinatesY">
              <input
                type="text"
                name="coordinatesY"
                inputMode="decimal"
                value={form.coordinatesY}
                onChange={handleChange}
                className={`${inputClasses} text-center font-mono`}
                placeholder="35.7890"
                dir="ltr"
              />
            </FormField>
          </div>
        </div>

        {/* بخش ۳: حدود اربعه */}
        <section>
          <SectionTitle icon={MapIcon} title="حدود اربعه" color="indigo" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="حد شمالی" name="north" icon={MoveUp}>
              <input
                name="north"
                value={form.north}
                onChange={handleChange}
                className={inputClasses}
                placeholder="مثلاً خیابان اصلی"
              />
            </FormField>
            <FormField label="حد جنوبی" name="south" icon={MoveDown}>
              <input
                name="south"
                value={form.south}
                onChange={handleChange}
                className={inputClasses}
                placeholder="مثلاً ملک مجاور"
              />
            </FormField>
            <FormField label="حد شرقی" name="east" icon={MoveRight}>
              <input
                name="east"
                value={form.east}
                onChange={handleChange}
                className={inputClasses}
                placeholder="مثلاً دیوار مشترک"
              />
            </FormField>
            <FormField label="حد غربی" name="west" icon={MoveLeft}>
              <input
                name="west"
                value={form.west}
                onChange={handleChange}
                className={inputClasses}
                placeholder="مثلاً کوچه"
              />
            </FormField>
          </div>
        </section>

        {/* بخش ۴: مساحت‌ها */}
        <section className="bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100">
          <SectionTitle icon={Ruler} title="اطلاعات مساحت" color="slate" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField label="مساحت عرصه (زمین)" name="landArea">
              <input
                type="text"
                name="landArea"
                inputMode="numeric"
                value={form.landArea}
                onChange={handleChange}
                className={`${inputClasses} text-center`}
                placeholder="متر مربع"
                dir="ltr"
              />
            </FormField>
            <FormField label="مساحت اعیان (بنا)" name="buildingArea">
              <input
                type="text"
                name="buildingArea"
                inputMode="numeric"
                value={form.buildingArea}
                onChange={handleChange}
                className={`${inputClasses} text-center`}
                placeholder="متر مربع"
                dir="ltr"
              />
            </FormField>
            <FormField label="حریم مصوب" name="approvedBufferArea">
              <input
                type="text"
                name="approvedBufferArea"
                inputMode="numeric"
                value={form.approvedBufferArea}
                onChange={handleChange}
                className={`${inputClasses} text-center`}
                placeholder="متر مربع"
                dir="ltr"
              />
            </FormField>
          </div>
        </section>

        {/* توضیحات */}
        <FormField label="توضیحات تکمیلی حدود" name="notes" icon={StickyNote}>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            className={`${inputClasses} resize-none`}
            placeholder="هرگونه نکته..."
          />
        </FormField>

        {/* دکمه‌ها */}
        <div className="flex justify-between pt-10 border-t border-slate-100">
          <button
            type="button"
            onClick={handleBack}
            className="group flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white border-2 border-slate-100 text-slate-600 font-bold hover:bg-slate-50 transition-all active:scale-95"
          >
            <ChevronRight
              size={20}
              className="transition-transform group-hover:translate-x-1"
            />
            مرحله قبل
          </button>
          <button
            type="submit"
            className="group flex items-center gap-2 px-10 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-xl shadow-blue-200 hover:shadow-blue-300 transition-all active:scale-95"
          >
            مرحله بعد
            <ChevronLeft
              size={20}
              className="transition-transform group-hover:-translate-x-1"
            />
          </button>
        </div>
      </form>

      {/* مودال نقشه */}
      {isMounted && isMapOpen && (
        <Map
          isOpen={isMapOpen}
          onClose={closeMap}
          onConfirm={confirmMapSelection}
          initialLat={form.coordinatesY || 0}
          initialLng={form.coordinatesX || 0}
          mapProvider={form.mapProvider}
        />
      )}
    </>
  );
}
