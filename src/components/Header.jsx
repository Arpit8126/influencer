import { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { influencerData } from "../config/content";

const NAV_ITEMS = [
  { id: "hero", label: "INTRO" },
  { id: "about", label: "BIO" },
  { id: "gallery", label: "REELS" },
  { id: "mediadeck", label: "MEDIA" },
  { id: "showcase", label: "LOOKBOOK" },
  { id: "collabs", label: "PARTNERS" },
  { id: "contact", label: "INQUIRE" }
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let rafId = null;
    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        setIsScrolled(window.scrollY > 50);
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const handleNavClick = (id) => {
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${
        isScrolled
          ? "bg-background/90 border-white/5 py-4 supports-[backdrop-filter]:backdrop-blur-md"
          : "bg-transparent border-transparent py-6"
      }`}
      id="global-header"
    >
      <div className="w-full px-4 sm:px-8 md:px-16 flex items-center justify-between relative">
        
        {/* Left Side: Brand Logo */}
        <button
          onClick={() => handleNavClick("hero")}
          className="font-playfair text-sm sm:text-lg md:text-xl lg:text-2xl font-normal tracking-wider text-cream focus:outline-none select-none hover:text-pink-400 transition-colors duration-300 z-10"
          aria-label="Back to intro"
        >
          {influencerData.name.toUpperCase()}
        </button>

        {/* Mobile Contact Button (Absolutely Centered) */}
        <button
          onClick={() => handleNavClick("contact")}
          className="lg:hidden absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 font-sans text-[9px] sm:text-[10px] tracking-[0.16em] uppercase border border-pink-500/40 bg-pink-500/10 hover:bg-gradient-to-r hover:from-pink-500 hover:to-coral hover:text-background active:scale-95 transition-all duration-300 py-1.5 px-3.5 rounded-full text-cream font-bold z-10"
          id="mobile-header-contact-btn"
        >
          Contact
        </button>

        {/* Center: Desktop Navigation Links (Absolutely Centered) */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 select-none absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="font-sans text-xs tracking-[0.18em] font-semibold text-cream/70 hover:text-pink-400 transition-colors duration-300 focus:outline-none uppercase"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Side: CTA / Mobile Menu toggle wrapper */}
        <div className="flex items-center space-x-4 z-10">
          <button
            onClick={() => handleNavClick("contact")}
            className="hidden lg:flex font-sans text-[10px] tracking-[0.18em] uppercase border border-pink-500/30 hover:border-pink-400 hover:bg-gradient-to-r hover:from-pink-500 hover:to-coral hover:text-background transition-all duration-500 py-2.5 px-5.5 rounded-full text-cream items-center space-x-1.5 focus:outline-none font-bold"
          >
            <span>Let's Collaborate</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Hamburger toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-cream hover:text-pink-400 transition-colors duration-300 focus:outline-none"
            aria-label="Toggle menu"
            id="mobile-menu-toggle-btn"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div 
          className="fixed inset-0 top-[60px] w-full h-[calc(100vh-60px)] bg-[#0b0709]/98 z-40 flex flex-col p-8 justify-between lg:hidden border-t border-white/5 select-none"
          id="mobile-navigation-drawer"
        >
          <div className="flex flex-col space-y-6 pt-12">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="font-italiana text-4xl font-normal text-cream/80 hover:text-pink-400 transition-colors duration-300 text-left focus:outline-none"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="space-y-6 pb-12">
            <button
              onClick={() => handleNavClick("contact")}
              className="w-full bg-gradient-to-r from-pink-500 to-coral text-background font-sans text-xs font-bold tracking-[0.16em] uppercase py-4 rounded-full border border-pink-400/20 text-center block"
            >
              LET'S COLLABORATE
            </button>
            <div className="flex justify-between items-center text-xs font-sans text-white/50 tracking-wider font-semibold">
              <span>{influencerData.email}</span>
              <span>@{influencerData.username}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
