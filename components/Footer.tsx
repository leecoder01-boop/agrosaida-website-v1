"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useEffect, useRef } from "react";

export default function Footer() {
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
          scrollTrigger: { trigger: root.current, start: "top 85%" },
        });
        tl.fromTo(".ft-logo-mask", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.1, ease: "power3.out" })
          .fromTo(".ft-sep", { scaleX: 0 }, { scaleX: 1, duration: 0.9, stagger: 0.08, ease: "power2.out" }, "-=0.6")
          .fromTo(".ft-item", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: "power2.out" }, "-=0.5");
        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });
      return () => mm.revert();
    })();
    return () => { killed = true; };
  }, []);

  return (
    <footer ref={root} className="bg-ink border-t border-paper/10 px-6 md:px-10 lg:px-[8vw] pt-[12vh] pb-10">
      {/* big logo */}
      <div className="overflow-hidden">
        <div className="ft-logo-mask font-display text-[13vw] lg:text-[8vw] leading-none tracking-[0.04em] text-paper/90 select-none">
          AGROSAIDA
        </div>
      </div>

      <div className="ft-sep h-px w-full bg-paper/10 mt-10" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mt-12">
        <div>
          <span className="eyebrow text-sand/40 block mb-5">Navegação</span>
          <ul className="space-y-3">
            {[
              { label: "Sobre", href: "#sobre" },
              { label: "Soluções", href: "#solucoes" },
              { label: "Atuação", href: "#atuacao" },
              { label: "Processo", href: "#processo" },
            ].map((l) => (
              <li key={l.href}>
                <a href={l.href} className="ft-item group relative text-sm text-sand/70 hover:text-paper transition-colors">
                  {l.label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-full bg-gold origin-right scale-x-0 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:origin-left group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <span className="eyebrow text-sand/40 block mb-5">Contato</span>
          <ul className="space-y-3 text-sm text-sand/70">
            <li className="ft-item">[Telefone]</li>
            <li className="ft-item">[E-mail]</li>
            <li className="ft-item">[Endereço / Cidade — UF]</li>
          </ul>
        </div>

        <div>
          <span className="eyebrow text-sand/40 block mb-5">Redes sociais</span>
          <ul className="space-y-3">
            {["[Instagram]", "[LinkedIn]", "[YouTube]"].map((s) => (
              <li key={s}>
                <a href="#" className="ft-item text-sm text-sand/70 hover:text-gold transition-colors">{s}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex md:justify-end items-start">
          <a
            href="#hero"
            className="ft-item group inline-flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase text-sand/60 hover:text-gold transition-colors"
            aria-label="Voltar ao topo"
          >
            Voltar ao topo
            <span className="inline-block h-px w-10 bg-current transition-all duration-500 group-hover:w-14" />
          </a>
        </div>
      </div>

      <div className="ft-sep h-px w-full bg-paper/10 mt-12" />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-8 text-[11px] tracking-[0.2em] uppercase text-sand/35">
        <span className="ft-item">© {new Date().getFullYear()} Agrosaida. Todos os direitos reservados.</span>
        <div className="flex gap-8">
          <a href="#" className="ft-item hover:text-sand/70 transition-colors">[Política de privacidade]</a>
          <a href="#" className="ft-item hover:text-sand/70 transition-colors">[Termos de uso]</a>
        </div>
      </div>
    </footer>
  );
}