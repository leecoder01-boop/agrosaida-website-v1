"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useEffect, useRef } from "react";

/**
 * Editorial gallery: asymmetric composition, individual parallax,
 * clip-path reveals, and a slow marquee reacting to scroll velocity.
 */
export default function Gallery() {
  const root = useRef<HTMLElement>(null);
  const marquee = useRef<HTMLDivElement>(null);
  const marqueeInner = useRef<HTMLDivElement>(null);
  const speed = useRef(1);

  useEffect(() => {
    let killed = false;
    let rafId = 0;
    let pos = 0;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (killed || !root.current) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // image reveals + individual parallax
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const reveals = gsap.utils.toArray<HTMLElement>(".gal-item").map((item, i) =>
          gsap.fromTo(
            item.querySelector(".gal-img"),
            { clipPath: i % 2 === 0 ? "inset(0 0 100% 0)" : "inset(100% 0 0 0)", scale: 1.08 },
            {
              clipPath: "inset(0 0 0% 0)",
              scale: 1,
              duration: 1.2,
              ease: "power4.inOut",
              scrollTrigger: { trigger: item, start: "top 82%" },
            }
          )
        );
        const captions = gsap.utils.toArray<HTMLElement>(".gal-item").map((item) =>
          gsap.fromTo(
            item.querySelector(".gal-caption"),
            { y: 12, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.7, ease: "power2.out",
              scrollTrigger: { trigger: item, start: "top 70%" },
            }
          )
        );

        // individual parallax at different speeds
        const parallaxes = [0.06, -0.05, 0.08, -0.07].map((v, i) =>
          ScrollTrigger.create({
            trigger: `.gal-par-${i}`,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
            onUpdate: (self) => {
              gsap.set(`.gal-par-${i} .gal-img`, { yPercent: self.progress * v * 100 });
            },
          })
        );

        return () => {
          reveals.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
          captions.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
          parallaxes.forEach((t) => t.kill());
        };
      });

      // marquee: slow drift, reacts to scroll velocity, smooth direction change
      if (!reduce && marqueeInner.current) {
        ScrollTrigger.create({
          trigger: marquee.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const v = self.getVelocity() / 400;
            // boost speed by scroll velocity, keep direction smooth
            speed.current = gsap.utils.clamp(-3, 3, speed.current * 0.9 + v * 0.1);
          },
        });

        const tick = () => {
          // base drift is always positive (left), scroll nudges it
          const base = 1;
          pos -= (base + Math.abs(speed.current)) * 0.6;
          if (speed.current < 0) pos += Math.abs(speed.current) * 1.2;
          const w = marqueeInner.current?.scrollWidth / 2 || 0;
          if (w > 0) {
            if (pos <= -w) pos += w;
            if (pos > 0) pos -= w;
          }
          if (marqueeInner.current) marqueeInner.current.style.transform = `translateX(${pos}px)`;
          rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);
      }

      return () => mm.revert();
    })();

    return () => {
      killed = true;
      cancelAnimationFrame(rafId);
    };
  }, []);

  const items = [
    { src: "/images/gallery-1-placeholder.svg", caption: "[Legenda — imagem 01]", cls: "lg:col-span-7", ratio: "aspect-[16/10]" },
    { src: "/images/gallery-2-placeholder.svg", caption: "[Legenda — imagem 02]", cls: "lg:col-span-4 lg:col-start-9 lg:mt-[18vh]", ratio: "aspect-[3/4]" },
    { src: "/images/gallery-3-placeholder.svg", caption: "[Legenda — imagem 03]", cls: "lg:col-span-5 lg:col-start-2 lg:-mt-[8vh]", ratio: "aspect-[4/5]" },
    { src: "/images/gallery-4-placeholder.svg", caption: "[Legenda — imagem 04]", cls: "lg:col-span-6 lg:col-start-7 lg:mt-[12vh]", ratio: "aspect-[16/9]" },
  ];

  return (
    <section ref={root} className="relative bg-paper px-6 md:px-10 lg:px-[8vw] py-[16vh] overflow-hidden">
      <span className="eyebrow text-earth/70 block mb-12">Galeria</span>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-0">
        {items.map((it, i) => (
          <figure key={i} className={`gal-item gal-par-${i} ${it.cls} group`}>
            <div className={`relative overflow-hidden ${it.ratio} bg-sand`}>
              <img
                src={it.src}
                alt={`${it.caption} (placeholder)`}
                className="gal-img absolute inset-0 h-[115%] w-full object-cover will-change-transform transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>
            <figcaption className="gal-caption mt-4 text-[11px] tracking-[0.22em] uppercase text-earth/60">
              {it.caption}
            </figcaption>
          </figure>
        ))}
      </div>

      {/* marquee */}
      <div ref={marquee} className="mt-[14vh] border-y border-earth/10 py-6 overflow-hidden" aria-hidden="true">
        <div
          ref={marqueeInner}
          className="flex whitespace-nowrap will-change-transform font-display text-3xl md:text-5xl text-deep/20 select-none"
        >
          {[0, 1].map((k) => (
            <span key={k} className="flex shrink-0">
              {["TERRA", "EXPERIÊNCIA", "CONFIANÇA", "FUTURO", "AGROSAIDA"].map((w) => (
                <span key={w} className="mx-8 flex items-center gap-16">
                  {w}
                  <span className="inline-block h-2 w-2 rounded-full bg-gold/50" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}