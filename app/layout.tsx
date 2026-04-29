import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cynthia Faye | The Gift — Psychic Medium & Spiritual Coach",
  description:
    "Experience a luxury psychic reading with Cynthia Faye. More than 45 years of experience. Diamond, Signature, and Crossover readings available. Serving Santa Rosa Beach, Destin, and Panama City Beach, FL.",
  keywords: "psychic reading, medium, spiritual coach, Santa Rosa Beach FL, Destin, Panama City Beach, Cynthia Faye",
  openGraph: {
    title: "Cynthia Faye | The Gift — Psychic Medium & Spiritual Coach",
    description: "Experience a luxury psychic reading with Cynthia Faye. More than 45 years of experience.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="noise-overlay">{children}</body>
    </html>
  );
}
