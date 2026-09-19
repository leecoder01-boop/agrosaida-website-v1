"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Camera, Mail, MapPin, Phone } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const MAPS_URL =
  "https://www.google.com/maps/place/agrosaida+localizacao/data=!4m2!3m1!1s0x94a444b1a8b18bb7:0x26f6772ec3247d43?sa=X&ved=1t:242&ictx=111";

const CONTACTS = [
  {
    label: "Telefone",
    value: "(34) 99999-2026",
    href: "tel:+5534999992026",
    icon: Phone,
  },
  {
    label: "E-mail",
    value: "contato@agrosaida.com.br",
    href: "mailto:contato@agrosaida.com.br",
    icon: Mail,
  },
  {
    label: "Instagram",
    value: "@agrosaida.oficial",
    href: "https://www.instagram.com/agrosaida.oficial/",
    icon: Camera,
  },
];

export default function ContactSection() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reveal = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 84%",
          toggleActions: "play none restart reverse",
        },
      });
      reveal
        .fromTo(".contact-darken", { opacity: 0 }, { opacity: 0.72, duration: 1.15, ease: "power2.inOut" }, 0)
        .fromTo(".contact-horizon", { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 0.78, duration: 1.15, ease: "power3.inOut" }, 0.28)
        .fromTo(".contact-ambient", { opacity: 0, scaleX: 0.72 }, { opacity: 0.3, scaleX: 1, duration: 1.2, ease: "power2.out" }, 0.34)
        .fromTo(".contact-kicker", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: "power2.out" }, 0.62)
        .fromTo(".contact-title", { y: 82, opacity: 0 }, { y: 0, opacity: 1, duration: 1.08, ease: "power4.out" }, 0.7)
        .fromTo(".contact-copy", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.62, stagger: 0.1, ease: "power2.out" }, 1.02)
        .fromTo(".contact-item", { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.58, stagger: 0.1, ease: "power3.out" }, 1.12)
        .fromTo(".contact-cta", { opacity: 0, scale: 0.985, y: 22 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out" }, 1.34);
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="contato"
      className="relative isolate overflow-hidden bg-[#07110b] px-6 py-24 md:px-10 md:py-32 lg:px-[8vw]"
    >
      <div className="contact-darken pointer-events-none absolute inset-0 z-0 bg-[#010604] opacity-0" aria-hidden="true" />
      <div className="contact-ambient pointer-events-none absolute inset-x-[-10%] top-[40%] z-[1] h-40 origin-center bg-[radial-gradient(ellipse_at_center,rgba(213,168,90,0.13),rgba(74,124,56,0.06)_38%,transparent_72%)] opacity-0 blur-xl" aria-hidden="true" />
      <div className="contact-horizon pointer-events-none absolute left-1/2 top-[49%] z-[2] h-px w-[min(86vw,1100px)] -translate-x-1/2 origin-center bg-[linear-gradient(90deg,transparent,rgba(163,199,122,0.28)_25%,rgba(213,168,90,0.72)_50%,rgba(163,199,122,0.28)_75%,transparent)] opacity-0 shadow-[0_0_14px_rgba(213,168,90,0.13)]" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-60 [background:radial-gradient(circle_at_75%_35%,rgba(74,124,56,0.20),transparent_38%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,0.72fr)] lg:items-center lg:gap-20">
        <div>
          <div>
            <span className="contact-kicker eyebrow text-[#d5a85a]">FALE COM A AGROSAIDA</span>
            <h2 className="contact-title mt-4 max-w-2xl font-display text-4xl leading-[1.05] text-[#f2ead6] md:text-6xl">
              Estamos perto de quem vive o campo.
            </h2>
            <p className="contact-copy mt-6 max-w-xl text-lg leading-relaxed text-[#b9c7a8]/85">
              Visite nossa loja ou fale com a equipe para encontrar produtos e orientações para sua rotina.
            </p>
            <span className="contact-copy mt-4 inline-flex rounded-full border border-[#d5a85a]/25 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-[#d5a85a]/75">
              Contatos demonstrativos
            </span>
          </div>

          <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
            {CONTACTS.map(({ label, value, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="contact-item group flex items-center gap-4 py-6 text-[#f2ead6] transition-colors hover:text-[#a3c77a]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#4a7c38]/60 bg-[#102619]/80 text-[#a3c77a]">
                  <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] uppercase tracking-[0.25em] text-[#b9c7a8]/55">{label}</span>
                  <span className="mt-1 block break-words text-base md:text-lg">{value}</span>
                </span>
                <ArrowUpRight className="shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" size={18} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div className="contact-cta origin-center">
          <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-white/10 bg-[#102619] shadow-[0_30px_80px_-32px_rgba(0,0,0,0.9)]">
            <div
              className="pointer-events-none absolute inset-0 bg-[#173522] [background-image:linear-gradient(32deg,transparent_44%,rgba(213,168,90,0.20)_45%,rgba(213,168,90,0.20)_47%,transparent_48%),linear-gradient(118deg,transparent_37%,rgba(163,199,122,0.16)_38%,rgba(163,199,122,0.16)_40%,transparent_41%),radial-gradient(circle_at_70%_26%,rgba(74,124,56,0.9),transparent_26%)]"
              aria-hidden="true"
            />
            <iframe
              title="Localização da Agrosaida no Google Maps"
              src="https://www.google.com/maps?q=Rua%20dos%20Flamingos%2C%202208%2C%20Jardim%20das%20Palmeiras%2C%20Uberlandia%2C%20MG&output=embed"
              className="relative h-full w-full border-0 opacity-70 grayscale-[0.25] contrast-[0.95]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              tabIndex={-1}
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(90deg,rgba(242,234,214,0.12)_1px,transparent_1px),linear-gradient(rgba(242,234,214,0.12)_1px,transparent_1px)] [background-size:52px_52px]"
              aria-hidden="true"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgba(3,12,7,0.88)_100%)]" aria-hidden="true" />
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir localização da Agrosaida no Google Maps"
              className="group absolute inset-0 flex items-end p-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-5px] focus-visible:outline-[#d5a85a] md:p-8"
            >
              <span className="flex w-full items-end gap-4 text-[#f2ead6]">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#4a7c38] shadow-[0_0_24px_rgba(74,124,56,0.42)]">
                  <MapPin size={21} aria-hidden="true" />
                </span>
                <span className="flex-1">
                  <span className="block text-[10px] uppercase tracking-[0.24em] text-[#d5a85a]">Como chegar</span>
                  <span className="mt-1 block text-sm leading-relaxed md:text-base">
                    Rua dos Flamingos, 2208 · Jardim das Palmeiras · Uberlândia/MG
                  </span>
                </span>
                <ArrowUpRight className="mb-1 shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" size={20} aria-hidden="true" />
              </span>
            </a>
          </div>
          <p className="mt-4 text-center text-xs tracking-wide text-[#b9c7a8]/55">
            Clique no mapa para abrir a rota no Google Maps.
          </p>
        </div>
      </div>
    </section>
  );
}
