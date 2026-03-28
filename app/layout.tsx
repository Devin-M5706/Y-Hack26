import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ERAC — Emergency Response Alerts for Cardiac Arrest",
  description:
    "Apple Watch detects cardiac arrest. Nearby strangers become first responders. Every second counts.",
  keywords: ["cardiac arrest", "CPR", "Apple Watch", "emergency response", "first responder"],
  openGraph: {
    title: "ERAC — Emergency Response Alerts for Cardiac Arrest",
    description: "The person next to you might need your help right now.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="bg-[#080808] text-white antialiased">{children}</body>
    </html>
  );
}
