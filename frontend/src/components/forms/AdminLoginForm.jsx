import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter } from "next/router";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha"; // 🔹 اضافه شدن ریکپچا

// internal
import { CloseEye, OpenEye } from "@/svg";
import ErrorMsg from "../common/error-msg";
import { useLoginAdminMutation } from "@/redux/features/auth/adminApi";
import { notifyError, notifySuccess } from "@/utils/toast";

// ✅ اعتبارسنجی فارسی شده
const schema = Yup.object().shape({
  email: Yup.string()
    .required("لطفا ایمیل را وارد کنید")
    .email("فرمت ایمیل صحیح نمی‌باشد")
    .label("ایمیل"),
  password: Yup.string()
    .required("لطفا رمز عبور را وارد کنید")
    .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد")
    .label("رمز عبور"),
});

const AdminLoginForm = () => {
  const [showPass, setShowPass] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null); // 🔹 استیت کپچا
  const [loginAdmin, { isLoading }] = useLoginAdminMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // 🔹 هندل کردن تغییر کپچا
  const onCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  // ✅ ارسال فرم
  const onSubmit = (data) => {
    // 🔹 بررسی کپچا قبل از ارسال
    if (!captchaValue) {
      notifyError("لطفا تأیید کنید که ربات نیستید!");
      return;
    }

    loginAdmin({
      email: data.email,
      password: data.password,
      // captchaToken: captchaValue // اگر بک‌اند نیاز به توکن دارد، این خط را فعال کنید
    }).then((res) => {
      if (res?.data) {
        notifySuccess("ورود موفقیت‌آمیز بود!");
        router.push("/admin/dashboard");
      } else {
        notifyError(res?.error?.data?.error || "ورود ناموفق بود");
      }
    });
    // reset(); // معمولاً در صورت خطا نباید فرم کامل پاک شود، اما طبق کد شما گذاشتم بماند
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md mx-auto space-y-6 bg-white shadow-2xl  h-fit p-5 rounded-2xl"
      dir="rtl" // 🔹 راست‌چین کردن کل فرم
    >
      <h2 className="text-blue-900 text-center text-2xl font-black">
        ورودبه سامانه{" "}
      </h2>
      {/* --- ایمیل --- */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-black "
        ></label>
        <div className="relative">
          <input
            {...register("email")}
            name="email"
            id="email"
            type="email"
            dir="rtl"
            placeholder="نام کاربری"
            className={`w-full px-4 py-3 rounded-lg border bg-gray-50 text-gray-900 placeholder-gray-900 focus:bg-white transition-colors duration-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent  ${
              errors.password ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
          />
        </div>
        <div className="text-right">
          <ErrorMsg msg={errors.email?.message} />
        </div>
      </div>

      {/* --- پسورد --- */}
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-black "
        ></label>
        <div className="relative">
          <input
            {...register("password")}
            id="password"
            type={showPass ? "text" : "password"}
            placeholder="گذرواژه"
            className={`w-full px-4 py-3 pl-12 rounded-lg border bg-gray-50 text-gray-900 placeholder-gray-900 focus:bg-white transition-colors duration-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.password ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
          />
          {/* آیکون چشم (در حالت راست‌چین باید سمت چپ باشد) */}
          <div
            className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-blue-600 transition-colors"
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? <CloseEye /> : <OpenEye />}
          </div>
        </div>
        <div className="text-right">
          <ErrorMsg msg={errors.password?.message} />
        </div>
      </div>

      {/* --- گزینه‌ها (مرا به خاطر بسپار & فراموشی رمز) --- */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center">
          <input
            id="remeber"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer ml-2" // ml-2 برای فاصله در راست‌چین
          />
          <label
            htmlFor="remeber"
            className="block text-gray-600 cursor-pointer select-none hover:text-gray-900"
          >
            مرا به خاطر بسپار
          </label>
        </div>
        <div>
          <Link
            href="/admin/forgot"
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            رمز عبور را فراموش کردید؟
          </Link>
        </div>
      </div>

      {/* --- کپچا (ReCAPTCHA) --- */}
      <div className="flex justify-center">
        <ReCAPTCHA
          sitekey="6LdnLyAsAAAAANcQ13SwbVVzuOhdHmjmbDiyGnkK" // 👈 کلید سایت خود را اینجا بگذارید
          onChange={onCaptchaChange}
          hl="fa" // 🔹 زبان کپچا فارسی
        />
      </div>

      {/* --- دکمه ورود --- */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? "در حال ورود..." : "ورود به پنل مدیریت"}
        </button>
      </div>
    </form>
  );
};

export default AdminLoginForm;
