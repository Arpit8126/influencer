import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Carousel3D from "../components/Carousel3D";
import { influencerData } from "../config/content";
import { Instagram, Eye } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Showcase() {
  const sectionRef = useRef(null);
  const reelsRowRef = useRef(null);

  useEffect(() => {
    // Fade and lift animation on scroll
    gsap.fromTo(
      ".showcase-fade-in",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 1.0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%"
        }
      }
    );

    // Stagger animation for the phone frames when they scroll into view
    gsap.fromTo(
      ".reel-phone-animate",
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: reelsRowRef.current,
          start: "top 80%"
        }
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="showcase"
      className="relative w-full min-h-screen bg-luxuryBlack flex flex-col justify-center py-24 px-6 sm:px-12 lg:px-20 overflow-hidden"
    >
      {/* Background soft glow accents */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gold/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-mauve/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto flex flex-col space-y-20 z-10">
        
        {/* Header Block with Enlarged Titles (No Slashes) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 select-none">
          <div className="space-y-4">
            <span className="showcase-fade-in font-mono text-xs sm:text-sm text-gold tracking-[0.25em] font-bold uppercase block">
              04 DIGITAL LOOKBOOK
            </span>
            <h2 className="showcase-fade-in text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-playfair font-normal leading-tight text-cream">
              Featured Work
            </h2>
          </div>
          
          <p className="showcase-fade-in text-xs sm:text-sm text-cream/60 max-w-sm font-light leading-relaxed">
            Drag to rotate the 3D showcase below, or scroll down to browse live Reels. Tap any card or phone frame to view directly on Instagram.
          </p>
        </div>

        {/* Separator line */}
        <div className="h-[1px] w-full bg-white/10 showcase-fade-in" />

        {/* 1. THREE.JS 3D LOOKBOOK CAROUSEL */}
        <div className="showcase-fade-in space-y-4">
          <div className="flex items-center space-x-3 select-none">
            <span className="font-mono text-[9px] text-gold/60 tracking-[0.2em] font-semibold uppercase">
              LOOKBOOK: 3D CYLINDER ROTATION
            </span>
            <div className="h-[1px] w-12 bg-gold/20" />
          </div>
          <Carousel3D />
        </div>

        {/* 2. INSTAGRAM REELS GALLERY */}
        <div className="space-y-8 select-none">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="font-mono text-[9px] text-gold/60 tracking-[0.2em] font-semibold uppercase">
                GALLERY: LIVE REELS FEED
              </span>
              <div className="h-[1px] w-12 bg-gold/20" />
            </div>
            
            <div className="flex items-center space-x-2 text-[10px] font-mono text-mauve tracking-widest uppercase">
              <span>Verified Campaigns</span>
            </div>
          </div>

          {/* Scrolling Reels Frame Row with custom thumbnails mapped to screenshots */}
          <div 
            ref={reelsRowRef}
            className="flex overflow-x-auto pb-8 space-x-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 scroll-smooth snap-x snap-mandatory"
            id="reels-scroller-row"
          >
            {influencerData.instagramReels.map((reel) => (
              <div
                key={reel.id}
                onClick={() => window.open(reel.link, "_blank")}
                className="reel-phone-animate flex-shrink-0 w-[240px] sm:w-[260px] aspect-[9/18.5] bg-[#0c080a] rounded-[2.5rem] border-[5px] border-white/5 relative overflow-hidden group/phone flex flex-col justify-end p-5 snap-start shadow-xl hover:shadow-gold/5 transition-all duration-500 hover:border-gold/25 cursor-pointer"
              >
                {/* Clean screenshot image as thumbnail - No cut-off or blank screen */}
                <img
                  src={reel.thumbnailUrl}
                  alt={reel.title}
                  className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-[0.75] group-hover/phone:brightness-[0.6] group-hover/phone:scale-105 transition-all duration-700"
                  draggable="false"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/10 z-10 pointer-events-none" />

                {/* Top Phone Decorators */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-black rounded-full z-20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white/10" />
                </div>

                {/* Instagram Overlay UI Elements */}
                <div className="relative z-20 space-y-3 pointer-events-none">
                  {/* Account detail */}
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-gold/40 bg-luxuryMauve flex items-center justify-center">
                      <img 
                        src={influencerData.images.heroPortrait} 
                        alt="Profile avatar" 
                        className="w-full h-full object-cover scale-110"
                      />
                    </div>
                    <span className="font-mono text-[9px] tracking-wider text-cream font-medium">
                      @{influencerData.username}
                    </span>
                  </div>

                  {/* Caption */}
                  <p className="text-[10px] text-cream/80 line-clamp-2 leading-relaxed font-light font-inter">
                    {reel.caption}
                  </p>

                  {/* Stats Row */}
                  <div className="flex items-center space-x-4 border-t border-white/10 pt-2.5 text-[9px] font-mono text-white/40">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3 text-gold/75" />
                      <span>{reel.views} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Instagram className="w-3 h-3 text-gold/75" />
                      <span>Open Reel</span>
                    </div>
                  </div>
                </div>

                {/* Hover Play Glow Pill */}
                <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover/phone:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="bg-gold text-background font-mono text-[8px] tracking-widest uppercase font-bold py-2.5 px-4 rounded-full shadow-lg border border-gold flex items-center space-x-1">
                    <span>Watch Reel</span>
                    <span>↗</span>
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
