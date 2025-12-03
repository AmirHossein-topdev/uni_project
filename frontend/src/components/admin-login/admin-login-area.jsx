"use client";
import React from "react";
import Link from "next/link";
import { BsExclamationTriangle } from "react-icons/bs";
import AdminLoginForm from "../forms/AdminLoginForm";

const tips = [
  "از <span class='font-bold'>مرورگر های مطمئن و بروز</span> مانند گوگل کروم و فایرفاکس استفاده کنید.",
  "<span class='font-bold'>رمز عبور</span> خود را در فواصل زمانی کوتاه تغییر دهید.",
  "پس از انجام و اتمام کار، حتما از سیستم <span class='font-black'>خارج</span> شوید.",
  "هرگز <span class='font-bold'>نام کاربری و گذرواژه</span> خود را در اختیار دیگران قرار ندهید.",
];

export default function AdminLoginArea() {
  return (
    <section className="relative min-h-screen bg-gray-50 flex flex-col lg:flex-row h-screen">
      {/* right */}
      <section className="w-full lg:w-3/4 p-6 lg:p-20">
        {/* logo */}
        <img
          src="/assets/img/logo.png"
          alt=""
          className="h-14 md:h-18  object-fill mx-auto md:ms-0 mb-5"
        />

        {/* warning */}
        <div className="mt-12 lg:mt-72 bg-amber-200 border-l-4 border-amber-500 text-amber-900 p-4 rounded-lg gap-3 w-full lg:w-1/2 hidden md:flex">
          <p className="text-lg leading-relaxed">
            <span className="inline-flex items-center font-light text-amber-700">
              <BsExclamationTriangle className="mr-1 ml-1 h-5 w-5" />
            </span>
            کاربر گرامی، به منظور ارتقاء سطح امنیت حساب کاربری توصیه میگردد،
            مولفه امنیتی ورود دو مرحله ای از طریق پیامک را در سیستم
            <span className="font-bold text-blue-700"> پروفایل کاربری </span>
            از منو فعالسازی ورود دو مرحله ای فعال نمایید.
          </p>
        </div>

        {/* tips */}
        <ul className="space-y-4 mt-8 lg:mt-32 hidden md:block">
          {tips.map((item, i) => (
            <li key={i} className="flex items-center gap-3">
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-900 text-white font-bold">
                {i + 1}
              </span>
              <h3
                className="text-black text-lg"
                dangerouslySetInnerHTML={{ __html: item }}
              />
            </li>
          ))}
        </ul>
        {/* form */}
        <div className="md:fixed inset-0 flex items-center justify-center z-50 p-4 mt-10 mb-5">
          <AdminLoginForm />
        </div>

        {/* social medias */}
        <div className=" mx-auto md:ms-0 mt-2 lg:mt-82 bg-blue-800 rounded-2xl flex flex-wrap justify-evenly items-center w-fit gap-4 lg:gap-10 py-2 px-10">
          <Link
            href="https://t.me/yourUsername"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500"
          >
            <img src="/assets/img/logo/telegram.png" alt="" className="h-8" />
          </Link>
          <Link
            href="https://wa.me/yourNumber"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-500"
          >
            <img src="/assets/img/logo/whatsapp.png" alt="" className="h-8" />
          </Link>
          <Link
            href="https://instagram.com/yourUsername"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-500"
          >
            <img src="/assets/img/logo/instagram.png" alt="" className="h-9" />
          </Link>
          <Link href="https://bale.ai/">
            <img
              src="/assets/img/logo/bale-color.png"
              alt="bale"
              className="h-6"
            />
          </Link>
          <Link href="https://web.eaita.com/">
            <img
              src="/assets/img/logo/eitaa-icon-colorful.png"
              alt="bale"
              className="h-6"
            />
          </Link>
        </div>

        {/* copyright */}
        <p className="text-black mt-2 lg:mt-5 text-base text-center md:text-right lg:text-xl">
          پورتال رسمی سازمان تامین اجتماعی: www.tamin.ir | مرکز تماس شبانه‌روزی:
          1420 | شبکه‌های اجتماعی: tamin_media@
        </p>
      </section>

      {/* left */}
      <section className="w-full lg:w-4/5 hidden md:block">
        <img
          src="/assets/img/taminLoginPic1.png"
          alt=""
          className="h-64 sm:h-96 lg:h-screen w-full object-cover"
        />
      </section>
    </section>
  );
}
