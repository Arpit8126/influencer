import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { influencerData } from "../config/content";
import { Instagram, Eye, Loader2, AlertCircle } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const isMobileDevice = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768);

// ─── Unified Reel Card ──────────────────────────────────────────────────────
function ReelCard({ reel, isStreamableBlocked }) {
  const [videoState, setVideoState] = useState("thumbnail"); // 'thumbnail' | 'loading' | 'playing' | 'error'
  const cardRef = useRef(null);
  const timeoutRef = useRef(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const startLoadingVideo = useCallback(() => {
    if (isStreamableBlocked) return;
    
    setVideoState((state) => {
      if (state === "thumbnail") {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setVideoState((prev) => (prev === "loading" ? "error" : prev));
        }, 4500); // 4.5s loading timeout
        return "loading";
      }
      return state;
    });
  }, [isStreamableBlocked]);

  const handleIframeLoad = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVideoState("playing");
  };

  const getStreamableUrl = () => {
    // Both desktop and mobile: autoplay, mute, controls, loop
    return `${reel.streamableUrl}&controls=1&loop=1`;
  };

  // Autoplay on view scroll trigger
  useEffect(() => {
    if (isStreamableBlocked) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startLoadingVideo();
          observer.disconnect();
        }
      },
      { rootMargin: "150px" } // Trigger slightly early
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [isStreamableBlocked, startLoadingVideo]);

  return (
    <div
      ref={cardRef}
      className="reel-phone-animate flex-shrink-0 w-[270px] sm:w-[290px] aspect-[9/18.5] bg-[#0c080a] rounded-[2.5rem] border-[5px] border-white/5 relative overflow-hidden group/phone snap-start shadow-xl hover:shadow-pink-500/10 transition-all duration-500 hover:border-pink-500/30 cursor-pointer"
      style={{
        pointerEvents: videoState === "playing" ? "none" : "auto",
        WebkitMaskImage: "-webkit-radial-gradient(white, black)",
      }}
    >
      {/* Phone notch */}
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-black rounded-full z-30 flex items-center justify-center pointer-events-none">
        <div className="w-2 h-2 rounded-full bg-white/10" />
      </div>

      {/* Persistent Watch on Instagram CTA Overlay (Always on top of video, except in error state) */}
      {videoState !== "error" && (
        <a
          href={reel.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="absolute z-40 flex items-center space-x-1.5 bg-black/60 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-full text-pink-400 font-sans text-[10px] font-bold tracking-wider active:scale-95 transition-all duration-200 shadow-md cursor-pointer pointer-events-auto hover:bg-pink-500/80 hover:text-white hover:border-pink-500/30"
          style={{
            top: "40px",
            left: "16px",
          }}
        >
          <Instagram className="w-3.5 h-3.5 text-pink-400 group-hover:text-white" />
          <span>Watch on Instagram</span>
        </a>
      )}

      {/* Thumbnail Image (Always in DOM as base/fallback) */}
      <img
        src={reel.thumbnailUrl}
        alt={reel.title}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        style={{
          zIndex: videoState === "playing" ? 5 : 20,
          opacity: videoState === "playing" ? 0 : 1,
        }}
        draggable="false"
        loading="lazy"
      />

      {/* Loading Spinner Overlay */}
      {videoState === "loading" && (
        <div className="absolute inset-0 z-30 bg-black/40 backdrop-blur-xs flex flex-col items-center justify-center space-y-3 pointer-events-none">
          <Loader2 className="w-8 h-8 text-pink-400 animate-spin" />
          <span className="text-[10px] font-mono tracking-widest text-cream/70 uppercase">
            Loading Reel...
          </span>
        </div>
      )}

      {/* Error / Blocked Overlay */}
      {(videoState === "error" || (isStreamableBlocked && videoState !== "thumbnail")) && (
        <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4 pointer-events-auto">
          <AlertCircle className="w-10 h-10 text-pink-500/80" />
          <div className="space-y-1">
            <p className="text-xs font-sans font-bold text-cream">Video Blocked or Unavailable</p>
            <p className="text-[10px] font-sans text-cream/60 leading-relaxed">
              {isStreamableBlocked 
                ? "Your network/ISP is blocking Streamable videos." 
                : "Unable to stream the reel on this connection."}
            </p>
          </div>
          <a
            href={reel.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 bg-pink-500/80 hover:bg-pink-600 active:scale-95 text-white font-sans text-[10px] tracking-wider uppercase font-bold py-2 px-4 rounded-full transition-all duration-200 shadow-md cursor-pointer"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>Watch on Instagram</span>
          </a>
        </div>
      )}

      {/* Video Iframe (Rendered when we are loading or playing, absolute positioned) */}
      {!isStreamableBlocked && (videoState === "loading" || videoState === "playing") && (
        <iframe
          allow="fullscreen; autoplay"
          allowFullScreen
          src={getStreamableUrl()}
          title={reel.title}
          onLoad={handleIframeLoad}
          className="absolute inset-0 w-full h-full border-none transition-opacity duration-500"
          style={{
            zIndex: 10,
            opacity: videoState === "playing" ? 1 : 0,
            pointerEvents: "auto",
          }}
        />
      )}

      {/* Bottom bar (Only show when video is NOT active/playing or loading) */}
      {videoState === "thumbnail" && (
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
              <span>Auto-playing...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main ReelsGallery Section ──────────────────────────────────────────────
export default function ReelsGallery() {
  const sectionRef = useRef(null);
  const reelsRowRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isStreamableBlocked, setIsStreamableBlocked] = useState(false);

  useEffect(() => {
    const mobile = isMobileDevice();
    setIsMobile(mobile);

    // Reachability test for Streamable to detect ISP/network blocks
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout

    // Fetch the actual embed URL directly to avoid any root-domain redirect delay
    fetch("https://streamable.com/e/lc4zz4", { mode: "no-cors", signal: controller.signal })
      .then(() => {
        clearTimeout(timeoutId);
        setIsStreamableBlocked(false);
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        if (err.name === "AbortError") {
          // If it is just a timeout (e.g. slow connection), don't block
          setIsStreamableBlocked(false);
          console.warn("Streamable reachability check timed out; assuming not blocked.");
        } else {
          // Real connection error (DNS block / reset)
          setIsStreamableBlocked(true);
          console.warn("Streamable is blocked or unreachable by network/ISP:", err);
        }
      });

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
              ? "Tap any reel to watch inline with controls. Use the close button (X) to stop playback."
              : "Hover a card to watch or click \"Watch on Instagram\" to open the reel natively."}
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
          }}
          id="reels-scroller-row"
        >
          {influencerData.instagramReels.map((reel) => (
            <ReelCard
              key={reel.id}
              reel={reel}
              isMobile={isMobile}
              isStreamableBlocked={isStreamableBlocked}
            />
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
