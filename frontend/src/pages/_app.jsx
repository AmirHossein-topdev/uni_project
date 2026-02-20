"use client";

import { useRouter } from "next/router";
import store from "@/redux/store";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ReactModal from "react-modal";
import { useEffect, useState } from "react";

import "../styles/globals.css";
import "../styles/dashboard.css";

const NEXT_PUBLIC_GOOGLE_CLIENT_ID =
  "768004342999-p4ivhapdmh7sm1pv02vft691vlt9d38n.apps.googleusercontent.com";

// مسیرهایی که نیاز به لاگین ندارن
const publicRoutes = ["/"];

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // loader state برای نمایش لودر سراسری هنگام تغییر مسیر
  const [loading, setLoading] = useState(false);

  // تنظیم ReactModal
  useEffect(() => {
    if (typeof window !== "undefined") {
      ReactModal.setAppElement("body");
    }
  }, []);

  // 🔐 گارد احراز هویت
  useEffect(() => {
    if (typeof window === "undefined") return;

    const user = sessionStorage.getItem("user");
    const isPublicRoute = publicRoutes.includes(router.pathname);

    if (!user && !isPublicRoute) {
      router.replace("/");
    }
    // فقط وابسته به مسیر هست (اگر بخوای می‌تونیم user رو هم اضافه کنیم)
  }, [router.pathname]);

  // مدیریت رویدادهای Router برای لودر سراسری
  useEffect(() => {
    const handleStart = (url) => {
      // می‌توانی شرط بزاری که برای مسیرهای خاص loader نمایش داده نشه
      setLoading(true);
    };
    const handleComplete = (url) => {
      setLoading(false);
    };
    const handleError = (err) => {
      setLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleError);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleError);
    };
  }, [router.events]);

  // inline style برای لودر — ساده و بدون وابستگی اضافه
  const overlayStyle = {
    position: "fixed",
    inset: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(255,255,255,0.75)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1050,
    pointerEvents: "auto",
    backdropFilter: "blur(4px)",
  };

  const spinnerStyle = {
    width: 60,
    height: 60,
    borderRadius: "50%",
    border: "6px solid rgba(1,79,134,0.12)",
    borderTop: "6px solid #1b4965",
    animation: "spin 1s linear infinite",
  };

  // small text under spinner
  const spinnerTextStyle = {
    marginTop: 12,
    color: "#012a4a",
    fontWeight: 800,
    fontSize: 13,
    letterSpacing: 0.6,
    textAlign: "center",
  };

  return (
    <GoogleOAuthProvider clientId={NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        {/* Global loader overlay */}
        {loading && (
          <>
            <div style={overlayStyle} aria-hidden="true">
              <div className="flex flex-col items-center">
                <div style={spinnerStyle} />
                <div style={spinnerTextStyle}>در حال بارگذاری...</div>
              </div>
            </div>
            {/* keyframes با styled-jsx global برای انیمیشن چرخش */}
            <style jsx global>{`
              @keyframes spin {
                to {
                  transform: rotate(360deg);
                }
              }
            `}</style>
          </>
        )}

        {/* کامپوننت صفحه */}
        <Component {...pageProps} />
      </Provider>
    </GoogleOAuthProvider>
  );
}
