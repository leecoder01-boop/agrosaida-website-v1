"use client";

import gsap from "gsap";

import { useEffect, useRef, useState } from "react";

type Props = {
  onComplete: () => void;
  videoReady: boolean;
};

/**
 * Cinematic preloader: 00-100 counter, scaleX line, letter-spacing closing,
 * curtain exit. Waits for video metadata, with a safety timeout.
 */
export default function Preloader({ onComplete, videoReady }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const doneRef = useRef(false);
  const startedRef = useRef(false);
  const videoReadyRef = useRef(videoReady);

  useEffect(() => {
    videoReadyRef.current = videoReady;
  }, [videoReady]);

  useEffect(() => {
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    lenis?.stop();
    document.body.style.overflow = "hidden";

    const finish = () => {
      if (doneRef.current || startedRef.current) return;
      startedRef.current = true;
      import("gsap").then(({ gsap }) => {
        const tl = gsap.timeline({
          onComplete: () => {
            doneRef.current = true;
            setDone(true);
            document.body.style.overflow = "";
            lenis?.start();
            onComplete();
          },
        });
        tl.to(line.current, { scaleX: 1, duration: 0.3, ease: "power2.in" })
          .to(".pre-fade", { opacity: 0, duration: 0.4 }, "<")
          .to(word.current, { letterSpacing: "0.02em", duration: 0.7 }, "<")
          .to(".pre-panel", {
            yPercent: -100,
            duration: 1.1,
            stagger: 0.08,
            ease: "power4.inOut",
          })
          .set(root.current, { display: "none" });
      });
    };

    const safety = window.setTimeout(finish, 7000);
    const onFinishEvent = () => finish();
    window.addEventListener("preloader:finish", onFinishEvent);

    // watchdog: se a timeline travar (fast refresh, erro no gsap, etc.),
    // força a finalização para o site nunca ficar preso no preloader
    const watchdog = window.setTimeout(() => {
      if (doneRef.current) return;
      doneRef.current = true;
      startedRef.current = true;
      if (root.current) root.current.style.display = "none";
      document.body.style.overflow = "";
      lenis?.start();
      setDone(true);
      onComplete();
    }, 8500);

    import("gsap").then(({ gsap }) => {
      gsap.fromTo(
        word.current,
        { letterSpacing: "0.6em", opacity: 0 },
        { opacity: 1, duration: 1.2, ease: "power2.out" }
      );
      gsap.fromTo(
        ".pre-fade",
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, delay: 0.3, ease: "power2.out" }
      );

      const progress = { v: 0 };
      gsap.to(progress, {
        v: 100,
        duration: 1.6,
        ease: "power2.inOut",
        onUpdate: () => {
          const capped = videoReadyRef.current ? progress.v : Math.min(progress.v, 92);
          if (counter.current) counter.current.textContent = String(Math.floor(capped)).padStart(2, "0");
          if (line.current) line.current.style.transform = `scaleX(${capped / 100})`;
          if (capped >= 100 && !startedRef.current) finish();
        },
      });
    });

    return () => {
      window.clearTimeout(safety);
      window.removeEventListener("preloader:finish", onFinishEvent);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!videoReady) return;
    import("gsap").then(({ gsap }) => {
      const obj = { v: 92 };
      gsap.to(obj, {
        v: 100,
        duration: 0.5,
        ease: "power2.out",
        onUpdate: () => {
          if (counter.current) counter.current.textContent = String(Math.floor(obj.v)).padStart(2, "0");
          if (line.current) line.current.style.transform = `scaleX(${obj.v / 100})`;
        },
        onComplete: () => window.dispatchEvent(new CustomEvent("preloader:finish")),
      });
    });
  }, [videoReady]);

  if (done) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[100] overflow-hidden" aria-label="Carregando">
      <div className="pre-panel absolute inset-x-0 top-0 h-[50.5%] bg-ink" />
      <div className="pre-panel absolute inset-x-0 bottom-0 h-[50.5%] bg-ink" />
      <div
        ref={word}
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center font-display text-[7.5vw] md:text-[6vw] font-semibold tracking-[0.6em] text-white/[0.06] select-none pointer-events-none whitespace-nowrap pl-[0.6em]"
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