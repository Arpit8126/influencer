import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { influencerData } from "../config/content";
import { Users, TrendingUp, BarChart3, Globe } from "lucide-react";

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

  return (
    <section
      ref={sectionRef}
      id="mediadeck"
      className="relative w-full min-h-screen bg-luxuryBlack flex items-center justify-center py-24 px-6 sm:px-12 lg:px-20 overflow-hidden"
    >
      {/* Background glow vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(199,169,110,0.08)_0%,transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl w-full flex flex-col space-y-16 z-10">
        
        {/* Header Block with Enlarged Titles */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 select-none">
          <div className="space-y-4">
            <span className="deck-fade-in font-mono text-xs sm:text-sm text-gold tracking-[0.25em] font-bold uppercase block">
              03 AUDIENCE INSIGHTS & SERVICES
            </span>
            <h2 className="deck-fade-in text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-playfair font-normal leading-[1.1] text-cream">
              Media Portfolio
            </h2>
          </div>
          <p className="deck-fade-in text-xs sm:text-sm text-cream/60 max-w-sm font-light leading-relaxed">
            Verified demographics and engagement indexes optimized for conversion. Select a package below to align with your launch.
          </p>
        </div>

        {/* Separator line */}
        <div className="h-[1px] w-full bg-white/10 deck-fade-in" />

        {/* Demographics Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {/* Card 1: Female Ratio */}
          <div className="deck-fade-in glass-card rounded-2xl p-6 sm:p-8 border border-white/5 flex flex-col justify-between h-48 select-none">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-mauve tracking-widest uppercase">
                TARGET AUDIENCE
              </span>
              <Users className="w-4 h-4 text-gold/60" />
            </div>
            <div>
              <span className="text-4xl sm:text-5xl font-playfair font-semibold text-gold tracking-tight block mb-2">
                {influencerData.demographics.femaleRatio}
              </span>
              <p className="text-xs text-cream/60 font-light leading-relaxed">
                Strong female demographic index, ideal for skincare, cosmetics, and self-care launches.
              </p>
            </div>
          </div>

          {/* Card 2: Age Group */}
          <div className="deck-fade-in glass-card rounded-2xl p-6 sm:p-8 border border-white/5 flex flex-col justify-between h-48 select-none">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-mauve tracking-widest uppercase">
                AGE COHORT
              </span>
              <BarChart3 className="w-4 h-4 text-gold/60" />
            </div>
            <div>
              <span className="text-4xl sm:text-5xl font-playfair font-semibold text-gold tracking-tight block mb-2">
                {influencerData.demographics.ageGroup}
              </span>
              <p className="text-xs text-cream/60 font-light leading-relaxed">
                Concentrated in the high-purchasing age brackets, driving organic routine decisions.
              </p>
            </div>
          </div>

          {/* Card 3: Reach / Impressions */}
          <div className="deck-fade-in glass-card rounded-2xl p-6 sm:p-8 border border-white/5 flex flex-col justify-between h-48 select-none">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-mauve tracking-widest uppercase">
                MONTHLY IMPRESSIONS
              </span>
              <TrendingUp className="w-4 h-4 text-gold/60" />
            </div>
            <div>
              <span className="text-4xl sm:text-5xl font-playfair font-semibold text-gold tracking-tight block mb-2">
                {influencerData.demographics.monthlyReach}
              </span>
              <p className="text-xs text-cream/60 font-light leading-relaxed">
                Robust profile impressions concentrated in Tier 1 cities: {influencerData.demographics.topRegions}.
              </p>
            </div>
          </div>
        </div>

        {/* Partnership Packages Grid */}
        <div className="space-y-6 pt-4">
          <span className="deck-fade-in font-mono text-[10px] text-mauve tracking-wider uppercase block">
            Select Campaign Packages
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {influencerData.packages.map((pkg) => (
              <div 
                key={pkg.id} 
                className="deck-fade-in glass-card glass-card-hover rounded-2xl p-6 sm:p-8 border border-white/5 flex flex-col justify-between select-none"
              >
                <div className="space-y-4">
                  <span className="font-mono text-[9px] text-gold tracking-widest uppercase block">
                    {pkg.duration}
                  </span>
                  <h3 className="font-playfair text-xl sm:text-2xl text-cream font-medium">
                    {pkg.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-cream/60 leading-relaxed font-light">
                    {pkg.description}
                  </p>
                </div>
                
                <div className="border-t border-white/5 mt-6 pt-4 space-y-2">
                  {pkg.deliverables.map((del, i) => (
                    <span key={i} className="font-mono text-[9px] text-gold/80 block">
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
