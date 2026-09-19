"use client";

import gsap from "gsap";

import { useEffect, useRef } from "react";
import MagneticButton from "./MagneticButton";

/**
 * Depth-layered hero:
 * 1. drone video (back)
 * 2. AGROSAIDA title, masked - rises from yPercent 120 to 0, scale 0.94 -> 1
 * 3. foreground crop strip (front) - a cropped copy of the same video
 *    covering the bottom strip, so the title appears to come from behind
 *    the plantation itself.
 * The reveal is synchronized with the video currentTime.
 */
export default function HeroVideo({
  onVideoReady,
}: {
  onVideoReady?: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoFront = useRef<HTMLVideoElement>(null);
  const title = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const v = videoRef.current!;
    const onMeta = () => onVideoReady?.();
    if (v.readyState >= 1) onMeta();
    v.addEventListener("loadeddata", onMeta);
    const safety = setTimeout(onMeta, 6000);
    return () => {
      v.removeEventListener("loadeddata", onMeta);
      clearTimeout(safety);
    };
  }, [onVideoReady]);

  useEffect(() => {
    const v = videoRef.current!;
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()),
      { threshold: 0.05 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    let killed = false;
    const cleanups: Array<() => void> = [];

    (async () => {
      const { gsap } = await import("gsap");
      if (killed || !root.current) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const v = videoRef.current!;
      const titleEl = title.current;

      const playReveal = () => {
        if (killed || !titleEl) return;
        if (reduce) {
          gsap.set(titleEl, { opacity: 1, yPercent: 0, scale: 1 });
          return;
        }
        // looping masked-text effect (brand gold instead of neon green)
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
        tl.set(titleEl, { opacity: 0, y: 50, scale: 1 })
          .set(".text-mask", { width: "0%", x: "0%" })
          .to(titleEl, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
          .to(".text-mask", { width: "100%", duration: 0.8, ease: "power2.inOut" }, "-=0.3")
          .to(".text-mask", { x: "100%", duration: 0.8, ease: "power2.inOut" })
          .to(titleEl, { opacity: 0, y: -50, duration: 0.6, ease: "power2.in" }, "-=0.4")
          .set(".text-mask", { x: "0", width: "0%" });
        cleanups.push(() => tl.kill());
      };

      // sync with video.currentTime: reveal when the drone starts to climb
      let revealed = false;
      const tryReveal = () => {
        if (revealed) return;
        if (v.readyState >= 2 && (v.currentTime >= 0.1 || !v.paused)) {
          revealed = true;
          playReveal();
        }
      };
      const onTime = () => tryReveal();
      const onLoaded = () => tryReveal();
      v.addEventListener("timeupdate", onTime);
      v.addEventListener("loadeddata", onLoaded);
      tryReveal();
      const fallback = setTimeout(() => {
        if (!revealed) {
          revealed = true;
          playReveal();
        }
      }, 2500);
      cleanups.push(() => {
        v.removeEventListener("timeupdate", onTime);
        v.removeEventListener("loadeddata", onLoaded);
        clearTimeout(fallback);
      });

      if (!reduce) {
        const intro = gsap.timeline({ delay: 1.2 });
        intro
          .fromTo(".hero-eyebrow-mask > div", { yPercent: 120 }, { yPercent: 0, duration: 0.8, ease: "power3.out" }, 0)
          .fromTo(".hero-desc", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 0.4)
          .fromTo(".hero-cta", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" }, 0.7)
          .fromTo(".hero-meta", { opacity: 0 }, { opacity: 1, duration: 0.9, stagger: 0.12 }, 0.9);
        cleanups.push(() => intro.kill());

        // foreground crop strip: subtle drift to sell the parallax depth
        const drift = gsap.fromTo(
          ".hero-crop-front",
          { yPercent: 0 },
          { yPercent: -1.5, duration: 6, ease: "none", repeat: -1, yoyo: true }
        );
        cleanups.push(() => drift.kill());
      }
    })();

    return () => {
      killed = true;
      cleanups.forEach((fn) => fn());
    };
  }, []);

  // keep the front video in sync with the back one (same frame = seamless)
  useEffect(() => {
    const back = videoRef.current!;
    const front = videoFront.current;
    if (!front) return;
    const sync = () => {
      if (Math.abs(front.currentTime - back.currentTime) > 0.15) {
        front.currentTime = back.currentTime;
      }
      if (back.paused) front.pause();
      else front.play().catch(() => {});
    };
    back.addEventListener("timeupdate", sync);
    back.addEventListener("play", sync);
    back.addEventListener("pause", sync);
    const interval = window.setInterval(sync, 1000);
    return () => {
      back.removeEventListener("timeupdate", sync);
      back.removeEventListener("play", sync);
      back.removeEventListener("pause", sync);
      window.clearInterval(interval);
    };
  }, []);

  return (
    <section id="hero" ref={root} className="relative h-screen overflow-hidden bg-ink">
      {/* LAYER 1 - drone video (back) */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/_base-placeholder.svg"
        >
          <source src="/videos/agrosaida-hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-ink/45" />
      </div>

      {/* LAYER 2 - masked AGROSAIDA title, rises from behind the crops and
          settles exactly at the center of the screen */}
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div
          className="overflow-hidden"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, black 62%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, black 62%, transparent 100%)",
          }}
        >
          <div className="text-container relative">
          <div
            className="text-mask absolute top-0 left-0 h-full w-0 bg-gold"
            style={{ transformOrigin: "left" }}
            aria-hidden="true"
          />
          <h1
            ref={title}
            className="font-display font-semibold text-paper text-[15vw] md:text-[13vw] lg:text-[11vw] leading-[1] tracking-[0.02em] select-none will-change-transform whitespace-nowrap"
            style={{ opacity: 0, transform: "translateY(50px)" }}
          >
            <span className="sr-only">AGROSAIDA</span>
            AGROSAIDA
          </h1>
        </div>
        </div>
      </div>

      {/* LAYER 3 - foreground crop strip (front) */}
      <div className="hero-crop-front pointer-events-none absolute inset-x-0 bottom-0 h-[22vh] overflow-hidden" aria-hidden="true">
        <video
          ref={videoFront}
          className="absolute left-0 w-full"
          style={{
            height: "100vh",
            bottom: "0",
            objectFit: "cover",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 45%)",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 45%)",
          }}
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/videos/agrosaida-hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* supporting content, below the centered title */}
      <div className="absolute inset-x-0 top-1/2 flex flex-col items-center text-center px-6 pt-[13vw] md:pt-[10vw] pointer-events-none">
        <div className="hero-eyebrow-mask overflow-hidden">
          <div>
            <span className="hero-eyebrow eyebrow block text-gold pb-1">Cultivando possibilidades</span>
          </div>
        </div>
        <p className="hero-desc mt-4 max-w-xl text-sand/85 text-base md:text-lg leading-relaxed">
          Experi&#234;ncia, proximidade e inova&#231;&#227;o para impulsionar cada novo ciclo.
        </p>
        <div className="hero-cta mt-6 pointer-events-auto">
          <MagneticButton href="#sobre" variant="gold">
            Conhe&#231;a a Agrosaida
          </MagneticButton>
        </div>
      </div>

      {/* scroll indicator */}
      <div className="hero-meta hero-scroll-hint absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-paper/60">
        <span className="text-[10px] tracking-[0.3em] uppercase">Role</span>
        <div className="h-10 w-px bg-paper/25 overflow-hidden">
          <div className="h-full w-full bg-gold animate-[scrolldown_2s_ease-in-out_infinite] origin-top" />
        </div>
      </div>

      <style>{`
        @keyframes scrolldown {
          0% { transform: scaleY(0); transform-origin: top; }
          45% { transform: scaleY(1); transform-origin: top; }
          55% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
      `}</style>
    </section>
  );
}