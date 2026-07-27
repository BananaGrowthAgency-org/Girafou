"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const BALOO = "var(--font-baloo)";
const NUNITO = "var(--font-nunito)";

// Section « Programme de fidélité » de la home. Fond blanc pour enchaîner avec
// Birthday (blanc) au-dessus et la vague vers les avis en dessous.
export default function Fidelite({ t }: { t: Dictionary["home"]["fidelite"] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-10 sm:py-20 overflow-hidden" style={{ background: "#ffffff" }}>
      {/* Halo doré discret */}
      <div
        className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(245,166,35,0.14) 0%, transparent 70%)", filter: "blur(60px)" }}
      />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid lg:grid-cols-2 gap-5 lg:gap-10 items-center rounded-[2rem] overflow-hidden shadow-xl border border-amber-100"
          style={{ background: "linear-gradient(135deg, #FFF7E6 0%, #FFEFC4 100%)" }}
        >
          {/* Photo — le mur peint Girafou (cadré sur le nom du parc) */}
          <div className="relative h-36 sm:h-52 lg:h-full lg:min-h-[420px]">
            <Image
              src="/images/fidelite/carte.jpg"
              alt="Le mur peint du parc Girafou"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              style={{ objectPosition: "center 46%" }}
            />
          </div>

          {/* Contenu */}
          <div className="px-7 sm:px-10 pt-6 pb-7 sm:py-10">
            <motion.span
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-200 text-amber-700 text-xs font-extrabold uppercase tracking-wide"
              style={{ fontFamily: NUNITO }}
            >
              ⭐ {t.badge}
            </motion.span>

            <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-900 leading-tight" style={{ fontFamily: BALOO }}>
              {t.title}
            </h2>

            {/* Équation 1 € = 1 point — sur une seule ligne */}
            <div className="mt-5 flex items-center gap-2 whitespace-nowrap">
              <span className="px-3.5 py-2 rounded-xl bg-white shadow-md font-extrabold text-amber-900 text-sm sm:text-lg" style={{ fontFamily: BALOO }}>
                {t.spend}
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-amber-500" style={{ fontFamily: BALOO }}>=</span>
              <span className="px-3.5 py-2 rounded-xl text-white shadow-md font-extrabold text-sm sm:text-lg" style={{ background: "linear-gradient(135deg, #F5A623, #FF5722)", fontFamily: BALOO }}>
                {t.point}
              </span>
            </div>

            {/* Récompense 100 points → entrée offerte */}
            <div className="mt-4 flex items-center gap-3.5 rounded-2xl bg-white px-5 py-4 shadow-md border-2 border-amber-200">
              <span className="flex-shrink-0 text-3xl" aria-hidden="true">🎟️</span>
              <p style={{ fontFamily: NUNITO }}>
                <span className="font-extrabold text-lg sm:text-xl" style={{ color: "#E8400C", fontFamily: BALOO }}>{t.rewardValue}</span>
                <span className="mx-1.5 font-extrabold text-amber-400">→</span>
                <span className="font-extrabold text-amber-900 text-sm sm:text-base">{t.rewardText}</span>
              </p>
            </div>

            <p className="mt-5 text-sm sm:text-base font-semibold text-amber-900/65 leading-relaxed" style={{ fontFamily: NUNITO }}>
              {t.extra}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
