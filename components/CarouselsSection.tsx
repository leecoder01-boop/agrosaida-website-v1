"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CarouselSection, { type CarouselProduct } from "./CarouselSection";

gsap.registerPlugin(ScrollTrigger);

type FilterId = "racoes" | "medicamentos" | "botas-chapeus";

const FILTERS: { id: FilterId; label: string; accent: string }[] = [
  { id: "racoes", label: "Rações", accent: "#d5a85a" },
  { id: "medicamentos", label: "Remédios", accent: "#a3c77a" },
  { id: "botas-chapeus", label: "Equipamentos", accent: "#c9a86a" },
];

const RACOES: CarouselProduct[] = [
  { name: "RP Dog Premium", detail: "15 kg · carne · 21% de proteína", image: "/images/products/racao-1.webp" },
  { name: "Special Dog Ultralife Adultos", detail: "Cães adultos · frango e arroz", image: "/images/products/racao-2.webp" },
  { name: "Magnus Cat Sachê Adultos", detail: "85 g · carne ao molho", image: "/images/products/racao-3.webp" },
  { name: "Magnus Sachê Cães Adultos", detail: "85 g · carne ao molho", image: "/images/products/racao-4.webp" },
  { name: "Bifinhos Magnus Sabor Carne", detail: "500 g · petisco mastigável", image: "/images/products/racao-5.webp" },
  { name: "Bifinhos Magnus Pequeno Porte", detail: "500 g · sabor carne", image: "/images/products/racao-6.webp" },
];

const MEDICAMENTOS: CarouselProduct[] = [
  { name: "Vermífugo Bovino", detail: "Frasco 500ml · dose única", image: "/images/products/remedio-1.webp" },
  { name: "Antiparasitário para Equinos", detail: "Pasta oral · 7g", image: "/images/products/remedio-2.webp" },
  { name: "Medicamento Veterinário", detail: "Frasco 1L · bovinos e equinos", image: "/images/products/remedio-3.webp" },
  { name: "Vitaminas para Animais", detail: "Suplemento · auxílio à saúde", image: "/images/products/remedio-4.webp" },
  { name: "Medicação Animal", detail: "Frasco 500ml · uso veterinário", image: "/images/products/remedio-5.webp" },
];

const BOTAS_CHAPEUS: CarouselProduct[] = [
  { name: "Botina de Couro Rural", detail: "Couro legítimo · bico aço", image: "/images/products/bota-1.webp" },
  { name: "Bota de Trabalho", detail: "Couro resistente · impermeável", image: "/images/products/bota-2.webp" },
  { name: "Botina Cano Longo", detail: "Proteção total · solado antiderrapante", image: "/images/products/bota-3.webp" },
  { name: "Botina de Segurança", detail: "Biqueira de aço · conforto", image: "/images/products/bota-4.webp" },
  { name: "Bota de Campo", detail: "Couro nobuc · durabilidade", image: "/images/products/bota-5.webp" },
  { name: "Chapéu de Palha", detail: "Palha trançada · aba larga", image: "/images/products/chapeu-1.webp" },
  { name: "Chapéu de Couro", detail: "Couro legítimo · proteção solar", image: "/images/products/chapeu-2.webp" },
  { name: "Chapéu Country", detail: "Estilo tradicional · campo", image: "/images/products/chapeu-3.webp" },
];

export default function CarouselsSection() {
  const [active, setActive] = useState<FilterId>("racoes");
  const rootRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(backgroundRef.current, { scale: 1.12 }, {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      gsap.fromTo(contentRef.current, { y: 36, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 90%",
          toggleActions: "play none restart reverse",
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const goTo = (id: FilterId) => {
    setActive(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={rootRef} id="catalogo" className="relative isolate overflow-hidden bg-[#07110b]">
      <div
        ref={backgroundRef}
        className="absolute inset-0 -z-30 h-full w-full bg-cover bg-center bg-no-repeat will-change-transform"
        style={{ backgroundImage: "url('/images/backgrounds/lavoura-brasil.jpg')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(2,10,6,0.90),rgba(5,20,12,0.76),rgba(2,10,6,0.72))] md:bg-[linear-gradient(90deg,rgba(2,10,6,0.80),rgba(5,20,12,0.62),rgba(2,10,6,0.58))]" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(3,12,7,0.18),rgba(3,12,7,0.50))]" aria-hidden="true" />

      <div ref={contentRef} className="relative">
      {/* barra de filtros */}
      <div className="pt-16 md:pt-24 px-6 md:px-10 lg:px-[8vw]">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-3 flex-wrap">
            {FILTERS.map((f) => {
              const isActive = active === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => goTo(f.id)}
                  className={`rounded-full px-6 py-3 text-[13px] tracking-[0.12em] uppercase transition-all duration-300 border ${
                    isActive
                      ? "text-[#0c1a10] border-transparent shadow-[0_0_24px_rgba(0,0,0,0.4)]"
                      : "bg-transparent text-[#b9c7a8] border-[#b9c7a8]/25 hover:text-[#f2ead6] hover:border-[#4a7c38]"
                  }`}
                  style={isActive ? { background: f.accent } : undefined}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <CarouselSection
        id="racoes"
        eyebrow="LINHA DE RAÇÕES"
        title="Nutrição de ponta para cada animal."
        subtitle="Deslize e conheça rações, sachês e petiscos para cães e gatos disponíveis na Agrosaida."
        products={RACOES}
        accent="#d5a85a"
        backgroundImage="/images/backgrounds/ovelhas-campo.png"
      />
      <CarouselSection
        id="medicamentos"
        eyebrow="MEDICAMENTOS"
        title="Saúde do seu rebanho em primeiro lugar."
        subtitle="Vermífugos, antiparasitários e suplementos para manter seus animais sempre saudáveis."
        products={MEDICAMENTOS}
        accent="#a3c77a"
        backgroundImage="/images/backgrounds/ovelhas-campo.png"
      />
      <CarouselSection
        id="botas-chapeus"
        eyebrow="BOTAS & CHAPÉUS"
        title="Equipado para o trabalho no campo."
        subtitle="Botas e chapéus de qualidade, feitos para durar e proteger você em cada jornada."
        products={BOTAS_CHAPEUS}
        accent="#c9a86a"
        backgroundImage="/images/backgrounds/rebanho-campo.jpg"
      />
      </div>
    </section>
  );
}
