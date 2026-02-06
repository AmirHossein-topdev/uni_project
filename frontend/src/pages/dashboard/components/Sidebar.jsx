"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBuilding, FaTimes } from "react-icons/fa";
import {
  LayoutDashboard,
  Users,
  Building2,
  ShieldCheck,
  ChevronLeft,
  InfoIcon,
  Dumbbell,
  ChevronUp,
  ChevronDown,
  Plus,
  CirclePlus,
} from "lucide-react";

const menuItems = [
  {
    label: "پیشخوان اصلی",
    icon: <LayoutDashboard size={20} />,
    href: "/dashboard",
  },
  {
    label: "مالکین و ذینفعان",
    icon: <Users size={20} />,
    href: "/dashboard/owners",
    subMenu: [
      {
        label: "ثبت مالک جدید ",
        icon: <CirclePlus size={16} />,
        href: "/dashboard/owners/create",
      },
    ],
  },
  {
    label: "مستغلات سازمانی",
    icon: <Building2 size={20} />,
    href: "/dashboard/properties",
  },
  {
    label: "مدیریت کاربران",
    icon: <ShieldCheck size={20} />,
    href: "/dashboard/users",
    subMenu: [
      {
        label: "ثبت کاربر جدید ",
        icon: <CirclePlus size={16} />,
        href: "/dashboard/users/create",
      },
    ],
  },
];

