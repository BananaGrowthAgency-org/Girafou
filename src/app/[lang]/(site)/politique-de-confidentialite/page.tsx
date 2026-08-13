import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LegalPage, { type LegalSection } from "@/components/LegalPage";
import { alternates } from "@/lib/i18n/seo";

export function generateMetadata(): Metadata {
  return {
  title: "Politique de confidentialité | Girafou",
  description: "Politique de confidentialité du site Girafou : données personnelles, droits d'accès et cookies.",
    // Page française uniquement : pas d'alternate anglais (la version
    // n'existe pas), seulement le canonical français.
    alternates: alternates("fr", "/politique-de-confidentialite"),
  };
}

const sections: LegalSection[] = [
  {
    heading: "Données personnelles",
    paragraphs: [
      "Les fichiers nominatifs qui font l'objet d'un traitement informatisé sur ce site ont été déclarés à la Commission Nationale Informatique et Liberté (récépissé de déclaration CNIL N°1929152 V0 du 10 février 2016).",
      "En application de la loi Informatique et Libertés n°78-17 du 6 janvier 1978, vous disposez d'un droit d'accès, d'opposition et de rectification des données vous concernant.",
      "Vous pouvez à tout moment exercer ce droit en adressant votre demande par écrit auprès du Service Consommateur à l'adresse suivante :\nGirafou — ZA Clos de la Hogue, 14970 Bénouville\ncontact@girafou.com",
    ],
  },
  {
    heading: "Cookies",
    paragraphs: [
      "Les utilisateurs sont informés que lors de leurs visites sur ce site, des cookies (éléments ne permettant pas de les identifier mais servant à enregistrer des informations sur leur navigation) peuvent s'installer automatiquement sur leur logiciel de navigation. Sont alors recueillies de manière automatique des données non nominatives, le plus souvent à usage statistique, concernant la navigation sur le site de Girafou par son utilisateur.",
      "Les utilisateurs sont informés de la présence de ces cookies, de la possibilité qui leur est offerte de les refuser et du fait que la désactivation des cookies peut techniquement limiter leur accès à tout ou partie du site. Il est par ailleurs possible de désactiver les cookies en paramétrant son navigateur.",
      "Tout utilisateur du site https://girafou.com reconnaît avoir pris connaissance des mentions légales d'information ci-dessus exposées et les avoir acceptées.",
    ],
  },
];

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <Navbar />
      <main>
        <LegalPage
          title="Politique de"
          highlight="confidentialité"
          subtitle="Comment nous traitons vos données personnelles et notre usage des cookies."
          sections={sections}
        />
      </main>
      <Footer waveColor="#FFFDF5" />
    </>
  );
}
