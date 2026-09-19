"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useEffect, useRef } from "react";

/**
 * Territory: topographic map composition with progressive line drawing,
 * staggered pulses and masked labels. Placeholder regions.
 */
export default function Territory() {
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
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top 70%", end: "center center", scrub: 0.8 },
        });
        tl.fromTo(".ter-line", { strokeDashoffset: 600, opacity: 0 }, { strokeDashoffset: 0, opacity: 0.35, duration: 1.4, stagger: 0.15, ease: "none" })
          .fromTo(".ter-point", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, stagger: 0.18, ease: "back.out(2)" }, "-=0.8")
          .fromTo(".ter-label", { yPercent: 110 }, { yPercent: 0, duration: 0.6, stagger: 0.15, ease: "power3.out" }, "-=0.6");
        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            gsap.set(".ter-layer-1", { y: self.progress * -30 });
            gsap.set(".ter-layer-2", { y: self.progress * -60 });
          },
        });
        return () => st.kill();
      });

      return () => mm.revert();
    })();
    return () => {
      killed = true;
    };
  }, []);

  const points = [
    { x: 30, y: 35, label: "[Região 01]" },
    { x: 62, y: 28, label: "[Região 02]" },
    { x: 45, y: 58, label: "[Região 03]" },
    { x: 74, y: 62, label: "[Região 04]" },
  ];

  return (
    <section ref={root} id="atuacao" className="relative bg-deep px-6 md:px-10 lg:px-[8vw] py-[16vh] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 flex flex-col justify-center">
          <span className="eyebrow text-gold mb-6">Área de atuação</span>
          <h2 className="font-display text-paper text-4xl md:text-5xl leading-[1.15]">
            Onde a terra <span className="italic font-light">responde.</span>
          </h2>
          <p className="mt-6 text-sand/70 leading-relaxed max-w-sm">
            [Descrição das regiões e do mapa de atuação da Agrosaida —
            conteúdo real a ser fornecido.]
          </p>
          <div className="mt-8 text-[11px] tracking-[0.25em] uppercase text-sand/40 tabular-nums">
            LAT [XX°XX&apos;] — LON [XX°XX&apos;]
          </div>
        </div>

        <div className="lg:col-span-8 relative">
          <div className="relative aspect-[16/10] w-full">
            <svg viewBox="0 0 100 62" className="ter-layer-1 absolute inset-0 h-full w-full" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, i) => (
                <path
                  key={i}
                  className="ter-line"
                  style={{ strokeDasharray: 600 }}
                  d={`M2 ${8 + i * 9} C 25 ${2 + i * 9}, 45 ${14 + i * 9}, 68 ${6 + i * 9} S 92 ${14 + i * 9}, 98 ${8 + i * 9}`}
                  fill="none"
                  stroke="#DED4BD"
                  strokeWidth="0.25"
                />
              ))}
            </svg>
            <div className="ter-layer-2 absolute inset-0">
              {points.map((p) => (
                <div key={p.label} className="absolute" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
                  <div className="ter-point group relative flex items-center justify-center" tabIndex={0} aria-label={`${p.label} — detalhes`}>
                    <span className="absolute h-4 w-4 rounded-full bg-gold/30 animate-[pulse_2.4s_ease-out_infinite]" />
                    <span className="relative h-2 w-2 rounded-full bg-gold" />
                    <span className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-sm bg-ink/80 px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase text-sand opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                      {p.label} — [informação]
                    </span>
                  </div>
                  <div className="absolute left-4 top-1 overflow-hidden">
                    <span className="ter-label block text-[10px] tracking-[0.2em] uppercase text-sand/60">{p.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.6); opacity: 0; }
        }
      `}</style>
    </section>
  );
}