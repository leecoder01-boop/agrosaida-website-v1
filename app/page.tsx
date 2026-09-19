"use client";

import { useState, useCallback } from "react";
import Preloader from "@/components/Preloader";
import Header from "@/components/Header";
import HeroTransition from "@/components/HeroTransition";
import AboutSection from "@/components/AboutSection";
import AbasSection from "@/components/AbasSection";
import CarouselsSection from "@/components/CarouselsSection";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [activeSection, setActiveSection] = useState<"hero" | "abas">("hero");

  const onVideoReady = useCallback(() => setVideoReady(true), []);
  const onPreloaderComplete = useCallback(() => setLoaded(true), []);

  return (
    <main>
      <Preloader onComplete={onPreloaderComplete} videoReady={videoReady} />
      <Header visible={loaded} />
      <HeroTransition onVideoReady={onVideoReady} setNextSection={setActiveSection} start={loaded} />
      <AboutSection />
      <AbasSection />
      <CarouselsSection />
    </main>
  );
}