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
    src: "/images/abas-01.png",
  },
  {
    eyebrow: "02",
    title: "[TÍTULO]",
    desc: "[Descrição da prateleira — conteúdo real a ser fornecido pela Agrosaida. Foto real em breve.]",
    src: "/images/abas-02.png",
  },
  {
    eyebrow: "03",
    title: "[TÍTULO]",
    desc: "[Descrição da prateleira — conteúdo real a ser fornecido pela Agrosaida. Foto real em breve.]",
    src: "/images/abas-03.png",
  },
  {
    eyebrow: "04",
    title: "[TÍTULO]",
    desc: "[Descrição da prateleira — conteúdo real a ser fornecido pela Agrosaida. Foto real em breve.]",
    src: "/images/abas-04.png",
  },
  {
    eyebrow: "05",
    title: "[TÍTULO]",
    desc: "[Descrição da prateleira — conteúdo real a ser fornecido pela Agrosaida. Foto real em breve.]",
    src: "/images/abas-05.png",
  },
];

export default function AbasSection() {
  const root = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useLayoutEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      // cards staggered reveal when section enters viewport
      gsap.fromTo(
        ".abas-card",
        { y: 60, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top 75%",
          },
        }
      );
    }, root.current);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative bg-paper min-h-screen flex items-center px-6 md:px-10 lg:px-[8vw] py-[12vh]">
      <div className="absolute inset-x-0 top-0 h-px bg-deep/10" aria-hidden="true" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
        {CARDS.map((card, i) => (
          <article
            key={i}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="abas-card group relative overflow-hidden bg-deep/5 rounded-sm"
          >
            <div className="aspect-[16/10] overflow-hidden bg-sand/20">
              <img
                src={card.src}
                alt={`Imagem da prateleira ${card.eyebrow} (placeholder)`}
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
    </section>
  );
}