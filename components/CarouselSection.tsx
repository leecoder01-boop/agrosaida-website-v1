"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WHATSAPP_NUMBER = "553432311843";

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
  backgroundImage?: string;
  className?: string;
};

export default function CarouselSection({
  id,
  eyebrow,
  title,
  subtitle,
  products,
  accent = "#d5a85a",
  backgroundImage,
  className = "",
}: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const shelfRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const animatingRef = useRef(false);
  const [index, setIndex] = useState(0);
  const maxIndex = Math.max(0, products.length - 1);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const isPremium = id === "racoes";

  const goto = (i: number) => {
    const clamped = Math.min(Math.max(i, 0), maxIndex);
    if (clamped === index || animatingRef.current) return;
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(".carousel-card");
    if (!card) return;
    const step = card.offsetWidth + 24; // card width + gap
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isMobile) {
      shelfRef.current?.scrollTo({
        left: clamped * step,
        behavior: reduceMotion ? "auto" : "smooth",
      });
      setIndex(clamped);
      setCanPrev(clamped > 0);
      setCanNext(clamped < maxIndex);
      return;
    }

    const direction = clamped > index ? 1 : -1;
    const cards = track.querySelectorAll<HTMLElement>(".carousel-card");

    if (isPremium && !reduceMotion) {
      animatingRef.current = true;
      setIsAnimating(true);

      gsap.timeline({
        onComplete: () => {
          gsap.set(cards, { clearProps: "transform,opacity" });
          animatingRef.current = false;
          setIsAnimating(false);
        },
      })
        .to(cards, {
          x: direction > 0 ? -100 : 100,
          opacity: 0,
          scale: 0.96,
          duration: 0.32,
          stagger: 0.025,
          ease: "power2.in",
        })
        .set(track, { x: -clamped * step })
        .set(cards, {
          x: direction > 0 ? 100 : -100,
          opacity: 0,
          scale: 0.96,
        })
        .to(cards, {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.65,
          stagger: 0.05,
          ease: "power3.out",
        });
    } else {
      gsap.to(track, {
        x: -clamped * step,
        duration: reduceMotion ? 0 : 0.7,
        ease: "power3.out",
      });
    }

    setIndex(clamped);
    setCanPrev(clamped > 0);
    setCanNext(clamped < maxIndex);
  };

  useEffect(() => {
    const shelf = shelfRef.current;
    const track = trackRef.current;
    if (!shelf || !track) return;

    let frame = 0;
    const syncIndex = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!window.matchMedia("(max-width: 767px)").matches) return;
        const card = track.querySelector<HTMLElement>(".carousel-card");
        if (!card) return;
        const step = card.offsetWidth + 24;
        const nextIndex = Math.min(maxIndex, Math.max(0, Math.round(shelf.scrollLeft / step)));
        setIndex(nextIndex);
        setCanPrev(nextIndex > 0);
        setCanNext(nextIndex < maxIndex);
      });
    };

    shelf.addEventListener("scroll", syncIndex, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      shelf.removeEventListener("scroll", syncIndex);
    };
  }, [maxIndex]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 86%",
          toggleActions: "play none restart reverse",
        },
      });

      intro
        .fromTo(rootRef.current, { clipPath: "inset(10% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power3.out" }, 0)
        .fromTo(".carousel-eyebrow", { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power2.out" }, 0.06)
        .fromTo(".carousel-title", { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.76, ease: "power3.out" }, 0.1)
        .fromTo(".carousel-subtitle", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: "power2.out" }, 0.2)
        .fromTo(".carousel-controls", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, 0.22)
        .fromTo(".carousel-shelf", { y: isPremium ? 30 : 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.68, ease: "power3.out" }, 0.28);

      const cards = gsap.utils.toArray<HTMLElement>(".carousel-card");
      intro
        .fromTo(cards, { opacity: 0, y: 55, filter: "brightness(0.58) saturate(0.78)" }, { opacity: 1, y: 0, filter: "brightness(1) saturate(1)", duration: 0.46, stagger: 0.06, ease: "power3.out" }, 0.3)
        .set(cards, { clearProps: "transform,opacity,filter" });

      if (backgroundRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
      }
    }, rootRef);
    return () => ctx.revert();
  }, [isPremium]);

  const handleQuote = (name: string) => {
    const msg = `Olá! Tenho interesse no produto ${name}. Pode me informar o valor e a disponibilidade?`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <section
      ref={rootRef}
      id={id}
      className={`relative isolate overflow-hidden bg-transparent px-6 py-24 md:px-10 md:py-32 lg:px-[8vw] ${className}`}
    >
      {backgroundImage && (
        <>
          <div
            ref={backgroundRef}
            className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat will-change-transform"
            style={{ backgroundImage: `url('${backgroundImage}')` }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(2,10,6,0.88),rgba(5,20,12,0.72),rgba(2,10,6,0.64))] md:bg-[linear-gradient(90deg,rgba(2,10,6,0.78),rgba(5,20,12,0.56),rgba(2,10,6,0.50))]"
            aria-hidden="true"
          />
        </>
      )}

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* header + controls */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="max-w-2xl">
            <span className="carousel-eyebrow eyebrow" style={{ color: accent }}>
              {eyebrow}
            </span>
            <h2 className="carousel-title mt-4 font-display text-[#f2ead6] text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
              {title}
            </h2>
            <p className="carousel-subtitle mt-5 text-[#b9c7a8]/85 leading-relaxed text-lg">{subtitle}</p>
          </div>

          {/* arrows */}
          <div className="carousel-controls flex gap-3 shrink-0">
            <button
              aria-label="Anterior"
              onClick={() => goto(index - 1)}
              disabled={!canPrev || isAnimating}
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
              disabled={!canNext || isAnimating}
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
        <div
          ref={shelfRef}
          className={`carousel-shelf mt-14 origin-top overflow-x-auto overscroll-x-contain scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:overflow-hidden md:snap-none ${isPremium ? "group/shelf" : ""}`}
        >
          <div ref={trackRef} className="flex w-max gap-6 pr-6 will-change-transform md:w-auto md:pr-0">
            {products.map((p) => (
              <article
                key={p.name}
                className={`carousel-card group relative shrink-0 w-[80vw] snap-start sm:w-[380px] md:w-[420px] md:snap-none flex flex-col overflow-hidden border border-[#b9c7a8]/12 bg-[#122415]/80 shadow-[0_18px_48px_-20px_rgba(0,0,0,0.75)] transition-[transform,box-shadow,border-color,opacity] duration-500 will-change-transform ${
                  isPremium
                    ? "rounded-[1.75rem] group-hover/shelf:opacity-70 hover:!opacity-100 hover:-translate-y-1.5 hover:scale-[1.01] hover:border-[#6fa85a]/70 hover:shadow-[0_24px_54px_-22px_rgba(74,124,56,0.42)]"
                    : "rounded-xl hover:-translate-y-2 hover:border-[#d5a85a]/50 hover:shadow-[0_26px_58px_-22px_rgba(213,168,90,0.3)]"
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#0a140c]">
                  <div className="absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(ellipse_at_center,rgba(213,168,90,0.2),transparent_70%)] pointer-events-none" />
                  <img
                    src={p.image}
                    alt={p.name}
                    className={`h-full w-full object-cover transition-transform duration-700 will-change-transform ${isPremium ? "group-hover:scale-[1.035]" : "group-hover:scale-[1.06]"}`}
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
                    className={`group/button relative mt-6 inline-flex items-center justify-center gap-2 overflow-hidden rounded-sm bg-[#4a7c38] text-[#f2ead6] text-[13px] tracking-[0.14em] uppercase px-6 py-3.5 transition-all duration-300 hover:bg-[#5a9146] hover:shadow-[0_0_22px_rgba(74,124,56,0.45)]`}
                  >
                    {isPremium && <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover/button:translate-x-[450%]" aria-hidden="true" />}
                    <span className="relative z-10">Pedir orçamento</span>
                    <svg className="relative z-10" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
              disabled={isAnimating}
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
