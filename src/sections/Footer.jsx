import { Instagram, Mail, ArrowUp } from "lucide-react";
import { influencerData } from "../config/content";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer 
      className="bg-background border-t border-white/5 py-12 px-6 sm:px-12 lg:px-20 select-none relative z-10"
      id="global-footer"
    >
      <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left Side: Brand name and tagline */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
          <span className="text-xl font-italiana font-normal tracking-wide text-cream">
            {influencerData.name}
          </span>
          <span className="font-sans text-xs font-semibold text-purple-300 tracking-[0.16em] uppercase">
            Built for Brand Partnerships
          </span>
        </div>

        {/* Center: Social Links */}
        <div className="flex items-center space-x-6">
          <a
            href={influencerData.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram Profile"
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-cream/70 hover:text-pink-400 hover:border-pink-400/50 transition-all duration-300 transform active:scale-95 bg-white/5"
            id="footer-instagram-btn"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href={`mailto:${influencerData.email}`}
            aria-label="Send Direct Email"
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-cream/70 hover:text-pink-400 hover:border-pink-400/50 transition-all duration-300 transform active:scale-95 bg-white/5"
            id="footer-email-btn"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>

        {/* Right Side: Back to top / copyright */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-2">
          <button
            onClick={scrollToTop}
            className="flex items-center space-x-2 text-cream/50 hover:text-pink-400 transition-colors duration-300 text-xs font-sans font-bold tracking-[0.16em] uppercase focus:outline-none"
            aria-label="Scroll back to top"
            id="footer-back-to-top-btn"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <p className="font-sans text-xs text-white/30 tracking-wide">
            &copy; {new Date().getFullYear()} {influencerData.name}. ALL RIGHTS RESERVED.
          </p>
        </div>

      </div>
    </footer>
  );
}
