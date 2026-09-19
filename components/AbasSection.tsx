"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  {
    eyebrow: "01",
    title: "[TÍTULO]",
    desc: "[Descrição da prateleira — conteúdo real a ser fornecido pela Agrosaida. Foto real em breve.]",
    src: "/images/store/prateleira-medicamentos.png",
  },
  {
    eyebrow: "02",
    title: "[TÍTULO]",
    desc: "[Descrição da prateleira — conteúdo real a ser fornecido pela Agrosaida. Foto real em breve.]",
    src: "/images/store/racoes-e-ferramentas.png",
  },
  {
    eyebrow: "03",
    title: "[TÍTULO]",
    desc: "[Descrição da prateleira — conteúdo real a ser fornecido pela Agrosaida. Foto real em breve.]",
    src: "/images/store/racoes-a-granel.png",
  },
  {
    eyebrow: "04",
    title: "[TÍTULO]",
    desc: "[Descrição da prateleira — conteúdo real a ser fornecido pela Agrosaida. Foto real em breve.]",
    src: "/images/store/acessorios-e-utilidades.png",
  },
];

export default function AbasSection() {
  const root = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        gsap.set(backgroundRef.current, { scale: 1 });
        gsap.set(root.current, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set([".abas-title", ".abas-heading", ".abas-card"], { opacity: 1, y: 0, scale: 1 });
        return;
      }

      gsap.fromTo(backgroundRef.current, { scale: 1.12 }, {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      const reveal = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 86%",
          toggleActions: "play none restart reverse",
        },
      });
      reveal
        .fromTo(root.current, { clipPath: "inset(10% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.72, ease: "power3.out" }, 0)
        .fromTo(".abas-title", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, 0.08)
        .fromTo(".abas-heading", { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.78, ease: "power3.out" }, 0.12)
        .fromTo(".abas-card", { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 0.62, stagger: 0.12, ease: "power3.out" }, 0.28);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="solucoes" className="relative isolate min-h-screen overflow-hidden bg-[#07110b] px-6 py-[12vh] md:px-10 lg:px-[8vw]">
      <div
        ref={backgroundRef}
        className="absolute inset-0 -z-30 h-full w-full bg-cover bg-center bg-no-repeat will-change-transform"
        style={{ backgroundImage: "url('/images/backgrounds/lavoura-brasil.jpg')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(105deg,rgba(2,10,6,0.90)_0%,rgba(7,27,16,0.78)_52%,rgba(2,11,7,0.58)_100%)] md:bg-[linear-gradient(105deg,rgba(2,10,6,0.82)_0%,rgba(7,27,16,0.68)_52%,rgba(2,11,7,0.42)_100%)]" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(3,14,8,0.10),rgba(3,14,8,0.38))]" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-10 max-w-2xl md:mb-14">
          <span className="abas-title eyebrow text-[#d5a85a]">MINI CATÁLOGO</span>
          <h2 className="abas-heading mt-4 font-display text-3xl leading-[1.08] text-[#f2ead6] [text-shadow:0_3px_24px_rgba(0,0,0,0.45)] md:text-5xl">
            Soluções para cada rotina no campo.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4 lg:gap-10">
        {CARDS.map((card, i) => (
          <article
            key={i}
            className="abas-card group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#102619]/90 shadow-[0_18px_42px_-22px_rgba(0,0,0,0.8)] backdrop-blur-[2px]"
          >
            <div className="aspect-[16/10] overflow-hidden bg-sand/20">
              <img
                src={card.src}
                alt={`Prateleira ${card.eyebrow} da loja Agrosaida`}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
              />
            </div>
            <div className="p-6 lg:p-8">
              <span className="eyebrow text-gold block mb-3">{card.eyebrow}</span>
              <h3 className="font-display text-paper text-xl lg:text-2xl leading-tight">{card.title}</h3>
              <p className="mt-4 text-sand/70 text-sm leading-relaxed">{card.desc}</p>
            </div>
          </article>
        ))}
        </div>
      </div>
    </section>
  );
}
