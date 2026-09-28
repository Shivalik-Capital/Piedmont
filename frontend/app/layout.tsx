import type { Metadata } from "next";
import "./globals.css";
import PWARegister from "./components/PWARegister";
import LayoutWrapper from "./components/layout/LayoutWrapper";

export const metadata: Metadata = {
  metadataBase: new URL('https://piedmont-two.vercel.app'),
  title: "PIEDMONT | Institutional Financial Intelligence",
  description: "Institutional-grade macroeconomic intelligence for the Indian markets. Real-time indices, RBI policy rates, GDP, CPI, and company financials.",
  keywords: ["Indian stock market", "Nifty 50", "Macroeconomics India", "RBI Repo Rate", "FII DII data", "Indian equities", "Financial dashboard"],
  authors: [{ name: "Piedmont Intelligence" }],
  creator: "Piedmont",
  publisher: "Piedmont",
  alternates: {
    canonical: '/',
    languages: {
      'en-IN': '/',
      'en': '/',
    }
  },
  openGraph: {
    title: "PIEDMONT | Institutional Financial Intelligence",
    description: "Institutional-grade macroeconomic intelligence for the Indian markets. Real-time indices, RBI policy rates, GDP, CPI, and company financials.",
    url: 'https://piedmont-two.vercel.app',
    siteName: 'Piedmont Terminal',
    images: [
      {
        url: '/icon.svg',
        width: 512,
        height: 512,
        alt: 'Piedmont Logo',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "PIEDMONT | Institutional Financial Intelligence",
    description: "Institutional-grade macroeconomic intelligence for the Indian markets.",
    images: ['/icon.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/icon.svg' }
    ]
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "google-site-verification=placeholder",
  },
  other: {
    "geo.region": "IN",
    "geo.placename": "India",
    "geo.position": "20.5937;78.9629",
    "ICBM": "20.5937, 78.9629"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className="dark h-full antialiased">
      
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Piedmont Terminal",
              "url": "https://piedmont-two.vercel.app",
              "description": "Institutional-grade macroeconomic intelligence for the Indian markets.",
              "publisher": {
                "@type": "Organization",
                "name": "Piedmont Intelligence",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://piedmont-two.vercel.app/icon.svg"
                }
              },
              "inLanguage": "en-IN"
            })
          }}
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <PWARegister />
                <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
