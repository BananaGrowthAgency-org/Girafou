"use client";

import { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useLocalePath } from "@/lib/i18n/useLocale";
import { ui } from "@/lib/i18n/ui";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { FORMULES } from "@/lib/anniversaires";

// Les formules (slug, lien Qweekle, illustration, couleurs) viennent de
// `lib/anniversaires.ts` : les dupliquer ici avait déjà fait diverger un lien
// de réservation. Seule la teinte de bordure, propre à cette carte, reste ici.
const CARD_BORDER: Record<string, string> = {
  "formule-du-lion": "#FFE082",
  "ptits-gourmands": "#FFCCBC",
  "gira-fun-karaoke": "#DDD6FE",
};

const formulas = FORMULES.map((f) => ({
  slug: f.slug,
  reserveUrl: f.reserveUrl,
  color: f.accent,
  bg: f.soft,
  border: CARD_BORDER[f.slug] ?? `${f.accent}40`,
  image: f.illustration,
  highlight: Boolean(f.highlight),
}));

function FormulaCard({
  f,
  i,
  inView,
  t,
  prix,
}: {
  f: typeof formulas[0];
  i: number;
  inView: boolean;
  t: Dictionary["home"]["birthday"];
  prix: string;
}) {
  const lp = useLocalePath();
  const texte = t.formulas[f.slug];
  const name = ui(useLocale()).names.formules[f.slug];
  const [err, setErr] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 55 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.15 + i * 0.15 }}
      className={`relative rounded-3xl overflow-visible border-2 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col ${f.highlight ? "scale-[1.03]" : ""}`}
      style={{ background: f.bg, borderColor: f.border }}
    >
      {f.highlight && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <span
            className="px-4 py-1.5 rounded-full text-white text-xs font-extrabold shadow-lg"
            style={{ background: f.color, fontFamily: "var(--font-nunito)" }}
          >
            {t.popular}
          </span>
        </div>
      )}

      {/* Image complète sans crop */}
      <div className="rounded-t-3xl overflow-hidden" style={{ background: f.bg }}>
        {!err ? (
          <Image
            src={f.image}
            alt={name}
            width={420}
            height={420}
            className="w-full h-auto"
            onError={() => setErr(true)}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="h-56 img-placeholder" style={{ background: f.bg }}>
            <span className="text-4xl opacity-30">🎂</span>
            <span className="text-xs opacity-50">{name}</span>
          </div>
        )}
      </div>

      {/* Info + boutons */}
      <div className="px-6 pt-4 pb-6 flex flex-col gap-1 flex-1">
        <h3
          className="text-2xl font-extrabold leading-tight"
          style={{ color: f.color, fontFamily: "var(--font-baloo)" }}
        >
          {name}
        </h3>
        <p className="text-sm font-semibold text-amber-800/60" style={{ fontFamily: "var(--font-nunito)" }}>{texte.sub}</p>
        <p className="text-xs text-amber-800/45" style={{ fontFamily: "var(--font-nunito)" }}>⏰ {texte.horaire}</p>

        {/* Le prix est aussi dans l'illustration, mais en pixels : le doubler en
            texte le rend lisible par les lecteurs d'écran et indexable. */}
        <p className="mb-4 mt-2 flex items-baseline gap-1.5" style={{ fontFamily: "var(--font-nunito)" }}>
          <span className="text-2xl font-extrabold" style={{ color: f.color, fontFamily: "var(--font-baloo)" }}>
            {prix}
          </span>
          <span className="text-xs font-semibold text-amber-800/55">{t.perChild}</span>
        </p>

        <div className="flex gap-3 mt-auto">
          <a
            href={f.reserveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-shine flex-1 py-3 rounded-2xl text-center text-white font-extrabold text-sm shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
            style={{ background: f.color, fontFamily: "var(--font-nunito)" }}
          >
            {t.book}
          </a>
          <Link
            href={lp(`/anniversaires/${f.slug}`)}
            className="flex-1 py-3 rounded-2xl text-center font-extrabold text-sm border-2 hover:scale-[1.02] transition-all duration-200"
            style={{ borderColor: f.color, color: f.color, fontFamily: "var(--font-nunito)" }}
          >
            {t.more}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function Birthday({
  t,
  formules,
}: {
  t: Dictionary["home"]["birthday"];
  formules: Dictionary["anniversaires"]["formules"];
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const starsOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section ref={sectionRef} id="anniversaires" className="relative pt-16 pb-8 sm:py-24 overflow-hidden">
      {/* White base */}
      <div className="absolute inset-0" style={{ background: "#ffffff" }} />
      {/* Subtle amber radial glow top-right */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(245,166,35,0.13) 0%, transparent 70%)", filter: "blur(60px)" }} />
      {/* Subtle warm glow bottom-left */}
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,94,60,0.10) 0%, transparent 70%)", filter: "blur(80px)" }} />
      {/* Very faint dot grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{ backgroundImage: "radial-gradient(circle, #F5A623 1px, transparent 1px)", backgroundSize: "36px 36px" }} />

      {/* Confetti left — pegado al borde superior, detrás de todo el contenido */}
      <motion.div
        className="absolute pointer-events-none select-none"
        style={{ left: "clamp(-3rem, -6vw, -0.75rem)", top: 0, zIndex: 0, opacity: starsOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            animate={{ y: [0, -8, -2, -6, 0], rotateZ: [0, -1, 0, 1, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/birthday/confettis-left.png" alt="" loading="lazy" style={{ height: "clamp(64px, 16vw, 220px)", width: "auto", display: "block" }} />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Confetti right — pegado al borde superior, detrás de todo el contenido */}
      <motion.div
        className="absolute pointer-events-none select-none"
        style={{ right: "clamp(-3rem, -6vw, -0.75rem)", top: 0, zIndex: 0, opacity: starsOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            animate={{ y: [0, -10, -3, -7, 0], rotateZ: [0, 1, 0, -1, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/birthday/confettis-right.png" alt="" loading="lazy" style={{ height: "clamp(64px, 16vw, 220px)", width: "auto", display: "block" }} />
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative text-center mb-16"
        >
          <motion.span
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-50 border border-pink-100 text-pink-600 text-sm font-bold mb-4"
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            {t.badge}
          </motion.span>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-amber-900 mb-3 leading-tight break-words"
            style={{ fontFamily: "var(--font-baloo)" }}
          >
            {t.titleStart}{" "}
            <span className="text-pop">{t.titleAccent}</span>
          </h2>
          <p
            className="text-xl font-semibold text-amber-900/70 mb-6"
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            {t.subtitle}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {formulas.map((f, i) => (
            <FormulaCard key={i} f={f} i={i} inView={inView} t={t} prix={formules[f.slug].price} />
          ))}
        </div>

        {/* Info box con estrellas */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="relative mt-12 rounded-2xl px-8 py-7 text-center text-white overflow-visible"
          style={{ background: "#C0392B" }}
        >
          <p className="text-base leading-relaxed" style={{ fontFamily: "var(--font-nunito)" }}>
            {t.info.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
            <strong>{t.infoStrong}</strong>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
