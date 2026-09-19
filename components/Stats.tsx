"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useEffect, useRef } from "react";

const STATS = [
  { value: "[XX]", suffix: "", label: "anos de experiência" },
  { value: "[XX]", suffix: "", label: "regiões atendidas" },
  { value: "[XX]", suffix: "", label: "clientes e parceiros" },
  { value: "[XX]", suffix: "", label: "projetos realizados" },
];

/**
 * Stats: numeric count-up when entering viewport, growing separators,
 * background transitions sand -> ink as the section scrolls through.
 */
export default function Stats() {
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
        // background + text color transition while scrolling through
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top 80%",
            end: "center 45%",
            scrub: 0.6,
          },
        });
        tl.fromTo(root.current, { backgroundColor: "#DED4BD" }, { backgroundColor: "#0B1A12", ease: "none" }, 0)
          .fromTo(".st-label", { color: "#594735" }, { color: "#DED4BD", ease: "none" }, 0)
          .fromTo(".st-value", { color: "#163C25" }, { color: "#F3F0E8", ease: "none" }, 0);

        // line growing behind indicators
        gsap.fromTo(".st-back-line", { scaleX: 0 }, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 75%", end: "center center", scrub: 1 },
        });

        // entrance stagger
        gsap.fromTo(".st-item", { y: 40, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 65%" },
        });

        // separators growing
        gsap.fromTo(".st-sep", { scaleX: 0 }, {
          scaleX: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: root.current, start: "top 60%" },
        });

        return () => {
          ScrollTrigger.getAll().forEach((st) => {
            if (st.trigger === root.current) st.kill();
          });
        };
      });

      return () => mm.revert();
    })();
    return () => {
      killed = true;
    };
  }, []);

  return (
    <section ref={root} className="relative bg-sand py-[18vh] px-6 md:px-10 lg:px-[8vw] overflow-hidden">
      {/* line growing behind the indicators */}
      <div className="st-back-line absolute left-[8vw] right-[8vw] top-1/2 h-px bg-current/10 origin-left" aria-hidden="true" />

      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-16 lg:gap-x-0">
        {STATS.map((s, i) => (
          <div key={i} className="st-item relative lg:px-10">
            {i > 0 && <div className="st-sep absolute left-0 top-1 bottom-1 w-px bg-earth/15 hidden lg:block origin-top" aria-hidden="true" />}
            <div className="st-value font-display text-6xl lg:text-7xl tabular-nums leading-none">
              {s.value}
              {s.suffix}
            </div>
            <div className="st-label mt-4 text-[12px] tracking-[0.22em] uppercase">
              {s.label}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-14 text-[10px] tracking-[0.25em] uppercase text-earth/50">
        * Números definitivos a serem confirmados pela Agrosaida
      </div>
    </section>
  );
}