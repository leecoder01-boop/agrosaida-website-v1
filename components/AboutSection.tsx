"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function AboutSection() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-content",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.1 }
      );
      gsap.fromTo(
        ".about-image",
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.9, ease: "power2.out", delay: 0.3 }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="sobre"
      className="relative bg-[#0c1a10] py-24 md:py-32 px-6 md:px-10 lg:px-[8vw] overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 55% 35% at 25% 20%, #d5a85a 0%, transparent 55%), radial-gradient(ellipse 45% 35% at 80% 80%, #3f6b33 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* image */}
          <div className="about-image order-2 md:order-1 md:sticky md:top-8">
            <div className="relative overflow-hidden rounded-2xl border border-[#b9c7a8]/12 bg-[#0a140c] shadow-[0_20px_52px_-18px_rgba(0,0,0,0.75)]">
              <img
                src="/images/about/agrosaida-intro.webp"
                alt="Produtos agropecuários Agrosaida"
                className="w-full h-auto object-cover transition-transform duration-700 hover:scale-[1.02]"
                loading="lazy"
              />
            </div>
          </div>

          {/* content */}
          <div className="about-content order-1 md:order-2 text-left">
            <span className="eyebrow text-[#d5a85a]">SOBRE A AGROSAIDA</span>
            <h2 className="mt-4 font-display text-[#f2ead6] text-3xl md:text-4xl lg:text-5xl leading-[1.08]">
              Produtos agropecuários e veterinários, rações, ferramentas, selaria e muito mais!
            </h2>
            <p className="mt-6 text-[#b9c7a8]/85 leading-relaxed text-lg">
              Há mais de 20 anos no mercado, a Agrosaida é referência em soluções completas para o produtor rural. Oferecemos uma linha ampla de produtos de qualidade, desde rações balanceadas até equipamentos de proteção, sempre com o compromisso de entregar o melhor para sua propriedade.
            </p>
            <p className="mt-4 text-[#b9c7a8]/80 leading-relaxed">
              Nossa equipe está pronta para atender você com consultoria técnica e suporte especializado, garantindo que você encontre exatamente o que precisa para cada fase do ciclo produtivo.
            </p>

            <a
              href="https://wa.me/553432311843"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-3 rounded-sm bg-[#4a7c38] text-[#f2ead6] text-[13px] tracking-[0.14em] uppercase px-8 py-4 transition-all duration-300 hover:bg-[#5a9146] hover:shadow-[0_0_22px_rgba(74,124,56,0.45)]"
            >
              Falar com a Agrosaida
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}