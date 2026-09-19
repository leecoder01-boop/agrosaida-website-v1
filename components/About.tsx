"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useEffect, useRef } from "react";

/**
 * About: editorial asymmetric layout — large image with clip-path reveal +
 * internal parallax, big number "01", vertical caption, topographic texture.
 */
export default function About() {
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
          scrollTrigger: { trigger: root.current, start: "top 70%", end: "top 20%" },
        });
        tl.fromTo(".about-img-mask", { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1.3, ease: "power4.inOut" })
          .fromTo(".about-img", { scale: 1.25 }, { scale: 1, duration: 1.3, ease: "power4.inOut" }, "<")
          .fromTo(".about-line", { yPercent: 115 }, { yPercent: 0, duration: 1, stagger: 0.1, ease: "power3.out" }, "-=0.7")
          .fromTo(".about-block", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power2.out" }, "-=0.6")
          .fromTo(".about-num", { y: -60 }, { y: 0, duration: 1.6, ease: "power2.out" }, "<")
          .fromTo(".about-topo path", { drawSVG: undefined, opacity: 0 }, { opacity: 0.5, duration: 1.2, stagger: 0.1 }, "-=1");
        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      // internal parallax on the image (separate, scrub)
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = ScrollTrigger.create({
          trigger: ".about-img-mask",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            gsap.set(".about-img", { yPercent: -8 + self.progress * 16 });
          },
        });
        // big number moves at different velocity
        const st2 = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
          onUpdate: (self) => {
            gsap.set(".about-num", { yPercent: 12 - self.progress * 30 });
          },
        });
        return () => {
          st.kill();
          st2.kill();
        };
      });

      return () => mm.revert();
    })();
    return () => {
      killed = true;
    };
  }, []);

  return (
    <section ref={root} id="sobre" className="relative bg-paper overflow-hidden">
      <div className="topo-lines absolute inset-0 opacity-[0.35] pointer-events-none" aria-hidden="true" />

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-0 px-6 md:px-10 lg:px-[8vw] py-[16vh]">
        {/* giant number, different velocity */}
        <div className="lg:col-span-2 flex items-start pointer-events-none" aria-hidden="true">
          <span className="about-num font-display text-[22vw] lg:text-[9vw] leading-none text-deep/10 select-none">
            01
          </span>
        </div>

        {/* image with mask + parallax */}
        <div className="lg:col-span-6 relative">
          <div className="about-img-mask relative overflow-hidden aspect-[4/5] bg-sand">
            <img
              src="/images/about-placeholder.svg"
              alt="Imagem institucional da Agrosaida (placeholder)"
              className="about-img absolute inset-0 h-[120%] w-full object-cover will-change-transform"
            />
          </div>
          {/* vertical caption */}
          <div className="v-text absolute -right-8 top-0 hidden lg:block text-[11px] tracking-[0.3em] uppercase text-earth/60">
            [Legenda institucional]
          </div>
        </div>

        {/* text */}
        <div className="lg:col-span-4 lg:pl-12 flex flex-col justify-center">
          <div className="eyebrow text-earth/70 mb-6">Sobre a Agrosaida</div>
          <h2 className="font-display text-deep text-4xl md:text-5xl leading-[1.15]">
            <span className="block overflow-hidden"><span className="about-line block">[Título institucional</span></span>
            <span className="block overflow-hidden"><span className="about-line block">da Agrosaida — placeholder]</span></span>
          </h2>
          <p className="about-block mt-6 text-natural leading-relaxed max-w-md">
            [Texto institucional sobre a história, missão e valores da Agrosaida.
            Conteúdo real a ser fornecido pela empresa.]
          </p>
          <p className="about-block mt-4 text-natural/80 leading-relaxed max-w-md">
            [Segundo parágrafo institucional com informações sobre experiência
            e proximidade com o produtor.]
          </p>
          <a href="#solucoes" className="about-block group mt-8 inline-flex items-center gap-3 text-[13px] tracking-[0.18em] uppercase text-deep">
            Ver soluções
            <span className="h-px w-10 bg-deep/40 transition-all duration-500 group-hover:w-16 group-hover:bg-gold" />
          </a>
        </div>
      </div>
    </section>
  );
}