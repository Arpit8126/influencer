import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { influencerData } from "../config/content";
import { Users, Sparkles, Award } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// Sub-component for interactive 3D Tilt Cards
function TiltCard({ children, className }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = (x - centerX) / centerX;
    const tiltY = (centerY - y) / centerY;

    gsap.to(card, {
      rotateY: tiltX * 10,
      rotateX: tiltY * 10,
      transformPerspective: 1000,
      ease: "power2.out",
      duration: 0.3,
      overwrite: "auto"
    });
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      ease: "power3.out",
      duration: 0.6,
      overwrite: "auto"
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`tilt-card ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}

export default function About() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    // Stat Counter ScrollTrigger Animations
    const stats = [
      { id: "stat-followers", val: 34.1, suffix: "K" },
      { id: "stat-posts", val: 170, suffix: "" },
      { id: "stat-engagement", val: 5.8, suffix: "%" }
    ];

    stats.forEach((stat) => {
      const el = document.getElementById(stat.id);
      if (!el) return;

      const obj = { value: 0 };
      gsap.to(obj, {
        value: stat.val,
        duration: 2.0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none"
        },
        onUpdate: () => {
          const formatted = Number.isInteger(stat.val)
            ? Math.floor(obj.value)
            : obj.value.toFixed(1);
          el.innerText = `${formatted}${stat.suffix}`;
        }
      });
    });

    // Smooth fade-in scroll triggers for content elements
    gsap.fromTo(
      ".about-fade-in",
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 1.0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 80%"
        }
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full min-h-screen bg-luxuryMauve flex items-center justify-center py-24 px-6 sm:px-12 lg:px-20 overflow-hidden"
    >
      {/* Background glow ornament */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gold/5 rounded-full filter blur-3xl pointer-events-none" />

      <div 
        ref={contentRef}
        className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center z-10"
      >
        {/* Left Side: Large vertical editorial portrait */}
        <div className="lg:col-span-5 select-none order-2 lg:order-1 flex justify-center">
          <div className="about-fade-in w-full max-w-sm aspect-[3/4.2] rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
            <img 
              src={influencerData.images.aboutLifestyle} 
              alt="Divya Rana Lifestyle portrait" 
              className="w-full h-full object-cover filter brightness-[0.9]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#10080c]/60 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Right Side: Biography & Editorial Content */}
        <div className="lg:col-span-7 space-y-8 order-1 lg:order-2">
          {/* Eyebrow Label - No slashes */}
          <span className="about-fade-in font-mono text-xs sm:text-sm text-gold tracking-[0.25em] font-bold uppercase block">
            02 THE FOUNDER & CREATOR
          </span>
          
          {/* H2 Title - Responsive size scaling to prevent mobile wrapping overlap */}
          <h2 className="about-fade-in text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-playfair font-normal leading-tight text-cream">
            {influencerData.bioTitle}
          </h2>

          <div className="h-[1px] w-20 bg-gold/30 about-fade-in" />

          {/* Description Paragraph */}
          <p className="about-fade-in text-base sm:text-lg text-cream/80 leading-relaxed font-light font-inter">
            {influencerData.bioText}
          </p>

          {/* Creative vision block - spacious, borderless */}
          <div className="about-fade-in pt-8 border-t border-white/5 space-y-4">
            <span className="font-mono text-xs text-gold tracking-[0.2em] uppercase block font-semibold">
              CREATIVE VISION
            </span>
            <p className="text-xl sm:text-2xl lg:text-3xl font-playfair italic text-cream/95 leading-relaxed">
              “Beauty curation is about high-end product integrity, authentic routine integration, and converting aesthetics into brand loyalty.”
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
