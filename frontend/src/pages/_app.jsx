import { useRouter } from "next/router";
import store from "@/redux/store";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ReactModal from "react-modal";
// مسیرهای استایل عمومی

import "../styles/globals.css";
import "../styles/dashboard.css";

import { useEffect } from "react";

const stripePromise = loadStripe(
  "pk_test_51M6BIWJiVHIFxYwiOXHKzmHAXm3QBTPca0ewQcX55zju2j0RNqj1wvQUI0GVE2B3Yvx94h7lvKFqC5dS8HhMoatY00ox5oPPtM"
);

const NEXT_PUBLIC_GOOGLE_CLIENT_ID =
  "768004342999-p4ivhapdmh7sm1pv02vft691vlt9d38n.apps.googleusercontent.com";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      ReactModal.setAppElement("body");
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId={NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <Elements stripe={stripePromise}>
          <Component {...pageProps} />
        </Elements>
      </Provider>
    </GoogleOAuthProvider>
  );
}
