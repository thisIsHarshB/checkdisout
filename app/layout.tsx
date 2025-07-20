import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'CheckDisOut - Achievement Aggregator',
    template: '%s | CheckDisOut',
  },
  description: 'Track and showcase your achievements, participations, and projects',
  openGraph: {
    title: 'CheckDisOut - Achievement Aggregator',
    description: 'Track and showcase your achievements, participations, and projects',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'CheckDisOut',
    images: [
      {
        url: '/public/globe.svg',
        width: 1200,
        height: 630,
        alt: 'CheckDisOut',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: '/',
    shortcut: '/',
    apple: '/',
  },
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
