"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useEffect, useRef } from "react";

const SOLUTIONS = [
  { n: "01", title: "[SOLUÇÃO 01]", desc: "[Descrição da solução — conteúdo real a ser fornecido pela Agrosaida.]" },
  { n: "02", title: "[SOLUÇÃO 02]", desc: "[Descrição da solução — conteúdo real a ser fornecido pela Agrosaida.]" },
  { n: "03", title: "[SOLUÇÃO 03]", desc: "[Descrição da solução — conteúdo real a ser fornecido pela Agrosaida.]" },
  { n: "04", title: "[SOLUÇÃO 04]", desc: "[Descrição da solução — conteúdo real a ser fornecido pela Agrosaida.]" },
];

/**
 * Horizontal pinned solutions on desktop; vertical stack on mobile.
 */
export default function Solutions() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let killed = false;
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (killed || !root.current || !track.current) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const panels = gsap.utils.toArray<HTMLElement>(".sol-panel");
        const counter = document.querySelector<HTMLElement>(".sol-counter");
        const progress = document.querySelector<HTMLElement>(".sol-progress-bar");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => "+=" + panels.length * window.innerWidth * 0.75,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(panels.length - 1, Math.floor(self.progress * panels.length));
              if (counter) counter.textContent = `0${idx + 1} / 04`;
              panels.forEach((p, i) => {
                const active = i === idx;
                gsap.to(p, {
                  opacity: active ? 1 : Math.abs(i - idx) === 1 ? 0.7 : 0.4,
                  scale: active ? 1 : 0.94,
                  duration: 0.5,
                  overwrite: "auto",
                });
              });
            },
          },
        });

        tl.to(track.current, { xPercent: -75, ease: "none" }, 0);
        if (progress) tl.fromTo(progress, { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0);

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      // tablet & mobile: vertical stack with simple reveals
      mm.add("(max-width: 1023px), (prefers-reduced-motion: reduce)", () => {
        const triggers = gsap.utils.toArray<HTMLElement>(".sol-panel").map((p) =>
          gsap.fromTo(
            p.querySelectorAll(".sol-reveal"),
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.1,
              ease: "power2.out",
              scrollTrigger: { trigger: p, start: "top 80%" },
            }
          )
        );
        return () =>
          triggers.forEach((t) => {
            t.scrollTrigger?.kill();
            t.kill();
          });
      });

      return () => mm.revert();
    })();
    return () => {
      killed = true;
    };
  }, []);

  return (
    <section ref={root} id="solucoes" className="relative bg-deep overflow-hidden">
      <div className="lg:h-screen flex flex-col justify-center py-[12vh] lg:py-0">
        <div className="px-6 md:px-10 lg:px-[8vw] mb-10 lg:mb-14 flex items-end justify-between gap-8">
          <h2 className="font-display text-paper text-3xl md:text-5xl lg:text-6xl leading-[1.1] max-w-3xl">
            Soluções que acompanham <span className="italic font-light">cada etapa.</span>
          </h2>
          <div className="hidden lg:block shrink-0 text-sand/60 text-sm tracking-[0.3em] tabular-nums">
            <span className="sol-counter">01 / 04</span>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            ref={track}
            className="flex flex-col lg:flex-row lg:w-[400%] gap-12 lg:gap-0 px-6 md:px-10 lg:px-[8vw]"
          >
            {SOLUTIONS.map((s) => (
              <article key={s.n} className="sol-panel lg:w-[25%] lg:shrink-0 lg:pr-[4vw]">
                <div className="sol-img-mask relative overflow-hidden aspect-[16/10] lg:aspect-[4/3] bg-ink/40">
                  <img
                    src="/images/solution-placeholder.svg"
                    alt={`Imagem ilustrativa da ${s.title} (placeholder)`}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                <div className="mt-8 flex gap-8">
                  <span className="font-display text-gold text-2xl lg:text-3xl tabular-nums sol-reveal">{s.n}</span>
                  <div>
                    <h3 className="font-display text-paper text-2xl lg:text-3xl sol-reveal">{s.title}</h3>
                    <p className="mt-4 text-sand/70 leading-relaxed max-w-md sol-reveal">{s.desc}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="hidden lg:block mt-14 mx-[8vw] h-px bg-paper/15">
          <div className="sol-progress-bar h-full w-full origin-left bg-gold scale-x-0" />
        </div>
      </div>
    </section>
  );
}