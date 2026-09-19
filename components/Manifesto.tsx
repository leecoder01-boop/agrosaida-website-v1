"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useEffect, useRef } from "react";

/**
 * Manifesto: word-by-word reveal with scrub — words start faded and turn
 * deep-green as the user scrolls. Side label + growing vertical line.
 */
export default function Manifesto() {
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
        const words = gsap.utils.toArray<HTMLElement>(".mf-word");
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top 75%",
            end: "bottom 60%",
            scrub: 0.8,
          },
        });
        tl.fromTo(
          words,
          { opacity: 0.18 },
          { opacity: 1, color: "#163C25", stagger: 0.06, ease: "none" },
          0
        ).fromTo(".mf-line", { scaleY: 0 }, { scaleY: 1, ease: "none" }, 0);
        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });
      return () => mm.revert();
    })();
    return () => {
      killed = true;
    };
  }, []);

  const lines = [
    ["Mais", "que", "acompanhar", "o", "campo,"],
    ["é", "preciso", "compreender", "cada", "ciclo."],
  ];

  return (
    <section ref={root} className="relative bg-paper text-natural/30 py-[18vh] px-6 md:px-10 lg:px-[8vw]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-2 flex lg:flex-col items-start gap-6">
          <span className="eyebrow text-earth/60 lg:v-text">Nossa essência</span>
          <div className="hidden lg:block w-px h-[240px] bg-earth/15">
            <div className="mf-line h-full w-full origin-top bg-gold scale-y-0" />
          </div>
        </div>

        <blockquote className="lg:col-span-10 font-display text-4xl md:text-6xl lg:text-7xl leading-[1.2]">
          {lines.map((line, i) => (
            <span key={i} className="block mb-3">
              {line.map((w, j) => (
                <span key={j} className="mf-word">{w}{" "}</span>
              ))}
            </span>
          ))}
        </blockquote>
      </div>
    </section>
  );
}