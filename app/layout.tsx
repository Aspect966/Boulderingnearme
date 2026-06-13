import type { Metadata } from "next";
import Link from "next/link";
import { Outfit } from "next/font/google";
import { Header } from "@/components/header";
import { LEGAL } from "@/components/legal-document";
import { ThemeProvider } from "@/components/theme-provider";
import { themeInitScript } from "@/lib/theme";
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
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript() }} />
      </head>
      <body className="min-h-full font-[family-name:var(--font-outfit)] antialiased">
        <ThemeProvider>
          <Header />
          <main>{children}</main>
          <footer className="themed-footer border-t">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-stone-500 sm:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p>BoulderingNearMe.com — community-powered outdoor bouldering</p>
              <p>Grades use outlier-filtered consensus · Default V-Scale</p>
            </div>
            <nav className="flex flex-wrap gap-x-4 gap-y-1">
              <Link href="/terms" className="hover:text-stone-700 hover:underline">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-stone-700 hover:underline">
                Privacy Policy
              </Link>
            </nav>
            <p className="text-xs text-stone-400">
              By using {LEGAL.siteName}, you agree to our Terms and Privacy Policy.
            </p>
          </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
