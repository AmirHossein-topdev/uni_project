import { useRouter } from "next/router";
import store from "@/redux/store";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ReactModal from "react-modal";
import { useEffect } from "react";

import "../styles/globals.css";
import "../styles/dashboard.css";

const NEXT_PUBLIC_GOOGLE_CLIENT_ID =
  "768004342999-p4ivhapdmh7sm1pv02vft691vlt9d38n.apps.googleusercontent.com";

// مسیرهایی که نیاز به لاگین ندارن
const publicRoutes = ["/"];

export default function App({ Component, pageProps }) {
  const router = useRouter();

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
  }, [router.pathname]);

  return (
    <GoogleOAuthProvider clientId={NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </GoogleOAuthProvider>
  );
}
