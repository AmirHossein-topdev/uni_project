"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter } from "next/navigation"; // برای Next 13+
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";

import { CloseEye, OpenEye } from "@/svg";
import ErrorMsg from "../common/error-msg";
import { notifyError, notifySuccess } from "@/utils/toast";
import { useLoginUserMutation } from "@/redux/features/auth/authApi";

const schema = Yup.object().shape({
  employeeCode: Yup.string()
    .required("کد سازمانی الزامی است")
    .matches(/^[0-9]{6,12}$/, "کد سازمانی معتبر نیست"),
  password: Yup.string()
    .required("رمز عبور الزامی است")
    .min(6, "حداقل ۶ کاراکتر"),
});

const AdminLoginForm = () => {
  const [showPass, setShowPass] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    if (!captchaValue) {
      notifyError("تأییدیه امنیتی الزامی است");
      return;
    }

    const API_BASE = (
      process.env.NEXT_PUBLIC_API_BASE || "http://localhost:7000/api"
    ).replace(/\/$/, "");

    try {
      // 1) لاگین
      const res = await loginUser({
        employeeCode: data.employeeCode,
        password: data.password,
        profileImage: data.profileImage,
      }).unwrap();

      // 2) توکن را بردار و ذخیره کن (اگر وجود داشت)
      const token = res?.token || res?.data?.token || res?.accessToken || null;
      if (token) {
        sessionStorage.setItem("token", token);
        console.info("[login] token stored");
      } else {
        console.warn("[login] no token returned from login");
      }

      // 3) تلاش برای استخراج userId از پاسخ لاگین (چند حالت محتمل)
      let userId =
        res?.data?._id ||
        res?.data?.users?.[0]?._id ||
        res?.user?._id ||
        res?.data?.user?._id ||
        res?._id ||
        null;

      console.info("[login] extracted userId from login response:", userId);

      // 4) اگر id نبود، تلاش برای پیدا کردن از طریق endpoint جستجو (fallback)
      if (!userId) {
        try {
          const searchUrl = `${API_BASE}/users?employeeCode=${encodeURIComponent(data.employeeCode)}`;
          console.info(
            "[login] trying fallback search by employeeCode:",
            searchUrl,
          );

          const searchRes = await fetch(searchUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          });

          const searchJson = await searchRes.json();
          console.info(
            "[login] fallback search response:",
            searchRes.status,
            searchJson,
          );

          if (Array.isArray(searchJson) && searchJson.length > 0) {
            userId = searchJson[0]._id || searchJson[0].id || null;
          } else if (
            Array.isArray(searchJson?.users) &&
            searchJson.users.length > 0
          ) {
            userId = searchJson.users[0]._id || searchJson.users[0].id || null;
          } else if (searchJson && searchJson._id) {
            userId = searchJson._id;
          }
        } catch (searchErr) {
          console.warn("[login] fallback search failed (ignored):", searchErr);
        }
      }

      // 5) اگر هنوز id نداریم، از اطلاعات لاگین به‌عنوان fallback مستقیم استفاده کن
      if (!userId) {
        console.warn(
          "[login] no userId found; using login response as user source if available",
        );
      }

      // 6) حالا اگر userId داریم، از endpoint /api/users/:id اطلاعات کامل کاربر را بگیر
      let fetchedUser = null;
      if (userId) {
        const userUrl = `${API_BASE}/users/${encodeURIComponent(userId)}`;
        console.info("[login] fetching user by id:", userUrl);

        try {
          const userRes = await fetch(userUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          });

          const userJson = await userRes.json();
          console.info(
            "[login] user by id response:",
            userRes.status,
            userJson,
          );

          // اگر پاسخ یک شیء user است، استفاده کن
          if (userJson && typeof userJson === "object") {
            // ممکنه سرور ساختار { success: true, data: {...} } برگردونه
            fetchedUser = userJson.data || userJson.user || userJson;
          }
        } catch (userFetchErr) {
          console.warn(
            "[login] fetch user by id failed (ignored):",
            userFetchErr,
          );
          fetchedUser = null;
        }
      }

      // 7) منبع نهایی اطلاعات کاربر: اول fetchedUser، بعد fallback از پاسخ لاگین
      const fallbackUser =
        res?.data?.users?.[0] ||
        res?.user ||
        res?.data ||
        (res && typeof res === "object" ? res : null);

      const userSource = fetchedUser || fallbackUser || {};

      // 8) فقط فیلدهای مشخص را بردار و در sessionStorage ذخیره کن
      const finalUser = {
        _id: userSource._id || userSource.id || null,
        name: userSource.name || null,
        employeeCode: userSource.employeeCode || data.employeeCode || null,
        email: userSource.email || null,
        profileImage: userSource.profileImage || null,
        role: userSource.role || null,
        contactNumber: userSource.contactNumber || null,
        address: userSource.address || null,
        status: userSource.status || null,
        createdAt: userSource.createdAt || null,
        updatedAt: userSource.updatedAt || null,
      };

      sessionStorage.setItem("user", JSON.stringify(finalUser));
      console.info("[login] user saved to sessionStorage:", finalUser);

      notifySuccess("خوش آمدید!");
      router.replace("/dashboard");
    } catch (err) {
      console.error("[login] login error:", err);
      notifyError(
        err?.data?.message || err?.message || "خطا در برقراری ارتباط",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-7 bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white"
      dir="rtl"
    >
      <div className="text-center space-y-2">
        <h2 className="text-[#012a4a] text-3xl font-[1000] tracking-tighter">
          ورود مدیران
        </h2>
        <p className="text-gray-400 text-sm font-bold">
          اطلاعات سازمانی خود را وارد کنید
        </p>
      </div>

      <div className="space-y-5">
        {/* کد سازمانی */}
        <div className="relative group">
          <input
            {...register("employeeCode")}
            type="text"
            placeholder="کد سازمانی"
            className={`w-full px-6 py-4 rounded-2xl bg-gray-100/60 border-none text-[#012a4a] font-black placeholder:text-gray-300 transition-all focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none
            ${errors.employeeCode ? "ring-2 ring-red-500/20 bg-red-50/50" : ""}`}
          />
          {errors.employeeCode && (
            <div className="mt-1 pr-2">
              <ErrorMsg msg={errors.employeeCode?.message} />
            </div>
          )}
        </div>

        {/* رمز عبور */}
        <div className="relative group">
          <input
            {...register("password")}
            type={showPass ? "text" : "password"}
            placeholder="رمز عبور"
            className={`w-full px-6 py-4 rounded-2xl bg-gray-100/60 border-none text-[#012a4a] font-black placeholder:text-gray-300 transition-all focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none
      ${errors.password ? "ring-2 ring-red-500/20 bg-red-50/50" : ""}`}
            onKeyPress={(e) => {
              // اجازه فقط حروف انگلیسی و اعداد و نمادهای معمول
              const pattern = /[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;
              if (!pattern.test(e.key)) e.preventDefault();
            }}
          />
          <div
            className="absolute left-5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-300 hover:text-blue-600 transition"
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? <CloseEye /> : <OpenEye />}
          </div>
          {errors.password && (
            <div className="mt-1 pr-2">
              <ErrorMsg msg={errors.password?.message} />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-2">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            className="w-5 h-5 rounded-lg border-gray-200 text-blue-600 focus:ring-0 transition-all"
          />
          <span className="text-gray-400 text-xs font-black group-hover:text-gray-600 transition">
            ذخیره نشست
          </span>
        </label>
        <Link
          href="/admin/forgot"
          className="text-blue-600 text-xs font-[1000] hover:underline"
        >
          فراموشی رمز؟
        </Link>
      </div>

      {/* کپچا مینیمال */}
      <div className="flex justify-center scale-90 origin-center opacity-80 hover:opacity-100 transition">
        <ReCAPTCHA
          sitekey="6LdnLyAsAAAAANcQ13SwbVVzuOhdHmjmbDiyGnkK"
          onChange={(v) => setCaptchaValue(v)}
          hl="fa"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-5 rounded-[1.8rem] bg-[#012a4a] text-white font-[1000] text-lg hover:bg-blue-900 transition-all shadow-[0_10px_30px_rgba(1,42,74,0.3)] disabled:opacity-50 active:scale-[0.98]"
      >
        {isLoading ? "در حال تایید..." : "شروع مدیریت"}
      </button>
    </form>
  );
};

export default AdminLoginForm;
