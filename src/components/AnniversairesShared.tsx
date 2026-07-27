"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { InterditSticker } from "./ReglesParc";
import { useLocale } from "@/lib/i18n/useLocale";
import { ui } from "@/lib/i18n/ui";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const BALOO = "var(--font-baloo)";
const NUNITO = "var(--font-nunito)";

const pizzaSlides = [
  "/images/resto/option-pizza-1.jpg",
  "/images/resto/option-pizza-2.jpg",
  "/images/resto/option-pizza-3.jpg",
];

/* ── Option Pizza add-on banner (réutilise le style de la home) ── */
export function OptionPizzaBanner({ t }: { t: Dictionary["anniversaires"]["optionPizza"] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="relative rounded-3xl overflow-visible shadow-xl"
    >
      {/* Pastille flottante */}
      <motion.div
        className="absolute pointer-events-none select-none z-20"
        style={{ left: "-1.2rem", top: "-2rem" }}
        animate={{ y: [0, -8, -2, -6, 0], rotateZ: [0, -3, 0, 3, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/resto/pastille-pizza-2-50.png"
          alt={t.price}
          loading="lazy"
          style={{ height: "clamp(64px, 8vw, 96px)", width: "auto", display: "block", filter: "drop-shadow(-2px 6px 12px rgba(0,0,0,0.28))" }}
        />
      </motion.div>

      <div className="relative rounded-3xl overflow-hidden flex flex-col sm:flex-row sm:items-center" style={{ background: "#E8400C" }}>
        <div className="flex flex-col justify-center py-6 sm:py-8 sm:flex-1" style={{ paddingLeft: "clamp(3rem, 8vw, 5.5rem)", paddingRight: "1.5rem" }}>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2 leading-tight" style={{ fontFamily: BALOO }}>
            {t.title}
          </h3>
          <p className="text-white/85 text-sm leading-snug" style={{ fontFamily: NUNITO }}>
            {t.text}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2.5 p-3 sm:p-4 sm:w-[46%] sm:flex-none">
          {pizzaSlides.map((src, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden aspect-square">
              <Image src={src} alt={`Option Pizza ${i + 1}`} fill className="object-cover" sizes="(max-width: 640px) 30vw, 150px" quality={90} />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Chaussettes + conditions ── */
export function ConditionsBlock({ t }: { t: Dictionary["anniversaires"] }) {
  const regles = ui(useLocale()).regles;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref} className="max-w-4xl mx-auto flex flex-col gap-6">
      {/* Chaussettes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl bg-white border border-amber-100 shadow-md p-5 lg:pl-24"
      >
        {/* Badge « Chaussettes Obligatoires » flottant — coin haut-gauche, comme sur la home */}
        <motion.div
          className="hidden lg:block absolute pointer-events-none select-none z-10"
          style={{ left: "-1.9rem", top: "-2rem" }}
        >
          <motion.div
            initial={{ opacity: 0, x: -30, scale: 0.9 }}
            animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              animate={{ y: [0, -10, -2, -8, 0], rotateZ: [0, 2, 0, -2, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{ perspective: 900, transformStyle: "preserve-3d" }}
            >
              <motion.div
                animate={{ rotateY: [0, 8, 0, -8, 0], rotateX: [0, 4, 6, 2, 0], scale: [1, 1.04, 1.01, 1.03, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/chaussettes-obligatoires.png"
                  alt={regles.chaussettesTitle}
                  style={{ height: "clamp(66px, 7vw, 92px)", width: "auto", display: "block", filter: "drop-shadow(-3px 8px 14px rgba(0,0,0,0.18))" }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* En-tête : sticker (mobile) + titre, description pleine largeur dessous */}
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            className="lg:hidden flex-shrink-0"
            animate={{ y: [0, -8, 0], rotateZ: [0, 2, 0, -2, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/chaussettes-obligatoires.png"
              alt={regles.chaussettesTitle}
              style={{ height: 56, width: "auto", display: "block", filter: "drop-shadow(-2px 6px 10px rgba(0,0,0,0.18))" }}
            />
          </motion.div>
          <p className="font-extrabold text-amber-900 leading-tight" style={{ fontFamily: BALOO }}>{regles.chaussettesTitle}</p>
        </div>
        <p className="text-sm text-amber-800/60 leading-snug" style={{ fontFamily: NUNITO }}>{regles.chaussettes}</p>
      </motion.div>

      {/* Nourriture extérieure — même poids visuel que le bloc chaussettes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="relative rounded-2xl bg-white border border-amber-100 shadow-md p-5"
      >
        {/* En-tête : picto + titre, description pleine largeur dessous */}
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            className="flex-shrink-0"
            animate={{ y: [0, -8, 0], rotateZ: [0, -2, 0, 2, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <InterditSticker size={56} />
          </motion.div>
          <p className="font-extrabold text-amber-900 leading-tight" style={{ fontFamily: BALOO }}>{regles.nourritureTitle}</p>
        </div>
        <p className="text-sm text-amber-800/60 leading-snug" style={{ fontFamily: NUNITO }}>{regles.nourriture}</p>
        <p className="text-xs text-amber-800/40 leading-snug mt-1.5" style={{ fontFamily: NUNITO }}>{regles.nourritureExceptions}</p>
      </motion.div>

      {/* Conditions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-3xl px-7 py-7 text-white shadow-xl"
        style={{ background: "#C0392B" }}
      >
        <p className="font-extrabold text-lg mb-3" style={{ fontFamily: BALOO }}>{t.conditionsTitle}</p>
        <ul className="flex flex-col gap-2.5">
          {t.conditions.map((c, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm leading-snug text-white/90" style={{ fontFamily: NUNITO }}>
              <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-white/70" />
              {c}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
