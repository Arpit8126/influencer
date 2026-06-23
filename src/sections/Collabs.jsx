import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { influencerData } from "../config/content";
import { CheckCircle2, TrendingUp, Calendar } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Collabs() {
  const sectionRef = useRef(null);
  const logosRef = useRef(null);
  const casesRef = useRef(null);

  useEffect(() => {
    // Reveal header elements on scroll
    gsap.fromTo(
      ".collab-header-animate",
      { y: 30, opacity: 0 },
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

    // Stagger logos grid
    gsap.fromTo(
      ".collab-logo-animate",
      { scale: 0.9, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        stagger: 0.08,
        duration: 0.8,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: logosRef.current,
          start: "top 80%"
        }
      }
    );

    // Stagger case study cards
    gsap.fromTo(
      ".collab-case-animate",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 1.0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: casesRef.current,
          start: "top 80%"
        }
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="collabs"
      className="relative w-full min-h-screen bg-background flex flex-col justify-center py-24 px-6 sm:px-12 lg:px-20 overflow-hidden"
    >
      {/* Background glow vignette */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto flex flex-col space-y-16 z-10">
        
        {/* Header Block with Enlarged Titles */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 select-none">
          <div className="space-y-4">
            <span className="collab-header-animate font-mono text-xs sm:text-sm text-gold tracking-[0.25em] font-bold uppercase block">
              05 BRAND COLLABORATIONS
            </span>
            <h2 className="collab-header-animate text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-playfair font-normal leading-tight text-cream">
              Campaign Highlights
            </h2>
          </div>
          <p className="collab-header-animate text-xs sm:text-sm text-cream/60 max-w-sm font-light leading-relaxed">
            Direct partnerships delivering high-impact, clean aesthetic alignments with skincare and makeup innovators.
          </p>
        </div>

        {/* Separator line */}
        <div className="h-[1px] w-full bg-white/10 collab-header-animate" />

        {/* Brand Logos Row (Custom logos from Brandfetch) */}
        <div className="space-y-4">
          <span className="collab-header-animate font-mono text-[8px] text-mauve tracking-wider uppercase block">
            Featured Partner Portfolio
          </span>
          
          <div 
            ref={logosRef}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full"
          >
            {influencerData.brandLogos.map((brand) => (
              <div 
                key={brand.id} 
                className="collab-logo-animate glass-card rounded-2xl p-6 flex items-center justify-center h-24 border border-white/5 hover:border-gold/25 hover:bg-gold/[0.02] transition-all duration-500 shadow-md"
              >
                <img 
                  src={brand.logoUrl} 
                  alt={`${brand.brand} logo`} 
                  className="max-h-12 max-w-full object-contain filter contrast-[1.05] brightness-[0.8] hover:brightness-[1] transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Case Study Cards (Showing her 4 upright, complete screenshots) */}
        <div className="space-y-8">
          <span className="collab-header-animate font-mono text-[8px] text-mauve tracking-wider uppercase block">
            Verified Deliverables & Performance
          </span>

          <div 
            ref={casesRef}
            className="flex flex-col space-y-8 w-full"
          >
            {influencerData.collabs.map((collab) => (
              <div
                key={collab.id}
                className="collab-case-animate glass-card rounded-2xl border border-white/5 overflow-hidden flex flex-col md:flex-row p-6 sm:p-8 gap-6 sm:gap-8 group hover:border-gold/20 transition-all duration-500 shadow-xl"
              >
                {/* Image Container: Full vertical screenshot (No cut-off!) */}
                <div className="w-full md:w-[240px] aspect-[9/16] rounded-xl overflow-hidden relative bg-[#0c080a] border border-white/5 flex-shrink-0 flex items-center justify-center">
                  <img 
                    src={collab.bannerImage} 
                    alt={`${collab.brand} campaign screenshot`} 
                    className="w-full h-full object-contain filter brightness-[0.95] group-hover:scale-102 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Content details on the right */}
                <div className="flex-1 flex flex-col justify-between py-2 space-y-6 select-none">
                  <div className="space-y-4">
                    {/* Eyebrow type & metrics */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-[9px] text-gold tracking-widest uppercase">
                        {collab.type}
                      </span>
                      <div className="h-1.5 w-1.5 rounded-full bg-gold/50" />
                      <div className="bg-gold/10 border border-gold/25 px-3 py-0.5 rounded-full flex items-center space-x-1">
                        <TrendingUp className="w-2.5 h-2.5 text-gold" />
                        <span className="font-mono text-[8px] tracking-wide text-gold uppercase font-semibold">
                          {collab.metric}
                        </span>
                      </div>
                    </div>

                    {/* Brand Title */}
                    <h3 className="text-3xl font-playfair font-normal text-cream leading-tight">
                      {collab.brand}
                    </h3>
                    
                    {/* Description copy */}
                    <p className="text-sm text-cream/70 leading-relaxed font-light font-inter">
                      {collab.description}
                    </p>
                  </div>

                  {/* Bullet Highlights & Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-white/5 py-4">
                    <div className="flex items-center space-x-2 text-xs text-cream/60">
                      <CheckCircle2 className="w-4 h-4 text-gold/80 flex-shrink-0" />
                      <span>Professional Routine Alignment</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-cream/60">
                      <CheckCircle2 className="w-4 h-4 text-gold/80 flex-shrink-0" />
                      <span>Audience Conversion Verified</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-cream/60">
                      <Calendar className="w-4 h-4 text-gold/80 flex-shrink-0" />
                      <span>High Retention Content Launch</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-cream/60 font-mono text-[9px] text-gold/80">
                      <span>✦ TARGET AUDIENCE MATCHED</span>
                    </div>
                  </div>

                  {/* Footer metadata display */}
                  <div className="flex items-center justify-between text-[8px] font-mono text-white/30 tracking-widest uppercase">
                    <span>rana_divu098 | partner authentication</span>
                    <span>© {new Date().getFullYear()} INFLUENCER PORTAL</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
