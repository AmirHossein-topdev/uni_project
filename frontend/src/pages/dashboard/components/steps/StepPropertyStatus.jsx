"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStatus } from "@/redux/features/propertyDraftSlice";

// استایل پایه برای تمام ورودی‌ها و Select ها
const inputBaseClasses =
  "p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out w-full bg-white text-gray-800 shadow-sm";

// استایل برای چک‌باکس‌ها
const checkboxBaseClasses =
  "form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition duration-150 ease-in-out cursor-pointer";

export default function StepPropertyStatus({ next, back }) {
  const dispatch = useDispatch();
  const draft = useSelector((state) => state.propertyDraft.status);

  const [form, setForm] = useState({
    isArseh: draft?.isArseh || false,
    isAyan: draft?.isAyan || false,
    arsehNumber: draft?.arsehNumber || "",
    caseStatus: draft?.caseStatus || "",
    propertyIdCode: draft?.propertyIdCode || "",
    propertyNumber: draft?.propertyNumber || "",
  });

  // state برای نگهداری enum ها
  const [caseStatusOptions, setCaseStatusOptions] = useState([]);
  const [isLoadingEnums, setIsLoadingEnums] = useState(true);

  // گرفتن enum ها از سرور
  useEffect(() => {
    async function fetchEnums() {
      try {
        const res = await fetch("/api/property-enums"); // API که enum ها رو برمیگردونه
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      setStatus({
        ...form,
        // تبدیل به عدد قبل از ذخیره
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

  const handleBack = () => {
    dispatch(setStatus(form));
    back();
  };

  if (isLoadingEnums)
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-xl font-medium text-blue-600">
          در حال بارگذاری اطلاعات...
        </div>
      </div>
    );

  // یک کامپوننت کوچک برای ساختار دهی به ورودی
  const FormInput = ({ label, name, children, required = false }) => (
    <div className="flex flex-col space-y-1">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 pr-1">*</span>}
      </label>
      {children}
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-gray-50 rounded-xl shadow-lg"
    >
      <h2 className="text-2xl font-extrabold text-gray-800 border-b pb-3 mb-4">
        📄 اطلاعات پایه و ثبتی ملک
      </h2>

      {/* بخش چک‌باکس‌ها (عرصه و اعیان) */}
      <div className="flex gap-10 items-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="font-semibold text-gray-700">نوع مالکیت:</div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="isArseh"
            checked={form.isArseh}
            onChange={handleChange}
            className={checkboxBaseClasses}
          />
          <span className="text-gray-600">عرصه (زمین)</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="isAyan"
            checked={form.isAyan}
            onChange={handleChange}
            className={checkboxBaseClasses}
          />
          <span className="text-gray-600">اعیان (ساختمان)</span>
        </label>
      </div>

      {/* فیلدهای ورودی (چیدمان دو ستونی) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput label="وضعیت پرونده" name="caseStatus" required>
          <select
            name="caseStatus"
            value={form.caseStatus}
            onChange={handleChange}
            className={inputBaseClasses}
            required
          >
            <option value="">انتخاب کنید</option>
            {caseStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </FormInput>

        <FormInput label="شماره عرصه (اختیاری)" name="arsehNumber">
          <input
            type="number"
            name="arsehNumber"
            value={form.arsehNumber}
            onChange={handleChange}
            placeholder="مثلاً ۱۲۳۴۵"
            className={inputBaseClasses}
          />
        </FormInput>

        <FormInput label="کد شناسایی ملک" name="propertyIdCode" required>
          <input
            type="number"
            name="propertyIdCode"
            value={form.propertyIdCode}
            onChange={handleChange}
            placeholder="مثلاً ۳۲۴۷۶۸"
            required
            className={inputBaseClasses}
          />
        </FormInput>

        <FormInput label="کد ملک" name="propertyNumber" required>
          <input
            type="number"
            name="propertyNumber"
            value={form.propertyNumber}
            onChange={handleChange}
            placeholder="مثلاً ۶۷۸"
            required
            className={inputBaseClasses}
          />
        </FormInput>
      </div>

      {/* دکمه‌های ناوبری */}
      <div className="flex justify-between pt-6 border-t mt-6">
        <button
          type="button"
          onClick={handleBack}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-150"
        >
          ➡️ قبلی
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150"
        >
          بعدی ⬅️
        </button>
      </div>
    </form>
  );
}
