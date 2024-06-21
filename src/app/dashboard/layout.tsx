import { UserButton } from "@clerk/nextjs";
import { getPersonInfo, getTeams } from "@/utils/api";
import React, { Fragment } from "react";
import { currentUser } from "@clerk/nextjs";
import { Md3, Team } from "@/types/api";
import Header from "@/components/Header";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard w-full">
      <div className="m-4 flex items-center">
        <Header />
      </div>
      <div className="flex flex-col items-center">{children}</div>
    </div>
  );
}
