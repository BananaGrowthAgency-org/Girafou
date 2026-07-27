"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useLocalePath } from "@/lib/i18n/useLocale";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { PACKS_URL } from "@/lib/anniversaires";
import BeachClub from "./BeachClub";

// Mise en forme des horaires : quelle ligne est une fermeture (en rouge) et
// laquelle est mise en avant (Jeudi des tout-petits). Même ordre que le
// dictionnaire — les textes, eux, sont traduits.
const HOUR_STYLES = [
  { closed: true },
  {},
  { highlight: true },
  {},
  {},
  {},
];

// Icônes et couleurs des repères rapides ; `strong` = une des deux règles du
// parc, encadrée plus visiblement.
const TIP_STYLES = [
  { icon: "🧦", color: "#F5A623", strong: true },
  { icon: "🚫", color: "#C0392B", strong: true },
  { icon: "🚗", color: "#00897B" },
  { icon: "♿", color: "#0284C7" },
];

export default function PracticalInfo({
  t,
  beach,
}: {
  t: Dictionary["home"]["practical"];
  beach: Dictionary["pages"]["prix"]["beach"];
}) {
  const lp = useLocalePath();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const starsOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section ref={sectionRef} id="infos" className="relative pt-12 pb-16 sm:py-24 overflow-hidden spots-pattern" style={{ background: "linear-gradient(to bottom, #FFF8E1 0%, #FFE8A0 100%)" }}>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative text-center mb-14"
        >
          {/* Star left */}
          <motion.div
            className="absolute pointer-events-none select-none z-10"
            style={{ left: "-1rem", top: "-8%", opacity: starsOpacity }}
          >
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                animate={{ y: [0, -14, -3, -10, 0], rotateZ: [0, -3, 0, 3, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ perspective: 900, transformStyle: "preserve-3d" }}
              >
                <motion.div
                  animate={{ rotateY: [0, -8, 0, 8, 0], rotateX: [0, 4, 6, 2, 0], scale: [1, 1.05, 1.01, 1.04, 1] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/etoile-1.png" alt="" loading="lazy" style={{ height: "clamp(24px, 4vw, 56px)", width: "auto", display: "block", filter: "drop-shadow(-3px 8px 14px rgba(245,166,35,0.35))" }} />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Star right */}
          <motion.div
            className="absolute pointer-events-none select-none z-10 top-2 right-2 lg:top-[30%] lg:right-8"
            style={{ opacity: starsOpacity }}
          >
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                animate={{ y: [0, -12, -5, -16, 0], rotateZ: [0, 3, 0, -3, 0] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ perspective: 900, transformStyle: "preserve-3d" }}
              >
                <motion.div
                  animate={{ rotateY: [0, 8, 0, -8, 0], rotateX: [0, 3, 7, 2, 0], scale: [1, 1.04, 1.02, 1.05, 1] }}
                  transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/etoile-2.png" alt="" loading="lazy" style={{ height: "clamp(22px, 4vw, 56px)", width: "auto", display: "block", filter: "drop-shadow(3px 8px 14px rgba(245,166,35,0.35))" }} />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
          <motion.span
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-sm font-bold mb-4"
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            {t.badge}
          </motion.span>
          <h2
            className="text-5xl md:text-6xl font-extrabold text-amber-900"
            style={{ fontFamily: "var(--font-baloo)" }}
          >
            {t.titleStart}{" "}
            <span className="text-giraffe">{t.titleAccent}</span>
          </h2>
        </motion.div>


        {/* Mise en page en 3 bandes : repères rapides, puis horaires/tarifs,
            puis adresse/carte. Chaque bande a deux colonnes de hauteur égale —
            la carte ne s'étire donc plus pour compenser une colonne trop haute. */}
        <div className="space-y-6">

          {/* ── Bande 1 — repères rapides ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {t.tips.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                className="bg-white rounded-2xl p-5 border-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                style={{ borderColor: TIP_STYLES[i].color + (TIP_STYLES[i].strong ? "80" : "30") }}
              >
                <div className="text-3xl mb-2">{TIP_STYLES[i].icon}</div>
                <h4
                  className="font-extrabold text-sm mb-0.5"
                  style={{ fontFamily: "var(--font-baloo)", color: TIP_STYLES[i].color }}
                >
                  {tip.label}
                </h4>
                <p className="text-xs text-amber-800/50" style={{ fontFamily: "var(--font-nunito)" }}>{tip.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* ── Bande 2 — horaires + tarifs ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Hours card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-3xl p-8 shadow-xl shadow-amber-50 border border-amber-100"
            >
              <h3
                className="text-2xl font-extrabold text-amber-900 mb-6"
                style={{ fontFamily: "var(--font-baloo)" }}
              >
                {t.hoursTitle}
              </h3>
              <div className="space-y-0 divide-y divide-amber-50">
                {t.hours.map((h, i) =>
                  HOUR_STYLES[i].highlight ? (
                    // Jeudi des tout-petits — sorti du flux en carte colorée.
                    <div key={i} className="py-3">
                      <div
                        className="rounded-2xl px-4 py-3 border-2"
                        style={{ background: "#FFF4E0", borderColor: "#F5A62360" }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                          <span className="flex items-center gap-2 font-extrabold text-amber-900" style={{ fontFamily: "var(--font-nunito)" }}>
                            <span aria-hidden="true">🍼</span>
                            {h.day}
                            <span
                              className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide text-white"
                              style={{ background: "#C0392B" }}
                            >
                              {t.new}
                            </span>
                          </span>
                          <span className="font-extrabold text-sm sm:text-base" style={{ fontFamily: "var(--font-baloo)", color: "#E05A2F" }}>
                            {h.time}
                          </span>
                        </div>
                        <p className="text-xs text-amber-800/70 mt-1" style={{ fontFamily: "var(--font-nunito)" }}>
                          {h.note}
                        </p>
                      </div>
                    </div>
                  ) : HOUR_STYLES[i].closed ? (
                    // Fermeture : même ligne que les autres (pas d'encart, qui
                    // entrerait en concurrence avec celui du Jeudi), mais en
                    // rouge pour qu'on ne la lise pas comme une ouverture.
                    <div key={i} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-2 py-3.5">
                      <div>
                        <span className="font-bold" style={{ fontFamily: "var(--font-nunito)", color: "#C0392B" }}>{h.day}</span>
                        <p className="text-xs text-amber-800/55" style={{ fontFamily: "var(--font-nunito)" }}>{h.note}</p>
                      </div>
                      <span className="font-extrabold text-sm sm:text-base uppercase tracking-wide" style={{ fontFamily: "var(--font-baloo)", color: "#C0392B" }}>
                        {h.time}
                      </span>
                    </div>
                  ) : (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 py-3.5">
                      <span className="font-bold text-amber-800" style={{ fontFamily: "var(--font-nunito)" }}>{h.day}</span>
                      <span className="font-extrabold text-amber-500 text-sm sm:text-base" style={{ fontFamily: "var(--font-baloo)" }}>{h.time}</span>
                    </div>
                  )
                )}
              </div>
            </motion.div>

            {/* Tarifs card — extrait, le détail est sur /prix-des-entrees */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="flex flex-col bg-white rounded-3xl p-8 shadow-xl shadow-amber-50 border border-amber-100"
            >
              <h3
                className="text-2xl font-extrabold text-amber-900 mb-5"
                style={{ fontFamily: "var(--font-baloo)" }}
              >
                {t.pricesTitle}
              </h3>
              <div className="space-y-0 divide-y divide-amber-50 mb-5">
                {t.prices.map((p, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 py-3">
                    <span className="font-bold text-amber-800" style={{ fontFamily: "var(--font-nunito)" }}>{p.label}</span>
                    <span className="font-extrabold text-amber-500 text-sm sm:text-base whitespace-nowrap" style={{ fontFamily: "var(--font-baloo)" }}>{p.price}</span>
                  </div>
                ))}
              </div>

              {/* Packs d'entrées à tarif préférentiel — mis en avant (fond ambré,
                  chaque pack renvoie vers sa vente sur Qweekle). */}
              <div className="mb-5 rounded-2xl border-2 border-amber-200 bg-amber-50/70 p-4">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-giraffe/10 text-giraffe text-xs font-extrabold uppercase tracking-wide mb-3"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  🎟️ {t.passes.badge}
                </span>
                <div className="space-y-2">
                  {t.passes.items.map((pack, i) => (
                    <a
                      key={i}
                      href={PACKS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 rounded-xl bg-white border border-amber-100 px-3 py-2.5 shadow-sm hover:border-amber-300 hover:-translate-y-0.5 transition-all"
                    >
                      <span className="min-w-0">
                        <span className="block font-extrabold text-amber-900 text-sm" style={{ fontFamily: "var(--font-baloo)" }}>{pack.n}</span>
                        <span className="block text-xs text-amber-800/60" style={{ fontFamily: "var(--font-nunito)" }}>{pack.note}</span>
                      </span>
                      <span className="font-extrabold text-giraffe text-base sm:text-lg whitespace-nowrap" style={{ fontFamily: "var(--font-baloo)" }}>{pack.price}</span>
                    </a>
                  ))}
                </div>
              </div>

              <p className="text-xs text-amber-800/55 mb-4" style={{ fontFamily: "var(--font-nunito)" }}>
{t.pricesNote}
              </p>
              {/* mt-auto : les boutons restent collés en bas même si la carte
                  s'étire pour s'aligner sur celle des horaires. */}
              <div className="mt-auto flex flex-wrap items-center gap-3">
                <Link
                  href={lp("/prix-des-entrees")}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 font-bold text-sm hover:bg-white hover:border-amber-300 transition-all"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  {t.allPrices}
                </Link>
                <a
                  href={PACKS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-shine inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-bold text-sm shadow-lg hover:-translate-y-0.5 transition-all"
                  style={{ background: "linear-gradient(135deg, #F5A623, #FF5722)", fontFamily: "var(--font-nunito)" }}
                >
                  🎟️ {t.book}
                </a>
              </div>
            </motion.div>
          </div>

          {/* ── Bande 3 — adresse + carte ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Address card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col bg-white rounded-3xl p-8 shadow-xl shadow-amber-50 border border-amber-100"
            >
              <h3
                className="text-2xl font-extrabold text-amber-900 mb-5"
                style={{ fontFamily: "var(--font-baloo)" }}
              >
                {t.findUs}
              </h3>
              {/* Deux sites distincts : le parc couvert (toute l'année) et le
                  club de plage estival. Adresses identiques au footer. */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🏠</span>
                  <div>
                    <p className="font-bold text-amber-900" style={{ fontFamily: "var(--font-nunito)" }}>{t.parkName}</p>
                    <p className="text-sm text-amber-800/70" style={{ fontFamily: "var(--font-nunito)" }}>{t.parkAddress}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🏖️</span>
                  <div>
                    <p className="font-bold text-amber-900" style={{ fontFamily: "var(--font-nunito)" }}>{t.beachName}</p>
                    <p className="text-sm text-amber-800/70" style={{ fontFamily: "var(--font-nunito)" }}>{t.beachAddress}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mt-auto">
                <a
                  href="tel:0231537268"
                  className="btn-shine flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-bold text-sm shadow-lg hover:-translate-y-0.5 transition-all"
                  style={{ background: "linear-gradient(135deg, #F5A623, #FF5722)", fontFamily: "var(--font-nunito)" }}
                >
                  📞 02 31 53 72 68
                </a>
                <a
                  href="mailto:contact@girafou.com"
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 font-bold text-sm hover:bg-white hover:border-amber-300 transition-all"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  ✉️ contact@girafou.com
                </a>
              </div>
            </motion.div>

            {/* Map — l'iframe est en absolute pour remplir la tuile sans imposer
                sa propre hauteur : la carte s'aligne sur la fiche adresse. */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="relative rounded-3xl overflow-hidden shadow-xl border border-amber-100 min-h-[300px]"
            >
              <iframe
                src="https://maps.google.com/maps?q=Girafou,+ZA+Clos+de+la+Hogue,+14970+B%C3%A9nouville,+France&output=embed&z=15"
                className="absolute inset-0 w-full h-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Girafou Bénouville"
              />
            </motion.div>
          </div>

          {/* ── Girafou Plage (Ouistreham) — sous « Nous trouver » ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <BeachClub t={beach} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
