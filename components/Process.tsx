"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useEffect, useRef } from "react";

const STEPS = [
  { n: "01", title: "[ETAPA 01]", desc: "[Descrição da etapa — conteúdo real a ser fornecido pela Agrosaida.]" },
  { n: "02", title: "[ETAPA 02]", desc: "[Descrição da etapa — conteúdo real a ser fornecido pela Agrosaida.]" },
  { n: "03", title: "[ETAPA 03]", desc: "[Descrição da etapa — conteúdo real a ser fornecido pela Agrosaida.]" },
  { n: "04", title: "[ETAPA 04]", desc: "[Descrição da etapa — conteúdo real a ser fornecido pela Agrosaida.]" },
];

/**
 * Sticky vertical narrative: left side fixed title + active step text,
 * right side numbered steps with growing vertical line and clip-path image.
 */
export default function Process() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    let killed = false;
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (killed || !root.current) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(".pr-line", { scaleY: 0 }, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 60%", end: "bottom 70%", scrub: 0.6 },
        });

        gsap.fromTo(root.current, { backgroundColor: "#0B1A12" }, {
          backgroundColor: "#163C25",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 40%", end: "bottom 60%", scrub: 0.8 },
        });

        const setActive = (idx: number) => {
          document.querySelectorAll<HTMLElement>(".pr-step").forEach((el, i) => {
            el.style.opacity = i === idx ? "1" : i < idx ? "0.4" : "0.25";
          });
          document.querySelectorAll<HTMLElement>(".pr-text").forEach((el, i) => {
            el.style.opacity = i === idx ? "1" : "0";
            el.style.transform = `translateY(${i === idx ? 0 : i < idx ? -20 : 20}px)`;
          });
          document.querySelectorAll<HTMLElement>(".pr-img").forEach((el, i) => {
            el.style.clipPath = i === idx ? "inset(0 0 0 0)" : i < idx ? "inset(100% 0 0 0)" : "inset(0 0 100% 0)";
          });
        };

        const triggers = STEPS.map((_, i) =>
          ScrollTrigger.create({
            trigger: `.pr-step-${i}`,
            start: "top 70%",
            end: "bottom 30%",
            onEnter: () => setActive(i),
            onEnterBack: () => setActive(i),
          })
        );

        return () => triggers.forEach((t) => t.kill());
      });

      mm.add("(max-width: 1023px), (prefers-reduced-motion: reduce)", () => {
        const triggers = gsap.utils.toArray<HTMLElement>(".pr-step").map((p) =>
          gsap.fromTo(p, { y: 30, opacity: 0 }, {
            y: 0, opacity: 1, duration: 0.8, ease: "power2.out",
            scrollTrigger: { trigger: p, start: "top 85%" },
          })
        );
        return () => triggers.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
      });

      return () => mm.revert();
    })();
    return () => { killed = true; };
  }, []);

  return (
    <section ref={root} id="processo" className="relative bg-ink px-6 md:px-10 lg:px-[8vw] py-[16vh]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        <div className="lg:sticky lg:top-[20vh] lg:self-start">
          <span className="eyebrow text-gold mb-6 block">Como trabalhamos</span>
          <h2 className="font-display text-paper text-4xl md:text-5xl leading-[1.15]">
            Cada ciclo, <span className="italic font-light">um método.</span>
          </h2>
          <div className="relative mt-10 min-h-[140px]">
            {STEPS.map((s, i) => (
              <div key={i} className="pr-text absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ opacity: i === 0 ? 1 : 0 }}>
                <div className="font-display text-sand text-xl">{s.title}</div>
                <p className="mt-3 text-sand/70 leading-relaxed max-w-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative pl-10 lg:pl-16">
          <div className="absolute left-2 lg:left-4 top-2 bottom-2 w-px bg-paper/10">
            <div className="pr-line h-full w-full origin-top bg-gold scale-y-0" />
          </div>

          {STEPS.map((s, i) => (
            <div key={i} className={`pr-step pr-step-${i} transition-opacity duration-700 py-14 border-b border-paper/10 last:border-none`} style={{ opacity: i === 0 ? 1 : 0.25 }}>
              <div className="flex items-baseline gap-6">
                <span className="font-display text-gold text-3xl tabular-nums">{s.n}</span>
                <h3 className="font-display text-paper text-2xl">{s.title}</h3>
              </div>
              <div className="pr-img mt-8 overflow-hidden aspect-[16/9] bg-deep/50 transition-[clip-path] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ clipPath: i === 0 ? "inset(0 0 0 0)" : "inset(0 0 100% 0)" }}>
                <img
                  src="/images/process-placeholder.svg"
                  alt={`Composição visual da ${s.title} (placeholder)`}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}