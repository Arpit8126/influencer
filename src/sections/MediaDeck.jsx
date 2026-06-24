import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { influencerData } from "../config/content";
import { Users, TrendingUp, BarChart3 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function MediaDeck() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      ".deck-fade-in",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.12,
        duration: 1.0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%"
        }
      }
    );
  }, []);

  const handleCardMouseMove = (e) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (centerY - y) / 8;
    const rotateY = (x - centerX) / 12;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 800,
      ease: "power2.out",
      duration: 0.35,
      overwrite: "auto"
    });
  };

  const handleCardMouseLeave = (e) => {
    const card = e.currentTarget;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      ease: "power3.out",
      duration: 0.5,
      overwrite: "auto"
    });
  };

  return (
    <section
      ref={sectionRef}
      id="mediadeck"
      className="relative w-full min-h-screen bg-luxuryBlack flex items-center justify-center py-24 px-6 sm:px-12 lg:px-20 overflow-hidden"
    >
      {/* Background glow vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(192,132,252,0.12)_0%,transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl w-full flex flex-col space-y-16 z-10">
        
        {/* Header Block with Enlarged Titles */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 select-none">
          <div className="space-y-4">
            <span className="deck-fade-in font-sans text-xs sm:text-sm text-pink-400 tracking-[0.25em] font-semibold uppercase block">
              04 AUDIENCE INSIGHTS & SERVICES
            </span>
            <h2 className="deck-fade-in text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-italiana font-normal leading-[1.1] text-pink-sunset-gradient drop-shadow-[0_0_20px_rgba(251,113,133,0.18)]">
              Media Portfolio
            </h2>
          </div>
          <p className="deck-fade-in text-sm text-cream/70 max-w-sm font-light leading-relaxed font-sans">
            Verified demographics and engagement indexes optimized for conversion. Select a package below to align with your launch.
          </p>
        </div>

        {/* Separator line */}
        <div className="h-[1px] w-full bg-white/10 deck-fade-in" />

        {/* Demographics Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {/* Card 1: Female Ratio */}
          <div 
            data-cursor-text="STATS"
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            className="deck-fade-in glass-card-colored spotlight-card hover:border-pink-500/25 rounded-2xl p-6 sm:p-8 border border-white/5 flex flex-col justify-between h-48 select-none transition-all duration-500 cursor-none"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="flex items-center justify-between" style={{ transform: "translateZ(20px)" }}>
              <span className="font-sans text-xs font-semibold text-purple-300 tracking-[0.16em] uppercase">
                TARGET AUDIENCE
              </span>
              <Users className="w-4 h-4 text-pink-400/60" />
            </div>
            <div style={{ transform: "translateZ(30px)" }}>
              <span className="text-4xl sm:text-5xl font-italiana font-semibold text-pink-sunset-gradient tracking-tight block mb-2">
                {influencerData.demographics.femaleRatio}
              </span>
              <p className="text-xs sm:text-sm text-cream/70 font-light leading-relaxed font-sans">
                Strong female demographic index, ideal for skincare, cosmetics, and self-care launches.
              </p>
            </div>
          </div>

          {/* Card 2: Age Group */}
          <div 
            data-cursor-text="STATS"
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            className="deck-fade-in glass-card-colored spotlight-card hover:border-pink-500/25 rounded-2xl p-6 sm:p-8 border border-white/5 flex flex-col justify-between h-48 select-none transition-all duration-500 cursor-none"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="flex items-center justify-between" style={{ transform: "translateZ(20px)" }}>
              <span className="font-sans text-xs font-semibold text-purple-300 tracking-[0.16em] uppercase">
                AGE COHORT
              </span>
              <BarChart3 className="w-4 h-4 text-pink-400/60" />
            </div>
            <div style={{ transform: "translateZ(30px)" }}>
              <span className="text-4xl sm:text-5xl font-italiana font-semibold text-pink-sunset-gradient tracking-tight block mb-2">
                {influencerData.demographics.ageGroup}
              </span>
              <p className="text-xs sm:text-sm text-cream/70 font-light leading-relaxed font-sans">
                Concentrated in the high-purchasing age brackets, driving organic routine decisions.
              </p>
            </div>
          </div>

          {/* Card 3: Reach / Impressions */}
          <div 
            data-cursor-text="STATS"
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            className="deck-fade-in glass-card-colored spotlight-card hover:border-pink-500/25 rounded-2xl p-6 sm:p-8 border border-white/5 flex flex-col justify-between h-48 select-none transition-all duration-500 cursor-none"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="flex items-center justify-between" style={{ transform: "translateZ(20px)" }}>
              <span className="font-sans text-xs font-semibold text-purple-300 tracking-[0.16em] uppercase">
                MONTHLY IMPRESSIONS
              </span>
              <TrendingUp className="w-4 h-4 text-pink-400/60" />
            </div>
            <div style={{ transform: "translateZ(30px)" }}>
              <span className="text-4xl sm:text-5xl font-italiana font-semibold text-pink-sunset-gradient tracking-tight block mb-2">
                {influencerData.demographics.monthlyReach}
              </span>
              <p className="text-xs sm:text-sm text-cream/70 font-light leading-relaxed font-sans">
                Robust profile impressions concentrated in Tier 1 cities: {influencerData.demographics.topRegions}.
              </p>
            </div>
          </div>
        </div>

        {/* Partnership Packages Grid */}
        <div className="space-y-6 pt-4">
          <span className="deck-fade-in font-sans text-xs font-semibold text-purple-300 tracking-[0.18em] uppercase block">
            Select Campaign Packages
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {influencerData.packages.map((pkg) => (
              <div 
                key={pkg.id} 
                data-cursor-text="OFFER"
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                className="deck-fade-in glass-card-colored spotlight-card glass-card-hover rounded-2xl p-6 sm:p-8 border border-white/5 flex flex-col justify-between select-none cursor-none"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="space-y-4" style={{ transform: "translateZ(20px)" }}>
                  <span className="font-sans text-[10px] font-bold text-pink-400 tracking-[0.18em] uppercase block">
                    {pkg.duration}
                  </span>
                  <h3 className="font-italiana text-2xl text-cream font-medium">
                    {pkg.title}
                  </h3>
                  <p className="text-sm text-cream/70 leading-relaxed font-light font-sans">
                    {pkg.description}
                  </p>
                </div>
                
                <div className="border-t border-white/5 mt-6 pt-4 space-y-2" style={{ transform: "translateZ(30px)" }}>
                  {pkg.deliverables.map((del, i) => (
                    <span key={i} className="font-sans text-xs text-pink-400/90 font-medium tracking-wide block">
                      ✦ {del}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
