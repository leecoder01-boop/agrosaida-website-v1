"use client";

import gsap from "gsap";

import { useEffect, useRef, ReactNode, MouseEvent } from "react";

type Props = {
  children: ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  variant?: "light" | "dark" | "gold";
};

/**
 * Magnetic CTA: subtle magnetic pull on desktop, growing inner circle on hover,
 * vertical text swap. Degrades to a normal button on touch / reduced motion.
 */
export default function MagneticButton({
  children,
  href,
  className = "",
  onClick,
  ariaLabel,
  variant = "gold",
}: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const circle = useRef<HTMLDivElement>(null);
  const textTop = useRef<HTMLSpanElement>(null);
  const textBottom = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = wrap.current!;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const strength = 0.35;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      import("gsap").then(({ gsap }) => {
        gsap.to(el, { x: x * strength, y: y * strength, duration: 0.6, ease: "power3.out" });
      });
    };
    const onLeave = () => {
      import("gsap").then(({ gsap }) => {
        gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
      });
    };

    el.addEventListener("mousemove", onMove as unknown as EventListener);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove as unknown as EventListener);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const palette =
    variant === "gold"
      ? "bg-gold text-ink"
      : variant === "dark"
        ? "bg-ink text-paper"
        : "bg-paper text-ink";

  const inner = (
    <>
      {/* growing circle */}
      <div
        ref={circle}
        className="absolute inset-0 overflow-hidden rounded-full pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full rounded-full scale-0 group-hover:scale-[1.75] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] bg-current opacity-[0.12]" />
      </div>
      {/* vertical text swap */}
      <span className="relative block h-[1.4em] overflow-hidden leading-[1.4em]">
        <span ref={textTop} className="block group-hover:-translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
          {children}
        </span>
        <span ref={textBottom} className="block group-hover:-translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" aria-hidden="true">
          {children}
        </span>
      </span>
    </>
  );

  const cls = `group relative inline-flex items-center justify-center px-8 py-4 rounded-full font-medium text-sm tracking-wide overflow-hidden ${palette} ${className}`;

  return (
    <div ref={wrap} className="inline-block">
      {href ? (
        <a href={href} onClick={onClick} aria-label={ariaLabel} className={cls}>
          {inner}
        </a>
      ) : (
        <button type="button" onClick={onClick} aria-label={ariaLabel} className={cls}>
          {inner}
        </button>
      )}
    </div>
  );
}