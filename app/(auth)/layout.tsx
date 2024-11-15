import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { dark } from "@clerk/themes";

export const metadata: Metadata = {
  title: "Threads",
  description: "Next JS Threads Application",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body
          className={`${inter.className} bg-dark-1 min-h-screen min-w-full flex items-center justify-center`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
