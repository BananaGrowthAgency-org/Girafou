"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

import { TEXT_OUTLINE, TEXT_OUTLINE_SOFT } from "@/lib/text";
import type { Dictionary } from "@/lib/i18n/dictionaries";

// Valeurs postées à Web3Forms : elles restent en français quelle que soit
// la langue affichée, pour que le parc reçoive toujours les mêmes intitulés.
const CIVILITE_VALUES = ["M", "Mme", "Un comité d'entreprise", "Une école", "Un centre aéré", "Une association", "Autre"];
const SUJET_VALUES = ["Question", "Anniversaire", "Le parc", "Services", "Restauration", "Activités"];

const BALOO = "var(--font-baloo)";
const NUNITO = "var(--font-nunito)";
const BROWN = "#5A3520";
const RED = "#C0392B";

// Clé publique Web3Forms (destinée au client : elle figure dans le <form>, elle
// n'est pas secrète). Surchargeable via NEXT_PUBLIC_WEB3FORMS_KEY (ex. Vercel) ;
// à défaut, on utilise la clé du compte Girafou pour que le formulaire marche
// partout sans configuration.
const ACCESS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "2ab3e28e-a43b-4716-a05a-51549fa6eb88";


const inputCls =
  "w-full rounded-xl border-2 border-amber-200/70 bg-white px-4 py-3 text-amber-900 placeholder:text-amber-900/35 outline-none transition-colors duration-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200";

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-bold mb-1.5" style={{ fontFamily: NUNITO, color: BROWN }}>
        {label} <span style={{ color: RED }}>*</span>
      </label>
      {children}
    </div>
  );
}

