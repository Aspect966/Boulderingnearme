import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Header } from "@/components/header";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BoulderingNearMe — Find Outdoor Boulders",
    template: "%s | BoulderingNearMe",
  },
  description:
    "Discover outdoor boulders near you. Add problems, upload photos, rate difficulty on multiple scales, and build community consensus grades.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full`}>
      <body className="min-h-full bg-stone-50 font-[family-name:var(--font-outfit)] text-stone-900 antialiased">
        <Header />
        <main>{children}</main>
        <footer className="border-t border-stone-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p>BoulderingNearMe.com — community-powered outdoor bouldering</p>
            <p>Grades use outlier-filtered consensus · Default V-Scale</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
