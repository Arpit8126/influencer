import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { influencerData } from "../config/content";

gsap.registerPlugin(ScrollTrigger);


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
      {/* Background glow ornament (Vibrant colorful backdrop) */}
      <div className="absolute top-[15%] right-0 w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(192,132,252,0.15)_0%,transparent_70%)] filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-[15%] left-0 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(251,113,133,0.18)_0%,transparent_70%)] filter blur-3xl pointer-events-none" />

      <div 
        ref={contentRef}
        className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center z-10"
      >
        {/* Left Side: Large vertical editorial portrait with Asymmetric frame offset */}
        <div className="lg:col-span-5 select-none order-2 lg:order-1 flex justify-center relative py-6">
          <div className="absolute top-0 left-[10%] w-16 h-16 border-t-2 border-l-2 border-pink-500/30 hidden sm:block pointer-events-none" />
          <div className="absolute bottom-0 right-[10%] w-16 h-16 border-b-2 border-r-2 border-purple-500/30 hidden sm:block pointer-events-none" />
          
          <div 
            className="about-fade-in w-full max-w-sm aspect-[3/4.2] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative transform lg:-rotate-2 hover:rotate-0 transition-transform duration-500 cursor-none"
            data-cursor-text="DIVYA"
          >
            <img 
              src={influencerData.images.aboutLifestyle} 
              alt="Divya Rana Lifestyle portrait" 
              className="w-full h-full object-cover filter brightness-[0.9] hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#10080c]/60 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Right Side: Biography & Editorial Content */}
        <div className="lg:col-span-7 space-y-8 order-1 lg:order-2 lg:pl-8">
          {/* Eyebrow Label - No slashes */}
          <span className="about-fade-in font-sans text-xs sm:text-sm text-pink-400 tracking-[0.25em] font-semibold uppercase block">
            02 THE FOUNDER & CREATOR
          </span>
          
          {/* H2 Title - Responsive size scaling to prevent mobile wrapping overlap */}
          <h2 className="about-fade-in text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-italiana font-normal leading-[1.08] text-violet-dream-gradient drop-shadow-[0_0_25px_rgba(192,132,252,0.2)]">
            {influencerData.bioTitle}
          </h2>

          <div className="h-[1px] w-20 bg-pink-500/40 about-fade-in" />

          {/* Description Paragraph */}
          <p className="about-fade-in text-base sm:text-lg text-cream/80 leading-relaxed font-light font-sans">
            {influencerData.bioText}
          </p>

          {/* Animating Stats Counters Grid */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5 about-fade-in select-none">
            <div>
              <span id="stat-followers" className="text-3xl sm:text-4xl md:text-5xl font-italiana font-bold text-pink-sunset-gradient tracking-tight">0</span>
              <span className="block font-sans text-[10px] tracking-[0.16em] text-cream/65 uppercase mt-1">Followers</span>
            </div>
            <div>
              <span id="stat-posts" className="text-3xl sm:text-4xl md:text-5xl font-italiana font-bold text-pink-sunset-gradient tracking-tight">0</span>
              <span className="block font-sans text-[10px] tracking-[0.16em] text-cream/65 uppercase mt-1">Posts</span>
            </div>
            <div>
              <span id="stat-engagement" className="text-3xl sm:text-4xl md:text-5xl font-italiana font-bold text-pink-sunset-gradient tracking-tight">0</span>
              <span className="block font-sans text-[10px] tracking-[0.16em] text-cream/65 uppercase mt-1">Engagement</span>
            </div>
          </div>

          {/* Creative vision block - spacious, borderless */}
          <div className="about-fade-in pt-8 border-t border-white/5 space-y-4">
            <span className="font-sans text-xs text-pink-400 tracking-[0.2em] uppercase block font-bold">
              CREATIVE VISION
            </span>
            <p className="text-xl sm:text-2xl lg:text-3xl font-playfair italic text-cream/95 leading-relaxed">
              “Beauty curation is about high-end product integrity, authentic routine integration, and converting aesthetics into brand loyalty.”
            </p>
          </div>
        </div>

      </div>

      {/* Elegant botanical fine line-art illustration (skincare motif) */}
      <div className="absolute right-[-8%] bottom-0 w-[480px] h-[580px] pointer-events-none opacity-[0.035] text-pink-300 z-0 hidden lg:block">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.35">
          <path d="M50,90 Q52,70 55,50 Q58,30 50,10" />
          <path d="M52,70 Q65,65 72,52 Q70,45 53,58" />
          <path d="M54,58 Q68,52 75,38 Q71,32 55,44" />
          <path d="M50,42 Q32,38 25,24 Q29,18 47,30" />
          <path d="M49,58 Q31,52 23,38 Q27,32 46,44" />
          <path d="M48,74 Q32,70 24,56 Q28,50 45,62" />
        </svg>
      </div>
    </section>
  );
}
