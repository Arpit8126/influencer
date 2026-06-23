import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BrandForm from "../components/BrandForm";
import { influencerData } from "../config/content";
import { Mail, Clock, HelpCircle } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef(null);

  useEffect(() => {
    // Reveal text and form card on scroll
    gsap.fromTo(
      ".contact-fade-in",
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
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full min-h-screen bg-luxuryMauve flex items-center justify-center py-24 px-6 sm:px-12 lg:px-20 overflow-hidden"
    >
      {/* Background soft glow ornament */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center z-10">
        
        {/* Left column: Text details */}
        <div className="lg:col-span-5 space-y-8 select-none">
          <span className="contact-fade-in font-mono text-xs sm:text-sm text-gold tracking-[0.25em] font-bold uppercase block">
            06 COLLABORATE
          </span>
          <h2 className="contact-fade-in text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-playfair font-normal leading-tight text-cream">
            Initiate a Campaign
          </h2>
          
          <div className="h-[1px] w-20 bg-gold/30 contact-fade-in" />
          
          <p className="contact-fade-in text-sm sm:text-base text-cream/70 font-light leading-relaxed">
            Ready to align your brand with 34.1K+ active cosmetics and skincare consumers? Submit your campaign briefs in the contract portal. Divya will review the campaign budget, timelines, and product details and get in touch with your marketing team.
          </p>

          {/* Quick FAQ / Guidelines (Relevant Content addition) */}
          <div className="contact-fade-in space-y-4 pt-2">
            <div className="flex items-start space-x-3">
              <Clock className="w-4 h-4 text-gold mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-mono text-[10px] tracking-wide text-cream uppercase">Response Time</h4>
                <p className="text-xs text-cream/50">Divya reviews proposals and responds to brand inquiries within 48 business hours.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <HelpCircle className="w-4 h-4 text-gold mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-mono text-[10px] tracking-wide text-cream uppercase">PR Shipping / Gifting</h4>
                <p className="text-xs text-cream/50">Shipping details are provided once the campaign brief is locked. Please specify if it is an unpaid PR unboxing or paid integration.</p>
              </div>
            </div>
          </div>
          
          <div className="contact-fade-in space-y-2 pt-4 border-t border-white/5">
            <span className="font-mono text-[8px] text-mauve tracking-wider uppercase block">
              DIRECT INQUIRIES & PR OFFERS
            </span>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gold/75" />
              <a 
                href={`mailto:${influencerData.email}`}
                className="text-base text-gold hover:text-cream font-mono transition-colors duration-300 block w-fit border-b border-gold/20 hover:border-cream"
                id="direct-inquiry-email-link"
              >
                {influencerData.email}
              </a>
            </div>
          </div>
        </div>

        {/* Right column: Form Card */}
        <div className="lg:col-span-7 contact-fade-in">
          <BrandForm />
        </div>
      </div>
    </section>
  );
}
