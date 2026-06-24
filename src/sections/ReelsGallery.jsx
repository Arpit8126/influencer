import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { influencerData } from "../config/content";
import { Instagram, Eye } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const isMobileDevice = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768);

// ─── Unified Reel Card ──────────────────────────────────────────────────────
// Iframe embed that preloads silently in the background when close to viewport.
function ReelCard({ reel }) {
  const [showVideo, setShowVideo] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseEnter={!showVideo ? () => setShowVideo(true) : undefined}
      onTouchStart={!showVideo ? () => setShowVideo(true) : undefined}
      className="reel-phone-animate flex-shrink-0 w-[270px] sm:w-[290px] aspect-[9/18.5] bg-[#0c080a] rounded-[2.5rem] border-[5px] border-white/5 relative overflow-hidden group/phone snap-start shadow-xl hover:shadow-pink-500/10 transition-all duration-500 hover:border-pink-500/30 cursor-pointer md:cursor-none"
    >
      {/* Phone notch */}
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-black rounded-full z-30 flex items-center justify-center pointer-events-none">
        <div className="w-2 h-2 rounded-full bg-white/10" />
      </div>

      {/* Instagram Button — Top-Right, always active, small footprint to prevent touch blocking */}
      <a
        href={reel.link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-pink-400 hover:bg-pink-500/80 hover:text-white active:scale-95 transition-all duration-200 shadow-md cursor-pointer pointer-events-auto"
        title="Open on Instagram"
      >
        <Instagram className="w-4 h-4" />
      </a>

      {/* Iframe — always in DOM, hidden until viewport */}
      <div
        style={{
          position: "absolute", inset: 0, zIndex: 10,
          visibility: showVideo ? "visible" : "hidden",
          pointerEvents: showVideo ? "auto" : "none",
          opacity: showVideo ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        <iframe
          allow="fullscreen; autoplay"
          allowFullScreen
          src={showVideo ? reel.streamableUrl : "about:blank"}
          title={reel.title}
          style={{ border: "none", width: "100%", height: "100%", position: "absolute", left: 0, top: 0, display: "block" }}
        />
      </div>

      {/* Thumbnail while buffering */}
      {!showVideo && (
        <img
          src={reel.thumbnailUrl}
          alt={reel.title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 20 }}
          draggable="false"
          loading="lazy"
        />
      )}

      {/* Bottom bar — ONLY show when video is NOT active/playing */}
      {!showVideo && (
        <div
          className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-12 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none select-none"
          style={{ zIndex: 40 }}
        >
          <div className="flex items-center space-x-2 mb-1.5">
            <div className="w-5 h-5 rounded-full overflow-hidden border border-pink-500/40 bg-luxuryMauve flex-shrink-0">
              <img
                src={influencerData.images.heroPortrait}
                alt="avatar"
                className="w-full h-full object-cover scale-110"
                loading="lazy"
              />
            </div>
            <span className="font-sans text-[10px] tracking-wider text-cream font-semibold truncate">
              @{influencerData.username}
            </span>
          </div>
          <div className="flex items-center space-x-3 text-[10px] font-sans text-white/50 border-t border-white/10 pt-2">
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3 text-pink-400/75" />
              <span>{reel.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Instagram className="w-3 h-3 text-pink-400/75" />
              <span>Open on Instagram</span>
            </div>
          </div>
        </div>
      )}

      {/* Hover Pill (Desktop Only) — View on Instagram */}
      <div
        className="absolute top-10 left-0 right-0 hidden md:flex justify-center opacity-0 group-hover/phone:opacity-100 transition-opacity duration-300 pointer-events-none select-none"
        style={{ zIndex: 50 }}
      >
        <a
          href={reel.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center space-x-1.5 bg-black/70 backdrop-blur-sm text-white font-sans text-[10px] tracking-[0.16em] uppercase font-bold py-2.5 px-5 rounded-full border border-pink-400/40 shadow-lg pointer-events-auto cursor-pointer hover:bg-pink-500/80 transition-colors duration-200"
        >
          <Instagram className="w-3 h-3 text-pink-300" />
          <span>View on Instagram ↗</span>
        </a>
      </div>
    </div>
  );
}

// ─── Main ReelsGallery Section ──────────────────────────────────────────────
export default function ReelsGallery() {
  const sectionRef = useRef(null);
  const reelsRowRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobile = isMobileDevice();
    setIsMobile(mobile);

    gsap.fromTo(
      ".gallery-fade-in",
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.12, duration: 1.0, ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" }
      }
    );

    // Only animate phone cards on desktop (mobile has instant render)
    if (!mobile) {
      gsap.fromTo(
        ".reel-phone-animate",
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.08, duration: 1.2, ease: "power3.out",
          scrollTrigger: { trigger: reelsRowRef.current, start: "top 80%" }
        }
      );
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="relative w-full min-h-screen bg-luxuryMauve flex flex-col justify-center py-24 px-6 sm:px-12 lg:px-20 overflow-hidden"
    >
      {/* Background ambient glows */}
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-rose-glow/10 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[380px] h-[380px] bg-lavender-glow/12 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto flex flex-col space-y-14 z-10">

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 select-none">
          <div className="space-y-4">
            <span className="gallery-fade-in font-sans text-xs sm:text-sm text-pink-400 tracking-[0.25em] font-semibold uppercase block">
              03 LIVE REELS GALLERY
            </span>
            <h2 className="gallery-fade-in text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-italiana font-normal leading-tight text-pink-sunset-gradient drop-shadow-[0_0_20px_rgba(251,113,133,0.18)]">
              Featured Reels
            </h2>
          </div>
          <p className="gallery-fade-in text-sm sm:text-base text-cream/70 max-w-sm font-light leading-relaxed font-sans">
            {isMobile
              ? "Tap any reel to watch — use the play, pause, or sound buttons at the bottom."
              : "Hover a card to watch or click \"View on Instagram\" to open the reel natively."}
          </p>
        </div>

        <div className="h-[1px] w-full bg-white/10 gallery-fade-in" />

        {/* Sub-label */}
        <div className="gallery-fade-in flex items-center justify-between select-none -mt-4">
          <div className="flex items-center space-x-3">
            <span className="font-sans text-[11px] text-pink-400/80 tracking-[0.2em] font-bold uppercase">
              GALLERY: LIVE REELS FEED
            </span>
            <div className="h-[1px] w-12 bg-pink-500/20" />
          </div>
          <div className="text-xs font-sans font-bold text-purple-300 tracking-[0.18em] uppercase">
            Verified Campaigns
          </div>
        </div>

        {/* Reels row */}
        <div
          ref={reelsRowRef}
          className="flex overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory"
          style={{
            gap: isMobile ? "12px" : "24px",
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-x",
          }}
          id="reels-scroller-row"
        >
          {influencerData.instagramReels.map((reel) => (
            <ReelCard key={reel.id} reel={reel} />
          ))}
        </div>

        {/* Swipe hint on mobile */}
        {isMobile && (
          <p className="text-center font-mono text-[10px] text-white/30 tracking-widest uppercase -mt-8">
            ← Swipe to explore →
          </p>
        )}

      </div>
    </section>
  );
}
