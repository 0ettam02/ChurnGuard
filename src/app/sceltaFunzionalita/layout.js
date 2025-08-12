import { Geist, Geist_Mono } from "next/font/google";

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
  applicationName: "SaaS Churn Palestre",
  metadataBase: new URL(siteUrl),
  title: {
    default: "Scelta Funzionalità",
    template: "%s | Funzionalità | SaaS Churn Palestre",
  },
  description: "Pagina dedicata alla scelta delle funzionalità della piattaforma.",
  alternates: {
    canonical: "/sceltaFunzionalita",
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: `${siteUrl}/sceltaFunzionalita`,
    siteName: "SaaS Churn Palestre",
    title: "Scelta Funzionalità",
    description: "Seleziona le funzionalità per la tua analisi di churn.",
    images: [
      {
        url: "/churnLogo.svg",
        width: 1200,
        height: 630,
        alt: "Scelta Funzionalità",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Scelta Funzionalità",
    description: "Seleziona le funzionalità per la tua analisi di churn.",
    images: ["/churnLogo.svg"],
  },
  robots: {
    index: process.env.NODE_ENV === "production",
    follow: process.env.NODE_ENV === "production",
  },
  keywords: ["funzionalità", "churn", "palestra", "analisi", "saas"],
};

export default function RootLayout({ children }) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      {children}
    </div>
  );
}
