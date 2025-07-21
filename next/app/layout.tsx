import type { Viewport } from "next";
import { Locale, i18n } from '@/i18n.config'

import "./globals.css";

import { SlugProvider } from "./context/SlugContext";
import { ThemeProvider } from "@/components/theme-provider";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export async function generateStaticParams() {
  return i18n.locales.map(locale => ({ lang: locale }))
}

export default function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { lang: Locale }
}) {
  return (
    <html lang={params.lang} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <SlugProvider>
            {children}
          </SlugProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
