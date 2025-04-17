import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "@/globals.css";
import { ViewTransitions } from "next-view-transitions";
import { Toaster } from "react-hot-toast";
import { commonMetadata } from "@/constants/metadata";
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
