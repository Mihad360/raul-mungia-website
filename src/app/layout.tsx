import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner"; // optional, for toast notifications
import { ReduxProvider } from "@/redux/ReduxProvider";
import envConfig from "@/config/envConfig";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    envConfig.baseUrl || "https://www.stxresearch.com",
  ),
  title: {
    default: "STX Research — Premium Research Peptides",
    template: "%s | STX Research",
  },
  description:
    "STX Research — premium research peptides for laboratory use. Verified purity, fast shipping.",
  applicationName: "STX Research",
  openGraph: {
    title: "STX Research — Premium Research Peptides",
    description:
      "Premium research peptides for laboratory use. Verified purity, fast shipping.",
    siteName: "STX Research",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "STX Research — Premium Research Peptides",
    description:
      "Premium research peptides for laboratory use. Verified purity, fast shipping.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font" suppressHydrationWarning>
        <ReduxProvider>
          <Toaster position="top-right" richColors />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
