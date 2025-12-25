"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStatus } from "@/redux/features/propertyDraftSlice";
import {
  FileText,
  Layers,
  Hash,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

// استایل‌های مشترک سبک X1
const inputClasses =
  "w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white/50 text-slate-700 shadow-sm transition-all duration-300 outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50/50 placeholder:text-slate-400 font-medium";

const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 shadow-sm">
      <Icon size={22} />
    </div>
    <h3 className="text-lg font-black text-slate-800 tracking-tight">
      {title}
    </h3>
    <div className="flex-1 h-px bg-gradient-to-r from-slate-100 to-transparent"></div>
  </div>
);

const FormInput = ({ label, name, children, required = false }) => (
  <div className="flex flex-col space-y-2 group">
    <label
      htmlFor={name}
      className="text-sm font-bold text-slate-600 px-1 transition-colors group-focus-within:text-blue-600"
    >
      {label}
      {required && <span className="text-red-500 mr-1">*</span>}
    </label>
    <div className="relative">{children}</div>
  </div>
);

export default function StepPropertyStatus({ next, back }) {
  const dispatch = useDispatch();
  const statusDraft = useSelector((state) => state.propertyDraft.status); // فقط status از redux

  const [form, setForm] = useState({
    isArseh: false,
    isAyan: false,
    arsehNumber: "",
    caseStatus: "",
    propertyIdCode: "",
    propertyNumber: "",
  });

  // وقتی statusDraft تغییر کرد، فرم بروزرسانی بشه
  useEffect(() => {
    if (statusDraft) {
      setForm({
        isArseh: statusDraft.isArseh || false,
        isAyan: statusDraft.isAyan || false,
        arsehNumber: statusDraft.arsehNumber || "",
        caseStatus: statusDraft.caseStatus || "",
        propertyIdCode: statusDraft.propertyIdCode || "",
        propertyNumber: statusDraft.propertyNumber || "",
      });
    }
  }, [statusDraft]);

  const [caseStatusOptions, setCaseStatusOptions] = useState([]);
  const [isLoadingEnums, setIsLoadingEnums] = useState(true);

  useEffect(() => {
    async function fetchEnums() {
      try {
        const res = await fetch("/api/property-enums");
        const data = await res.json();
        setCaseStatusOptions(data.caseStatus || []);
      } catch (err) {
        console.error("خطا در دریافت enum ها:", err);
      } finally {
        setIsLoadingEnums(false);
      }
    }
    fetchEnums();
  }, []);

  const persianToEnglishDigits = (str) => {
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    const englishDigits = "0123456789";
    return str
      .toString()
      .replace(/[۰-۹]/g, (d) => englishDigits[persianDigits.indexOf(d)]);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;

    if (["arsehNumber", "propertyIdCode", "propertyNumber"].includes(name)) {
      newValue = newValue.replace(/[^۰-۹0-9]/g, "");
      const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
      const englishDigits = "0123456789";
      newValue = newValue.replace(
        /[۰-۹]/g,
        (d) => englishDigits[persianDigits.indexOf(d)]
      );
    }

    setForm((prev) => {
      let updated = { ...prev, [name]: newValue };

      // منطق محدود کردن checkboxها به یکی
      if (type === "checkbox") {
        if (name === "isArseh" && checked) updated.isAyan = false;
        else if (name === "isAyan" && checked) updated.isArseh = false;
      }

      // همزمان آپدیت Redux
      dispatch(setStatus(updated));

      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      setStatus({
        ...form,
        arsehNumber: form.arsehNumber ? Number(form.arsehNumber) : null,
        propertyIdCode: form.propertyIdCode
          ? Number(form.propertyIdCode)
          : null,
        propertyNumber: form.propertyNumber
          ? Number(form.propertyNumber)
          : null,
      })
    );
    next();
  };

  if (isLoadingEnums)
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold tracking-tight animate-pulse">
          در حال فراخوانی اطلاعات...
        </p>
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl mx-auto bg-white/40 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white/60 space-y-10 transition-all duration-500"
    >
      {/* هدر بخش X1 */}
      <div className="flex items-center gap-5 border-b border-slate-100 pb-6">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg shadow-blue-100 text-white">
          <FileText size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            اطلاعات پایه و ثبتی
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            وضعیت پرونده و کدهای شناسایی ملک را تعیین کنید
          </p>
        </div>
      </div>

      <div className="space-y-10">
        {/* بخش نوع مالکیت با دکمه‌های شیک‌تر */}
        <section>
          <SectionTitle icon={Layers} title="نوع مالکیت ملک" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: "isArseh", label: "عرصه (زمین)", icon: "🌱" },
              { id: "isAyan", label: "اعیان (ساختمان)", icon: "🏢" },
            ].map((type) => (
              <label
                key={type.id}
                className={`flex items-center justify-between p-5 rounded-3xl border-2 transition-all duration-300 cursor-pointer ${
                  form[type.id]
                    ? "bg-blue-50/50 border-blue-500 shadow-md shadow-blue-50"
                    : "bg-white border-slate-100 hover:border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{type.icon}</span>
                  <span
                    className={`font-bold ${
                      form[type.id] ? "text-blue-700" : "text-slate-600"
                    }`}
                  >
                    {type.label}
                  </span>
                </div>
                <input
                  type="checkbox"
                  name={type.id}
                  checked={form[type.id]}
                  onChange={handleChange}
                  className="w-6 h-6 rounded-lg border-2 border-slate-300 text-blue-600 focus:ring-blue-500 transition-all"
                />
              </label>
            ))}
          </div>
        </section>

        {/* فیلدهای ورودی */}
        <section>
          <SectionTitle
            icon={ClipboardList}
            title="جزئیات پرونده و کدهای ثبتی"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <FormInput label="وضعیت فعلی پرونده" name="caseStatus" required>
              <select
                name="caseStatus"
                value={form.caseStatus}
                onChange={handleChange}
                className={inputClasses}
                required
              >
                <option value="">انتخاب وضعیت...</option>
                {caseStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </FormInput>

            <FormInput label="شماره عرصه" name="arsehNumber">
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  name="arsehNumber"
                  value={form.arsehNumber}
                  onChange={handleChange}
                  placeholder="وارد کنید"
                  className={inputClasses}
                />
                <Hash
                  className="absolute left-4 top-3.5 text-slate-300"
                  size={18}
                />
              </div>
            </FormInput>

            <FormInput label="کد شناسایی ملک" name="propertyIdCode" required>
              <input
                type="text"
                inputMode="numeric"
                name="propertyIdCode"
                value={form.propertyIdCode}
                onChange={handleChange}
                placeholder="مثلاً ۳۲۴۷۶۸"
                required
                className={inputClasses}
              />
            </FormInput>

            <FormInput label="کد ملک" name="propertyNumber" required>
              <input
                type="text"
                inputMode="numeric"
                name="propertyNumber"
                value={form.propertyNumber}
                onChange={handleChange}
                placeholder="مثلاً ۶۷۸"
                required
                className={inputClasses}
              />
            </FormInput>
          </div>
        </section>
      </div>

      {/* دکمه‌های ناوبری X1 */}
      <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-10">
        <button
          type="button"
          onClick={back}
          className="group flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white border-2 border-slate-100 text-slate-600 font-bold hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-95"
        >
          <ChevronRight
            size={20}
            className="transition-transform group-hover:translate-x-1"
          />
          مرحله قبلی
        </button>

        <button
          type="submit"
          className="group flex items-center gap-2 px-10 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-xl shadow-blue-200 hover:shadow-blue-300 transition-all active:scale-95"
        >
          ثبت و مرحله بعدی
          <ChevronLeft
            size={20}
            className="transition-transform group-hover:-translate-x-1"
          />
        </button>
      </div>
    </form>
  );
}
