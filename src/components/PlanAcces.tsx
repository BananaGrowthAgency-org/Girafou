"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";

import { TEXT_OUTLINE, TEXT_OUTLINE_SOFT } from "@/lib/text";

import type { Dictionary } from "@/lib/i18n/dictionaries";

const BALOO = "var(--font-baloo)";
const NUNITO = "var(--font-nunito)";
const BROWN = "#5A3520";
const RED = "#C0392B";
const AMBER = "#F5A623";

const GPS = "+49° 14′ 59.77″, -0° 16′ 50.32″";
const MAPS_LINK = "https://www.google.com/maps/search/?api=1&query=49.24994,-0.28064";
const MAPS_EMBED = "https://maps.google.com/maps?q=49.24994,-0.28064&z=12&output=embed";

/* ── Icônes SVG (pas d'emojis) ── */
const IconRoute = (p: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}>
    <circle cx="6" cy="19" r="3" /><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" /><circle cx="18" cy="5" r="3" />
  </svg>
);
const IconPin = (p: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconPhone = (p: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
  </svg>
);
const IconCrosshair = (p: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}>
    <circle cx="12" cy="12" r="9" /><line x1="12" y1="2" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="22" /><line x1="2" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="22" y2="12" /><circle cx="12" cy="12" r="2.5" />
  </svg>
);
const IconExternal = (p: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}>
    <path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
);

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

