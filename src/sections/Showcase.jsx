import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Carousel3D from "../components/Carousel3D";
import { influencerData } from "../config/content";
import { Instagram, Eye } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/**
 * ReelCard
 *
 * Fix 1 – Instant start:
 *   Iframe is mounted with `visibility: hidden` from component mount (page load).
 *   The browser fetches and buffers the video silently the entire time the user
 *   is reading the page above. When IntersectionObserver fires (user reaches
 *   the gallery), we reveal it immediately — no extra delay needed.
 *
 * Fix 2 – Controls vanishing:
 *   The bottom stats bar previously had z-40 + pointer-events:auto, which
 *   caused the iframe to receive `mouseleave` as soon as the cursor moved
 *   onto the bar, hiding Streamable's controls.
 *   Solution: bottom bar is pointer-events:none (visual only). Instagram
 *   redirect is handled by a hover-only pill that appears over the video
 *   and stays WITHIN the iframe bounding box, so mouse events stay on the
 *   iframe and controls remain visible.
 */
function ReelCard({ reel }) {
  const [showVideo, setShowVideo] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    // Reveal immediately when card enters viewport.
    // The iframe has been buffering since page load (visibility:hidden),
    // so by the time the user scrolls here the video is ready.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowVideo(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className="reel-phone-animate flex-shrink-0 w-[240px] sm:w-[260px] aspect-[9/18.5] bg-[#0c080a] rounded-[2.5rem] border-[5px] border-white/5 relative overflow-hidden group/phone snap-start shadow-xl hover:shadow-pink-500/10 transition-all duration-500 hover:border-pink-500/30 cursor-none"
    >
      {/* Phone notch */}
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-black rounded-full z-30 flex items-center justify-center pointer-events-none">
        <div className="w-2 h-2 rounded-full bg-white/10" />
      </div>

      {/* ── iframe: always in DOM, hidden until user reaches section ──
          visibility:hidden = silent background loading, zero paint, no z fights.
          pointer-events:auto when visible so Streamable controls work fully.   */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          visibility: showVideo ? "visible" : "hidden",
          pointerEvents: showVideo ? "auto" : "none",
          opacity: showVideo ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        <iframe
          allow="fullscreen; autoplay"
          allowFullScreen
          src={reel.streamableUrl}
          title={reel.title}
          style={{
            border: "none",
            width: "100%",
            height: "100%",
            position: "absolute",
            left: 0,
            top: 0,
            display: "block",
          }}
        />
      </div>

      {/* ── Thumbnail: shown while video is buffering / hidden ── */}
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

      {/* ── Bottom bar: purely visual, pointer-events NONE so mouse stays
          inside iframe bounds and Streamable controls stay visible ──      */}
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
            <span>Tap to open on Instagram</span>
          </div>
        </div>
      </div>

      {/* ── Hover pill: "View on Instagram" — appears over video, within iframe
          bounds so Streamable controls don't disappear when hovering it ──  */}
      <div
        className="absolute top-10 left-0 right-0 flex justify-center opacity-0 group-hover/phone:opacity-100 transition-opacity duration-300 pointer-events-none select-none"
        style={{ zIndex: 50 }}
      >
        <a
          href={reel.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center space-x-1.5 bg-black/70 backdrop-blur-sm text-white font-sans text-[10px] tracking-[0.16em] uppercase font-bold py-2 px-4 rounded-full border border-pink-400/40 shadow-lg pointer-events-auto cursor-none hover:bg-pink-500/80 transition-colors duration-200"
        >
          <Instagram className="w-3 h-3 text-pink-300" />
          <span>View on Instagram ↗</span>
        </a>
      </div>
    </div>
  );
}

export default function Showcase() {
  const sectionRef = useRef(null);
  const reelsRowRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      ".showcase-fade-in",
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.15, duration: 1.0, ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" }
      }
    );
    gsap.fromTo(
      ".reel-phone-animate",
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.08, duration: 1.2, ease: "power3.out",
        scrollTrigger: { trigger: reelsRowRef.current, start: "top 80%" }
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="showcase"
      className="relative w-full min-h-screen bg-luxuryBlack flex flex-col justify-center py-24 px-6 sm:px-12 lg:px-20 overflow-hidden"
    >
      {/* Background glows */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-rose-glow/12 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-lavender-glow/15 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto flex flex-col space-y-20 z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 select-none">
          <div className="space-y-4">
            <span className="showcase-fade-in font-sans text-xs sm:text-sm text-pink-400 tracking-[0.25em] font-semibold uppercase block">
              04 DIGITAL LOOKBOOK
            </span>
            <h2 className="showcase-fade-in text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-italiana font-normal leading-tight text-pink-sunset-gradient drop-shadow-[0_0_20px_rgba(251,113,133,0.18)]">
              Featured Work
            </h2>
          </div>
          <p className="showcase-fade-in text-sm sm:text-base text-cream/70 max-w-sm font-light leading-relaxed font-sans">
            Drag to rotate the 3D showcase. Scroll down to watch live Reels — hover a card and tap "View on Instagram" to open the reel.
          </p>
        </div>

        <div className="h-[1px] w-full bg-white/10 showcase-fade-in" />

        {/* 3D Lookbook Carousel */}
        <div className="showcase-fade-in space-y-4">
          <div className="flex items-center space-x-3 select-none">
            <span className="font-sans text-[11px] text-pink-400/80 tracking-[0.2em] font-bold uppercase">
              LOOKBOOK: 3D CYLINDER ROTATION
            </span>
            <div className="h-[1px] w-12 bg-pink-500/20" />
          </div>
          <Carousel3D />
        </div>

        {/* Reels Gallery */}
        <div className="space-y-8 select-none">
          <div className="flex items-center justify-between">
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

          <div
            ref={reelsRowRef}
            className="flex overflow-x-auto pb-8 space-x-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 scroll-smooth snap-x snap-mandatory"
            id="reels-scroller-row"
          >
            {influencerData.instagramReels.map((reel) => (
              <ReelCard key={reel.id} reel={reel} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
