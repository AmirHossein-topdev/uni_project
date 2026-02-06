"use client";

import Head from "next/head";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Home,
  UserPlus,
  CheckCircle2,
  MessageSquare,
  Clock,
  TrendingUp,
  Bell,
  PlusCircle,
  Map,
  ShieldCheck,
  ArrowUpRight,
  Search,
  Settings,
} from "lucide-react";

// کامپوننت کمکی برای آیکون سپر (UserShield)
function UserShield({ size, className }) {
  return <ShieldCheck size={size} className={className} />;
}

export default function DashboardPage() {
  const stats = [
    {
      title: "سندهای رسمی امروز",
      value: "۱۲",
      desc: "+۳ نسبت به دیروز",
      icon: <FileText className="text-[#01497c]" size={24} />,
      trend: "up",
      color: "bg-[#eef7fa]",
    },
    {
      title: "ثبت‌های جدید",
      value: "۲۵",
      desc: "+۵ مورد جدید",
      icon: <PlusCircle className="text-[#2a6f97]" size={24} />,
      trend: "up",
      color: "bg-[#e7f3f7]",
    },
    {
      title: "ثبت‌های این ماه",
      value: "۴۵۰",
      desc: "+۲۰ نسبت به ماه قبل",
      icon: <TrendingUp className="text-[#014f86]" size={24} />,
      trend: "up",
      color: "bg-[#d9e9f0]",
    },
    {
      title: "کل مستغلات",
      value: "۵,۲۰۰",
      desc: "در سراسر کشور",
      icon: <Map className="text-[#012a4a]" size={24} />,
      trend: "neutral",
      color: "bg-[#cfe7f2]",
    },
  ];

  const quickAccess = [
    {
      label: "ثبت ملک جدید",
      href: "/dashboard/properties/create",
      icon: <Home size={18} />,
      color: "bg-[#014f86]",
    },
    {
      label: "افزودن مالک",
      href: "/dashboard/owners/create",
      icon: <UserPlus size={18} />,
      color: "bg-[#2a6f97]",
    },
    {
      label: "گزارشات سیستمی",
      href: "/dashboard/",
      icon: <FileText size={18} />,
      color: "bg-[#2a6f97]",
    },
    {
      label: "تنظیمات پنل",
      href: "/dashboard/",
      icon: <Settings size={18} />,
      color: "bg-[#468faf]",
    },
  ];

  const activities = [
    {
      icon: <FileText size={20} />,
      title: "سند رسمی صادر شد: #۱۲۳۴",
      time: "۵ دقیقه پیش",
      detail: "مالک: محمد رضایی",
      statusColor: "text-[#0179cf]",
    },
    {
      icon: <Home size={20} />,
      title: "ملک جدید ثبت شد: پلاک ۵۲",
      time: "۱۵ دقیقه پیش",
      detail: "آدرس: تهران، سعادت‌آباد",
      statusColor: "text-[#2c7da0]",
    },
    {
      icon: <UserShield size={20} />,
      title: "تایید احراز هویت مالک",
      time: "۳۰ دقیقه پیش",
      detail: "توسط مدیریت سیستم",
      statusColor: "text-[#468faf]",
    },
    {
      icon: <CheckCircle2 size={20} />,
      title: "قرارداد تایید شد: #۵۶۷۸",
      time: "۴۵ دقیقه پیش",
      detail: "نوع: اجاره سازمانی",
      statusColor: "text-[#01497c]",
    },
    {
      icon: <MessageSquare size={20} />,
      title: "تیکت پشتیبانی جدید",
      time: "۱ ساعت پیش",
      detail: "موضوع: اصلاح متراژ",
      statusColor: "text-[#61a5c2]",
    },
    {
      icon: <Clock size={20} />,
      title: "پایان مهلت اجاره",
      time: "۲ ساعت پیش",
      detail: "واحد اداری منطقه ۳",
      statusColor: "text-[#012a4a]",
    },
  ];

  return (
    <div className=" bg-[#eef7fa]  text-[#012a4a] p-4 lg:p-10 rounded-[3rem] border border-white/50">
      <Head>
        <title>داشبورد هوشمند مستغلات</title>
      </Head>

      {/* هدر خوش‌آمدگویی */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-[#014f86] rounded-xl text-white shadow-lg shadow-[#014f86]/20">
              <LayoutDashboard size={24} />
            </div>
            <h1 className="text-3xl font-black text-[#012a4a] tracking-tighter">
              میز کار مدیریت
            </h1>
          </div>
          <p className="text-[#468faf] text-xs font-bold mr-11 tracking-widest uppercase">
            سامانه یکپارچه مستغلات و املاک
          </p>
        </div>

        <div className="flex items-center gap-4 ">
          <div className="relative group">
            <input
              type="text"
              placeholder="جستجوی سریع..."
              className="bg-white/70 backdrop-blur-md border border-[#cfe7f2] rounded-2xl py-3 px-12 text-sm focus:ring-4 focus:ring-[#014f86]/5 focus:border-[#014f86] outline-none transition-all w-72 font-bold placeholder:text-[#61a5c2]/50"
            />
            <Search
              className="absolute right-4 top-3.5 text-[#61a5c2]"
              size={18}
            />
          </div>
          <button className="bg-white p-3.5 rounded-2xl border border-[#cfe7f2] text-[#014f86] hover:bg-[#014f86] hover:text-white transition-all shadow-sm relative group">
            <Bell size={20} />
            <span className="absolute top-3 right-3.5 w-2.5 h-2.5 bg-[#1ea0fe] rounded-full border-2 border-white animate-pulse"></span>
          </button>
        </div>
      </div>

      {/* دسترسی سریع */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
        {quickAccess.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className="group flex items-center gap-4 bg-white/60 backdrop-blur-sm p-4 rounded-[1.8rem] border border-white hover:border-[#014f86] transition-all shadow-sm hover:shadow-xl hover:shadow-[#014f86]/5"
          >
            <div
              className={`${item.color} p-3 rounded-2xl text-white shadow-md group-hover:scale-110 transition-transform duration-500`}
            >
              {item.icon}
            </div>
            <span className="font-black text-xs text-[#012a4a]">
              {item.label}
            </span>
          </Link>
        ))}
      </div>

      {/* کارت‌های آمار هوشمند */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {stats.map((item, i) => (
          <div
            key={i}
            className="bg-white p-7 rounded-[2.5rem] border border-[#cfe7f2] shadow-sm relative overflow-hidden group hover:border-[#014f86] transition-colors"
          >
            <div className="absolute -right-6 -top-6 w-28 h-28 bg-[#dfedf3]/50 rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <div className={`${item.color} p-4 rounded-2xl`}>
                  {item.icon}
                </div>
                {item.trend === "up" && (
                  <div className="flex items-center text-[#026bb6] bg-[#eef7fa] px-3 py-1 rounded-full text-[10px] font-black border border-[#a9d6e5]">
                    <ArrowUpRight size={14} className="ml-1" />{" "}
                    {item.desc.split(" ")[0]}
                  </div>
                )}
              </div>
              <h3 className="text-[#61a5c2] text-xs font-black mb-1 uppercase tracking-tighter">
                {item.title}
              </h3>
              <div className="text-4xl font-black text-[#012a4a]">
                {item.value}
              </div>
              <p className="text-[10px] text-[#468faf] mt-3 font-bold">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* بخش میانی: تحلیل و اعلانات */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-md p-8 rounded-[3rem] border border-white shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-xl text-[#012a4a] flex items-center gap-3">
              <TrendingUp className="text-[#0179cf]" size={24} />
              تحلیل ماهانه ثبت اسناد
            </h3>
            <select className="bg-[#eef7fa] border border-[#a9d6e5] text-[#014f86] text-[11px] font-black rounded-xl px-4 py-2 outline-none focus:ring-2 ring-[#014f86]/10">
              <option>دوره جاری: ۱۴۰۴</option>
              <option>دوره قبل: ۱۴۰۳</option>
            </select>
          </div>
          <div className="h-72 flex items-end justify-between px-4 pb-4 bg-gradient-to-b from-[#f2fbfa] to-white rounded-[2rem] border border-[#cfe7f2]">
            {[30, 50, 45, 95, 70, 85, 60, 40, 90, 55, 65, 80].map((h, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 group w-full px-1"
              >
                <div
                  className="w-full bg-[#014f86] rounded-t-lg transition-all hover:bg-[#0d99fd] cursor-pointer relative"
                  style={{ height: `${h * 2}px` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#012a4a] text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {h}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center gap-8">
            <div className="flex items-center gap-2 text-[10px] font-black text-[#61a5c2]">
              <div className="w-3 h-3 bg-[#014f86] rounded-full"></div> ثبت
              سیستمی
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-[#61a5c2]">
              <div className="w-3 h-3 bg-[#0d99fd] rounded-full shadow-[0_0_8px_#0d99fd]"></div>{" "}
              تایید نهایی
            </div>
          </div>
        </div>

        <div className="bg-[#012a4a] p-8 rounded-[3rem] shadow-2xl shadow-[#012a4a]/20 text-white border border-[#014f86]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-xl flex items-center gap-3">
              <Bell className="text-[#89c2d9]" size={24} />
              مانیتورینگ زنده
            </h3>
          </div>
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer group"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-[#1ea0fe] mt-2 shadow-[0_0_12px_#1ea0fe]"></div>
                <div>
                  <p className="text-sm font-black text-[#eef7fa] group-hover:text-white transition-colors">
                    درخواست انتقال مالکیت پلاک {500 + item}
                  </p>
                  <p className="text-[10px] text-[#61a5c2] mt-1 font-bold">
                    واحد حقوقی • {item * 10} دقیقه پیش
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-4 rounded-2xl bg-[#0179cf] text-white text-xs font-black hover:bg-[#1ea0fe] transition-all shadow-lg shadow-[#0179cf]/20">
            بررسی تمام هشدارها
          </button>
        </div>
      </div>

      {/* فعالیت‌های اخیر */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-black text-2xl text-[#012a4a] flex items-center gap-3">
          <Clock className="text-[#014f86]" size={26} />
          آخرین تراکنش‌های سیستمی
        </h3>
        <button className="text-[#0179cf] text-[11px] font-black border-b-2 border-[#0179cf]/20 hover:border-[#0179cf] transition-all pb-1">
          مشاهده لاگ کامل
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((item, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-[2rem] border border-[#cfe7f2] shadow-sm hover:translate-y-[-8px] transition-all duration-300 group"
          >
            <div className="flex items-center gap-5 mb-5">
              <div
                className={`p-4 rounded-2xl bg-[#eef7fa] ${item.statusColor} group-hover:bg-[#012a4a] group-hover:text-white transition-all duration-500 shadow-sm`}
              >
                {item.icon}
              </div>
              <div className="overflow-hidden">
                <div className="font-black text-[13px] text-[#012a4a] truncate">
                  {item.title}
                </div>
                <div className="text-[10px] text-[#61a5c2] flex items-center gap-1 font-bold mt-1">
                  <Clock size={12} /> {item.time}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between bg-[#f2fbfa] p-4 rounded-2xl border border-[#cfe7f2]/50">
              <span className="text-[11px] text-[#2c7da0] font-black">
                {item.detail}
              </span>
              <ArrowUpRight
                size={16}
                className="text-[#a9d6e5] group-hover:text-[#0179cf] transition-colors"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
