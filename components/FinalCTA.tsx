"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useEffect, useRef } from "react";
import MagneticButton from "./MagneticButton";

/**
 * Final CTA: dark ink background, gold circle growing behind, soil texture,
 * words start outlined and fill on scroll. Calm, strong ending.
 */
export default function FinalCTA() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    let killed = false;
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (killed || !root.current) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // line-by-line reveal
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });
        tl.fromTo(".cta-line", { yPercent: 115 }, { yPercent: 0, duration: 1, stagger: 0.12, ease: "power4.out" })
          .fromTo(".cta-btn-wrap", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.4");

        // outlined words fill + gold circle grows, scrubbed
        const tl2 = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top 80%", end: "center center", scrub: 0.8 },
        });
        tl2.fromTo(".cta-fill-word", { color: "transparent", WebkitTextStroke: "1px #DED4BD" }, { color: "#F3F0E8", WebkitTextStroke: "0px transparent", stagger: 0.3, ease: "none" }, 0)
          .fromTo(".cta-circle", { scale: 0.55, opacity: 0 }, { scale: 1.15, opacity: 1, ease: "none" }, 0);

        return () => {
          tl.scrollTrigger?.kill(); tl.kill();
          tl2.scrollTrigger?.kill(); tl2.kill();
        };
      });
      return () => mm.revert();
    })();
    return () => { killed = true; };
  }, []);

  return (
    <section ref={root} id="contato" className="relative bg-ink px-6 md:px-10 lg:px-[8vw] py-[24vh] overflow-hidden">
      {/* soil texture */}
      <div className="soil-texture absolute inset-0 pointer-events-none" aria-hidden="true" />
      {/* gold circle */}
      <div className="cta-circle pointer-events-none absolute right-[-12vw] top-1/2 -translate-y-1/2 h-[46vw] w-[46vw] rounded-full bg-gold/[0.07] will-change-transform" aria-hidden="true" />

      <div className="relative max-w-4xl">
        <span className="eyebrow text-gold block mb-10">Comece agora</span>
        <h2 className="font-display text-paper text-4xl md:text-6xl lg:text-7xl leading-[1.12]">
          <span className="block overflow-hidden">
            <span className="cta-line block">Todo grande resultado</span>
          </span>
          <span className="block overflow-hidden">
            <span className="cta-line block">
              começa onde alguém <em className="cta-fill-word not-italic font-light">decide</em>
            </span>
          </span>
          <span className="block overflow-hidden">
            <span className="cta-line block">
              <em className="cta-fill-word not-italic font-light">plantar o futuro.</em>
            </span>
          </span>
        </h2>

        <div className="cta-btn-wrap mt-12">
          <MagneticButton href="#contato" variant="gold">
            Falar com a Agrosaida
          </MagneticButton>
        </div>

        <div className="mt-10 text-[11px] tracking-[0.25em] uppercase text-sand/40">
          [Dados de contato a serem inseridos]
        </div>
      </div>
    </section>
  );
}