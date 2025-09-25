import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthSessionProvider from "../components/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://amala-atlas-oon3.vercel.app'),
  title: "Amala Atlas",
  description: "Discover the best amala spots around the world",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Amala Atlas",
    description: "Discover the best amala spots around the world",
    siteName: "Amala Atlas",
    type: "website",
    images: [
      { url: "/logo_dark.png?v=2", width: 1200, height: 630, alt: "Amala Atlas" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Amala Atlas",
    description: "Discover the best amala spots around the world",
    images: ["/logo_dark.png?v=2"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ea580c" />
        <meta name="color-scheme" content="dark light" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-primary text-primary-foreground px-3 py-2 rounded">Skip to content</a>
        <AuthSessionProvider>
          <main id="main">{children}</main>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
