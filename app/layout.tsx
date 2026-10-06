import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  axes: ["opsz"], // variable font has an optical-size axis; without this it's silently dropped
});

export const metadata: Metadata = {
  title: "Alpha Motion CMS",
  description: "Internal admin for Alpha Motion's site content.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col overflow-x-hidden font-[family-name:var(--font-dm-sans)]">
        {children}
      </body>
    </html>
  );
}