const IconPin = (p: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconMail = (p: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}>
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" />
  </svg>
);
const IconPhone = (p: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
  </svg>
);
const IconCheck = (p: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={p.className}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

type Status = "idle" | "loading" | "success" | "error";

export default function ContactForm({ t }: { t: Dictionary["pages"]["contact"] }) {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-80px" });
  const bodyRef = useRef(null);
  const bodyInView = useInView(bodyRef, { once: true, margin: "-60px" });

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: new FormData(form),
      });
      const json = await res.json();
      if (json.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
        setErrorMsg(json.message || t.errorGeneric);
      }
    } catch {
      setStatus("error");
      setErrorMsg(t.errorNetwork);
    }
  }

  return (
    <>
      {/* ── Hero avec photo ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/contactez-nous-hero/hero-hd.jpg"
            alt="Façade du parc Girafou"
            fill
            priority
            sizes="(max-width: 768px) 200vw, 100vw"
            className="object-cover"
            style={{ objectPosition: "center 35%" }}
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
            <IconMail className="w-4 h-4" /> {t.badge}
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
        <div ref={bodyRef} className="max-w-6xl mx-auto px-6 py-14 grid lg:grid-cols-[0.9fr_1.6fr] gap-8 items-start">

          {/* ── Colonne infos ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={bodyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl p-6 sm:p-7 text-white shadow-xl lg:sticky lg:top-24"
            style={{ background: "linear-gradient(160deg, #C0392B 0%, #E8552D 100%)" }}
          >
            <h2 className="text-2xl font-extrabold mb-1" style={{ fontFamily: BALOO }}>{t.infoTitle}</h2>
            <p className="text-white/85 text-sm mb-5" style={{ fontFamily: NUNITO }}>{t.infoSub}</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center bg-white/15"><IconPin className="w-5 h-5" /></span>
                <span className="text-sm leading-snug font-semibold pt-1.5" style={{ fontFamily: NUNITO }}>ZA Clos de la Hogue<br />14970 Bénouville</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center bg-white/15"><IconPhone className="w-5 h-5" /></span>
                <a href="tel:0231537268" className="text-sm font-bold hover:underline" style={{ fontFamily: NUNITO }}>02 31 53 72 68</a>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center bg-white/15"><IconMail className="w-5 h-5" /></span>
                <a href="mailto:contact@girafou.com" className="text-sm font-bold hover:underline break-all" style={{ fontFamily: NUNITO }}>contact@girafou.com</a>
              </li>
            </ul>
          </motion.div>

          {/* ── Formulaire ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={bodyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl bg-white shadow-xl border border-amber-100 p-6 sm:p-8"
          >
            {status === "success" ? (
              <div className="text-center py-10">
                <span className="inline-flex items-center justify-center w-16 h-16 rounded-full text-white mb-4" style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}>
                  <IconCheck className="w-8 h-8" />
                </span>
                <h2 className="text-2xl font-extrabold mb-2" style={{ fontFamily: BALOO, color: BROWN }}>{t.successTitle}</h2>
                <p className="text-amber-900/70 mb-6" style={{ fontFamily: NUNITO }}>{t.successText}</p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="px-6 py-3 rounded-xl text-white font-extrabold shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  style={{ background: RED, fontFamily: NUNITO }}
                >
                  {t.successAgain}
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate={false} className="space-y-5">
                {/* Champs cachés Web3Forms */}
                <input type="hidden" name="access_key" value={ACCESS_KEY} />
                <input type="hidden" name="subject" value="Nouveau message — Formulaire Girafou" />
                <input type="hidden" name="from_name" value="Girafou — Contactez-nous" />
                {/* Honeypot anti-spam */}
                <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

                <div className="grid sm:grid-cols-3 gap-4">
                  <Field label={t.fieldCivilite} htmlFor="civilite">
                    <select id="civilite" name="Vous êtes" required defaultValue="M" className={`${inputCls} cursor-pointer`} style={{ fontFamily: NUNITO }}>
                      {CIVILITE_VALUES.map((v, i) => <option key={v} value={v}>{t.civilites[i]}</option>)}
                    </select>
                  </Field>
                  <Field label={t.fieldNom} htmlFor="nom">
                    <input id="nom" name="Nom" type="text" required placeholder={t.fieldNom} className={inputCls} style={{ fontFamily: NUNITO }} />
                  </Field>
                  <Field label={t.fieldPrenom} htmlFor="prenom">
                    <input id="prenom" name="Prénom" type="text" required placeholder={t.fieldPrenom} className={inputCls} style={{ fontFamily: NUNITO }} />
                  </Field>
                </div>

                <Field label={t.fieldEmail} htmlFor="email">
                  <input id="email" name="Email" type="email" required placeholder={t.placeholderEmail} className={inputCls} style={{ fontFamily: NUNITO }} />
                </Field>

                <Field label={t.fieldTelephone} htmlFor="telephone">
                  <input id="telephone" name="Téléphone" type="tel" required placeholder={t.placeholderTelephone} className={inputCls} style={{ fontFamily: NUNITO }} />
                </Field>

                <Field label={t.fieldSujet} htmlFor="sujet">
                  <select id="sujet" name="Sujet" required defaultValue="Question" className={`${inputCls} cursor-pointer`} style={{ fontFamily: NUNITO }}>
                    {SUJET_VALUES.map((v, i) => <option key={v} value={v}>{t.sujets[i]}</option>)}
                  </select>
                </Field>

                <Field label={t.fieldMessage} htmlFor="message">
                  <textarea id="message" name="Message" required rows={5} placeholder={t.placeholderMessage} className={`${inputCls} resize-y`} style={{ fontFamily: NUNITO }} />
                </Field>

                {status === "error" && (
                  <p className="text-sm font-semibold text-red-600" style={{ fontFamily: NUNITO }} role="alert">{errorMsg}</p>
                )}
                {!ACCESS_KEY && (
                  <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2" style={{ fontFamily: NUNITO }}>
                    {t.missingKey}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-shine w-full py-4 rounded-2xl text-white font-extrabold text-base shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                  style={{ background: RED, fontFamily: NUNITO }}
                >
                  {status === "loading" ? t.submitting : t.submit}
                </button>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </>
  );
}
