import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { influencerData } from "../config/content";
import ThreeCanvas from "../components/ThreeCanvas";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef(null);
  const leftContentRef = useRef(null);
  const rightContentRef = useRef(null);

  // Helper function to split text into spans for GSAP animation
  const splitText = (text) => {
    return text.split("").map((char, index) => (
      <span key={index} className="hero-char inline-block translate-y-[100%] opacity-0">
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  useEffect(() => {
    // 1. Initial Load Animations
    const tl = gsap.timeline({ delay: 0.6 });

    // Name letter-by-letter animation
    tl.to(".hero-char", {
      y: 0,
      opacity: 1,
      stagger: 0.04,
      duration: 0.8,
      ease: "power4.out"
    });

    // Tagline fade and lift
    tl.to(".hero-fade-in", {
      y: 0,
      opacity: 1,
      stagger: 0.15,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.4");

    // 2. Parallax Scroll Trigger
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    // Move left content down slower than scrolling (parallax)
    scrollTl.to(leftContentRef.current, {
      y: 120,
      opacity: 0.2,
      ease: "none"
    }, 0);

    // Move right canvas slightly up/left (depth)
    scrollTl.to(rightContentRef.current, {
      y: -60,
      scale: 0.95,
      opacity: 0.4,
      ease: "none"
    }, 0);

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleCtaClick = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section 
      ref={sectionRef}
      id="hero"
      className="section-reveal w-full min-h-screen flex items-center justify-center bg-background px-6 sm:px-12 lg:px-20 py-20 relative overflow-hidden"
    >
      {/* Background glow vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(26,15,20,0.15)_0%,rgba(10,10,10,0)_70%)] pointer-events-none" />

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-10">
        
        {/* Left Side: Typography & CTAs */}
        <div 
          ref={leftContentRef} 
          className="lg:col-span-6 flex flex-col justify-center space-y-6 md:space-y-8 select-none order-2 lg:order-1"
        >
          {/* Follower Badge */}
          <div className="hero-fade-in opacity-0 translate-y-4 flex items-center space-x-3 w-fit">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
            </span>
            <span className="font-mono text-[9px] tracking-widest text-gold uppercase border border-gold/25 px-3 py-1 rounded-full bg-gold/5 gold-glow-subtle">
              {influencerData.followerCount} on Instagram
            </span>
          </div>

          {/* Heading Name */}
          <div className="space-y-2">
            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-playfair font-normal leading-[1.05] tracking-tighter text-cream overflow-hidden py-1">
              {splitText(influencerData.name)}
            </h1>
            <h2 className="hero-fade-in opacity-0 translate-y-4 text-sm sm:text-base font-mono tracking-widest text-mauve uppercase">
              {influencerData.niche}
            </h2>
          </div>

          {/* Tagline */}
          <p className="hero-fade-in opacity-0 translate-y-4 text-cream/70 font-light text-base md:text-lg max-w-md leading-relaxed">
            Curating elegant visuals at the intersection of conscious skincare, luxury cosmetics, and editorial style. 
          </p>

          {/* CTAs */}
          <div className="hero-fade-in opacity-0 translate-y-6 flex items-center space-x-6">
            <button
              onClick={handleCtaClick}
              id="hero-cta-btn"
              className="glass-card text-cream font-mono text-xs tracking-widest uppercase py-4 px-8 rounded-full border border-gold/30 hover:border-gold hover:text-background hover:bg-gold transition-all duration-500 transform active:scale-95 shadow-lg hover:shadow-gold/10"
            >
              Work With Me
            </button>
            <a
              href={influencerData.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="hero-instagram-link"
              className="text-cream/50 hover:text-gold font-mono text-[10px] tracking-widest uppercase transition-colors duration-300 py-2 border-b border-white/10 hover:border-gold"
            >
              Instagram Profile ↗
            </a>
          </div>
        </div>

        {/* Right Side: Portrait Image & ThreeJS Particles */}
        <div 
          ref={rightContentRef}
          className="lg:col-span-6 flex justify-center order-1 lg:order-2"
        >
          <ThreeCanvas imageUrl={influencerData.images.heroPortrait} />
        </div>
      </div>
      
      {/* Scroll Down Hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center space-y-2 pointer-events-none opacity-30 select-none">
        <span className="font-mono text-[8px] tracking-widest uppercase text-cream">
          SCROLL TO EXPLORE
        </span>
        <div className="h-6 w-[1px] bg-cream/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gold animate-bounce" />
        </div>
      </div>
    </section>
  );
}
