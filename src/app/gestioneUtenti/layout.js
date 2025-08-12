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
    default: "Gestione Utenti",
    template: "%s | Gestione Utenti | SaaS Churn Palestre",
  },
  description:
    "Pagina dedicata al modello di gestione automatica degli utenti a rischio abbandono.",
  alternates: {
    canonical: "/gestioneUtenti",
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: `${siteUrl}/gestioneUtenti`,
    siteName: "SaaS Churn Palestre",
    title: "Gestione Utenti",
    description:
      "Automatizza le azioni per trattenere gli iscritti a rischio abbandono.",
    images: [
      { url: "/churnLogo.svg", width: 1200, height: 630, alt: "Gestione Utenti" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gestione Utenti",
    description:
      "Automatizza le azioni per trattenere gli iscritti a rischio abbandono.",
    images: ["/churnLogo.svg"],
  },
  robots: {
    index: process.env.NODE_ENV === "production",
    follow: process.env.NODE_ENV === "production",
  },
  keywords: [
    "gestione utenti",
    "churn",
    "palestra",
    "retention",
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
