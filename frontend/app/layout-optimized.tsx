import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from 'react';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Optimize font loading
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Vibe Bar - Craft Your Perfect Cocktail",
  description: "AI-powered cocktail recipes tailored to your taste, ingredients, and mood",
  keywords: ["cocktail", "recipe", "AI", "mixology", "drinks", "bartender"],
  authors: [{ name: "Vibe Bar Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#d97706", // Amber-600
  manifest: "/manifest.json",
  openGraph: {
    title: "Vibe Bar - Craft Your Perfect Cocktail",
    description: "AI-powered cocktail recipes tailored to your taste, ingredients, and mood",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibe Bar - Craft Your Perfect Cocktail",
    description: "AI-powered cocktail recipes tailored to your taste, ingredients, and mood",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Loading component for Suspense boundaries
function AppLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-amber-700">
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-amber-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading Vibe Bar...
        </div>
      </div>
    </div>
  )
}

// Client boundary wrapper - import dynamically to reduce initial bundle
import dynamic from 'next/dynamic'

const ClientApp = dynamic(
  () => import('../components/client-app-wrapper'),
  {
    loading: () => <AppLoading />,
    ssr: false, // This component contains client-only logic
  }
)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Critical CSS will be inlined by Next.js */}
        
        {/* Prefetch for better performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        
        {/* Viewport meta tag for mobile optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#d97706" />
        
        {/* Apple touch icon */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="antialiased">
        {/* Wrap the entire app in Suspense for streaming */}
        <Suspense fallback={<AppLoading />}>
          <ClientApp />
        </Suspense>
        
        {/* Performance monitoring script (development only) */}
        {process.env.NODE_ENV === 'development' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Web Vitals monitoring
                if ('PerformanceObserver' in window) {
                  const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                      console.log('[Web Vitals]', entry.name, entry.value);
                    }
                  });
                  observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] });
                }
              `,
            }}
          />
        )}
      </body>
    </html>
  );
} 