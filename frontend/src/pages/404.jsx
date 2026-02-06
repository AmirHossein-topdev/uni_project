"use client";

import Link from "next/link";
import {
  Home,
  ArrowRight,
  Search,
  MessageSquare,
  RotateCcw,
} from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="min-h-screen bg-[#eef7fa] flex items-center justify-center p-6"
      dir="rtl"
    >
      {/* کانتینر اصلی با استایل شیشه‌ای امیر */}
      <div className="relative max-w-4xl w-full bg-white/70 backdrop-blur-2xl border-2 border-white rounded-[3.5rem] p-10 lg:p-20 shadow-[0_40px_100px_-20px_rgba(1,79,134,0.2)] overflow-hidden text-center">
        {/* المان‌های تزئینی پس‌زمینه */}
        <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-[#41bdbb]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#1b4965]/5 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          {/* بخش آیکون و عدد ۴۰۴ */}
          <div className="relative inline-block mb-8">
            <h1 className="text-[12rem] lg:text-[15rem] font-black leading-none tracking-tighter text-[#1b4965] opacity-10 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-[#1b4965] p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(27,73,101,0.3)] rotate-12 hover:rotate-0 transition-transform duration-500 group">
                <Search
                  size={80}
                  className="text-[#41bdbb] group-hover:scale-110 transition-transform"
                />
              </div>
            </div>
          </div>

          {/* متن خطا */}
          <h2 className="text-3xl lg:text-4xl font-black text-[#1b4965] mb-4">
            مسیر را گم کرده‌اید؟
          </h2>
          <p className="text-[#5fa8d3] font-bold text-lg max-w-md mx-auto mb-12">
            صفحه‌ای که به دنبال آن هستید یافت نشد یا به آدرس دیگری منتقل شده
            است.
          </p>

          {/* دکمه‌های عملیاتی سبک امیر */}
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 bg-[#1b4965] text-white px-8 py-4 rounded-2xl font-black shadow-[0_15px_30px_-5px_rgba(27,73,101,0.4)] hover:shadow-[0_20px_40px_-5px_rgba(65,189,187,0.4)] hover:bg-[#153a50] transition-all group"
            >
              <Home size={20} className="text-[#41bdbb]" />
              بازگشت به پیشخوان
              <ArrowRight
                size={18}
                className="mr-2 group-hover:translate-x-[-5px] transition-transform"
              />
            </Link>

            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-3 bg-white border-2 border-[#d8f2f1] text-[#1b4965] px-8 py-4 rounded-2xl font-black hover:border-[#41bdbb] hover:bg-[#f2fbfa] transition-all"
            >
              <RotateCcw size={20} className="text-[#41bdbb]" />
              صفحه قبلی
            </button>
          </div>

          {/* بخش پشتیبانی سریع */}
          <div className="mt-16 pt-8 border-t border-[#d8f2f1] flex flex-col sm:flex-row items-center justify-center gap-8">
            <div className="flex items-center gap-3 text-[#1b4965]/60 font-bold">
              <MessageSquare size={18} className="text-[#41bdbb]" />
              <span>مشکلی در سیستم وجود دارد؟</span>
            </div>
            <Link
              href="/support"
              className="text-[#41bdbb] font-black border-b-2 border-[#41bdbb]/20 hover:border-[#41bdbb] transition-all pb-1 text-sm"
            >
              گزارش به پشتیبانی
            </Link>
          </div>
        </div>

        {/* تگ وضعیت آنلاین به سبک امیر */}
        <div className="absolute top-8 right-8 flex items-center gap-2 bg-[#f2fbfa] px-4 py-2 rounded-full border border-[#41bdbb]/20">
          <div className="w-2 h-2 rounded-full bg-[#41bdbb] animate-pulse"></div>
          <span className="text-[10px] font-black text-[#1b4965] uppercase tracking-widest">
            System Online
          </span>
        </div>
      </div>
    </div>
  );
}
