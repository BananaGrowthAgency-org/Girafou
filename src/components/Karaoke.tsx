"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Wave from "@/components/Wave";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { TEXT_OUTLINE, TEXT_OUTLINE_SOFT } from "@/lib/text";

const BALOO = "var(--font-baloo)";
const NUNITO = "var(--font-nunito)";
const NEON = "linear-gradient(135deg, #7C3AED, #EC4899)";
const DARK = "#150A2E";
const LIGHT = "#FBF7FF";

// Site officiel Just-Karaoké + réservation Qweekle (service de Girafou). Non traduit.
const OFFICIAL_URL = "https://just-karaoke.com/";
const KARAOKE_URL = "https://girafou.qweekle.com/shop/girafou/karaoke?lang=fr";
const KARAOKE_ANNIV_URL =
  "https://girafou.qweekle.com/shop/girafou/karaoke/anniversaire-just-karaoke?lang=fr";

// Icônes par ordre du dictionnaire (le texte vient de l'i18n, l'icône du code).
const FEATURE_ICONS = ["🎤", "🎶", "📺", "⏱️"];
const QUICK_ICONS = ["👥", "🧼", "🅿️"];

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function BookButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-shine inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-white font-extrabold text-base shadow-lg hover:-translate-y-0.5 transition-transform duration-200"
      style={{ background: NEON, fontFamily: NUNITO }}
    >
      🎤 {children}
    </a>
  );
}

const IconCheck = (p: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M20 6 9 17l-5-5" /></svg>
);

