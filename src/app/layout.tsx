import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import { esES } from "@/utils/login-localization-es";

// Components
import Loader from "@/components/Loader";

// Fonts
const inter = Inter({ subsets: ["latin"] });

// Globals
import "./globals.css";
import { Fragment } from "react";

export const metadata: Metadata = {
  title: "EF United",
  description: "Registra tus Md3s de forma eficiente",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const mantenance = process.env.NEXT_PUBLIC_TURN_OFF_APP;

  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>
      <body className={inter.className}>
        <main className="flex flex-col items-center min-h-screen">
          <ClerkProvider
            localization={esES}
            appearance={{
              elements: {
                footer: "hidden",
                form: "hidden",
                dividerText: "hidden",
                dividerRow: "hidden",
              },
            }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <ClerkLoading>
                <Loader />
              </ClerkLoading>
            </div>

            <ClerkLoaded>{children}</ClerkLoaded>
          </ClerkProvider>
        </main>
      </body>
    </html>
  );
}
