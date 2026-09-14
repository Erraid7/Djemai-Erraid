import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/client/CustomCursor";
import { PreloadResources } from "@/components/client/PreloadResources";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const SITE_URL = "https://djemai-erraid.vercel.app/";
const NAME = "DJEMAI Mohamed Erraid";
const DESCRIPTION =
  "DJEMAI Mohamed Erraid -- freelance full-stack web developer and 4th-year Software Engineering (SIL) student at ESI Algiers. Portfolio built as a real API client: browse projects like ESI Flow, Khatma, and PharmaFlow.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${NAME} — Full-Stack Developer`,
    template: `%s — ${NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    "DJEMAI Mohamed Erraid",
    "Erraid",
    "full-stack developer",
    "freelance full-stack web developer",
    "freelance web developer Algeria",
    "ESI Algiers",
    "software engineer portfolio",
    "Next.js developer Algeria",
  ],
  authors: [{ name: NAME, url: SITE_URL }],
  creator: NAME,
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: `${NAME} — Portfolio`,
    title: `${NAME} — Full-Stack Developer`,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${NAME} — Full-Stack Developer`,
    description: DESCRIPTION,
  },
  icons: {
    icon: "/favicon.ico"
  },
};

export const viewport: Viewport = {
  themeColor: "#25282f",
  colorScheme: "dark",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "DJEMAI Mohamed Erraid",
  jobTitle: "Full-Stack Developer",
  url: SITE_URL,
  image:
    "https://res.cloudinary.com/umxjpowx/image/upload/v1785082721/AAFuWkQu2jM_1724670310462_jnsj7m.jpg",
  sameAs: [
    "https://github.com/Erraid7",
    "https://www.linkedin.com/in/djemai-mohamed-erraid-3835862b8/",
  ],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "École Nationale Supérieure d'Informatique (ESI), Algiers",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <PreloadResources />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
