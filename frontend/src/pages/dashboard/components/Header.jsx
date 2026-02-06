"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaBars } from "react-icons/fa";
import {
  Bell,
  ChevronDown,
  User,
  LogOut,
  Settings as SettingsIcon,
} from "lucide-react";

export default function Header({ onOpenSidebar }) {
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const profileRef = useRef(null);
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState({
    name: "",
    role: "",
    profileImage: "",
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileInfo(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // تابع خروج از حساب (سبک امیر)
  const handleLogout = () => {
    sessionStorage.clear(); // پاکسازی کامل سشن استوریج
    router.push("/"); // هدایت به صفحه اصلی
  };
  // بخش کاربر هدر
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("user");
      if (!raw) return;

      const parsed = JSON.parse(raw);

      // پشتیبانی از چند ساختار مختلف که ممکن ذخیره شده باشد:
      // 1) مستقیم شیء user: {_id, name, role, profileImage}
      // 2) wrapper مثل { token, user: {...} }
      // 3) wrapper با data.users: { success:true, data: { users: [...] } }
      let user =
        parsed?.user ??
        (parsed?.data?.user ? parsed.data.user : undefined) ??
        (Array.isArray(parsed?.data?.users)
          ? parsed.data.users[0]
          : undefined) ??
        (Array.isArray(parsed?.users) ? parsed.users[0] : undefined) ??
        parsed;

      // بعضی‌وقت فرم‌ها یا API پاسخ‌هایی می‌فرستن که توش فیلدها با نام‌های متفاوتن
      const normalized = {
        name: user?.name || user?.fullName || user?.employeeCode || "",
        role: user?.role || "",
        profileImage: user?.profileImage || user?.img || user?.avatar || "",
        _id: user?._id || user?.id || "",
      };

      setCurrentUser(normalized);
    } catch (err) {
      console.error("Failed to parse session user:", err);
    }
  }, []);

  return (
    <header className="relative flex z-[99] items-center justify-between bg-white/70 backdrop-blur-xl border-2 border-white rounded-[2.5rem] p-4 mb-5 shadow-[0_20px_50px_-20px_rgba(1,79,134,0.15)] overflow-visible">
      {/* بخش موبایل (همبرگر منو) */}
      <div className="lg:hidden flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="p-3 bg-[#1b4965] text-[#41bdbb] rounded-2xl shadow-lg shadow-[#1b4965]/20 hover:scale-105 transition-transform active:scale-95"
          aria-label="باز کردن منو"
        >
          <FaBars size={20} />
        </button>
        <div className="flex flex-col">
          <span className="font-black text-[#1b4965] text-sm leading-tight">
            پنل مدیریت
          </span>
          <span className="text-[9px] text-[#41bdbb] font-bold uppercase tracking-widest">
            Real Estate
          </span>
        </div>
      </div>

      {/* عنوان و وضعیت دسکتاپ (سبک امیر) */}
      <div className="hidden lg:flex flex-col mr-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#41bdbb] animate-pulse shadow-[0_0_8px_#41bdbb]"></div>
          <h2 className="text-xl font-black text-[#1b4965]">
            خوش آمدید، <span className="text-[#5fa8d3]">مدیر ارشد</span>
          </h2>
        </div>
        <p className="text-[11px] text-[#1b4965]/50 font-bold mt-1 pr-4">
          امروز{" "}
          <span className="text-[#0179cf] font-black">۵ فعالیت بی‌پاسخ</span> در
          سیستم ثبت شده است.
        </p>
      </div>

      {/* بخش ابزارها و پروفایل */}
      <div className="flex items-center gap-4">
        {/* دکمه اعلان نئونی */}
        <button className="hidden sm:flex relative p-3 bg-white border border-[#d8f2f1] text-[#1b4965] rounded-2xl hover:bg-[#1b4965] hover:text-white transition-all duration-300 group shadow-sm">
          <Bell size={20} />
          <span className="absolute top-2.5 left-2.5 w-2.5 h-2.5 bg-[#41bdbb] rounded-full border-2 border-white shadow-[0_0_10px_#41bdbb]"></span>
        </button>

        {/* پروفایل با استایل نئون بوردر و بک‌گراند رنگی */}
        <div ref={profileRef} className="relative">
          <div
            className={`flex items-center gap-3 p-1.5 pr-4 rounded-[1.8rem] cursor-pointer transition-all duration-300 border-2 ${
              showProfileInfo
                ? "bg-[#1b4965] border-[#41bdbb] shadow-[0_0_20px_rgba(65,189,187,0.3)]"
                : "bg-white border-[#d8f2f1] hover:border-[#41bdbb]/50 shadow-sm"
            }`}
            onClick={() => setShowProfileInfo(!showProfileInfo)}
          >
            <div className="flex flex-col items-end hidden sm:flex">
              <span
                className={`text-xs font-black transition-colors ${
                  showProfileInfo ? "text-white" : "text-[#1b4965]"
                }`}
              >
                {currentUser.name || "کاربر"}
              </span>
              <span
                className={`text-[9px] font-bold opacity-70 transition-colors ${
                  showProfileInfo ? "text-[#bee9e8]" : "text-[#41bdbb]"
                }`}
              >
                {currentUser.role || "—"}
              </span>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-[#41bdbb] to-[#1b4965] rounded-full opacity-0 group-hover:opacity-100 blur transition duration-500"></div>

              {/* اگر آدرس تصویر موجود نبود از تصویر دیفالت استفاده کن */}
              <Image
                src={currentUser.profileImage || "/images/default-avatar.png"}
                width={42}
                height={42}
                alt={currentUser.name || "User"}
                className="relative rounded-full border-2 border-[#41bdbb] object-cover shadow-md"
                unoptimized
              />
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${
                showProfileInfo
                  ? "rotate-180 text-[#41bdbb]"
                  : "text-[#1b4965]/40"
              }`}
            />
          </div>

          {/* منوی دراپ‌دان — بدون تغییر */}
          {showProfileInfo && (
            <div className="absolute left-0  w-56 z-[99] bg-white backdrop-blur-xl p-3 rounded-[2rem] border border-[#d8f2f1] shadow-[0_20px_40px_-15px_rgba(27,73,101,0.2)] z-[100] animate-in fade-in zoom-in duration-200 origin-top-left">
              <div className="flex flex-col gap-1">
                <button className="flex items-center gap-3 w-full p-3 text-[#1b4965]/70 hover:bg-[#e5f6f6] hover:text-[#1b4965] rounded-2xl transition-all font-bold text-xs">
                  <User size={16} className="text-[#41bdbb]" />
                  پروفایل کاربری
                </button>
                <button className="flex items-center gap-3 w-full p-3 text-[#1b4965]/70 hover:bg-[#e5f6f6] hover:text-[#1b4965] rounded-2xl transition-all font-bold text-xs">
                  <SettingsIcon size={16} className="text-[#41bdbb]" />
                  تنظیمات حساب
                </button>
                <div className="h-px bg-gradient-to-r from-transparent via-[#d8f2f1] to-transparent my-1"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all font-black text-xs"
                >
                  <LogOut size={16} />
                  خروج از سامانه
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
