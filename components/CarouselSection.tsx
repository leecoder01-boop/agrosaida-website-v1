"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const WHATSAPP_NUMBER = "553432311843";

const ANIMAL_IMAGES = {
  left: "/images/animals-background/animal-left.webp",
  right: "/images/animals-background/animal-right.webp",
};

export type CarouselProduct = {
  name: string;
  detail: string;
  image: string;
};

type Props = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  products: CarouselProduct[];
  /** cor de destaque (hex) para eyebrow, hover e dots */
  accent?: string;
  /** exibe os animais transparentes como fundo da seção */
  showAnimals?: boolean;
  className?: string;
};

export default function CarouselSection({
  id,
  eyebrow,
  title,
  subtitle,
  products,
  accent = "#d5a85a",
  showAnimals = false,
  className = "",
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const maxIndex = Math.max(0, products.length - 1);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const goto = (i: number) => {
    const clamped = Math.min(Math.max(i, 0), maxIndex);
    setIndex(clamped);
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(".carousel-card");
    if (!card) return;
    const step = card.offsetWidth + 24; // card width + gap
    gsap.to(track, {
      x: -clamped * step,
      duration: 0.7,
      ease: "power3.out",
    });
    setCanPrev(clamped > 0);
    setCanNext(clamped < maxIndex);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".carousel-card",
        { opacity: 0, y: 40, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.08, ease: "power2.out", delay: 0.2 }
      );
    });
    return () => ctx.revert();
  }, []);

  const handleQuote = (name: string) => {
    const msg = `Olá! Tenho interesse no produto ${name}. Pode me informar o valor e a disponibilidade?`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <section
      id={id}
      className={`relative py-24 md:py-32 px-6 md:px-10 lg:px-[8vw] overflow-hidden ${className}`}
      style={showAnimals ? {
        backgroundImage: "url('/images/animals-background/animal-left.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      } : { backgroundColor: '#0c1a10' }}
    >

      <div className="relative max-w-7xl mx-auto">
        {/* header + controls */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="max-w-2xl">
            <span className="eyebrow" style={{ color: accent }}>
              {eyebrow}
            </span>
            <h2 className="mt-4 font-display text-[#f2ead6] text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
              {title}
            </h2>
            <p className="mt-5 text-[#b9c7a8]/85 leading-relaxed text-lg">{subtitle}</p>
          </div>

          {/* arrows */}
          <div className="flex gap-3 shrink-0">
            <button
              aria-label="Anterior"
              onClick={() => goto(index - 1)}
              disabled={!canPrev}
              className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 ${
                canPrev
                  ? "border-[#4a7c38] text-[#a3c77a] hover:bg-[#4a7c38] hover:text-[#f2ead6] hover:shadow-[0_0_22px_rgba(74,124,56,0.45)]"
                  : "border-[#b9c7a8]/15 text-[#b9c7a8]/30 cursor-not-allowed"
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              aria-label="Próximo"
              onClick={() => goto(index + 1)}
              disabled={!canNext}
              className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 ${
                canNext
                  ? "border-[#4a7c38] text-[#a3c77a] hover:bg-[#4a7c38] hover:text-[#f2ead6] hover:shadow-[0_0_22px_rgba(74,124,56,0.45)]"
                  : "border-[#b9c7a8]/15 text-[#b9c7a8]/30 cursor-not-allowed"
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* carousel */}
        <div className="mt-14 overflow-hidden">
          <div ref={trackRef} className="flex gap-6 will-change-transform">
            {products.map((p) => (
              <article
                key={p.name}
                className="carousel-card group relative shrink-0 w-[80vw] sm:w-[380px] md:w-[420px] flex flex-col overflow-hidden rounded-xl border border-[#b9c7a8]/12 bg-[#122415]/80 shadow-[0_18px_48px_-20px_rgba(0,0,0,0.75)] transition-all duration-500 hover:-translate-y-2 hover:border-[#d5a85a]/50 hover:shadow-[0_26px_58px_-22px_rgba(213,168,90,0.3)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#0a140c]">
                  <div className="absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(ellipse_at_center,rgba(213,168,90,0.2),transparent_70%)] pointer-events-none" />
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06] will-change-transform"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col flex-1 p-7">
                  <span className="text-[11px] tracking-[0.2em] uppercase" style={{ color: accent }}>
                    Agrosaida
                  </span>
                  <h3 className="mt-2 font-display text-[#f2ead6] text-2xl leading-snug">{p.name}</h3>
                  <p className="mt-2 text-sm text-[#b9c7a8]/70">{p.detail}</p>
                  <button
                    onClick={() => handleQuote(p.name)}
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-sm bg-[#4a7c38] text-[#f2ead6] text-[13px] tracking-[0.14em] uppercase px-6 py-3.5 transition-all duration-300 hover:bg-[#5a9146] hover:shadow-[0_0_22px_rgba(74,124,56,0.45)]"
                  >
                    Pedir orçamento
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* progress dots */}
        <div className="mt-10 flex gap-2.5">
          {products.map((_, i) => (
            <button
              key={i}
              aria-label={`Ir para o item ${i + 1}`}
              onClick={() => goto(i)}
              className={`h-1.5 rounded-full transition-all duration-400 ${
                i === index ? "w-10" : "w-4 bg-[#b9c7a8]/25 hover:bg-[#b9c7a8]/50"
              }`}
              style={i === index ? { background: accent } : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}