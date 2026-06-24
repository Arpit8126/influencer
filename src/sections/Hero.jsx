import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { influencerData } from "../config/content";
import ThreeCanvas from "../components/ThreeCanvas";

gsap.registerPlugin(ScrollTrigger);

// Detect mobile/touch — used to skip heavy animations
const isMobile = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768);

export default function Hero() {
  const sectionRef = useRef(null);
  const leftContentRef = useRef(null);
  const rightContentRef = useRef(null);

  useEffect(() => {
    // 1. Initial Load Animations
    const tl = gsap.timeline({ delay: 0.6 });

    // Word-by-word elegant slide-up and fade-in
    tl.fromTo(".hero-word-1, .hero-word-2", 
      { y: 35, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 1.0,
        ease: "power3.out"
      }
    );

    // Niche spacing reveal
    tl.fromTo(".hero-niche", 
      { letterSpacing: "0.08em", opacity: 0, y: 15 },
      { letterSpacing: "0.22em", opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
      "-=0.6"
    );

    // Tagline fade and lift (explicit fromTo to bypass Tailwind transform clashes)
    tl.fromTo(".hero-fade-in", 
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.12,
        duration: 0.8,
        ease: "power3.out"
      }, 
      "-=0.6"
    );

    tl.eventCallback("onComplete", () => {
      console.log("Hero load animations complete!");
    });

    // 2. Mouse Move Parallax — desktop only (no mouse on mobile)
    const handleMouseParallax = (e) => {
      if (window.innerWidth < 1024) return;
      const { clientX, clientY } = e;
      const xVal = (clientX - window.innerWidth / 2) * 0.015;
      const yVal = (clientY - window.innerHeight / 2) * 0.015;
      gsap.to(leftContentRef.current, { x: xVal, y: yVal, duration: 0.8, ease: "power2.out", overwrite: "auto" });
      gsap.to(".hero-glow-blob-1", { x: xVal * -0.5, y: yVal * -0.5, duration: 1.2, ease: "power2.out", overwrite: "auto" });
      gsap.to(".hero-glow-blob-2", { x: xVal * 0.3, y: yVal * 0.3, duration: 1.2, ease: "power2.out", overwrite: "auto" });
    };
    window.addEventListener("mousemove", handleMouseParallax);

    // Floating blob animations — skip on mobile
    let blob1Tween, blob2Tween, blob3Tween, blob4Tween;
    if (!isMobile()) {
      blob1Tween = gsap.to(".hero-glow-blob-1", { x: "random(-40, 40)", y: "random(-40, 40)", duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut" });
      blob2Tween = gsap.to(".hero-glow-blob-2", { x: "random(-50, 50)", y: "random(-50, 50)", duration: 10, repeat: -1, yoyo: true, ease: "sine.inOut" });
      blob3Tween = gsap.to(".hero-glow-blob-3", { x: "random(-35, 35)", y: "random(-35, 35)", duration: 7, repeat: -1, yoyo: true, ease: "sine.inOut" });
      blob4Tween = gsap.to(".hero-glow-blob-4", { x: "random(-45, 45)", y: "random(-45, 45)", duration: 9, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }

    // 3. Parallax Scroll Trigger — desktop only (skip on mobile for smooth scroll)
    let scrollTl;
    if (!isMobile()) {
      scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
      scrollTl.to(leftContentRef.current, { y: 140, opacity: 0.1, ease: "none" }, 0);
      scrollTl.to(rightContentRef.current, { y: -60, scale: 0.95, opacity: 0.3, ease: "none" }, 0);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseParallax);
      scrollTl && scrollTl.scrollTrigger && scrollTl.scrollTrigger.kill();
      scrollTl && scrollTl.kill();
      blob1Tween && blob1Tween.kill();
      blob2Tween && blob2Tween.kill();
      blob3Tween && blob3Tween.kill();
      blob4Tween && blob4Tween.kill();
    };
  }, []);

  const handleCtaClick = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section 
      ref={sectionRef}
      id="hero"
      className="section-reveal w-full min-h-screen flex items-center justify-center bg-background px-6 sm:px-12 lg:px-20 py-20 relative overflow-hidden"
    >
      {/* Background glow vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(23,13,18,0.35)_0%,rgba(11,7,9,0)_70%)] pointer-events-none" />

      {/* Concentric Cosmic Beauty Orbits (SVG fine line ornaments) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] pointer-events-none opacity-20 z-0 hidden lg:block">
        <svg className="w-full h-full animate-[spin_60s_linear_infinite]" viewBox="0 0 1000 1000" fill="none">
          <ellipse cx="500" cy="500" rx="450" ry="220" stroke="url(#orbit-grad)" strokeWidth="1" transform="rotate(-30 500 500)" />
          <ellipse cx="500" cy="500" rx="380" ry="180" stroke="url(#orbit-grad-2)" strokeWidth="0.75" transform="rotate(45 500 500)" />
          <ellipse cx="500" cy="500" rx="480" ry="140" stroke="url(#orbit-grad)" strokeWidth="0.5" transform="rotate(-15 500 500)" />
          <defs>
            <linearGradient id="orbit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb7185" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#c084fc" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="orbit-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fdba74" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#fb7185" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Left Sideways Editorial Margin Text */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center space-y-4 text-white/20 select-none z-10">
        <span className="font-sans text-[10px] tracking-[0.25em] uppercase font-semibold sideways-text-left">
          RANA DIVYA ✦ PORTFOLIO
        </span>
        <div className="w-[1px] h-24 bg-white/10" />
      </div>

      {/* Right Sideways Editorial Margin Text */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center space-y-4 text-white/20 select-none z-10">
        <div className="w-[1px] h-24 bg-white/10" />
        <span className="font-sans text-[10px] tracking-[0.25em] uppercase font-semibold sideways-text-right">
          SCROLL TO EXPLORE ✦ INSIGHTS
        </span>
      </div>

      {/* Floating dynamic background ambient glow blobs (Vibrant, colorful mesh) */}
      <div className="absolute top-[10%] left-[5%] w-[380px] h-[380px] rounded-full bg-[radial-gradient(circle,rgba(251,113,133,0.18)_0%,transparent_70%)] filter blur-3xl z-0 pointer-events-none hero-glow-blob-1" />
      <div className="absolute bottom-[15%] right-[10%] w-[480px] h-[480px] rounded-full bg-[radial-gradient(circle,rgba(192,132,252,0.22)_0%,transparent_70%)] filter blur-3xl z-0 pointer-events-none hero-glow-blob-2" />
      <div className="absolute top-[40%] right-[30%] w-[320px] h-[320px] rounded-full bg-[radial-gradient(circle,rgba(253,186,116,0.15)_0%,transparent_70%)] filter blur-3xl z-0 pointer-events-none hero-glow-blob-3" />
      <div className="absolute bottom-[5%] left-[20%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(45,212,191,0.12)_0%,transparent_70%)] filter blur-3xl z-0 pointer-events-none hero-glow-blob-4" />

      {/* Floating Abstract SVG shapes for creativity */}
      <div className="absolute top-[22%] left-[8%] z-10 pointer-events-none animate-spin-sparkle text-pink-400 opacity-60 hidden md:block">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
      </div>
      <div className="absolute top-[18%] right-[8%] z-10 pointer-events-none animate-spin-sparkle text-orange-300 opacity-50 hidden lg:block" style={{ animationDuration: '18s' }}>
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-10">
        
        {/* Left Side: Typography & CTAs */}
        <div 
          ref={leftContentRef} 
          className="lg:col-span-6 flex flex-col justify-center space-y-6 md:space-y-8 select-none order-2 lg:order-1"
        >
          {/* Follower Badge */}
          <div className="hero-fade-in opacity-0 translate-y-4 flex items-center space-x-3 w-fit">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-400"></span>
            </span>
            <span className="font-sans text-xs tracking-[0.18em] font-semibold text-pink-400 uppercase border border-pink-500/20 px-4.5 py-1.5 rounded-full bg-pink-500/5 pink-glow-subtle">
              {influencerData.followerCount} on Instagram
            </span>
          </div>

          {/* Heading Name */}
          <div className="space-y-3">
            <h1 className="text-6xl sm:text-7xl xl:text-8xl font-italiana font-normal leading-[1.02] tracking-normal overflow-hidden py-1 flex flex-wrap gap-x-4">
              <span className="hero-word-1 inline-block opacity-0 translate-y-8 text-cream pr-4">
                Divya
              </span>
              <span className="hero-word-2 inline-block opacity-0 translate-y-8 text-pink-sunset-gradient italic font-playfair font-medium drop-shadow-[0_0_20px_rgba(251,113,133,0.25)]">
                Rana
              </span>
            </h1>
            <h2 className="hero-niche opacity-0 text-sm sm:text-base font-sans font-medium text-purple-300 tracking-[0.25em] uppercase drop-shadow-[0_0_8px_rgba(192,132,252,0.25)]">
              {influencerData.niche}
            </h2>
          </div>

          {/* Tagline */}
          <p className="hero-fade-in opacity-0 translate-y-4 text-cream/75 font-light text-base md:text-lg max-w-md leading-relaxed">
            Curating elegant visuals at the intersection of conscious skincare, luxury cosmetics, and editorial style. 
          </p>

          {/* CTAs (Responsive Alignment on Mobile) */}
          <div className="hero-fade-in opacity-0 translate-y-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 w-full sm:w-auto">
            <button
              onClick={handleCtaClick}
              id="hero-cta-btn"
              data-cursor-text="CONTACT"
              className="w-full sm:w-auto glass-card text-cream font-sans text-xs font-semibold tracking-[0.16em] uppercase py-4.5 px-9 rounded-full border border-pink-500/20 hover:border-pink-400 hover:text-white hover:bg-gradient-to-r hover:from-rose-glow hover:to-coral transition-all duration-500 transform active:scale-95 shadow-lg hover:shadow-pink-500/20"
            >
              Work With Me
            </button>
            <a
              href={influencerData.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="hero-instagram-link"
              data-cursor-text="OPEN"
              className="text-cream/70 hover:text-pink-400 font-sans text-xs font-medium tracking-[0.18em] uppercase transition-colors duration-300 py-2.5 border-b border-white/10 hover:border-pink-400"
            >
              Instagram Profile ↗
            </a>
          </div>
        </div>

        {/* Right Side: Portrait Image & ThreeJS Particles */}
        <div 
          ref={rightContentRef}
          className="lg:col-span-6 flex justify-center order-1 lg:order-2"
          data-cursor-text="DRAG"
        >
          <ThreeCanvas imageUrl={influencerData.images.heroPortrait} />
        </div>
      </div>
      
      {/* Scroll Down Hint: Sleek luxury mouse scroll dot indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center space-y-2.5 pointer-events-none opacity-40 select-none">
        <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-cream/70 font-semibold">
          SCROLL TO EXPLORE
        </span>
        <div className="w-5 h-8 border border-cream/30 rounded-full flex justify-center p-1.5">
          <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-scroll-dot" />
        </div>
      </div>
    </section>
  );
}
