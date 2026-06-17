import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";

export const metadata: Metadata = {
  metadataBase: new URL("https://riderafrica.com"),

  title: {
    default: "Rider Africa — On-Demand Delivery & Transport in Namibia | Windhoek",
    template: "%s | Rider Africa Namibia",
  },
  description:
    "Rider Africa is Namibia's #1 on-demand delivery and transport app. Same-day parcel delivery, safe passenger rides, grocery delivery, and valuables courier across Windhoek and all of Namibia. Download free on iOS & Android.",

  keywords: [
    // Brand
    "Rider Africa", "RiderAfrica", "Rider Africa app", "Rider Africa Namibia",
    // Delivery — Namibia / Windhoek
    "delivery Namibia", "delivery Windhoek", "parcel delivery Namibia",
    "courier Namibia", "courier Windhoek", "same-day delivery Windhoek",
    "package delivery Namibia", "on-demand delivery Namibia",
    // Transport
    "transport Windhoek", "taxi app Namibia", "ride hailing Namibia",
    "passenger transport Namibia", "airport transfer Windhoek",
    // Grocery
    "grocery delivery Windhoek", "grocery delivery Namibia",
    "food delivery Namibia", "essentials delivery Windhoek",
    // Logistics / Africa
    "logistics Namibia", "logistics Windhoek", "on-demand logistics Africa",
    "delivery app Southern Africa", "transport app Africa",
    "courier app Windhoek", "business delivery Namibia",
    // Geo
    "Windhoek", "Namibia", "Southern Africa", "Swakopmund delivery",
    "Walvis Bay delivery", "Oshakati delivery", "Africa on-demand",
  ],

  authors: [{ name: "Rider Africa", url: "https://riderafrica.com" }],
  creator: "Rider Africa",
  publisher: "Rider Africa",

  openGraph: {
    type: "website",
    locale: "en_NA",
    url: "https://riderafrica.com",
    siteName: "Rider Africa",
    title: "Rider Africa — On-Demand Delivery & Transport in Namibia",
    description:
      "Same-day parcel delivery, safe passenger rides, grocery delivery and valuables courier across Windhoek and Namibia. Proudly Namibian. Download free on iOS & Android.",
  },

  twitter: {
    card: "summary_large_image",
    site: "@riderafrica",
    creator: "@riderafrica",
    title: "Rider Africa — Delivery & Transport in Namibia",
    description:
      "Namibia's leading on-demand delivery & transport platform. Windhoek and beyond. Free on iOS & Android.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://riderafrica.com",
  },

  other: {
    "geo.region": "NA-KH",
    "geo.placename": "Windhoek, Khomas, Namibia",
    "geo.position": "-22.5594;17.0832",
    ICBM: "-22.5594, 17.0832",
    "theme-color": "#0073FF",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Rider Africa",
    "application-name": "Rider Africa",
    "msapplication-TileColor": "#0073FF",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD structured data for local business SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": "https://riderafrica.com",
              name: "Rider Africa Logistics (Proprietary) Limited",
              legalName: "Rider Africa Logistics (Proprietary) Limited",
              identifier: "20250760",
              description:
                "Namibia's leading on-demand delivery and transport platform. Same-day parcel delivery, passenger transport, grocery delivery across Windhoek and Namibia.",
              url: "https://riderafrica.com",
              logo: "https://riderafrica.com/logo.png",
              image: "https://riderafrica.com/logo.png",
              telephone: "+264814698594",
              email: "admin@riderafrica.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "695 Vrede Rede, Mondesa",
                addressLocality: "Swakopmund",
                addressRegion: "Erongo",
                postalCode: "22000",
                addressCountry: "NA",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: -22.5594,
                longitude: 17.0832,
              },
              areaServed: [
                { "@type": "City", name: "Windhoek" },
                { "@type": "City", name: "Swakopmund" },
                { "@type": "City", name: "Walvis Bay" },
                { "@type": "Country", name: "Namibia" },
              ],
              serviceType: [
                "Parcel Delivery",
                "Passenger Transport",
                "Grocery Delivery",
                "Courier Service",
              ],
              sameAs: [
                "https://www.instagram.com/rider_africa_pty_ltd",
                "https://www.facebook.com/share/17N4hjiTe3/?mibextid=wwXIfr",
                "https://www.linkedin.com/company/riderafrica",
                "https://apps.apple.com/na/app/riderafrica/id6741062391",
                "https://play.google.com/store/apps/details?id=com.riderafricaapp.riderafrica",
              ],
              hasApp: [
                {
                  "@type": "MobileApplication",
                  name: "Rider Africa",
                  operatingSystem: "iOS",
                  applicationCategory: "TravelApplication",
                  downloadUrl: "https://apps.apple.com/na/app/riderafrica/id6741062391",
                },
                {
                  "@type": "MobileApplication",
                  name: "Rider Africa",
                  operatingSystem: "Android",
                  applicationCategory: "TravelApplication",
                  downloadUrl:
                    "https://play.google.com/store/apps/details?id=com.riderafricaapp.riderafrica",
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1 page-enter">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
