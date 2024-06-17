"use client";

import React from "react";
import { SignIn } from "@clerk/nextjs";
import { Zen_Dots } from "next/font/google";

const zenDots = Zen_Dots({
  subsets: ["latin"],
  weight: "400",
});

function Login() {
  return (
    <div className="min-h-screen w-full flex justify-center flex-col items-center bg-yellow-950">
      <div>
        <p className="bg-white pt-8 pb-0 relative top-8 z-10 rounded-lg text-center text-3xl">
          <span className="mx-2 mb-2 text-xl block">🎮 🏆 ⚽️</span>
          <p className={`ef-title text-slate-700 ${zenDots.className}`}>
            EF United
          </p>
        </p>
        <SignIn />
      </div>
    </div>
  );
}

export default Login;
