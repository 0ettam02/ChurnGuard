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
    default: "Modello Predittivo",
    template: "%s | Modello | SaaS Churn Palestre",
  },
  description:
    "Pagina dedicata al modello di predizione della perdita di clienti (churn) per palestre.",
  alternates: {
    canonical: "/modello",
  },
  openGraph: {
    type: "article",
    locale: "it_IT",
    url: `${siteUrl}/modello`,
    siteName: "SaaS Churn Palestre",
    title: "Modello Predittivo",
    description:
      "Spiega e mostra il modello per prevedere l'abbandono degli iscritti.",
    images: [
      { url: "/churnLogo.svg", width: 1200, height: 630, alt: "Modello Predittivo" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Modello Predittivo",
    description:
      "Spiega e mostra il modello per prevedere l'abbandono degli iscritti.",
    images: ["/churnLogo.svg"],
  },
  robots: {
    index: process.env.NODE_ENV === "production",
    follow: process.env.NODE_ENV === "production",
  },
  keywords: [
    "modello",
    "churn",
    "palestre",
    "machine learning",
    "previsione abbandono",
  ],
};

export default function RootLayout({ children }) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      {children}
    </div>
  );
}
