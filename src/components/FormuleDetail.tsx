"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { type Formule } from "@/lib/anniversaires";
import { OptionPizzaBanner, ConditionsBlock } from "./AnniversairesShared";

import { GRADIENT_TEXT_NO_OUTLINE, TEXT_OUTLINE, TEXT_OUTLINE_SOFT, fixOrphans } from "@/lib/text";
import { useLocale, useLocalePath } from "@/lib/i18n/useLocale";
import { ui } from "@/lib/i18n/ui";
import type { Dictionary, FormuleTexte } from "@/lib/i18n/dictionaries";

const BALOO = "var(--font-baloo)";
const NUNITO = "var(--font-nunito)";
const BROWN = "#5A3520";

type Detail = Dictionary["pages"]["anniversaires"]["detail"];
type Anniv = Dictionary["anniversaires"];

/** Contenu de marque (titre + sous-titre + liste « + » + CTA) posé sur le fond illustré. */
function FondBranded({
  f,
  texte,
  t,
  anniversaires,
}: {
  f: Formule;
  texte: FormuleTexte;
  t: Detail;
  anniversaires: Anniv;
}) {
  const name = ui(useLocale()).names.formules[f.slug];
  // Le 1er élément sert de sous-titre ; le reste forme la liste.
  // L'« extra » (ex. la boisson du Lion) est mis en avant à part, sous la liste.
  const [, ...items] = anniversaires.baseInclusions;
  const extraText = texte.fondExtra ?? texte.extra;

  const content = (
    <div className="text-center" style={{ color: BROWN }}>
      <h3 className="text-[1.7rem] sm:text-[2.1rem] font-extrabold leading-none" style={{ fontFamily: BALOO }}>
        {name}
      </h3>
      <p className="mt-2.5 text-sm sm:text-[15px] font-bold uppercase tracking-wide">
        {t.entryBefore}{" "}
        <span className="underline decoration-2 underline-offset-[3px]" style={{ textDecorationColor: f.accent }}>
          {t.entryUnderlined}
        </span>{" "}
        {t.entryAfter}
      </p>

      <ul className="mt-4 sm:mt-5 space-y-2">
        {items.map((it, i) => (
          <li key={i} className="text-[13.5px] sm:text-[16px] leading-snug px-1">
            <span className="font-extrabold mr-1" style={{ color: f.accent }}>+</span>
            <span className="font-extrabold">{it.b}</span>
            {it.t ? <span className="font-medium opacity-90"> {it.t}</span> : null}
          </li>
        ))}
      </ul>

      {extraText && (
        <div className="mt-3 sm:mt-4">
          <div className="text-3xl sm:text-4xl font-extrabold leading-none" style={{ color: f.accent }}>+</div>
          <p className="mt-1.5 sm:mt-2 text-base sm:text-xl font-extrabold leading-snug px-2 whitespace-pre-line">{extraText}</p>
        </div>
      )}
    </div>
  );

  const cta = (
    <a
      href={f.reserveUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-shine inline-block px-12 py-3.5 rounded-full text-white font-extrabold text-base sm:text-lg shadow-lg hover:-translate-y-0.5 transition-transform duration-200"
      style={{ background: f.gradient, fontFamily: NUNITO }}
    >
      {t.book}
    </a>
  );

  return (
    <>
      {/* Desktop : contenu posé sur l'image de fond illustrée */}
      <div className="hidden md:block relative mx-auto w-full max-w-[840px]">
        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl" style={{ aspectRatio: "1380 / 1133" }}>
          <Image src={f.fondImage!} alt="" fill sizes="840px" className="object-cover" />
          <div className="absolute inset-0 flex flex-col justify-center" style={{ padding: "3% 8% 16%" }}>
            {content}
            <div className="text-center mt-5 sm:mt-6">{cta}</div>
          </div>
        </div>
      </div>

      {/* Mobile : carte crème assortie (le fond est trop petit pour tout le contenu) */}
      <div className="md:hidden relative overflow-hidden rounded-3xl px-5 py-8 shadow-xl" style={{ background: "#FDF3E0", border: "1px solid rgba(255,87,34,0.14)" }}>
        <span className="absolute top-3 left-4 w-2 h-2 rounded-full" style={{ background: f.accent, opacity: 0.55 }} />
        <span className="absolute top-6 left-9 w-1.5 h-1.5 rounded-full" style={{ background: "#4FC3E8", opacity: 0.55 }} />
        <span className="absolute top-4 right-6 w-2 h-2 rounded-full" style={{ background: f.accent, opacity: 0.55 }} />
        <span className="absolute top-8 right-10 w-1.5 h-1.5 rounded-full" style={{ background: "#4FC3E8", opacity: 0.55 }} />
        {content}
        {f.fondBadge && (
          <Image src={f.fondBadge} alt={`${texte.price} ${t.perChild}`} width={214} height={222} className="mx-auto mt-5 w-32 h-auto" />
        )}
        <div className="text-center mt-5">{cta}</div>
      </div>
    </>
  );
}

/** Liste « carte blanche » (formules sans fond illustré). */
function InclusionsList({
  f,
  inView,
  texte,
  anniversaires,
}: {
  f: Formule;
  inView: boolean;
  texte: FormuleTexte;
  anniversaires: Anniv;
}) {
  const base = anniversaires.baseInclusions;
  const inclusions = texte.extra ? [...base, { b: texte.extra }] : base;
  const extraIndex = texte.extra ? inclusions.length - 1 : -1;

  return (
    <ul className="flex flex-col">
      {inclusions.map((item, i) => {
        const isExtra = i === extraIndex;
        return (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -14 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.35, delay: 0.06 + i * 0.04 }}
            className={`flex items-start gap-3 py-3 border-b border-dashed border-amber-900/10 last:border-0 ${isExtra ? "rounded-2xl px-4 -mx-2 mt-1" : ""}`}
            style={isExtra ? { background: f.soft } : undefined}
          >
            <span
              className="flex-shrink-0 mt-0.5 w-6 h-6 text-sm rounded-full flex items-center justify-center text-white font-extrabold"
              style={{ background: f.accent }}
            >
              {isExtra ? "★" : "✓"}
            </span>
            <span className="text-[15px] leading-snug text-amber-900/85" style={{ fontFamily: NUNITO }}>
              {isExtra && <span className="mr-1">{f.emoji}</span>}
              <span className="font-extrabold text-amber-900">{item.b}</span>
              {"t" in item && item.t ? ` ${item.t}` : ""}
            </span>
          </motion.li>
        );
      })}
    </ul>
  );
}

