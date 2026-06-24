import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { influencerData } from "../config/content";
import { CheckCircle2, TrendingUp } from "lucide-react";

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
    // Elegant tilt offsets (max 8 degrees rotateX, 10 degrees rotateY)
    const rotateX = (centerY - y) / 15;
    const rotateY = (x - centerX) / 25;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 1000,
      ease: "power2.out",
      duration: 0.4,
      overwrite: "auto"
    });
  };

  const handleCardMouseLeave = (e) => {
    const card = e.currentTarget;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      ease: "power3.out",
      duration: 0.6,
      overwrite: "auto"
    });
  };

  return (
    <section
      ref={sectionRef}
      id="collabs"
      className="relative w-full min-h-screen bg-background flex flex-col justify-center py-24 px-6 sm:px-12 lg:px-20 overflow-hidden"
    >
      {/* Background glow vignette */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-rose-glow/12 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto flex flex-col space-y-16 z-10">
        
        {/* Header Block with Enlarged Titles */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 select-none">
          <div className="space-y-4">
            <span className="collab-header-animate font-sans text-xs sm:text-sm text-pink-400 tracking-[0.25em] font-semibold uppercase block">
              06 BRAND COLLABORATIONS
            </span>
            <h2 className="collab-header-animate text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-italiana font-normal leading-tight text-pink-sunset-gradient drop-shadow-[0_0_20px_rgba(251,113,133,0.18)]">
              Campaign Highlights
            </h2>
          </div>
          <p className="collab-header-animate text-sm text-cream/70 max-w-sm font-light leading-relaxed font-sans">
            Direct partnerships delivering high-impact, clean aesthetic alignments with skincare and makeup innovators.
          </p>
        </div>

        {/* Separator line */}
        <div className="h-[1px] w-full bg-white/10 collab-header-animate" />

        {/* Brand Logos Row (Custom logos from Brandfetch) */}
        <div className="space-y-4">
          <span className="collab-header-animate font-sans text-xs font-semibold text-purple-300 tracking-[0.16em] uppercase block">
            Featured Partner Portfolio
          </span>
          
          <div 
            ref={logosRef}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full"
          >
            {influencerData.brandLogos.map((brand) => (
              <div 
                key={brand.id} 
                data-cursor-text="PARTNER"
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                className="collab-logo-animate glass-card spotlight-card rounded-2xl p-6 flex items-center justify-center h-24 border border-white/5 hover:border-pink-500/30 hover:bg-pink-500/[0.02] transition-all duration-500 shadow-md cursor-none"
                style={{ transformStyle: "preserve-3d" }}
              >
                <img 
                  src={brand.logoUrl} 
                  alt={`${brand.brand} logo`} 
                  className="max-h-12 max-w-full object-contain filter contrast-[1.05] brightness-[0.8] hover:brightness-[1] transition-all duration-300"
                  style={{ transform: "translateZ(20px)" }}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Case Study Cards (Showing her 4 upright, complete screenshots) */}
        <div className="space-y-8">
          <span className="collab-header-animate font-sans text-xs font-semibold text-purple-300 tracking-[0.16em] uppercase block">
            Verified Deliverables & Performance
          </span>

          <div 
            ref={casesRef}
            className="flex flex-col space-y-8 w-full"
          >
            {influencerData.collabs.map((collab, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={collab.id}
                  data-cursor-text="VIEW"
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                  className={`collab-case-animate glass-card-colored spotlight-card rounded-3xl border border-white/5 overflow-hidden flex flex-col ${
                    isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                  } p-6 sm:p-8 gap-6 sm:gap-8 group transition-all duration-500 shadow-xl cursor-none`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Image Container: Dynamic aspect ratio based on banner orientation */}
                  <div 
                    className={`w-full rounded-2xl overflow-hidden relative bg-[#0c080a] border border-white/5 flex-shrink-0 flex items-center justify-center transform group-hover:scale-[1.02] transition-transform duration-500 ${
                      collab.id === "collab-2" 
                        ? "md:w-[320px] aspect-[16/10]" 
                        : "md:w-[240px] aspect-[9/16]"
                    }`}
                    style={{ transform: "translateZ(15px)" }}
                  >
                    <img 
                      src={collab.bannerImage} 
                      alt={`${collab.brand} campaign screenshot`} 
                      className="w-full h-full object-cover filter brightness-[0.95]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Content details on the right */}
                  <div className={`flex-1 flex flex-col justify-between py-2 space-y-6 select-none ${
                    isEven ? "lg:pl-4" : "lg:pr-4"
                  }`} style={{ transform: "translateZ(25px)" }}>
                    <div className="space-y-4">
                      {/* Eyebrow type & metrics */}
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-sans text-xs font-bold text-pink-400 tracking-[0.12em] uppercase">
                          {collab.type}
                        </span>
                        <div className="h-1.5 w-1.5 rounded-full bg-pink-500/50" />
                        <div className="bg-pink-500/10 border border-pink-500/25 px-3.5 py-1 rounded-full flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3 text-pink-400" />
                          <span className="font-sans text-xs tracking-wide text-pink-400 uppercase font-semibold">
                            {collab.metric}
                          </span>
                        </div>
                      </div>

                      {/* Brand Title */}
                      <h3 className="text-3xl sm:text-4xl font-italiana font-normal text-cream leading-tight">
                        {collab.brand}
                      </h3>
                      
                      {/* Description copy */}
                      <p className="text-sm sm:text-base text-cream/70 leading-relaxed font-light font-sans">
                        {collab.description}
                      </p>
                    </div>

                    {/* Bullet Highlights & Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-white/5 py-4">
                      <div className="flex items-center space-x-2 text-sm text-cream/70 font-sans">
                        <CheckCircle2 className="w-4 h-4 text-pink-400/85 flex-shrink-0" />
                        <span>Professional Routine Alignment</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-cream/70 font-sans">
                        <CheckCircle2 className="w-4 h-4 text-pink-400/85 flex-shrink-0" />
                        <span>Audience Conversion Verified</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-cream/70 font-sans">
                        <CheckCircle2 className="w-4 h-4 text-pink-400/85 flex-shrink-0" />
                        <span>High Retention Content Launch</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-pink-400/90 font-sans font-semibold tracking-wider">
                        <span>✦ TARGET AUDIENCE MATCHED</span>
                      </div>
                    </div>

                    {/* Footer metadata display */}
                    <div className="flex items-center justify-between text-xs font-sans text-white/40 tracking-[0.16em] uppercase font-medium">
                      <span>rana_divu098 | partner authentication</span>
                      <span>© {new Date().getFullYear()} INFLUENCER PORTAL</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
