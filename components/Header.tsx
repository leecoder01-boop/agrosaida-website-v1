"use client";

import gsap from "gsap";

import { useEffect, useRef } from "react";

const LINKS = [
  { label: "Sobre", href: "#sobre" },
  { label: "Soluções", href: "#solucoes" },
  { label: "Atuação", href: "#atuacao" },
  { label: "Contato", href: "#contato" },
];

export default function Header({ visible }: { visible: boolean }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    import("gsap").then(({ gsap }) => {
      // entrance: logo clip-path, links stagger, CTA last
      const tl = gsap.timeline({ delay: 0.2 });
      tl.fromTo(".hd-logo", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power3.out" })
        .fromTo(".hd-link", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.07, ease: "power2.out" }, "-=0.4")
        .fromTo(".hd-cta", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.3");
    });

    // hide/show on scroll direction
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      const el = root.current;
      if (!el) return;
      if (y > 120 && y > lastY + 4) el.dataset.hide = "1";
      else if (y < lastY - 4 || y < 120) el.dataset.hide = "0";
      el.dataset.solid = y > 80 ? "1" : "0";
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // active section highlight
  useEffect(() => {
    const ids = LINKS.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            document.querySelectorAll(".hd-link").forEach((a) => {
              const active = (a as HTMLAnchorElement).getAttribute("href") === `#${e.target.id}`;
              (a as HTMLElement).style.opacity = active ? "1" : "0.55";
            });
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header
      ref={root}
      data-hide="0"
      data-solid="0"
      style={{ opacity: visible ? 1 : 0 }}
      className={`fixed top-0 inset-x-0 z-50 transition-[transform,background,backdrop-filter,height,opacity] duration-500 ${visible ? "" : "pointer-events-none"}`}
    >
      <nav className="flex items-center justify-between h-full px-6 md:px-10 lg:px-16" aria-label="Navegação principal">
        <a href="#hero" className="hd-logo font-display text-lg md:text-xl tracking-[0.28em] text-paper">
          AGROSAIDA
        </a>
        <ul className="hidden md:flex items-center gap-8 lg:gap-10">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="hd-link group relative text-[13px] tracking-[0.18em] uppercase text-paper/90 transition-opacity duration-300">
                {l.label}
                <span className="link-line absolute -bottom-1 left-0 h-px w-full bg-gold origin-right scale-x-0 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:origin-left group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>
        <a href="#contato" className="hd-cta group relative inline-flex items-center px-6 py-2.5 rounded-full border border-paper/25 text-[13px] tracking-[0.14em] uppercase text-paper transition-colors duration-500 hover:border-gold hover:text-gold">
          Fale conosco
        </a>
      </nav>
    </header>
  );
}