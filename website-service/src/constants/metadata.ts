import { JsonLd } from "jsonld/jsonld-spec";
import { Metadata } from "next";

// =========================================================================================================

export const baseUrl = "http://localhost";

// =========================================================================================================

export const jsonLd: JsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Laynz",
  url: `${baseUrl}/`,
  logo: `${baseUrl}/icon/logo.svg`,
  image: `${baseUrl}/img/websiteimg.png`,
  description: "Laynz...",
};

export const commonMetadata: Metadata = {
  applicationName: "Laynz",
  creator: "Bryan Cellier",
  metadataBase: new URL(`${baseUrl}/`),
  title: {
    template: "%s - Laynz",
    default: "Laynz",
  },
  authors: { name: "Bryan Cellier", url: `https://bryancellier.fr/` },
  openGraph: {
    title: "Laynz...",
    type: "website",
    url: `${baseUrl}/`,
    images: [
      {
        url: `${baseUrl}/img/websiteimg.png`,
        width: "1200",
        height: "630",
        alt: "Laynz - Redécouvrez le monde de la route.",
      },
    ],
    description: "...",
    siteName: "Akkor Hotel",
  },
  twitter: {
    card: "summary_large_image",
    site: "@laynz",
    title: "Laynz - Redécouvrez le monde de la route.",
    description: "...",
    creator: "@laynz",
    images: {
      width: "1200",
      height: "630",
      url: `${baseUrl}/img/websiteimg.png`,
      alt: "Laynz - Redécouvrez le monde de la route.",
    },
  },
};

// =========================================================================================================

export const homeMetadata: Metadata = {
  title: "Accueil",
  description: "Bienvenue sur Laynz...",
  keywords: "...",
  alternates: {
    canonical: `${baseUrl}/`,
  },
};

// =========================================================================================================

export const registerMetadata: Metadata = {
  title: "Inscription",
  description: "Inscrivez-vous pour accéder à votre espace personnel.",
  keywords: "inscription, signup, espace client",
  alternates: {
    canonical: `${baseUrl}/inscription`,
  },
};

// =========================================================================================================

export const loginMetadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre espace personnel pour gérer vos réservations et vos informations.",
  keywords: "connexion, login, espace client",
  alternates: {
    canonical: `${baseUrl}/connexion`,
  },
};

// =================================== PANEL (EMPLOYEE / ADMIN SECTION) ====================================

export const panelLoginMetadata: Metadata = {
  title: "Espace Employés",
  description: "Espace personnel des employés.",
  keywords: "connexion, login, espace client",
  alternates: {
    canonical: `${baseUrl}/panel/connexion`,
  },
};

// =========================================================================================================