export default function PlanAcces({ t }: { t: Dictionary["pages"]["planAcces"] }) {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);
  const it = t.itineraires[active];

  return (
    <>
      {/* ── Hero avec photo ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/plan-dacces-hero/hero.jpg"
            alt="Entrée du parc Girafou à Bénouville"
            fill
            priority
            sizes="(max-width: 768px) 200vw, 100vw"
            className="object-cover object-[center_25%]"
          />
          {/* Overlay pour la lisibilité du texte */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(28,16,8,0.72) 0%, rgba(28,16,8,0.5) 55%, rgba(245,166,35,0.45) 100%)" }} />
        </div>

        <div ref={heroRef} className="relative max-w-3xl mx-auto px-6 py-24 sm:py-32 text-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1, y: [0, -8, 0] } : { opacity: 0 }}
            transition={{ opacity: { duration: 0.5 }, y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white text-sm font-bold mb-4"
            style={{ fontFamily: NUNITO }}
          >
            <IconRoute className="w-4 h-4" /> {t.badge}
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="text-4xl sm:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg" style={{ fontFamily: BALOO, textShadow: TEXT_OUTLINE }}>
            {t.titleStart}<span style={{ color: "#FFD23F" }}>{t.titleAccent}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="text-lg text-white/85 max-w-xl mx-auto drop-shadow" style={{ fontFamily: NUNITO, textShadow: TEXT_OUTLINE_SOFT }}>
            {t.subtitle}
          </motion.p>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none leading-[0]">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[60px]">
            <path d="M0,50 C360,90 720,10 1080,40 C1260,55 1380,45 1440,40 L1440,80 L0,80 Z" fill="#FFFDF5" />
          </svg>
        </div>
      </section>

      <div style={{ background: "#FFFDF5" }}>
        <div className="max-w-6xl mx-auto px-6 py-14 space-y-16">

          {/* ── Carte + adresse flottante ── */}
          <Reveal className="relative">
            <div className="rounded-[2rem] overflow-hidden shadow-xl border border-amber-100">
              <iframe
                src={MAPS_EMBED}
                title={t.mapTitle}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-[340px] sm:h-[440px] lg:h-[520px] border-0 block"
              />
            </div>

            {/* Carte adresse — flotte sur la carte en desktop, empilée en mobile */}
            <div className="mt-5 lg:mt-0 lg:absolute lg:bottom-6 lg:left-6 lg:w-[380px] rounded-3xl bg-white/95 backdrop-blur-sm shadow-2xl border border-amber-100 p-6">
              <h2 className="text-2xl font-extrabold mb-4" style={{ fontFamily: BALOO, color: BROWN }}>{t.addressTitle}</h2>
              <ul className="space-y-3.5" style={{ fontFamily: NUNITO }}>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#FFF3D0", color: RED }}><IconPin className="w-5 h-5" /></span>
                  <span className="text-sm sm:text-[15px] text-amber-900/85 leading-snug font-semibold">
                    <span className="font-extrabold" style={{ color: BROWN }}>Le Girafou</span><br />
                    ZA Clos de la Hogue<br />14970 Bénouville
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#FFF3D0", color: RED }}><IconCrosshair className="w-5 h-5" /></span>
                  <span className="text-xs sm:text-sm text-amber-900/70 font-semibold">{t.gps}&nbsp;: {GPS}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#FFF3D0", color: RED }}><IconPhone className="w-5 h-5" /></span>
                  <a href="tel:0231537268" className="text-sm sm:text-[15px] font-bold text-amber-900/85 hover:text-orange-500 transition-colors">02 31 53 72 68</a>
                </li>
              </ul>
              <div className="mt-5 flex gap-2.5">
                <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-extrabold shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer" style={{ background: RED, fontFamily: NUNITO }}>
                  <IconExternal className="w-4 h-4" /> {t.route}
                </a>
                <a href="tel:0231537268" className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-extrabold border-2 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer" style={{ borderColor: RED, color: RED, fontFamily: NUNITO }}>
                  <IconPhone className="w-4 h-4" /> {t.call}
                </a>
              </div>
            </div>
          </Reveal>

          {/* ── Itinéraires : onglets + timeline ── */}
          <Reveal>
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ fontFamily: BALOO, color: BROWN }}>{t.howToTitle}</h2>
              <span className="block w-14 h-1 rounded-full mx-auto mt-3" style={{ background: RED }} />
            </div>

            {/* Onglets (pills) */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {t.itineraires.map((route, i) => {
                const on = i === active;
                return (
                  <button
                    key={route.short}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={on}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm sm:text-base font-extrabold transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
                    style={on
                      ? { background: RED, color: "#fff", boxShadow: "0 8px 20px rgba(192,57,43,0.28)", fontFamily: NUNITO }
                      : { background: "#fff", color: BROWN, border: `2px solid ${AMBER}55`, fontFamily: NUNITO }}
                  >
                    <IconPin className="w-4 h-4" /> {route.short}
                  </button>
                );
              })}
            </div>

            {/* Timeline de l'itinéraire actif */}
            <div className="max-w-2xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="text-center text-sm font-bold uppercase tracking-widest mb-7" style={{ color: RED, fontFamily: NUNITO }}>
                    {it.from}
                  </p>
                  <ol className="relative ml-5 border-l-2 border-dashed" style={{ borderColor: `${AMBER}80` }}>
                    {it.steps.map((s, si) => (
                      <li key={si} className="relative pl-8 pb-7 last:pb-0">
                        <span
                          className="absolute -left-[1.15rem] -top-0.5 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-extrabold shadow-md"
                          style={{ background: "linear-gradient(135deg, #F5A623 0%, #FF5722 100%)", fontFamily: BALOO }}
                        >
                          {si + 1}
                        </span>
                        <div className="rounded-2xl bg-white shadow-sm border border-amber-100 px-4 py-3">
                          <p className="text-sm sm:text-base text-amber-900/85 leading-snug" style={{ fontFamily: NUNITO }}>{s}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>

          {/* ── Accessibilité PMR ──
              Le parc ne publie aucune information sur ses conditions d'accès :
              on n'affirme donc rien ici (ni accessible, ni non accessible) et
              on renvoie vers l'accueil, seul à pouvoir répondre au cas par cas. */}
          <Reveal>
            <div className="max-w-2xl mx-auto mt-14 rounded-3xl bg-white shadow-lg border border-amber-100 p-6 sm:p-7">
              <h2 className="text-xl sm:text-2xl font-extrabold mb-2" style={{ fontFamily: BALOO, color: BROWN }}>
                {t.pmrTitle}
              </h2>
              <p className="text-sm sm:text-base text-amber-900/75 leading-snug mb-5" style={{ fontFamily: NUNITO }}>
                {t.pmrText}
              </p>
              <div className="flex flex-wrap gap-2.5">
                <a
                  href="tel:0231537268"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-extrabold shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  style={{ background: RED, fontFamily: NUNITO }}
                >
                  <IconPhone className="w-4 h-4" /> 02 31 53 72 68
                </a>
                <a
                  href="mailto:contact@girafou.com"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-extrabold border-2 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  style={{ borderColor: RED, color: RED, fontFamily: NUNITO }}
                >
                  contact@girafou.com
                </a>
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </>
  );
}
