"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import MagneticButton from "./MagneticButton";

export default function HeroTransition({
  onVideoReady,
  setNextSection,
  start,
}: {
  onVideoReady?: () => void;
  setNextSection: (section: string) => void;
  start?: boolean;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const titleText = useRef<HTMLHeadingElement>(null);
  const [videoReady, setVideoReadyState] = useState(false);
  const taglineRef = useRef<HTMLParagraphElement>(null);

  // notify preloader about video metadata
  useLayoutEffect(() => {
    const v = videoRef.current!;
    const onMeta = () => {
      setVideoReadyState(true);
      onVideoReady?.();
    };
    if (v.readyState >= 1) onMeta();
    v.addEventListener("loadeddata", onMeta);
    const safety = setTimeout(onMeta, 6000);
    return () => {
      v.removeEventListener("loadeddata", onMeta);
      clearTimeout(safety);
    };
  }, [onVideoReady]);

  useLayoutEffect(() => {
    const v = videoRef.current!;
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()),
      { threshold: 0.05 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  // keep the video parked low + title hidden until the preloader finishes
  useLayoutEffect(() => {
    if (start) return;
    gsap.set(videoRef.current, { y: "16%", scale: 1.12 });
    gsap.set(titleText.current, {
      opacity: 0,
      y: 180,
      filter: "blur(12px)",
      letterSpacing: "0.28em",
    });
    gsap.set(taglineRef.current, { opacity: 0, y: 30 });
  }, [start]);

  // camera rises + title is born from the bottom, starting right after the preloader
  useLayoutEffect(() => {
    if (!start) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });
      tl.fromTo(
        videoRef.current,
        { y: "16%", scale: 1.12 },
        { y: "0%", scale: 1, duration: 2.4, ease: "power3.out" }
      ).fromTo(
        titleText.current,
        {
          opacity: 0,
          y: 180,
          filter: "blur(12px)",
          letterSpacing: "0.28em",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          letterSpacing: "0.08em",
          duration: 1.8,
          ease: "power4.out",
        },
        0.35
      ).fromTo(
        taglineRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.4, ease: "power3.out" },
        0.7
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, [start]);

  const handleExplore = () => {
    setNextSection("abas");
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <div ref={wrapperRef} className="relative h-screen overflow-hidden bg-ink">
      <section className="hero-transition relative h-screen w-full">
        {/* drone video — 16:9, fills the screen with object-cover, no visible zoom */}
        <video
          ref={videoRef}
          className="drone-video absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/_base-placeholder.svg"
        >
          <source src="/videos/agrosaida-hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay absolute inset-0 bg-ink/45" />

        {/* AGROSAIDA title with looping mask */}
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div ref={titleRef} className="text-container relative flex flex-col items-center gap-3 md:gap-4">
            <h1
              ref={titleText}
              className="hero-title font-display font-semibold text-paper text-[6vw] md:text-[5vw] lg:text-[4vw] leading-[1] tracking-[0.08em] select-none will-change-transform whitespace-nowrap"
              style={{
                opacity: 0,
                transform: "translateY(180px)",
                filter: "blur(12px)",
                letterSpacing: "0.28em",
              }}
            >
              <span className="sr-only">AGROSAIDA</span>
              AGROSAIDA
            </h1>
            <p ref={taglineRef} className="tagline font-display font-semibold text-[#d5a85a] text-[3.5vw] md:text-[2.8vw] lg:text-[2vw] tracking-[0.18em] opacity-0 will-change-transform">
              DA TERRA NASCE O FUTURO
            </p>
          </div>
        </div>

        {/* CTA button */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 relative">
          <MagneticButton onClick={handleExplore} variant="gold">
            Explorar soluções
          </MagneticButton>
          {/* progress ring (cyan clear, gold fill) */}
          <svg
            className="absolute inset-0 -translate-x-1/2 -translate-y-1/2 h-24 w-24 -rotate-[-90deg] pointer-events-none"
            viewBox="0 0 32 32"
            aria-hidden="true"
          >
            <circle
              className="origin-center transition-[stroke-dashoffset_1.5s_ease-linear]"
              cx="16"
              cy="16"
              r="14"
              fill="none"
              strokeWidth="3"
              stroke="#D5A85A"
              strokeDasharray="88"
              strokeDashoffset="88"
              transform="scale(1.1)"
            />
            <circle
              className="opacity-0.1 origin-center transition-[stroke-dashoffset_1.5s_ease-linear]"
              cx="16"
              cy="16"
              r="14"
              fill="#D5A85A"
              stroke="none"
            />
          </svg>
        </div>
      </section>

      {/* Next section: prateleiras lado a lado */}
      <section className="next-section relative w-full h-screen bg-paper hidden" id="abas">
        <div className="next-content h-full w-full flex items-center justify-center px-6 md:px-10 lg:px-[8vw]">
          <p className="eyebrow text-deep/70 mb-4">SOLUÇÕES AGROSAIDA</p>
          <h2 className="font-display text-ink text-4xl md:text-6xl lg:text-7xl leading-[1.1] mb-8">
            Uma abordagem completa para cada fase do ciclo.
          </h2>
          <p className="max-w-xl text-natural/80 leading-relaxed text-lg">
            Consulte nossos parceiros e veja como impulsionamos o crescimento no campo.
          </p>
          <a href="#contato" className="group mt-8 inline-flex items-center gap-3 text-[13px] tracking-[0.18em] uppercase text-deep hover:text-natural transition-colors">
            Falar com a Agrosaida
            <span className="h-px w-10 bg-deep/40 transition-all duration-500 group-hover:w-14 group-hover:bg-gold" />
          </a>
        </div>
      </section>

      <style>{`
        .hero-transition { clip-path: inset(0); }
      `}</style>
    </div>
  );
}