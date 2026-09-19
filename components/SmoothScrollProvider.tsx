"use client";

import { useEffect, ReactNode } from "react";
import Lenis from "lenis";

export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
    });

    // Sync Lenis with GSAP ticker
    lenis.on("scroll", () => {
      // ScrollTrigger picks up scroll via scrollerProxy-less integration
    });

    const raf = (time: number) => {
      lenis.raf(time);
    };
    // Lenis provides its own raf via gsap ticker integration below
    let gsapTickerCleanup = () => {};
    import("gsap").then(({ gsap }) => {
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
      gsapTickerCleanup = () => {
        gsap.ticker.remove((time: number) => lenis.raf(time * 1000));
      };
    });

    // Expose globally for header hide/show and marquee velocity
    (window as unknown as { lenis: Lenis }).lenis = lenis;

    return () => {
      gsapTickerCleanup();
      lenis.destroy();
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, []);

  return <>{children}</>;
}