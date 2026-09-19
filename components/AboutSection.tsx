"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const rootRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        gsap.set(backgroundRef.current, { scale: 1 });
        gsap.set(rootRef.current, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set([".about-title", ".about-reveal"], { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(backgroundRef.current, { scale: 1.12 }, {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      const reveal = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 86%",
          toggleActions: "play none restart reverse",
        },
      });

      reveal
        .fromTo(rootRef.current, { clipPath: "inset(11% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.72, ease: "power3.out" }, 0)
        .fromTo(".about-title", { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.78, ease: "power3.out" }, 0.08)
        .fromTo(".about-reveal", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.62, stagger: 0.12, ease: "power2.out" }, 0.24);
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="sobre"
      className="relative isolate min-h-[82vh] overflow-hidden bg-[#07110b] px-6 py-24 md:px-10 md:py-32 lg:px-[8vw]"
    >
      <div
        ref={backgroundRef}
        className="absolute inset-0 -z-30 h-full w-full bg-cover bg-center bg-no-repeat will-change-transform"
        style={{ backgroundImage: "url('/images/backgrounds/trator-lavoura.jpg')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(2,10,6,0.90)_0%,rgba(5,20,12,0.78)_52%,rgba(3,12,7,0.48)_100%)] md:bg-[linear-gradient(90deg,rgba(2,10,6,0.84)_0%,rgba(5,20,12,0.68)_52%,rgba(3,12,7,0.35)_100%)]" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(4,13,8,0.08)_0%,rgba(4,13,8,0.28)_100%)]" aria-hidden="true" />

      <div className="relative mx-auto flex min-h-[58vh] max-w-7xl items-center">
          <div className="max-w-3xl text-left">
            <span className="about-reveal eyebrow text-[#d5a85a]">SOBRE A AGROSAIDA</span>
            <h2 className="about-title mt-4 font-display text-[#f2ead6] text-3xl md:text-5xl lg:text-6xl leading-[1.06] [text-shadow:0_3px_24px_rgba(0,0,0,0.45)]">
              Produtos agropecuários e veterinários, rações, ferramentas, selaria e muito mais!
            </h2>
            <p className="about-reveal mt-7 max-w-2xl text-[#e4eadc]/90 leading-relaxed text-lg">
              Há mais de 20 anos no mercado, a Agrosaida é referência em soluções completas para o produtor rural. Oferecemos uma linha ampla de produtos de qualidade, desde rações balanceadas até equipamentos de proteção, sempre com o compromisso de entregar o melhor para sua propriedade.
            </p>
            <p className="about-reveal mt-4 max-w-2xl text-[#d5dfcc]/85 leading-relaxed">
              Nossa equipe está pronta para atender você com consultoria técnica e suporte especializado, garantindo que você encontre exatamente o que precisa para cada fase do ciclo produtivo.
            </p>

            <a
              href="https://wa.me/553432311843"
              target="_blank"
              rel="noopener noreferrer"
              className="about-reveal mt-8 inline-flex items-center gap-3 rounded-sm bg-[#4a7c38] text-[#f2ead6] text-[13px] tracking-[0.14em] uppercase px-8 py-4 transition-all duration-300 hover:bg-[#5a9146] hover:shadow-[0_0_22px_rgba(74,124,56,0.45)]"
            >
              Falar com a Agrosaida
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
      </div>
    </section>
  );
}
