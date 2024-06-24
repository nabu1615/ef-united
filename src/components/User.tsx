import React from "react";
import { Zen_Dots } from "next/font/google";
import Image from "next/image";

const zenDots = Zen_Dots({
  subsets: ["latin"],
  weight: "400",
});

export const User = ({ user }: { user: any }) => {
  return (
    <div className="flex items-center">
      {user && (
        <div className="rounded-full border-solid border-4 border-yellow-950 p-1">
          <Image
            width={64}
            height={64}
            src={user.team.image.url}
            alt={user.team.name}
          />
        </div>
      )}
      <p className={`ef-title text-slate-700 ml-4 ${zenDots.className}`}>
        EF United
      </p>
    </div>
  );
};
