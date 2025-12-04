import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@/components/analytics";
import { Providers } from "@/components/providers";
import { JsonLd } from "@/components/json-ld";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://faregalo.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "FareGalo - Gift Planning Made Simple",
    template: "%s | FareGalo",
  },
  description:
    "Track gift ideas, manage budgets, and never forget a special occasion. FareGalo helps you organize thoughtful gifts for everyone you love.",
  applicationName: "FareGalo",
  authors: [{ name: "FareGalo Team" }],
  generator: "Next.js",
  keywords: [
    "gift planning",
    "gift tracker",
    "gift ideas",
    "holiday gifts",
    "birthday gifts",
    "gift organizer",
    "gift list",
    "gift budgeting",
    "family gift planning",
    "christmas gift list",
  ],
  referrer: "origin-when-cross-origin",
  creator: "FareGalo",
  publisher: "FareGalo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  category: "productivity",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "FareGalo",
    title: "FareGalo - Gift Planning Made Simple",
    description:
      "Track gift ideas, manage budgets, and never forget a special occasion.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FareGalo - Gift Planning Made Simple",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FareGalo - Gift Planning Made Simple",
    description:
      "Track gift ideas, manage budgets, and never forget a special occasion.",
    images: ["/og-image.png"],
    creator: "@faregalo", // Placeholder, update if real handle exists
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#8b5cf6" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "FareGalo",
            url: baseUrl,
            logo: `${baseUrl}/icon-512.png`,
            sameAs: [
              "https://twitter.com/faregalo", // Placeholder
              "https://github.com/faregalo", // Placeholder
            ],
            description:
              "FareGalo helps you organize thoughtful gifts for everyone you love.",
          }}
        />
        <Providers>
          {children}
          <Toaster />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
