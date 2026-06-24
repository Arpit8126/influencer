import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "INTRO" },
  { id: "about", label: "BIO" },
  { id: "mediadeck", label: "MEDIA" },
  { id: "showcase", label: "WORK" },
  { id: "collabs", label: "PARTNERS" },
  { id: "contact", label: "INQUIRE" }
];

export default function ScrollIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }

      // Determine active section
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.4) {
            setActiveSection(section.id);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div 
      className="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col items-end space-y-6"
      id="global-scroll-indicator"
    >
      {/* Visual Progress bar */}
      <div className="h-32 w-[1px] bg-white/10 relative overflow-hidden mb-2">
        <div 
          className="absolute top-0 right-0 w-full bg-pink-400 transition-all duration-75"
          style={{ height: `${scrollProgress}%` }}
        />
      </div>

      {/* Navigation Indicators */}
      {SECTIONS.map((sec) => {
        const isActive = activeSection === sec.id;
        return (
          <button
            key={sec.id}
            onClick={() => scrollToSection(sec.id)}
            className="group flex items-center space-x-3 text-right focus:outline-none"
            aria-label={`Scroll to ${sec.label}`}
          >
            {/* Hover label */}
            <span 
              className={`font-mono text-xs tracking-widest transition-all duration-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 ${
                isActive ? "opacity-100 text-pink-400 translate-x-0 font-medium" : "text-purple-300"
              }`}
            >
              {sec.label}
            </span>
            
            {/* Dot */}
            <div 
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 border ${
                isActive 
                  ? "bg-pink-400 border-pink-400 scale-125" 
                  : "bg-transparent border-white/30 group-hover:border-pink-400/60"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
