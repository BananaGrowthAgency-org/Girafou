import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { fontVariables } from "@/lib/fonts";
import { LOCALES, hasLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import "../globals.css";

const GTM_ID = "GTM-TG7BSX8F";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://girafou.com";

const OG_LOCALE: Record<Locale, string> = { fr: "fr_FR", en: "en_GB" };

// Root layout du site public. Le panneau /admin a le sien (second root layout) :
// il vit hors de [lang] et n'est jamais traduit.
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return {
    metadataBase: new URL(SITE_URL),
    // Valeurs de repli : chaque page fournit ses propres title/description
    // (og:title / og:description en héritent alors). L'image OG est référencée
    // explicitement : le fichier vit dans app/ (hors du segment [lang]), donc la
    // détection automatique de Next ne s'y rattache pas — on la déclare ici pour
    // que toutes les pages (qui héritent de ce openGraph) émettent bien og:image.
    title: dict.site.title,
    description: dict.site.description,
    keywords: dict.site.keywords,
    openGraph: {
      siteName: "Girafou",
      locale: OG_LOCALE[lang],
      type: "website",
      images: [{ url: "/opengraph-image.jpg", width: 1200, height: 524, alt: dict.site.title }],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/twitter-image.jpg"],
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html lang={lang} className="h-full">
      <head>
        <Script id="gtm-script" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      </head>
      <body className={`${fontVariables} min-h-full antialiased`}>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
