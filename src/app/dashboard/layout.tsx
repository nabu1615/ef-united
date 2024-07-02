import React from "react";
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
