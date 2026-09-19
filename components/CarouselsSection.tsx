"use client";

import { useState } from "react";
import CarouselSection, { type CarouselProduct } from "./CarouselSection";

type FilterId = "racoes" | "medicamentos" | "botas-chapeus";

const FILTERS: { id: FilterId; label: string; accent: string }[] = [
  { id: "racoes", label: "Rações", accent: "#d5a85a" },
  { id: "medicamentos", label: "Remédios", accent: "#a3c77a" },
  { id: "botas-chapeus", label: "Equipamentos", accent: "#c9a86a" },
];

const RACOES: CarouselProduct[] = [
  { name: "Ração Premium Bovinos", detail: "Saco 30kg · engorda e criação", image: "/images/products/racao-1.webp" },
  { name: "Ração Equina", detail: "Saco 25kg · cavalos atletas", image: "/images/products/racao-2.webp" },
  { name: "Ração para Cães", detail: "Saco 15kg · todas as raças", image: "/images/products/racao-3.webp" },
  { name: "Ração para Aves", detail: "Saco 20kg · postura e corte", image: "/images/products/racao-4.webp" },
  { name: "Ração Nutricional", detail: "Saco 30kg · alta digestibilidade", image: "/images/products/racao-5.webp" },
  { name: "Ração Suplementada", detail: "Saco 40kg · recria e engorda", image: "/images/products/racao-6.webp" },
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

  const goTo = (id: FilterId) => {
    setActive(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* barra de filtros */}
      <div className="bg-[#0c1a10] pt-16 md:pt-24 px-6 md:px-10 lg:px-[8vw]">
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
        subtitle="Deslize e conheça as rações Agrosaida — formulação balanceada para bovinos, equinos, cães e aves."
        products={RACOES}
        accent="#d5a85a"
        showAnimals
      />
      <CarouselSection
        id="medicamentos"
        eyebrow="MEDICAMENTOS"
        title="Saúde do seu rebanho em primeiro lugar."
        subtitle="Vermífugos, antiparasitários e suplementos para manter seus animais sempre saudáveis."
        products={MEDICAMENTOS}
        accent="#a3c77a"
      />
      <CarouselSection
        id="botas-chapeus"
        eyebrow="BOTAS & CHAPÉUS"
        title="Equipado para o trabalho no campo."
        subtitle="Botas e chapéus de qualidade, feitos para durar e proteger você em cada jornada."
        products={BOTAS_CHAPEUS}
        accent="#c9a86a"
      />
    </>
  );
}