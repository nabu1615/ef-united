import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkLoaded, ClerkLoading, ClerkProvider } from '@clerk/nextjs'
import { dark } from "@clerk/themes";
import Loader from '@/components/Loader';
import { esES } from '@/utils/login-localization-es';
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>
          <ClerkProvider localization={esES} appearance={{
            elements: {
              footer: "hidden",
              form: "hidden",
              dividerText: "hidden",
            },
            baseTheme: dark
          }}>
            <ClerkLoading>
              <Loader />
            </ClerkLoading>
            <ClerkLoaded>
              {children}
            </ClerkLoaded>

          </ClerkProvider>
        </main>
      </body>
    </html>
  )
}