export default function FormuleDetail({
  formule: f,
  t,
  anniversaires,
}: {
  formule: Formule;
  t: Detail;
  anniversaires: Anniv;
}) {
  const texte = anniversaires.formules[f.slug];
  const lp = useLocalePath();
  const name = ui(useLocale()).names.formules[f.slug];
  const listRef = useRef(null);
  const listInView = useInView(listRef, { once: true, margin: "-80px" });
  const pizzaRef = useRef(null);
  const pizzaInView = useInView(pizzaRef, { once: true, margin: "-100px" });
  const hasPhoto = Boolean(f.heroImage);

  // Contenu textuel du hero, commun aux deux fonds (photo réelle ou dégradé).
  const heroInner = (
    <div className="relative max-w-4xl mx-auto px-6 text-center">
      {/* Fil d'ariane */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-white/75 text-xs sm:text-sm font-bold mb-5" style={{ fontFamily: NUNITO }}>
        <Link href={lp("/anniversaires")} className="hover:text-white transition-colors">{t.breadcrumb}</Link>
        <span>›</span>
        <span className="text-white">{name}</span>
      </div>

      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight drop-shadow-md" style={{ fontFamily: BALOO, textShadow: TEXT_OUTLINE }}>
        {t.titleStart}{" "}
        <span className="bg-gradient-to-r from-[#FFCF4D] to-[#FF7A3D] bg-clip-text text-transparent" style={GRADIENT_TEXT_NO_OUTLINE}>{t.titleAccent}</span>{" "}
        {t.titleEnd}
      </motion.h1>
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="text-white/90 text-lg font-semibold drop-shadow" style={{ fontFamily: NUNITO, textShadow: TEXT_OUTLINE_SOFT }}>
        {anniversaires.creneaux}{t.subtitleSuffix}
      </motion.p>

      {/* Nom + prix en TEXTE : ils n'existaient qu'incrustés dans le fond
          illustré et la pastille, donc invisibles pour les lecteurs d'écran
          comme pour Google. */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-5 inline-flex flex-col sm:flex-row items-center sm:items-baseline justify-center gap-x-2 gap-y-1 rounded-2xl bg-white/12 backdrop-blur-sm border border-white/25 px-5 py-2.5"
        style={{ fontFamily: NUNITO }}
      >
        <span className="text-white font-extrabold text-lg sm:text-xl" style={{ fontFamily: BALOO }}>
          {name}
        </span>
        <span className="hidden sm:inline text-white/70">·</span>
        {/* Prix + « par enfant » groupés : en mobile ils passent sous le nom,
            en desktop ils restent sur la même ligne que le nom. */}
        <span className="inline-flex items-baseline gap-2 whitespace-nowrap">
          <span className="text-white font-extrabold text-lg sm:text-xl" style={{ fontFamily: BALOO }}>
            {fixOrphans(texte.price)}
          </span>
          <span className="text-white/75 text-sm font-semibold">{t.perChild}</span>
        </span>
      </motion.p>
    </div>
  );

  return (
    <>
      {/* ── Hero ── */}
      {hasPhoto ? (
        <section className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: "60vh" }}>
          <Image
            src={f.heroImage!}
            alt={name}
            fill
            priority
            sizes="(max-width: 768px) 200vw, 100vw"
            className="object-cover"
            style={{ objectPosition: f.heroFocus ?? "center" }}
          />
          {/* Teinte de marque sur la photo */}
          <div className="absolute inset-0" style={{ background: f.gradient, opacity: 0.5, mixBlendMode: "multiply" }} />
          {/* Voile sombre pour la lisibilité du texte */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(20,10,4,0.4) 0%, rgba(20,10,4,0.28) 45%, rgba(20,10,4,0.68) 100%)" }} />
          <div className="absolute inset-0 spots-pattern opacity-[0.06] pointer-events-none" />
          <div className="relative py-16">{heroInner}</div>
        </section>
      ) : (
        <section className="relative pt-16 pb-14 overflow-hidden" style={{ background: f.gradient }}>
          <div className="absolute inset-0 spots-pattern opacity-[0.08] pointer-events-none" />
          {heroInner}
        </section>
      )}

      {/* ── Option Pizza ── */}
      {f.optionPizza && (
        <section ref={pizzaRef} className="relative pt-16 pb-2 overflow-hidden">
          {/* Confetti gauche — collé au coin gauche, comme sur la home */}
          <motion.div
            className="absolute pointer-events-none select-none"
            style={{ left: "clamp(-3rem, -6vw, -0.75rem)", top: 0, zIndex: 0 }}
            initial={{ opacity: 0, x: -40 }}
            animate={pizzaInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div animate={{ y: [0, -8, -2, -6, 0], rotateZ: [0, -1, 0, 1, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/birthday/confettis-left.png" alt="" loading="lazy" style={{ height: "clamp(64px, 16vw, 220px)", width: "auto", display: "block" }} />
            </motion.div>
          </motion.div>

          {/* Confetti droite — collé au coin droit */}
          <motion.div
            className="absolute pointer-events-none select-none"
            style={{ right: "clamp(-3rem, -6vw, -0.75rem)", top: 0, zIndex: 0 }}
            initial={{ opacity: 0, x: 40 }}
            animate={pizzaInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div animate={{ y: [0, -10, -3, -7, 0], rotateZ: [0, 1, 0, -1, 0] }} transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/birthday/confettis-right.png" alt="" loading="lazy" style={{ height: "clamp(64px, 16vw, 220px)", width: "auto", display: "block" }} />
            </motion.div>
          </motion.div>

          <div className="relative z-10 max-w-5xl mx-auto px-6">
            <OptionPizzaBanner t={anniversaires.optionPizza} />
          </div>
        </section>
      )}

      {/* ── Inclusions ── */}
      <section ref={listRef} className={`relative py-16 mx-auto px-6 ${f.fondImage ? "max-w-4xl" : "max-w-3xl"}`}>
        {f.fondImage ? (
          <FondBranded f={f} texte={texte} t={t} anniversaires={anniversaires} />
        ) : (
          <>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={listInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center text-sm font-extrabold uppercase tracking-widest mb-8" style={{ color: f.accent, fontFamily: NUNITO }}>
              {t.includesTitle}
            </motion.p>
            <div className="rounded-3xl bg-white shadow-xl border border-amber-100 p-6 sm:p-8">
              <InclusionsList f={f} inView={listInView} texte={texte} anniversaires={anniversaires} />
              <a
                href={f.reserveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-shine mt-7 w-full py-4 rounded-2xl text-center text-white font-extrabold text-base shadow-lg hover:-translate-y-0.5 transition-all duration-200 block"
                style={{ background: f.gradient, fontFamily: NUNITO }}
              >
                {t.bookThis}
              </a>
            </div>
          </>
        )}
      </section>

      {/* ── Conditions ── */}
      <section className="relative pb-20 px-6">
        <ConditionsBlock t={anniversaires} />
      </section>

      {/* ── Autres formules ── */}
      <section className="relative pb-20 max-w-3xl mx-auto px-6 text-center">
        <Link href={lp("/anniversaires")} className="inline-flex items-center gap-2 text-sm font-extrabold text-amber-700 hover:text-amber-900 transition-colors" style={{ fontFamily: NUNITO }}>
          {t.backToAll}
        </Link>
      </section>
    </>
  );
}
