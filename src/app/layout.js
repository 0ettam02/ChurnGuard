import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "SaaS Churn Palestre",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  keywords: [
    "churn",
    "palestra",
    "fitness",
    "saas",
    "retention clienti",
    "machine learning",
    "analisi abbandono",
  ],
  authors: [{ name: "SaaS Churn Palestre" }],
  creator: "SaaS Churn Palestre",
  publisher: "SaaS Churn Palestre",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: "technology",
  title: {
    default: "SaaS Churn Palestre",
    template: "%s | SaaS Churn Palestre",
  },
  description:
    "Piattaforma per analizzare e ridurre l'abbandono clienti delle palestre con modelli predittivi.",
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: siteUrl,
    siteName: "SaaS Churn Palestre",
    title: "SaaS Churn Palestre",
    description:
      "Analisi churn per palestre: insight, modelli predittivi e azioni per ridurre l'abbandono.",
    images: [
      {
        url: "/churnLogo.svg",
        width: 1200,
        height: 630,
        alt: "SaaS Churn Palestre",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaS Churn Palestre",
    description:
      "Analisi churn per palestre: insight, modelli predittivi e azioni per ridurre l'abbandono.",
    images: ["/churnLogo.svg"],
  },
  robots: {
    index: process.env.NODE_ENV === "production",
    follow: process.env.NODE_ENV === "production",
    googleBot: {
      index: process.env.NODE_ENV === "production",
      follow: process.env.NODE_ENV === "production",
      noimageindex: false,
    },
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111827",
  colorScheme: "dark light",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
