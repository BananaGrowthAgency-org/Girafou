"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Script from "next/script";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const BALOO = "var(--font-baloo)";
const NUNITO = "var(--font-nunito)";

// Widgets Elfsight « Google Reviews » du compte Girafou : les avis du parc et
// ceux filtrés sur les anniversaires.
export const REVIEWS_PARC = "fc0026c3-430b-48ad-bf69-1ef9c9a4ddc4";
export const REVIEWS_ANNIVERSAIRES = "519ebacd-1797-460e-9bef-8d84a96f0bf1";

// Brun intermédiaire entre --dark (#1C1008) et --giraffe-brown (#8B5E3C) :
// assez clair pour rester chaleureux, assez sombre pour que les cartes
// blanches des avis ressortent. Repris tel quel par les vagues de page.tsx.
export const SECTION_BG = "#3D2718";

/**
 * Section « avis Google », juste avant les infos pratiques.
 *
 * ⚠️ Le div Elfsight ne doit avoir AUCUN ancêtre animé : `platform.js` mesure
 * la position du conteneur, et un parent en `opacity: 0` / `transform` (même
 * résiduel) l'empêche de rendre les avis. L'en-tête est donc animé à part, en
 * *frère* du widget, et le conteneur du widget reste strictement statique.
 * Pour la même raison on n'utilise pas `data-elfsight-app-lazy` : le widget
 * monte dès que le script est là, sans dépendre de l'IntersectionObserver.
 */
export default function Reviews({
  t,
  appId,
}: {
  t: Dictionary["home"]["reviews"];
  /** UUID du widget Elfsight — `REVIEWS_PARC` ou `REVIEWS_ANNIVERSAIRES`. */
  appId: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative overflow-hidden" style={{ background: SECTION_BG }}>
      {/* Comète — seul décor de la section, en frère du widget (jamais ancêtre).
          Même vocabulaire que WhyGirafou : flottement 3D lent. */}
      <motion.div
        className="absolute pointer-events-none select-none z-0"
        style={{ right: "clamp(0.5rem, 6vw, 6rem)", top: "clamp(0.5rem, 3vw, 2.5rem)" }}
        initial={{ opacity: 0, x: 40 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          animate={{ y: [0, -14, -3, -10, 0], rotateZ: [0, -2, 0, 2, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ perspective: 900, transformStyle: "preserve-3d" }}
        >
          <motion.div
            animate={{ rotateY: [0, -8, 0, 8, 0], rotateX: [0, 4, 6, 2, 0], scale: [1, 1.04, 1.01, 1.03, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/comete.png"
              alt=""
              loading="lazy"
              style={{
                height: "clamp(46px, 9vw, 120px)",
                width: "auto",
                display: "block",
                filter: "drop-shadow(-3px 8px 14px rgba(245,166,35,0.35))",
              }}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-14 pb-8 sm:py-20">
        {/* ── En-tête (animé) ── */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10 sm:mb-12"
        >
          <p
            className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] mb-3"
            style={{ color: "#F472B6", fontFamily: NUNITO }}
          >
            {t.label}
          </p>
          <h2
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight"
            style={{ fontFamily: BALOO }}
          >
            <span
              style={{
                background: "linear-gradient(135deg, #F5A623 0%, #FF5722 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t.accent}
            </span>{" "}
            {t.rest}
          </h2>
          <p
            className="mt-4 text-base sm:text-lg text-white/60 max-w-xl mx-auto leading-relaxed"
            style={{ fontFamily: NUNITO }}
          >
            {t.subtitle}
          </p>
        </motion.div>

        {/* ── Widget Elfsight — conteneur volontairement sans animation ──
            `minHeight` réserve à peu près la hauteur d'une rangée de cartes,
            pour que la page ne saute pas quand le widget se rend. */}
        <div style={{ minHeight: 250 }}>
          <div className={`elfsight-app-${appId}`} />
        </div>
      </div>

      {/* `afterInteractive` : le widget est le contenu de la section, pas un
          extra — en `lazyOnload` le script partait en dernier et laissait un
          blanc visible le temps du chargement. */}
      <Script src="https://elfsightcdn.com/platform.js" strategy="afterInteractive" />
    </section>
  );
}
