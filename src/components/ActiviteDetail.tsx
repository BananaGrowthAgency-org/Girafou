"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ACTIVITES, RESERVATION_URL, type Activite } from "@/lib/activites";
import ReglesParc from "./ReglesParc";

import { TEXT_OUTLINE, TEXT_OUTLINE_SOFT, fixOrphans } from "@/lib/text";
import { useLocale, useLocalePath } from "@/lib/i18n/useLocale";
import { ui } from "@/lib/i18n/ui";
import type { ActiviteTexte, Dictionary } from "@/lib/i18n/dictionaries";

const BALOO = "var(--font-baloo)";
const NUNITO = "var(--font-nunito)";

/* ── Icônes SVG (pas d'emojis) ── */
const IconChevron = (p: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="m9 18 6-6-6-6" /></svg>
);
const IconArrowLeft = (p: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
);
const IconUser = (p: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" /></svg>
);
const IconTicket = (p: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2 2 2 0 0 0 0 6 2 2 0 0 1-2 2H5a2 2 0 0 1-2-2 2 2 0 0 0 0-6Z" /><path d="M13 5v2M13 17v2M13 11v2" /></svg>
);
const IconInfo = (p: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg>
);
const IconCheck = (p: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M20 6 9 17l-5-5" /></svg>
);
const IconClock = (p: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
const IconReplay = (p: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
);
const IconCamera = (p: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
);

/* ── Bandeau de faits clés (âge / accès / à savoir) ── */
type Detail = Dictionary["pages"]["activites"]["detail"];

function QuickFacts({ a, texte, t }: { a: Activite; texte: ActiviteTexte; t: Detail }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const facts = [
    { icon: <IconUser className="w-5 h-5" />, label: t.factAge, value: texte.age ?? t.allAges },
    { icon: <IconTicket className="w-5 h-5" />, label: t.factAccess, value: a.payant ? t.paid : t.included },
    texte.ageDetail
      ? { icon: <IconInfo className="w-5 h-5" />, label: t.factInfo, value: texte.ageDetail }
      : { icon: <IconCheck className="w-5 h-5" />, label: t.factSafety, value: t.socksRequired },
  ];
  return (
    <div ref={ref} className="grid sm:grid-cols-3 gap-3 sm:gap-4">
      {facts.map((f, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-start gap-3 rounded-2xl bg-white shadow-md border border-amber-100 p-4"
        >
          <span className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: a.accentLight, color: a.accent }}>{f.icon}</span>
          <div className="min-w-0">
            <p className="text-[11px] font-extrabold uppercase tracking-wider" style={{ color: a.accent, fontFamily: NUNITO }}>{f.label}</p>
            <p className="text-sm font-bold text-amber-900/85 leading-snug" style={{ fontFamily: NUNITO }}>{f.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Autres activités (maillage interne) ── */
function AutresActivites({
  current,
  activites,
  title,
}: {
  current: Activite;
  activites: Dictionary["activites"];
  title: string;
}) {
  const lp = useLocalePath();
  const names = ui(useLocale()).names.activites;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const others = ACTIVITES.filter((a) => a.slug !== current.slug);
  return (
    <div ref={ref}>
      <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-amber-900 mb-8" style={{ fontFamily: BALOO }}>
        {title}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {others.map((a, i) => (
          <motion.div key={a.slug} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.45, delay: i * 0.04 }}>
            <Link href={lp(`/activites/${a.slug}`)} className="group block rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="relative h-28 sm:h-32 overflow-hidden" style={{ background: a.accentLight }}>
                <Image src={a.image} alt={names[a.slug]} fill sizes="(max-width: 768px) 45vw, 22vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-white text-[10px] font-extrabold shadow" style={{ background: a.tagBg, fontFamily: NUNITO }}>{activites[a.slug].tag}</span>
              </div>
              <p className="px-3 py-2.5 text-sm font-extrabold leading-tight group-hover:translate-x-0.5 transition-transform" style={{ color: a.accent, fontFamily: BALOO }}>{names[a.slug]}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Bloc « Grande Fête » (animation quotidienne, pour l'instant NeoXperience) ── */
function GrandeFete({
  gf,
  accent,
  gradient,
  video,
}: {
  gf: NonNullable<Dictionary["activites"][string]["grandeFete"]>;
  accent: string;
  gradient: string;
  video: string | null;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55 }}
      className="relative rounded-3xl overflow-hidden text-white shadow-xl"
      style={{ background: gradient }}
    >
      <div className="absolute inset-0 spots-pattern opacity-[0.07] pointer-events-none" />

      <div className={`relative grid gap-6 p-7 sm:p-9 ${video ? "lg:grid-cols-2 lg:items-center" : ""}`}>
        {/* Texte */}
        <div>
          <motion.span
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-xs font-extrabold uppercase tracking-wide"
            style={{ fontFamily: NUNITO }}
          >
            🎉 {gf.sessionsLabel}
          </motion.span>

          <h3 className="mt-4 text-2xl sm:text-3xl font-extrabold leading-tight" style={{ fontFamily: BALOO }}>
            {gf.title}
          </h3>

          <p className="mt-3 text-[15px] sm:text-base font-semibold leading-relaxed text-white/95" style={{ fontFamily: NUNITO }}>
            {gf.intro}
          </p>
          <p className="mt-3 text-[15px] sm:text-base leading-relaxed text-white/85" style={{ fontFamily: NUNITO }}>
            {gf.body}
          </p>

          {/* Sessions — repère horaire mis en avant */}
          <div
            className="mt-5 inline-flex items-center gap-2.5 rounded-2xl bg-white px-4 py-2.5 shadow-md"
            style={{ color: accent }}
          >
            <IconClock className="w-5 h-5" />
            <span className="font-extrabold text-base sm:text-lg" style={{ fontFamily: BALOO }}>
              {gf.sessions}
            </span>
          </div>

          <p className="mt-5 text-sm sm:text-[15px] font-semibold leading-relaxed text-white/90" style={{ fontFamily: NUNITO }}>
            {gf.outro}
          </p>
        </div>

        {/* Vidéo — n'apparaît que si le fichier a été déposé (cf. page.tsx) */}
        {video && <AutoLoopVideo src={video} poster="/images/grande-fete/poster.jpg" replayLabel={gf.replay} accent={accent} />}
      </div>
    </motion.div>
  );
}

/* Lecteur vidéo réutilisable — sans contrôles natifs (donc sans menu de
   téléchargement). Lecture auto muette à l'entrée dans le viewport, deux passages
   puis arrêt avec un bouton « Revoir ». Utilisé par « Grande Fête » et par la
   vidéo illustrative de « L'attraction ». */
function AutoLoopVideo({ src, poster, replayLabel, accent }: { src: string; poster: string; replayLabel: string; accent: string }) {
  const wrapRef = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(wrapRef, { margin: "-15% 0px" });
  const playsRef = useRef(0);
  const [finished, setFinished] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);

  // Démarrage automatique au premier passage dans le viewport.
  useEffect(() => {
    if (inView && playsRef.current === 0 && !finished) {
      videoRef.current?.play().then(() => setNeedsTap(false)).catch(() => setNeedsTap(true));
    }
  }, [inView, finished]);

  // Deux lectures consécutives, puis arrêt.
  const handleEnded = () => {
    playsRef.current += 1;
    const v = videoRef.current;
    if (playsRef.current < 2 && v) {
      v.currentTime = 0;
      v.play().catch(() => {});
    } else {
      setFinished(true);
    }
  };

  const replay = () => {
    playsRef.current = 0;
    setFinished(false);
    setNeedsTap(false);
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  };

  return (
    <div
      ref={wrapRef}
      className="relative self-center rounded-2xl overflow-hidden shadow-2xl bg-black/20 w-full"
      style={{ aspectRatio: "9 / 16", maxHeight: 440, marginLeft: "auto", marginRight: "auto" }}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted
        playsInline
        preload="metadata"
        poster={poster}
        onEnded={handleEnded}
        onContextMenu={(e) => e.preventDefault()}
        disablePictureInPicture
        controlsList="nodownload noplaybackrate noremoteplayback"
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Bouton « Revoir » (fin de lecture) ou lecture manuelle (autoplay bloqué). */}
      {(finished || needsTap) && (
        <button
          type="button"
          onClick={replay}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/45 backdrop-blur-[1px] text-white transition-colors hover:bg-black/55"
          style={{ fontFamily: NUNITO }}
          aria-label={replayLabel}
        >
          <span className="flex items-center justify-center w-14 h-14 rounded-full shadow-lg" style={{ background: accent }}>
            <IconReplay className="w-7 h-7" />
          </span>
          <span className="text-sm font-extrabold">{replayLabel}</span>
        </button>
      )}
    </div>
  );
}

export default function ActiviteDetail({
  activite: a,
  t,
  activites,
  grandeFeteVideo,
  attractionVideo,
  attractionImage,
}: {
  activite: Activite;
  t: Detail;
  activites: Dictionary["activites"];
  grandeFeteVideo: string | null;
  attractionVideo: string | null;
  attractionImage: string | null;
}) {
  const texte = activites[a.slug];
  const lp = useLocalePath();
  const name = ui(useLocale()).names.activites[a.slug];
  const descRef = useRef(null);
  const descInView = useInView(descRef, { once: true, margin: "-80px" });
  const rulesRef = useRef(null);
  const rulesInView = useInView(rulesRef, { once: true, margin: "-80px" });

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: "62vh" }}>
        <Image src={a.heroImage ?? a.image} alt={`${name} — Girafou`} fill priority sizes="(max-width: 768px) 200vw, 100vw" className="object-cover" style={{ objectPosition: a.heroFocus ?? "center" }} />
        <div className="absolute inset-0" style={{ background: a.gradient, opacity: 0.45, mixBlendMode: "multiply" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(20,10,4,0.45) 0%, rgba(20,10,4,0.3) 45%, rgba(20,10,4,0.78) 100%)" }} />

        <div className="relative py-20 w-full">
          <div className="relative max-w-4xl mx-auto px-6 text-center">
            {/* Fil d'ariane */}
            <div className="flex items-center justify-center gap-1.5 text-white/75 text-xs sm:text-sm font-bold mb-5" style={{ fontFamily: NUNITO }}>
              <Link href={lp("/activites")} className="hover:text-white transition-colors">{t.breadcrumb}</Link>
              <IconChevron className="w-3.5 h-3.5" />
              <span className="text-white">{name}</span>
            </div>

            {/* Pastilles */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
              <span className="px-3 py-1 rounded-full text-white text-xs font-extrabold shadow-md" style={{ background: a.tagBg, fontFamily: NUNITO }}>{activites[a.slug].tag}</span>
              {texte.age && <span className="px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold backdrop-blur-sm border border-white/20" style={{ fontFamily: NUNITO }}>{texte.age}</span>}
              {a.payant && <span className="px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold backdrop-blur-sm border border-white/20" style={{ fontFamily: NUNITO }}>{t.paid}</span>}
            </div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-3 leading-tight drop-shadow-md" style={{ fontFamily: BALOO, textShadow: TEXT_OUTLINE }}>
              {name}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="text-white/90 text-lg font-semibold drop-shadow max-w-xl mx-auto mb-7" style={{ fontFamily: NUNITO, textShadow: TEXT_OUTLINE_SOFT }}>
              {texte.tagline}
            </motion.p>
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22 }}
              href={RESERVATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shine inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-white font-extrabold shadow-2xl shadow-black/30 hover:-translate-y-0.5 transition-transform duration-200"
              style={{ background: a.gradient, fontFamily: NUNITO }}
            >
              <IconTicket className="w-5 h-5" /> {t.book}
            </motion.a>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none leading-[0]">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[56px]">
            <path d="M0,50 C360,90 720,10 1080,40 C1260,55 1380,45 1440,40 L1440,80 L0,80 Z" fill="#FFFDF5" />
          </svg>
        </div>
      </section>

      <div style={{ background: "#FFFDF5" }}>
        <div className="max-w-4xl mx-auto px-6 py-14 space-y-12">

          {/* ── Faits clés ── */}
          <QuickFacts a={a} texte={texte} t={t} />

          {/* ── Description ── */}
          <motion.div
            ref={descRef}
            initial={{ opacity: 0, y: 24 }}
            animate={descInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
            className="relative rounded-3xl bg-white shadow-lg border border-amber-100 overflow-hidden"
          >
            <div className="h-1.5 w-full" style={{ background: a.gradient }} />
            <div className="p-6 sm:p-8">
              {/* Deux colonnes : la colonne texte s'aligne sur le média — titre en
                  haut (au niveau où commence l'image/vidéo), description au centre,
                  bouton en bas. La carte épouse ainsi la hauteur du média, sans
                  titre qui dépasse au-dessus. */}
              <div className="grid gap-8 lg:gap-10 lg:grid-cols-2 lg:items-stretch">
                <div className="flex flex-col justify-between gap-6 text-center lg:text-left">
                  <div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight" style={{ fontFamily: BALOO, color: a.accent }}>
                      {t.attraction}
                    </h2>
                    <span className="mt-3 mx-auto lg:mx-0 block w-16 h-1.5 rounded-full" style={{ background: a.gradient }} />
                  </div>
                  <div className="flex flex-col gap-4">
                    {texte.description.map((p, i) => (
                      <p key={i} className="text-[17px] sm:text-lg leading-relaxed text-amber-900/80 font-medium" style={{ fontFamily: NUNITO }}>{fixOrphans(p)}</p>
                    ))}
                  </div>
                  <div className="flex justify-center">
                    <a
                      href={RESERVATION_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-shine inline-flex items-center gap-2 px-9 py-3.5 rounded-2xl text-white font-extrabold text-base shadow-lg hover:-translate-y-0.5 transition-transform duration-200"
                      style={{ background: a.gradient, fontFamily: NUNITO }}
                    >
                      <IconTicket className="w-5 h-5" /> {t.book}
                    </a>
                  </div>
                </div>

                {/* Média : vidéo, sinon photo, sinon emplacement réservé (zones-saut). */}
                {attractionVideo ? (
                  <AutoLoopVideo
                    src={attractionVideo}
                    poster={`/images/attraction-${a.slug}/poster.jpg`}
                    replayLabel={t.replay}
                    accent={a.accent}
                  />
                ) : attractionImage ? (
                  <div
                    className="relative self-center rounded-2xl overflow-hidden shadow-2xl bg-black/10 w-full"
                    style={{ aspectRatio: "4 / 5", maxHeight: 440, marginLeft: "auto", marginRight: "auto" }}
                  >
                    <Image src={attractionImage} alt={`${name} — Girafou`} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                  </div>
                ) : (
                  <div
                    className="relative self-center flex items-center justify-center rounded-2xl w-full border-2 border-dashed"
                    style={{ aspectRatio: "9 / 16", maxHeight: 440, marginLeft: "auto", marginRight: "auto", borderColor: `${a.accent}33`, background: `linear-gradient(135deg, ${a.accent}12, ${a.accent}06)` }}
                    aria-hidden="true"
                  >
                    <span style={{ color: a.accent, opacity: 0.4 }}>
                      <IconCamera className="w-12 h-12" />
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── Grande Fête (bloc spécial de certaines activités) ── */}
          {texte.grandeFete && (
            <GrandeFete gf={texte.grandeFete} accent={a.accent} gradient={a.gradient} video={grandeFeteVideo} />
          )}

          {/* ── Règlement de l'attraction (checklist) ── */}
          {texte.rules.length > 0 && (
            <motion.div
              ref={rulesRef}
              initial={{ opacity: 0, y: 24 }}
              animate={rulesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="rounded-3xl px-7 py-8 text-white shadow-xl"
              style={{ background: a.gradient }}
            >
              <p className="font-extrabold text-lg sm:text-xl mb-5" style={{ fontFamily: BALOO }}>{t.rulesTitle}</p>
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3.5">
                {texte.rules.map((c, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm sm:text-[15px] leading-snug text-white/95" style={{ fontFamily: NUNITO }}>
                    <span className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"><IconCheck className="w-3.5 h-3.5" /></span>
                    {c}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* ── Horaires d'ouverture ── */}
          <div className="rounded-3xl bg-white shadow-lg border border-amber-100 p-6 sm:p-8">
            <h3 className="flex items-center gap-2.5 text-lg sm:text-xl font-extrabold mb-5" style={{ fontFamily: BALOO, color: a.accent }}>
              <IconClock className="w-5 h-5" /> {t.hoursTitle}
            </h3>
            <ul className="divide-y divide-amber-900/10">
              {t.hours.map((h, i) => (
                <li key={i} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="font-bold text-sm sm:text-base text-amber-900/85" style={{ fontFamily: NUNITO }}>{h.period}</p>
                    <p className="text-xs sm:text-sm text-amber-900/55" style={{ fontFamily: NUNITO }}>{h.days}</p>
                  </div>
                  <span className="flex-shrink-0 font-extrabold text-sm sm:text-base whitespace-nowrap" style={{ color: a.accent, fontFamily: BALOO }}>{h.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Règles du parc (composant partagé) ── */}
          <ReglesParc />

        </div>
      </div>

      {/* ── Autres activités ── */}
      <section className="relative pb-8 max-w-5xl mx-auto px-6" style={{ background: "#FFFDF5" }}>
        <AutresActivites current={a} activites={activites} title={t.continueAdventure} />
      </section>

      {/* ── Retour au hub ── */}
      <section className="relative pb-20 pt-10 max-w-3xl mx-auto px-6 text-center" style={{ background: "#FFFDF5" }}>
        <Link href={lp("/activites")} className="inline-flex items-center gap-2 text-sm font-extrabold text-amber-700 hover:text-amber-900 transition-colors" style={{ fontFamily: NUNITO }}>
          <IconArrowLeft className="w-4 h-4" /> {t.backToAll}
        </Link>
      </section>
    </>
  );
}
