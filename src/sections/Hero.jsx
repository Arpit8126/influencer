import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { influencerData } from "../config/content";
import ThreeCanvas from "../components/ThreeCanvas";

gsap.registerPlugin(ScrollTrigger);

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

    // 2. Mouse Move Parallax on Left Content & Background Blobs
    const handleMouseParallax = (e) => {
      if (window.innerWidth < 1024) return; // Disable on tablet/mobile to avoid layout issues
      
      const { clientX, clientY } = e;
      const xVal = (clientX - window.innerWidth / 2) * 0.015;
      const yVal = (clientY - window.innerHeight / 2) * 0.015;

      gsap.to(leftContentRef.current, {
        x: xVal,
        y: yVal,
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto"
      });

      // Parallax displacement for background glows
      gsap.to(".hero-glow-blob-1", {
        x: xVal * -0.5,
        y: yVal * -0.5,
        duration: 1.2,
        ease: "power2.out",
        overwrite: "auto"
      });
      gsap.to(".hero-glow-blob-2", {
        x: xVal * 0.3,
        y: yVal * 0.3,
        duration: 1.2,
        ease: "power2.out",
        overwrite: "auto"
      });
    };

    window.addEventListener("mousemove", handleMouseParallax);

    // Floating animations for background blobs
    const blob1Tween = gsap.to(".hero-glow-blob-1", {
      x: "random(-30, 30)",
      y: "random(-30, 30)",
      duration: 7,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    const blob2Tween = gsap.to(".hero-glow-blob-2", {
      x: "random(-40, 40)",
      y: "random(-40, 40)",
      duration: 9,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // 3. Parallax Scroll Trigger
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    // Move left content down slower than scrolling (parallax)
    scrollTl.to(leftContentRef.current, {
      y: 140,
      opacity: 0.1,
      ease: "none"
    }, 0);

    // Move right canvas slightly up/left (depth)
    scrollTl.to(rightContentRef.current, {
      y: -60,
      scale: 0.95,
      opacity: 0.3,
      ease: "none"
    }, 0);

    return () => {
      window.removeEventListener("mousemove", handleMouseParallax);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      blob1Tween.kill();
      blob2Tween.kill();
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(26,15,20,0.15)_0%,rgba(10,10,10,0)_70%)] pointer-events-none" />

      {/* Floating luxury background ambient glow blobs */}
      <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle,rgba(199,169,110,0.08)_0%,transparent_70%)] filter blur-3xl z-0 pointer-events-none hero-glow-blob-1" />
      <div className="absolute bottom-[20%] right-[15%] w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(26,15,20,0.35)_0%,transparent_70%)] filter blur-3xl z-0 pointer-events-none hero-glow-blob-2" />

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-10">
        
        {/* Left Side: Typography & CTAs */}
        <div 
          ref={leftContentRef} 
          className="lg:col-span-6 flex flex-col justify-center space-y-6 md:space-y-8 select-none order-2 lg:order-1"
        >
          {/* Follower Badge */}
          <div className="hero-fade-in opacity-0 translate-y-4 flex items-center space-x-3 w-fit">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
            </span>
            <span className="font-mono text-[9px] tracking-widest text-gold uppercase border border-gold/25 px-3 py-1 rounded-full bg-gold/5 gold-glow-subtle">
              {influencerData.followerCount} on Instagram
            </span>
          </div>

          {/* Heading Name */}
          <div className="space-y-2">
            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-playfair font-normal leading-[1.05] tracking-tighter overflow-hidden py-1 flex flex-wrap gap-x-4">
              <span className="hero-word-1 inline-block opacity-0 translate-y-8 text-cream pr-4">
                Divya
              </span>
              <span className="hero-word-2 inline-block opacity-0 translate-y-8 text-luxury-gradient italic">
                Rana
              </span>
            </h1>
            <h2 className="hero-niche opacity-0 text-sm sm:text-base font-mono text-mauve uppercase drop-shadow-[0_0_8px_rgba(196,164,176,0.12)]">
              {influencerData.niche}
            </h2>
          </div>

          {/* Tagline */}
          <p className="hero-fade-in opacity-0 translate-y-4 text-cream/70 font-light text-base md:text-lg max-w-md leading-relaxed">
            Curating elegant visuals at the intersection of conscious skincare, luxury cosmetics, and editorial style. 
          </p>

          {/* CTAs */}
          <div className="hero-fade-in opacity-0 translate-y-6 flex items-center space-x-6">
            <button
              onClick={handleCtaClick}
              id="hero-cta-btn"
              className="glass-card text-cream font-mono text-xs tracking-widest uppercase py-4 px-8 rounded-full border border-gold/30 hover:border-gold hover:text-background hover:bg-gold transition-all duration-500 transform active:scale-95 shadow-lg hover:shadow-gold/10"
            >
              Work With Me
            </button>
            <a
              href={influencerData.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="hero-instagram-link"
              className="text-cream/50 hover:text-gold font-mono text-[10px] tracking-widest uppercase transition-colors duration-300 py-2 border-b border-white/10 hover:border-gold"
            >
              Instagram Profile ↗
            </a>
          </div>
        </div>

        {/* Right Side: Portrait Image & ThreeJS Particles */}
        <div 
          ref={rightContentRef}
          className="lg:col-span-6 flex justify-center order-1 lg:order-2"
        >
          <ThreeCanvas imageUrl={influencerData.images.heroPortrait} />
        </div>
      </div>
      
      {/* Scroll Down Hint: Sleek luxury mouse scroll dot indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center space-y-2.5 pointer-events-none opacity-40 select-none">
        <span className="font-mono text-[8px] tracking-[0.2em] uppercase text-cream/70">
          SCROLL TO EXPLORE
        </span>
        <div className="w-5 h-8 border border-cream/30 rounded-full flex justify-center p-1.5">
          <div className="w-1.5 h-1.5 bg-gold rounded-full animate-scroll-dot" />
        </div>
      </div>
    </section>
  );
}
