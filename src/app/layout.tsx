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

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex flex-col items-center min-h-screen justify-center">
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
            <ClerkLoading>
              <Loader />
            </ClerkLoading>
            <ClerkLoaded>{children}</ClerkLoaded>
          </ClerkProvider>
        </main>
      </body>
    </html>
  );
}
