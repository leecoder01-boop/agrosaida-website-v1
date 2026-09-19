"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  onComplete: () => void;
};

/**
 * Cinematic preloader: 00-100 counter, scaleX line, letter-spacing closing,
 * curtain exit. Waits for video metadata, with a safety timeout.
 */
export default function Preloader({ onComplete }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const doneRef = useRef(false);
  const startedRef = useRef(false);
  useEffect(() => {
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    lenis?.stop();
    document.body.style.overflow = "hidden";

    const finish = () => {
      if (doneRef.current || startedRef.current) return;
      startedRef.current = true;
      onComplete();
      import("gsap").then(({ gsap }) => {
        const tl = gsap.timeline({
          onComplete: () => {
            doneRef.current = true;
            setDone(true);
            document.body.style.overflow = "";
            lenis?.start();
          },
        });
        tl.to(line.current, { scaleX: 1, duration: 0.12, ease: "power2.in" })
          .to(".pre-fade", { opacity: 0, y: -10, duration: 0.22 }, "<")
          .to(word.current, { opacity: 0, scale: 1.025, duration: 0.38, ease: "power2.inOut" }, "<")
          .to(".pre-panel", {
            scaleY: 0,
            duration: 0.72,
            ease: "power4.inOut",
            stagger: 0.035,
          }, 0.16)
          .set(root.current, { display: "none" });
      });
    };

    const safety = window.setTimeout(finish, 1300);
    const onFinishEvent = () => finish();
    window.addEventListener("preloader:finish", onFinishEvent);

    // watchdog: se a timeline travar (fast refresh, erro no gsap, etc.),
    // força a finalização para o site nunca ficar preso no preloader
    const watchdog = window.setTimeout(() => {
      if (doneRef.current) return;
      doneRef.current = true;
      if (root.current) root.current.style.display = "none";
      document.body.style.overflow = "";
      lenis?.start();
      setDone(true);
      if (!startedRef.current) {
        startedRef.current = true;
        onComplete();
      }
    }, 2800);

    import("gsap").then(({ gsap }) => {
      gsap.fromTo(
        word.current,
        { opacity: 0, y: 16, scale: 0.985 },
        { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: "power3.out" }
      );
      gsap.fromTo(
        ".pre-fade",
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, delay: 0.3, ease: "power2.out" }
      );

      const progress = { v: 0 };
      gsap.to(progress, {
        v: 100,
        duration: 0.95,
        ease: "power2.inOut",
        onUpdate: () => {
          if (counter.current) counter.current.textContent = String(Math.floor(progress.v)).padStart(2, "0");
          if (line.current) line.current.style.transform = `scaleX(${progress.v / 100})`;
          if (progress.v >= 99.8 && !startedRef.current) finish();
        },
      });
    });

    return () => {
      window.clearTimeout(safety);
      window.clearTimeout(watchdog);
      window.removeEventListener("preloader:finish", onFinishEvent);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (done) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[100] overflow-hidden" aria-label="Carregando">
      <div className="pre-panel absolute inset-x-0 top-0 h-[50.5%] origin-top bg-ink" />
      <div className="pre-panel absolute inset-x-0 bottom-0 h-[50.5%] origin-bottom bg-ink" />
      <div
        ref={word}
        className="absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 flex items-center justify-center whitespace-nowrap font-display text-[10vw] font-semibold tracking-[0.08em] text-paper md:text-[5vw] lg:text-[4vw] select-none pointer-events-none"
        aria-hidden="true"
      >
        AGROSAIDA
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-[12vh]">
        <span ref={counter} className="pre-fade font-display text-5xl md:text-7xl text-paper tabular-nums">
          00
        </span>
        <div className="pre-fade mt-2 text-[11px] tracking-[0.35em] uppercase text-sand/60">
          Preparando terreno
        </div>
        <div className="pre-fade mt-8 w-[min(320px,60vw)] h-px bg-paper/15">
          <div ref={line} className="h-full w-full origin-left bg-gold scale-x-0" />
        </div>
      </div>
    </div>
  );
}
