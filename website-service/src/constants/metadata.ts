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
  title: "Carte",
  description: "Visualisez vos itinéraires sur une carte.",
  keywords: "carte, itinéraires, espace client",
  alternates: {
    canonical: `${baseUrl}/carte`,
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

// =========================================================================================================

export const itinerariesMetadata: Metadata = {
  title: "Mes itinéraires",
  description: "Gérez vos itinéraires enregistrés.",
  keywords: "itinéraires, itinéraire, espace client",
  alternates: {
    canonical: `${baseUrl}/itineraires`,
  },
};

// =========================================================================================================

export const profileMetadata: Metadata = {
  title: "Mon profil",
  description: "Gérez vos informations personnelles.",
  keywords: "profil, espace client",
  alternates: {
    canonical: `${baseUrl}/profil`,
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

export const incidentsMetadata: Metadata = {
  title: "Incidents",
  description: "Signalez un incident sur la route.",
  keywords: "incidents, itinéraires, espace client",
  alternates: {
    canonical: `${baseUrl}/incidents`,
  },
};

// =========================================================================================================

export const dashboardMetadata: Metadata = {
  title: "Tableau de bord",
  description: "Consultez les statistiques de vos itinéraires.",
  keywords: "statistiques, itinéraires, espace client, tableau de bord",
  alternates: {
    canonical: `${baseUrl}/tableau-de-bord`,
  },
};

// =========================================================================================================
