import "./globals.css";
import type { Metadata } from "next";
import CursorGlow from "./components/CursorGlow";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "AI Habit Tracker",
  description: "Beautiful AI-powered habit tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative min-h-screen bg-slate-950 text-white overflow-x-hidden">
        <CursorGlow />

        {}
        <div className="relative z-10">
          <Navbar />
          <main className="pt-16">{children}</main>
        </div>
      </body>
    </html>
  );
}
