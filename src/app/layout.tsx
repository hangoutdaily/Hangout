import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import { ThemeProvider } from "@/contexts/ThemeContext";

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
        <ThemeProvider>
          <Header />
          <main className="pb-16 md:pb-0">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
