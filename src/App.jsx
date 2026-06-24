import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

// Global Components
import CustomCursor from "./components/CustomCursor";
import ScrollIndicator from "./components/ScrollIndicator";
import Header from "./components/Header";

// Page Sections
import Hero from "./sections/Hero";
import About from "./sections/About";
import ReelsGallery from "./sections/ReelsGallery";
import MediaDeck from "./sections/MediaDeck";
import Showcase from "./sections/Showcase";
import Collabs from "./sections/Collabs";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const loaderRef = useRef(null);
  const loaderTextRef = useRef(null);

  // Programmatic text splitter for loading screen
  const splitLoaderText = (text) => {
    return text.split("").map((char, index) => (
      <span key={index} className="loader-char inline-block translate-y-[80%] opacity-0">
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  useEffect(() => {
    // Prevent scrolling while loading
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        // Unlock scrolling
        document.body.style.overflow = "";
        setIsLoading(false);
      }
    });

    // Animate loader text characters up — faster stagger
    tl.to(".loader-char", {
      y: 0,
      opacity: 1,
      stagger: 0.05,
      duration: 0.7,
      ease: "power3.out"
    });

    // Hold screen state briefly — shorter pause
    tl.to(loaderTextRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: "power2.inOut",
      delay: 0.3
    });

    // Slide up loader curtain — faster
    tl.to(loaderRef.current, {
      yPercent: -100,
      duration: 0.8,
      ease: "power4.inOut"
    }, "-=0.15");

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      {/* Paper Grain Overlay for tactile texture */}
      <div className="paper-grain-overlay" />

      {/* Global Interactive Cursor */}
      <CustomCursor />

      {/* Global Reading/Scroll Progress Indicator */}
      <ScrollIndicator />

      {/* Elegant Page Intro Screen */}
      <div
        ref={loaderRef}
        className="fixed inset-0 w-full h-full bg-[#050505] z-[99999] flex flex-col items-center justify-center select-none"
      >
        <div ref={loaderTextRef} className="text-center space-y-4">
          {/* Logo Name Split */}
          <h1 className="text-4xl sm:text-5xl font-playfair font-normal tracking-widest text-cream overflow-hidden py-2 px-6">
            {splitLoaderText("DIVYA RANA")}
          </h1>
          {/* Eyebrow subtitle */}
          <div className="overflow-hidden">
            <p className="loader-char text-xs font-mono tracking-[0.3em] text-pink-400 uppercase opacity-0">
              BEAUTY • LIFESTYLE • SKINCARE
            </p>
          </div>
        </div>
      </div>

      {/* 
        Page Content: always in DOM so images start downloading immediately
        behind the loader. Visually opacity-0 / pointer-events:none while 
        loader is active, then fades in quickly once loader slides away.
      */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full flex flex-col relative z-10"
        aria-hidden={isLoading}
        style={{ pointerEvents: isLoading ? "none" : "auto" }}
      >
        {/* Sections — order: Hero → About → Gallery → Media → Lookbook → Collabs → Contact */}
        <Header />
        <Hero />
        <About />
        <ReelsGallery />
        <MediaDeck />
        <Showcase />
        <Collabs />
        <Contact />
        <Footer />
      </motion.div>
    </>
  );
}
