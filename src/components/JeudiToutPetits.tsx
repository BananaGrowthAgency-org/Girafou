"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { RESERVATION_URL } from "@/lib/anniversaires";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { TEXT_OUTLINE_THIN, TEXT_OUTLINE_THIN_SOFT, TITLE_YELLOW } from "@/lib/text";

const BALOO = "var(--font-baloo)";
const NUNITO = "var(--font-nunito)";

// Bandeau « Jeudi des tout-petits » — offre récente que le parc pousse.
// Placé juste après le hero : c'est la première chose vue après le pli.
// Le fond reprend le #FFF8E1 sur lequel s'ouvre la section Activités, pour
// s'insérer entre les deux sans couture.
const POINT_ICONS = ["🕥", "🎟️", "🤗"];

export default function JeudiToutPetits({ t }: { t: Dictionary["home"]["toddler"] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    // Pas de fond propre : le bandeau vit à l'intérieur de la section Activités
    // et hérite de son dégradé, sinon une ligne de raccord apparaît entre les deux.
    <div className="relative px-4 sm:px-5 pb-14">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-[88rem] mx-auto rounded-3xl overflow-hidden shadow-xl"
        style={{ background: "linear-gradient(135deg, #F5A623 0%, #FF5722 100%)" }}
      >
        {/* Pastilles décoratives — même vocabulaire que le reste du site */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.14]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1.5px, transparent 1.5px)", backgroundSize: "28px 28px" }}
        />

        <div className="relative px-6 sm:px-10 py-7 text-center">
          <motion.span
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/35 text-white text-xs font-extrabold uppercase tracking-wide mb-2.5"
            style={{ fontFamily: NUNITO, textShadow: TEXT_OUTLINE_THIN_SOFT }}
          >
            {t.badge}
          </motion.span>

          <h2
            className="text-2xl sm:text-4xl font-extrabold mb-2 leading-tight"
            style={{ fontFamily: BALOO, color: TITLE_YELLOW, textShadow: TEXT_OUTLINE_THIN }}
          >
            {t.title}
          </h2>
          <p
            className="text-white font-semibold text-sm sm:text-base max-w-3xl mx-auto mb-5"
            style={{ fontFamily: NUNITO, textShadow: TEXT_OUTLINE_THIN_SOFT }}
          >
            {t.text}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 max-w-4xl mx-auto">
            {t.points.map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.15 + i * 0.08 }}
                className="flex items-center justify-center gap-3 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 px-4 py-2"
              >
                <span className="text-xl flex-shrink-0" aria-hidden="true">{POINT_ICONS[i]}</span>
                <div className="text-left">
                  <p className="text-white font-extrabold text-base leading-tight" style={{ fontFamily: BALOO, textShadow: TEXT_OUTLINE_THIN }}>
                    {p.label}
                  </p>
                  {/* Lisibilité gagnée par la graisse (bold), pas par la taille :
                      la tuile garde ses dimensions et « Parents, mamies,
                      nounous… » tient sur une seule ligne. */}
                  <p className="text-white font-bold text-sm leading-tight whitespace-pre-line" style={{ fontFamily: NUNITO, textShadow: TEXT_OUTLINE_THIN_SOFT }}>
                    {p.sub}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <a
            href={RESERVATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-shine inline-block px-9 py-3 rounded-2xl bg-white font-extrabold text-base shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
            style={{ color: "#E8400C", fontFamily: NUNITO }}
          >
            {t.cta}
          </a>
        </div>
      </motion.div>
    </div>
  );
}
