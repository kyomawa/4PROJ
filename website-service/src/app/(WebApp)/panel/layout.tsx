import type { Metadata } from "next";
import { Sora } from "next/font/google";
import { commonMetadata } from "@/constants/metadata";
import "@/globals.css";
import { Toaster } from "react-hot-toast";
import { ViewTransitions } from "next-view-transitions";
import NextTopLoader from "nextjs-toploader";

// =============================================================================================

const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });

export const metadata: Metadata = commonMetadata;

// =============================================================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="fr">
        <body className={`${sora.className} ${sora.variable} antialiased`}>
          {/* Manifest of the website */}
          <link rel="manifest" href="/manifests/manifestapp.json" />
          {/* Loading Bar */}
          <NextTopLoader color="#695bf9" zIndex={10} showSpinner={false} />
          {/* Content */}
          {children}
          {/* Toast  */}
          <Toaster />
        </body>
      </html>
    </ViewTransitions>
  );
}

// =============================================================================================
