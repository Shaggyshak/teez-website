import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Teez — AI Underwriting Inside Your Spreadsheet",
  description:
    "The only AI-powered CRE underwriting that lives inside Excel and Google Sheets. Rent roll in, full pro-forma out. Multi-asset types. Half the price of alternatives.",
  openGraph: {
    title: "Teez — AI Underwriting Inside Your Spreadsheet",
    description:
      "AI-powered CRE underwriting that lives inside Excel and Google Sheets. Multi-asset types at half the price.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
