import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Carousel3D from "../components/Carousel3D";

gsap.registerPlugin(ScrollTrigger);

export default function Showcase() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      ".showcase-fade-in",
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.15, duration: 1.0, ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" }
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="showcase"
      className="relative w-full min-h-screen bg-luxuryBlack flex flex-col justify-center py-24 px-6 sm:px-12 lg:px-20 overflow-hidden"
    >
      {/* Background glows */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-rose-glow/12 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-lavender-glow/15 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto flex flex-col space-y-16 z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 select-none">
          <div className="space-y-4">
            <span className="showcase-fade-in font-sans text-xs sm:text-sm text-pink-400 tracking-[0.25em] font-semibold uppercase block">
              05 DIGITAL LOOKBOOK
            </span>
            <h2 className="showcase-fade-in text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-italiana font-normal leading-tight text-pink-sunset-gradient drop-shadow-[0_0_20px_rgba(251,113,133,0.18)]">
              Featured Work
            </h2>
          </div>
          <p className="showcase-fade-in text-sm sm:text-base text-cream/70 max-w-sm font-light leading-relaxed font-sans">
            Explore the 3D lookbook — drag to rotate on desktop, swipe on mobile.
          </p>
        </div>

        <div className="h-[1px] w-full bg-white/10 showcase-fade-in" />

        {/* 3D Lookbook Carousel */}
        <div className="showcase-fade-in space-y-4">
          <div className="flex items-center space-x-3 select-none">
            <span className="font-sans text-[11px] text-pink-400/80 tracking-[0.2em] font-bold uppercase">
              LOOKBOOK: 3D CYLINDER ROTATION
            </span>
            <div className="h-[1px] w-12 bg-pink-500/20" />
          </div>
          <Carousel3D />
        </div>

      </div>
    </section>
  );
}
