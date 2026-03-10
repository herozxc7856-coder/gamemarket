import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexaTrade - Киберпанк Торговая Площадка",
  description: "Игровая торговая площадка в стиле киберпанк. Покупай и продавай игровые услуги, аккаунты и предметы с неоновой эстетикой.",
  keywords: ["NexaTrade", "gaming marketplace", "cyberpunk", "неон", "игровые услуги", "аккаунты", "скины"],
  authors: [{ name: "NexaTrade Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "NexaTrade - Киберпанк Торговая Площадка",
    description: "Игровая торговая площадка в стиле киберпанк",
    url: "https://nexatrade.com",
    siteName: "NexaTrade",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NexaTrade",
    description: "Киберпанк Торговая Площадка",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