export default function Karaoke({ t }: { t: Dictionary["pages"]["karaoke"] }) {
  return (
    <>
      {/* ── Hero ── (overflow-visible : les cartes stats débordent en bas) */}
      <section className="relative overflow-visible lg:min-h-[70vh]">
        {/* Fond photo + halos, découpés dans un calque à part */}
        <div className="absolute inset-0 overflow-hidden">
          <Image src="/images/karaoke/hero.jpg" alt="Box karaoké Just Karaoké" fill priority sizes="(max-width: 768px) 200vw, 100vw" className="object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,4,24,0.62) 0%, rgba(10,4,24,0.45) 45%, rgba(10,4,24,0.9) 100%)" }} />
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.45) 0%, transparent 70%)", filter: "blur(55px)" }} />
          <div className="absolute -bottom-28 -right-24 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(236,72,153,0.4) 0%, transparent 70%)", filter: "blur(55px)" }} />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-start lg:justify-center text-center max-w-3xl mx-auto px-6 pt-12 pb-4 lg:pt-20 lg:pb-[8.5rem] lg:min-h-[70vh]">
          <motion.span
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/12 backdrop-blur-sm border border-white/25 text-white text-sm font-bold mb-5"
            style={{ fontFamily: NUNITO }}
          >
            🎤 {t.badge}
          </motion.span>
          <h1 className="text-5xl sm:text-7xl font-extrabold text-white mb-4 leading-tight" style={{ fontFamily: BALOO, textShadow: TEXT_OUTLINE }}>
            {t.titleStart} <span style={{ color: "#F0ABFC" }}>{t.titleAccent}</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-xl mx-auto mb-8" style={{ fontFamily: NUNITO, textShadow: TEXT_OUTLINE_SOFT }}>
            {t.subtitle}
          </p>
          <a
            href={OFFICIAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-shine inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-white font-extrabold text-base shadow-lg hover:-translate-y-0.5 transition-transform duration-200"
            style={{ background: NEON, fontFamily: NUNITO }}
          >
            {t.viewSite}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg>
          </a>
        </div>

        {/* Cartes "stats" (les 4 atouts). En desktop elles chevauchent la section
            suivante (absolute + translate). En mobile (2×2, deux fois plus hautes)
            ce chevauchement recouvrait le bouton et le titre suivant : on les
            laisse donc dans le flux normal, sous le contenu du hero. */}
        <div className="relative z-30 mt-6 px-6 max-w-5xl mx-auto lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:mt-0 lg:translate-y-1/2 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {t.features.map((f, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div
                  className="h-full rounded-xl sm:rounded-2xl p-3 sm:p-5 flex flex-col items-center text-center"
                  style={{ background: "rgba(255,255,255,0.95)", border: "1.5px solid rgba(124,58,237,0.3)", backdropFilter: "blur(16px)", boxShadow: "0 14px 36px rgba(20,10,46,0.4)" }}
                >
                  <div className="text-3xl sm:text-4xl mb-1.5 sm:mb-2">{FEATURE_ICONS[i]}</div>
                  <h3 className="text-sm sm:text-lg font-extrabold mb-0.5 sm:mb-1 leading-tight" style={{ fontFamily: BALOO, color: "#6D28D9" }}>{f.title}</h3>
                  <p className="text-purple-900/55 text-[11px] sm:text-xs font-semibold leading-tight" style={{ fontFamily: NUNITO }}>{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Concept (fond sombre néon) — titre + accroche sous les cartes ── */}
      <section className="relative pt-9 lg:pt-40 pb-10 sm:pb-24 overflow-hidden" style={{ background: DARK }}>
        <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)", filter: "blur(60px)" }} />

        <Reveal className="relative text-center max-w-2xl mx-auto px-6">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4" style={{ fontFamily: BALOO, color: "#F0ABFC" }}>
            {t.conceptTitle}
          </h2>
          <p className="text-white/70 text-lg leading-relaxed" style={{ fontFamily: NUNITO }}>{t.conceptLead}</p>
        </Reveal>
      </section>

      <Wave above={DARK} fill={LIGHT} />

      {/* ── Formules ── */}
      <section className="pt-10 pb-12 sm:pb-24" style={{ background: LIGHT }}>
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-3" style={{ fontFamily: BALOO, color: "#6D28D9" }}>{t.formulesTitle}</h2>
            <p className="text-purple-900/60 text-lg max-w-xl mx-auto" style={{ fontFamily: NUNITO }}>{t.formulesSubtitle}</p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {t.formules.map((f, i) => (
              <Reveal key={i} delay={i * 0.08} className="h-full">
                <div className="flex flex-col h-full rounded-3xl bg-white p-7 shadow-lg" style={{ border: "1px solid #EDE4FF" }}>
                  <h3 className="text-xl font-extrabold mb-3" style={{ fontFamily: BALOO, color: "#6D28D9" }}>{f.name}</h3>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-extrabold bg-clip-text text-transparent" style={{ fontFamily: BALOO, backgroundImage: NEON }}>{f.price}</span>
                    <span className="font-bold text-purple-900/55" style={{ fontFamily: NUNITO }}>{f.unit}</span>
                  </div>
                  <span className="self-start mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold" style={{ background: "#F3E8FF", color: "#7C3AED", fontFamily: NUNITO }}>⏱️ {f.duration}</span>
                  <p className="mt-4 text-[15px] font-semibold text-purple-950/80 leading-relaxed" style={{ fontFamily: NUNITO }}>{f.desc}</p>
                  <p className="mt-2 text-sm text-purple-900/55 leading-relaxed" style={{ fontFamily: NUNITO }}>{f.audience}</p>
                  <div className="mt-6 pt-2 flex justify-center mt-auto">
                    <BookButton href={KARAOKE_URL}>{t.book}</BookButton>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-8 text-center">
            <p className="text-sm text-purple-900/55 max-w-2xl mx-auto" style={{ fontFamily: NUNITO }}>{t.formulesNote}</p>
          </Reveal>
        </div>
      </section>

      <Wave above={LIGHT} fill="#2A1052" />

      {/* ── Anniversaire ── */}
      <section className="relative py-12 sm:py-20 overflow-hidden" style={{ background: "linear-gradient(to bottom, #2A1052 0%, #4A1454 55%, #7A1E5A 100%)" }}>
        <div className="absolute -top-20 right-10 w-80 h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(236,72,153,0.35) 0%, transparent 70%)", filter: "blur(60px)" }} />

        <div className="relative max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <Reveal>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl mx-auto" style={{ aspectRatio: "1024 / 1153", maxHeight: 600, width: "100%", border: "1px solid rgba(240,171,252,0.3)" }}>
              <Image src="/images/karaoke/anniversaire.jpg" alt="Anniversaire karaoké Just Karaoké" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" style={{ objectPosition: "center bottom" }} />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <motion.span
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/12 backdrop-blur-sm border border-white/25 text-white text-xs font-extrabold uppercase tracking-wide mb-4"
              style={{ fontFamily: NUNITO }}
            >
              🎂 {t.annivBadge}
            </motion.span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4" style={{ fontFamily: BALOO }}>{t.annivTitle}</h2>
            <p className="text-white/85 leading-relaxed mb-4" style={{ fontFamily: NUNITO }}>{t.annivLead}</p>
            <p className="inline-flex items-center gap-2 rounded-2xl bg-white/10 border border-white/20 px-4 py-2.5 text-white font-extrabold text-sm sm:text-base mb-6" style={{ fontFamily: BALOO }}>
              🎉 {t.annivMeta}
            </p>
            <ul className="grid sm:grid-cols-2 gap-3 mb-8">
              {t.annivPoints.map((p, i) => (
                <li key={i} className="flex items-center gap-2.5 text-white/95 font-semibold" style={{ fontFamily: NUNITO }}>
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full" style={{ background: NEON }}>
                    <IconCheck className="w-3.5 h-3.5 text-white" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <BookButton href={KARAOKE_ANNIV_URL}>{t.annivBook}</BookButton>
          </Reveal>
        </div>
      </section>

      <Wave above="#7A1E5A" fill={LIGHT} />

      {/* ── Infos pratiques (comme la home : repères + horaires + adresse/carte) ── */}
      <section className="pt-10 pb-12 sm:pb-24" style={{ background: LIGHT }}>
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-extrabold" style={{ fontFamily: BALOO, color: "#6D28D9" }}>{t.infosTitle}</h2>
          </Reveal>

          <div className="space-y-6">
            {/* Repères rapides — 3 petits stacks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {t.quick.map((q, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="h-full bg-white rounded-2xl p-5 shadow-sm" style={{ border: "1px solid #EDE4FF" }}>
                    <div className="text-3xl mb-2">{QUICK_ICONS[i]}</div>
                    <h3 className="font-extrabold text-sm mb-0.5" style={{ fontFamily: BALOO, color: "#6D28D9" }}>{q.label}</h3>
                    <p className="text-xs text-purple-900/55 leading-snug" style={{ fontFamily: NUNITO }}>{q.value}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Adresse (courte) + Contact */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Reveal className="h-full">
                <div className="h-full bg-white rounded-3xl p-7 sm:p-8 shadow-lg flex flex-col justify-center" style={{ border: "1px solid #EDE4FF" }}>
                  <h3 className="flex items-center gap-2 text-2xl font-extrabold mb-3" style={{ fontFamily: BALOO, color: "#6D28D9" }}>📍 {t.addressTitle}</h3>
                  <p className="text-purple-950/80 font-bold leading-relaxed" style={{ fontFamily: NUNITO }}>{t.address}</p>
                </div>
              </Reveal>

              <Reveal delay={0.1} className="h-full">
                <div className="h-full bg-white rounded-3xl p-7 sm:p-8 shadow-lg" style={{ border: "1px solid #EDE4FF" }}>
                  <h3 className="flex items-center gap-2 text-2xl font-extrabold mb-5" style={{ fontFamily: BALOO, color: "#6D28D9" }}>☎️ {t.contactTitle}</h3>
                  <div className="space-y-3">
                    {t.phones.map((p, i) => (
                      <a key={i} href={`tel:${p.replace(/\s/g, "")}`} className="flex items-center gap-3 text-purple-950/85 font-bold hover:text-fuchsia-600 transition-colors" style={{ fontFamily: NUNITO }}>
                        <span className="flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0" style={{ background: "#F3E8FF" }} aria-hidden="true">📞</span>
                        {p}
                      </a>
                    ))}
                    <a href={`mailto:${t.email}`} className="flex items-center gap-3 text-purple-950/85 font-bold hover:text-fuchsia-600 transition-colors break-all" style={{ fontFamily: NUNITO }}>
                      <span className="flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0" style={{ background: "#F3E8FF" }} aria-hidden="true">✉️</span>
                      {t.email}
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Horaires (détaillé) + carte */}
            <div className="grid lg:grid-cols-2 gap-6 items-stretch">
              <Reveal className="h-full">
                <div className="h-full bg-white rounded-3xl p-7 sm:p-8 shadow-lg" style={{ border: "1px solid #EDE4FF" }}>
                  <h3 className="flex items-center gap-2 text-2xl font-extrabold mb-5" style={{ fontFamily: BALOO, color: "#6D28D9" }}>🕒 {t.hoursTitle}</h3>
                  <div className="divide-y divide-purple-100">
                    {t.hours.map((h, i) => (
                      <div key={i} className="flex items-center justify-between gap-3 py-3.5 first:pt-0">
                        <span className="font-bold" style={{ fontFamily: NUNITO, color: h.closed ? "#C0392B" : "#3B0764CC" }}>{h.days}</span>
                        <span className="font-extrabold text-sm sm:text-base whitespace-nowrap" style={{ fontFamily: BALOO, color: h.closed ? "#C0392B" : "#7C3AED" }}>{h.time}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-purple-900/55 leading-snug" style={{ fontFamily: NUNITO }}>{t.hoursNote}</p>
                </div>
              </Reveal>
              <Reveal delay={0.1} className="h-full">
                <div className="relative h-full min-h-[300px] rounded-3xl overflow-hidden shadow-lg" style={{ border: "1px solid #EDE4FF" }}>
                  <iframe
                    src="https://maps.google.com/maps?q=Just-Karaok%C3%A9,+ZA+Clos+de+la+Hogue,+B%C3%A9nouville,+France&output=embed&z=15"
                    className="absolute inset-0 w-full h-full"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Just-Karaoké — Bénouville"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <Wave above={LIGHT} fill={DARK} />

      {/* ── CTA final (fond sombre néon) ── */}
      <section className="relative py-12 sm:py-20 overflow-hidden text-center" style={{ background: DARK }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 50%, rgba(236,72,153,0.35) 0%, transparent 60%)" }} />
        <Reveal className="relative max-w-2xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3" style={{ fontFamily: BALOO }}>{t.ctaTitle}</h2>
          <p className="text-white/70 mb-7 text-lg" style={{ fontFamily: NUNITO }}>{t.ctaText}</p>
          <BookButton href={KARAOKE_URL}>{t.ctaButton}</BookButton>
        </Reveal>
      </section>
    </>
  );
}
