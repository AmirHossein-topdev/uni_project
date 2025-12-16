import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter } from "next/router";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";

import { CloseEye, OpenEye } from "@/svg";
import ErrorMsg from "../common/error-msg";
import { notifyError, notifySuccess } from "@/utils/toast";

// 🔹 ایمپورت از authApi.js
import { useLoginUserMutation } from "@/redux/features/auth/authApi";

// 🟦 اعتبارسنجی جدید مخصوص employeeCode
const schema = Yup.object().shape({
  employeeCode: Yup.string()
    .required("لطفا کد سازمانی را وارد کنید")
    .matches(/^[0-9]{6,12}$/, "کد سازمانی معتبر نیست"),
  password: Yup.string()
    .required("رمز عبور الزامی است")
    .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

const AdminLoginForm = () => {
  const [showPass, setShowPass] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);

  // 🔹 فقط از useLoginUserMutation استفاده می‌کنیم
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const onSubmit = async (data) => {
    if (!captchaValue) {
      notifyError("لطفاً تأیید کنید که ربات نیستید!");
      return;
    }

    try {
      const res = await loginUser({
        employeeCode: data.employeeCode,
        password: data.password,
      }).unwrap();

      // موفقیت
      notifySuccess("ورود با موفقیت انجام شد!");
      router.replace("/dashboard");
    } catch (err) {
      console.error("❌ Login failed with error:", err);

      const message =
        err?.data?.error ||
        err?.data?.message ||
        err?.error ||
        "ورود موفق نبود. لطفاً مجدداً تلاش کنید.";

      notifyError(message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md mx-auto space-y-6 bg-white shadow-2xl p-6 rounded-2xl"
      dir="rtl"
    >
      <h2 className="text-blue-900 text-center text-2xl font-black">
        ورود به سامانه مدیریت
      </h2>

      {/* کد سازمانی */}
      <div className="space-y-2">
        <input
          {...register("employeeCode")}
          type="text"
          placeholder="کد سازمانی"
          className={`w-full px-4 py-3 rounded-lg border text-gray-900 
            ${
              errors.employeeCode
                ? "border-red-500 bg-red-50"
                : "border-gray-300"
            }
            focus:ring-2 focus:ring-blue-500 outline-none`}
        />
        <ErrorMsg msg={errors.employeeCode?.message} />
      </div>

      {/* پسورد */}
      <div className="space-y-2">
        <div className="relative">
          <input
            {...register("password")}
            type={showPass ? "text" : "password"}
            placeholder="رمز عبور"
            className={`w-full px-4 py-3 rounded-lg border text-gray-900 
              ${
                errors.password ? "border-red-500 bg-red-50" : "border-gray-300"
              }
              focus:ring-2 focus:ring-blue-500 outline-none`}
          />

          <div
            className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer hover:text-blue-600"
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? <CloseEye /> : <OpenEye />}
          </div>
        </div>
        <ErrorMsg msg={errors.password?.message} />
      </div>

      {/* گزینه‌ها */}
      <div className="flex items-center justify-between text-sm mt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="h-4 w-4 text-blue-600" />
          <span className="text-gray-600">مرا به خاطر بسپار</span>
        </label>

        <Link
          href="/admin/forgot"
          className="text-blue-600 font-medium hover:text-blue-800 transition"
        >
          فراموشی رمز عبور؟
        </Link>
      </div>

      {/* کپچا */}
      <div className="flex justify-center">
        <ReCAPTCHA
          sitekey="6LdnLyAsAAAAANcQ13SwbVVzuOhdHmjmbDiyGnkK"
          onChange={onCaptchaChange}
          hl="fa"
        />
      </div>

      {/* دکمه ورود */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow disabled:opacity-60"
      >
        {isLoading ? "در حال ورود..." : "ورود"}
      </button>
    </form>
  );
};

export default AdminLoginForm;
