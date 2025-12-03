import React from "react";
import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";
import ForgotArea from "@/components/login-register/forgot-area";

const ForgotPage = () => {
  return (
    <>
      <CommonBreadcrumb
        title="Forgot Password"
        subtitle="Reset Password"
        center={true}
      />
      <ForgotArea />
    </>
  );
};

export default ForgotPage;
