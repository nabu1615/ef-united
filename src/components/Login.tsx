"use client";

import React, { Fragment } from "react";
import { SignIn } from "@clerk/nextjs";

function Login() {
  return (
    <Fragment>
      <p className="mb-8">
        <span className="text-5xl mx-2">🏆</span>
        <span className="ef-title text-5xl  font-bold">ef united</span>
      </p>
      <SignIn />
    </Fragment>
  );
}

export default Login;
