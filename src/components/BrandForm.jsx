import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import emailjs from "@emailjs/browser";
import { influencerData } from "../config/content";

export default function BrandForm() {
  const [formData, setFormData] = useState({
    brandName: "",
    email: "",
    campaignType: "Reel",
    budgetRange: "Under $1,000",
    message: ""
  });

  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const checkCircleRef = useRef(null);
  const checkPathRef = useRef(null);
  const containerRef = useRef(null);

  // Field focus effects using GSAP
  const handleFocus = (e) => {
    gsap.to(e.target, {
      borderColor: "#fb7185",
      boxShadow: "0 0 12px rgba(251, 113, 133, 0.22)",
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleBlur = (e) => {
    gsap.to(e.target, {
      borderColor: "rgba(245, 239, 230, 0.1)",
      boxShadow: "0 0 0px rgba(251, 113, 133, 0)",
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");

    // EmailJS credentials from environment variables
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    // Prepare template parameters
    const templateParams = {
      brand_name: formData.brandName,
      reply_to: formData.email,
      campaign_type: formData.campaignType,
      budget: formData.budgetRange,
      message: formData.message,
      to_email: influencerData.email
    };

    if (serviceId && templateId && publicKey) {
      // Send real email using EmailJS
      emailjs
        .send(serviceId, templateId, templateParams, publicKey)
        .then(() => {
          setStatus("success");
          resetForm();
        })
        .catch((error) => {
          console.error("EmailJS Error:", error);
          setStatus("error");
          setTimeout(() => setStatus("idle"), 4000);
        });
    } else {
      // Mock simulation for demo/local environment purposes
      console.warn("EmailJS credentials not found in env. Simulating submission success.");
      setTimeout(() => {
        setStatus("success");
        resetForm();
      }, 1500);
    }
  };

  const resetForm = () => {
    setFormData({
      brandName: "",
      email: "",
      campaignType: "Reel",
      budgetRange: "Under $1,000",
      message: ""
    });
  };

  // GSAP Checkmark Drawing Animation
  useEffect(() => {
    if (status === "success" && checkCircleRef.current && checkPathRef.current) {
      const circle = checkCircleRef.current;
      const path = checkPathRef.current;

      // Initialize dash arrays
      gsap.set(circle, { strokeDasharray: 251, strokeDashoffset: 251 });
      gsap.set(path, { strokeDasharray: 100, strokeDashoffset: 100 });

      const tl = gsap.timeline();
      tl.to(circle, {
        strokeDashoffset: 0,
        duration: 0.7,
        ease: "power2.out"
      }).to(path, {
        strokeDashoffset: 0,
        duration: 0.5,
        ease: "back.out(1.5)"
      });
      
      // Auto return to form after 4 seconds
      const timer = setTimeout(() => {
        setStatus("idle");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <div 
      ref={containerRef}
      className="glass-card rounded-2xl p-6 sm:p-10 w-full max-w-xl mx-auto border border-white/5 relative overflow-hidden"
      id="brand-inquiry-form-card"
    >
      {/* Glow background ornament */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-500/5 rounded-full filter blur-3xl pointer-events-none" />

      {status !== "success" ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label htmlFor="brandName" className="font-sans text-xs font-semibold text-purple-300 tracking-[0.16em] uppercase">
              Brand Name
            </label>
            <input
              required
              type="text"
              id="brandName"
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="e.g. Dot & Key Skincare"
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-cream focus:outline-none placeholder-white/20 transition-colors w-full"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="font-sans text-xs font-semibold text-purple-300 tracking-[0.16em] uppercase">
              Email Address
            </label>
            <input
              required
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="partnerships@brand.com"
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-cream focus:outline-none placeholder-white/20 transition-colors w-full"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <label htmlFor="campaignType" className="font-sans text-xs font-semibold text-purple-300 tracking-[0.16em] uppercase">
                Campaign Type
              </label>
              <select
                id="campaignType"
                name="campaignType"
                value={formData.campaignType}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="bg-luxuryBlack border border-white/10 rounded-lg px-4 py-3 text-sm text-cream focus:outline-none transition-colors w-full cursor-none"
              >
                <option value="Reel">Instagram Reel</option>
                <option value="Story">Instagram Story</option>
                <option value="Post">Instagram Feed Post</option>
                <option value="Package">Standard Partnership Package</option>
              </select>
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="budgetRange" className="font-sans text-xs font-semibold text-purple-300 tracking-[0.16em] uppercase">
                Budget Range
              </label>
              <select
                id="budgetRange"
                name="budgetRange"
                value={formData.budgetRange}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="bg-luxuryBlack border border-white/10 rounded-lg px-4 py-3 text-sm text-cream focus:outline-none transition-colors w-full cursor-none"
              >
                <option value="Under $1,000">Under $1,000</option>
                <option value="$1,000 - $3,000">$1,000 - $3,000</option>
                <option value="$3,000 - $5,000">$3,000 - $5,000</option>
                <option value="$5,000+">$5,000+</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="message" className="font-sans text-xs font-semibold text-purple-300 tracking-[0.16em] uppercase">
              Campaign Details
            </label>
            <textarea
              required
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Tell us about your brand, timeline, and campaign goals..."
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-cream focus:outline-none placeholder-white/20 transition-colors w-full resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            id="brand-inquiry-submit-btn"
            className="w-full bg-gradient-to-r from-pink-500 to-coral text-background font-sans text-xs font-bold tracking-[0.16em] uppercase py-4.5 px-6 rounded-full transition-all duration-300 transform active:scale-[0.98] border border-pink-400/30 hover:shadow-lg hover:shadow-pink-500/15 disabled:opacity-50"
          >
            {status === "sending" ? "TRANSMITTING..." : "SEND INQUIRY"}
          </button>
          
          {status === "error" && (
            <p className="text-red-400 font-sans text-xs text-center tracking-wide font-semibold">
              An error occurred. Please try again or email direct at {influencerData.email}
            </p>
          )}
        </form>
      ) : (
        /* Satisfying GSAP Checkmark success screen */
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
          <svg
            className="w-24 h-24 text-pink-400"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Success Circle */}
            <circle
              ref={checkCircleRef}
              cx="50"
              cy="50"
              r="40"
              className="opacity-90"
            />
            {/* Success Checkmark Path */}
            <path
              ref={checkPathRef}
              d="M33 52 L45 63 L67 38"
            />
          </svg>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-italiana font-medium text-cream">
              Inquiry Transmitted
            </h3>
            <p className="text-sm text-purple-300 max-w-sm mx-auto leading-relaxed font-sans">
              Your partnership campaign brief was sent successfully. Divya will review and get back to your team within 48 business hours.
            </p>
          </div>
          
          <span className="font-sans text-xs text-white/40 tracking-[0.14em] font-semibold">
            RETURNING TO FORM IN A MOMENT...
          </span>
        </div>
      )}
    </div>
  );
}
