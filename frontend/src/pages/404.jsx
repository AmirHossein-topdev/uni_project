import React from "react";
import Link from "next/link";
// internal

const ErrorPage = () => {
  return (
    <section className="tp-error-area pt-110 pb-110">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-8 col-md-10">
            <div className="tp-error-content text-center">
              <div className="tp-error-thumb"></div>

              <h3 className="tp-error-title">Oops! Page not found</h3>
              <p>
                Whoops, this is embarrassing. Looks like the page you were
                looking for was not found.
              </p>

              <Link href="/" className="tp-error-btn">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;
