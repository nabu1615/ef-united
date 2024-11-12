import React from "react";
import { Zen_Dots } from "next/font/google";

const zenDots = Zen_Dots({
  subsets: ["latin"],
  weight: "400",
});

export const User = ({ user }: { user: any }) => {
  return (
    <div className="flex items-center">
      <p className={`ef-title text-slate-700 ml-4 ${zenDots.className}`}>
        {user?.name} - {user?.userName} - EF United
      </p>
    </div>
  );
};
