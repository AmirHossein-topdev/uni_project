"use client";

import React from "react";
import {
  Send,
  Instagram,
  Globe,
  PhoneCall,
  ShieldCheck,
  Activity,
  Lock,
} from "lucide-react";
import AdminLoginForm from "../forms/AdminLoginForm";
import { FaWhatsapp } from "react-icons/fa";

export default function AdminLoginArea() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center bg-[#fcfcfc] overflow-hidden rtl font-sans">
      {/* 1. پس‌زمینه (تصویر در سمت راست با تم قرمز ملایم) */}
      <div
        className="absolute inset-0 z-0 bg-contain bg-no-repeat bg-right  transition-all duration-700 pointer-events-none"
        style={{
          backgroundImage: "url('/assets/img/BackGround.svg')",
          backgroundPosition: "left 5% center",
        }}
      ></div>

      {/* 2. لایه‌های نوری (Ambient Light) با تناژ قرمز و نقره‌ای */}
      <div className="absolute top-[-5%] right-[-5%] w-[35%] h-[35%] bg-red-500/10 rounded-full blur-[100px] z-0"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-[35%] h-[35%] bg-slate-400/10 rounded-full blur-[100px] z-0"></div>

      {/* 3. محتوای اصلی */}
      <div className="relative z-10 w-full max-w-[1240px] px-6 grid grid-cols-12 gap-8 items-center">
        {/* --- بخش متنی (سمت راست - اطلاعات) --- */}
        <div className="col-span-12 lg:col-span-6 space-y-8 order-2 lg:order-2 lg:pr-12"></div>

        {/* --- بخش فرم ورود (سمت چپ) --- */}
        <div className="col-span-12 lg:col-span-6 relative flex justify-start z-30 order-1 lg:order-1">
          {/* دکوراسیون پشت فرم */}
          <div className="absolute -bottom-10 -left-10 text-[150px] font-[1000] text-red-500/[0.03] select-none pointer-events-none uppercase">
            HRC
          </div>

          <div className="w-full max-w-[440px] relative group">
            {/* افکت نوری پشت فرم */}
            <div className="absolute inset-0 bg-red-600/20 blur-[50px] rounded-[4rem] group-hover:bg-red-600/30 transition-all duration-500 opacity-50"></div>

            <div className="relative bg-white p-4 rounded-[3.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.08)] border border-slate-100">
              <div className="bg-slate-50/50 rounded-[3rem] p-4 border border-slate-100">
                <AdminLoginForm />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. هدر معلق */}
      <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-40">
        {/* <div className="bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-[1.5rem] shadow-sm border border-slate-100 flex items-center gap-4">
          <img src="/assets/img/logo.png" className="h-10" alt="Logo" />
          <div className="w-px h-6 bg-slate-200"></div>
          <span className="text-slate-900 font-black text-sm">
            پورتال ادمین
          </span>
        </div> */}

        <div className="hidden md:flex gap-3">
          <ContactPill
            icon={<PhoneCall size={14} />}
            text="۱۱۲"
            isCritical={true}
          />
          <ContactPill
            icon={<Globe size={14} />}
            text="rcs.ir"
            isCritical={false}
          />
        </div>
      </div>

      {/* 5. فوتر معلق */}
      <div className="absolute bottom-8 left-10 right-10 flex justify-between items-end z-40">
        <div className="flex gap-3">
          {/* Send / Telegram */}
          <div className="w-12 h-12 flex items-center justify-center bg-white shadow-sm  text-blue-600 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-110 hover:-translate-y-[10px]">
            <Send size={18} />
          </div>

          {/* WhatsApp */}
          <div className="w-12 h-12 flex items-center justify-center bg-white shadow-sm  text-green-600 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-110 hover:-translate-y-[10px]">
            <FaWhatsapp size={18} />
          </div>

          {/* Instagram */}
          <div className="w-12 h-12 flex items-center justify-center bg-white shadow-sm  text-pink-600 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-110 hover:-translate-y-[10px]">
            <Instagram size={18} />
          </div>
          <div className="w-12 h-12 flex items-center justify-center bg-white shadow-sm rounded-2xl border border-slate-100 hover:border-red-200 transition-all cursor-pointer group duration-300 hover:scale-110 hover:-translate-y-[10px]">
            <img
              src="/assets/img/logo/bale-color.png"
              className="h-5 transition-transform "
              alt="Bale"
            />
          </div>
        </div>
        <div className="text-right">
          <p className="text-slate-400 font-black text-[10px] tracking-widest uppercase">
            Red Crescent Identity Management
          </p>
          <p className="text-slate-300 font-bold text-[9px] mt-1">
            Version 4.2.0 (Stable)
          </p>
        </div>
      </div>
    </section>
  );
}

function ContactPill({ icon, text, isCritical }) {
  return (
    <div
      className={`backdrop-blur-md border px-5 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 transition-all cursor-default shadow-sm
      ${
        isCritical
          ? "bg-red-600 border-red-500 text-white shadow-red-200"
          : "bg-white border-slate-100 text-slate-600"
      }`}
    >
      {icon} {text}
    </div>
  );
}
