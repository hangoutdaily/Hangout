import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Hangout",
  description: "Because there is so much to life...",
  authors: [{ name: "Rushil Patel" }],
  icons: {
    icon: "https://example.com/icon.png",
    apple: "https://example.com/apple-icon.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
