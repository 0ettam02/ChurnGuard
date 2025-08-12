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
    default: "Modello Dinamico Dataset",
    template: "%s | Dataset | SaaS Churn Palestre",
  },
  description:
    "Modello di predizione dell'abbandono dinamico basato su dataset personalizzati.",
  alternates: {
    canonical: "/modelloDataset",
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: `${siteUrl}/modelloDataset`,
    siteName: "SaaS Churn Palestre",
    title: "Modello Dinamico Dataset",
    description:
      "Carica i tuoi dati e ottieni previsioni di churn personalizzate.",
    images: [
      {
        url: "/churnLogo.svg",
        width: 1200,
        height: 630,
        alt: "Modello Dinamico Dataset",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Modello Dinamico Dataset",
    description:
      "Carica i tuoi dati e ottieni previsioni di churn personalizzate.",
    images: ["/churnLogo.svg"],
  },
  robots: {
    index: process.env.NODE_ENV === "production",
    follow: process.env.NODE_ENV === "production",
  },
  keywords: [
    "dataset",
    "churn",
    "personalizzato",
    "palestre",
    "saas",
  ],
};

export default function RootLayout({ children }) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      {children}
    </div>
  );
}