function MenuItem({ item, pathname, onClose, level = 0 }) {
  const [open, setOpen] = useState(false);

  // باز کردن خودکار اگر زیرمجموعه فعال بود
  useEffect(() => {
    if (item.subMenu && pathname) {
      const matchSub = item.subMenu.some(
        (sub) => pathname === sub.href || pathname.startsWith(sub.href + "/"),
      );
      if (matchSub) setOpen(true);
    }
  }, [pathname, item.subMenu]);

  const isActive = pathname === item.href;
  const paddingRight = 16 + level * 12;

  // اگر آیتم دارای زیرمنو بود
  if (item.subMenu && item.subMenu.length > 0) {
    return (
      <li className="list-none">
        <div className="relative mb-2 group">
          {/* لینک اصلی: با کلیک روی این بخش به صفحه میرود */}
          <Link
            href={item.href}
            onClick={onClose}
            style={{ paddingRight }}
            className={`flex items-center rounded-2xl p-3.5 transition-all duration-300 ${
              isActive
                ? "bg-[#1b4965] text-[#f2fbfa] shadow-[0_10px_20px_-5px_rgba(27,73,101,0.3)] border border-[#41bdbb]/20"
                : "text-[#1b4965]/70 hover:bg-[#e5f6f6] hover:text-[#1b4965]"
            }`}
          >
            <div className="flex items-center gap-3 flex-1">
              <span
                className={`${isActive || open ? "text-[#41bdbb]" : "text-[#1b4965]/40 group-hover:text-[#41bdbb]"} transition-colors`}
              >
                {item.icon}
              </span>
              <span className="text-xs font-black tracking-tight sidebar-text">
                {item.label}
              </span>
            </div>
          </Link>

          {/* دکمه فلش: جدا شده برای باز و بسته کردن ساب‌منو */}
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(!open);
            }}
            className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-xl cursor-pointer transition-all duration-300 ${
              open
                ? "rotate-180 bg-[#41bdbb]/10 text-[#41bdbb]"
                : "text-[#41bdbb] hover:bg-[#1b4965]/5"
            }`}
          >
            <ChevronDown size={16} />
          </div>
        </div>

        {/* لیست زیرمنو */}
        {open && (
          <ul className="mt-1 mb-3 space-y-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
            {item.subMenu.map((sub, i) => (
              <MenuItem
                key={i}
                item={sub}
                pathname={pathname}
                onClose={onClose}
                level={level + 1}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  // لینک عادی (بدون زیرمنو)
  return (
    <li className="list-none">
      <Link
        href={item.href}
        className={`flex items-center gap-3 rounded-2xl p-3.5 mb-1 transition-all duration-300 group ${
          isActive
            ? "bg-[#1b4965] text-[#f2fbfa] shadow-[0_10px_20px_-5px_rgba(27,73,101,0.4)] border border-[#41bdbb]/30"
            : "text-[#1b4965]/70 hover:bg-[#e5f6f6] hover:text-[#1b4965]"
        }`}
        style={{ paddingRight }}
        onClick={onClose}
      >
        <span
          className={`${isActive ? "text-[#41bdbb]" : "text-[#1b4965]/40 group-hover:text-[#41bdbb]"} transition-colors`}
        >
          {item.icon}
        </span>
        <span className="text-xs font-black sidebar-text">{item.label}</span>

        {isActive && (
          <div className="mr-auto animate-pulse">
            <div className="w-1.5 h-1.5 rounded-full bg-[#41bdbb] shadow-[0_0_8px_#41bdbb]"></div>
          </div>
        )}
      </Link>
    </li>
  );
}

export default function Sidebar({ isMobileOpen, onClose }) {
  const pathname = usePathname() || "";

  return (
    <>
      {/* Overlay هوشمند */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-[#0b1d28]/40 backdrop-blur-md z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        id="sidebar"
        className={`fixed right-0 top-2 bottom-2 rounded-4xl w-58 z-50 bg-[#f2fbfa] text-[#050e14] flex flex-col border-l border-[#d8f2f1] shadow-[25px_0_50px_-20px_rgba(27,73,101,0.1)] transition-all duration-500 ease-in-out transform ${
          isMobileOpen ? "translate-x-0" : "translate-x-full"
        } lg:translate-x-0`}
      >
        {/* هدر سایدبار - برندینگ با Yale Blue */}
        <div className="p-8 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 group">
              <div className="bg-[#1b4965] p-3 rounded-2xl shadow-lg group-hover:shadow-[#41bdbb]/40 transition-all duration-500 group-hover:-rotate-6">
                <FaBuilding className="text-[#bee9e8]" size={22} />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-tighter text-[#1b4965]">
                  سامانه املاک
                </span>
                <span className="text-[10px] text-[#41bdbb] font-black uppercase tracking-[3px]">
                  Real Estate
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-[#1b4965] hover:bg-[#bee9e8] rounded-xl transition-all"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        {/* ناوبری اصلی */}
        <nav className="flex-1 overflow-y-auto px-6 custom-scrollbar">
          <div className="flex items-center px-2 mb-6">
            <p className="text-[10px] text-[#1b4965]/40 font-black uppercase tracking-[4px]">
              دسترسی سیستم
            </p>
            <div className="h-px bg-gradient-to-l from-[#41bdbb]/30 to-transparent flex-1 mr-4"></div>
          </div>

          <ul className="space-y-1">
            {menuItems.map((item, i) => (
              <MenuItem
                key={i}
                item={item}
                pathname={pathname}
                onClose={onClose}
              />
            ))}
          </ul>
        </nav>

        {/* فوتر کاربری - ترکیب Fresh Sky و Yale Blue */}
        <div className="p-6 mt-auto">
          <div className="bg-white border border-[#d8f2f1] rounded-[2.5rem] p-4 flex items-center gap-3 shadow-sm hover:shadow-xl hover:shadow-[#1b4965]/5 transition-all duration-500 group cursor-pointer">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-[#1b4965] flex items-center justify-center font-black text-[#bee9e8] shadow-inner transition-transform group-hover:scale-105">
                AD
              </div>
              {/* وضعیت آنلاین با رنگ Frozen Water */}
              <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-[#41bdbb] rounded-full border-4 border-white shadow-sm"></div>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-black text-[#1b4965] truncate">
                مدیر ارشد
              </p>
              <p className="text-[10px] text-[#5fa8d3] font-bold truncate tracking-tight">
                پنل مدیریتی مستغلات
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
