import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const PALETTE = ["#fb7185", "#fdba74", "#c084fc", "#2dd4bf"];

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const textRef = useRef(null);
  const canvasRef = useRef(null);
  const gradientBorderRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let lastTouchTime = 0;
    let customCursorEnabled = false;

    const enableCustomCursor = () => {
      // Ignore mouse events simulated by touch taps
      if (Date.now() - lastTouchTime < 1000) return;
      if (!customCursorEnabled) {
        customCursorEnabled = true;
        setIsVisible(true);
        document.body.classList.add("custom-cursor-active");
      }
    };

    const disableCustomCursor = () => {
      lastTouchTime = Date.now();
      if (customCursorEnabled) {
        customCursorEnabled = false;
        setIsVisible(false);
        document.body.classList.remove("custom-cursor-active");
      }
    };

    const canvas = canvasRef.current;
    
    // We bind event listeners dynamically on mousemove or resize
    let ctx = null;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles = [];

    if (canvas) {
      ctx = canvas.getContext("2d");
      canvas.width = width;
      canvas.height = height;
    }

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 2;
        this.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5 - 0.3;
        this.alpha = 1.0;
        this.decay = Math.random() * 0.015 + 0.015;
        this.rotation = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.05;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
        this.rotation += this.spin;
        if (this.size > 0.1) this.size -= 0.02;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          ctx.lineTo(0, -this.size);
          ctx.lineTo(this.size * 0.3, -this.size * 0.3);
          ctx.rotate(Math.PI / 2);
        }
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
      }
    }

    // Velocity tracking vars
    let lastX = 0;
    let lastY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMouseMove = (e) => {
      enableCustomCursor();

      if (!customCursorEnabled) return;

      currentX = e.clientX;
      currentY = e.clientY;

      const dx = currentX - lastX;
      const dy = currentY - lastY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      if (speed > 1.5 && ctx) {
        const numParticles = Math.min(Math.floor(speed * 0.2), 3) + 1;
        for (let i = 0; i < numParticles; i++) {
          const px = currentX + (Math.random() - 0.5) * 4;
          const py = currentY + (Math.random() - 0.5) * 4;
          particles.push(new Particle(px, py));
        }
      }

      const angle = Math.atan2(dy, dx);
      const stretch = Math.min(speed * 0.05, 0.95);
      const scaleX = 1 + stretch;
      const scaleY = 1 - stretch * 0.6;
      const rotationDeg = angle * (180 / Math.PI);

      if (dotRef.current) {
        gsap.to(dotRef.current, {
          x: currentX,
          y: currentY,
          rotation: rotationDeg,
          scaleX: scaleX,
          scaleY: scaleY,
          duration: 0.1,
          ease: "power1.out",
          overwrite: "auto"
        });
      }

      if (ringRef.current) {
        gsap.to(ringRef.current, {
          x: currentX,
          y: currentY,
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto"
        });
      }

      lastX = currentX;
      lastY = currentY;
    };

    const onMouseDown = () => {
      if (!customCursorEnabled) return;

      for (let i = 0; i < 15; i++) {
        const p = new Particle(currentX, currentY);
        p.vx = (Math.random() - 0.5) * 5;
        p.vy = (Math.random() - 0.5) * 5;
        p.decay = Math.random() * 0.02 + 0.02;
        particles.push(p);
      }

      if (dotRef.current) {
        gsap.to(dotRef.current, {
          scale: 0.6,
          duration: 0.15,
          ease: "power2.out"
        });
      }
      if (ringRef.current) {
        gsap.to(ringRef.current, {
          scale: 0.8,
          borderColor: "#2dd4bf",
          duration: 0.15,
          ease: "power2.out"
        });
      }
    };

    const onMouseUp = () => {
      if (!customCursorEnabled) return;

      if (dotRef.current) {
        gsap.to(dotRef.current, {
          scale: 1.0,
          duration: 0.2,
          ease: "back.out(2)"
        });
      }
      if (ringRef.current) {
        gsap.to(ringRef.current, {
          scale: 1.0,
          borderColor: "rgba(251, 113, 133, 0.45)",
          duration: 0.2,
          ease: "back.out(2)"
        });
      }
    };

    let animationId;
    const renderParticles = () => {
      if (ctx && customCursorEnabled) {
        ctx.clearRect(0, 0, width, height);
        particles.forEach((p, idx) => {
          p.update();
          if (p.alpha <= 0 || p.size <= 0.1) {
            particles.splice(idx, 1);
          } else {
            p.draw();
          }
        });
      }
      animationId = requestAnimationFrame(renderParticles);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchstart", disableCustomCursor, { passive: true });
    
    renderParticles();

    const onMouseEnterInteractive = (e) => {
      if (!customCursorEnabled) return;
      const target = e.currentTarget;
      const cursorText = target.getAttribute("data-cursor-text") || "";
      
      if (cursorText) {
        if (dotRef.current) {
          gsap.to(dotRef.current, {
            scale: 0,
            opacity: 0,
            duration: 0.2,
            ease: "power2.out"
          });
        }
        if (ringRef.current) {
          gsap.to(ringRef.current, {
            width: 68,
            height: 68,
            borderWidth: "0px",
            backgroundColor: "rgba(251, 113, 133, 0.08)",
            backdropFilter: "blur(6px)",
            boxShadow: "0 10px 30px rgba(251, 113, 133, 0.25), inset 0 0 15px rgba(251, 113, 133, 0.1)",
            duration: 0.3,
            ease: "back.out(1.5)"
          });
        }
        if (gradientBorderRef.current) {
          gsap.to(gradientBorderRef.current, {
            opacity: 1,
            duration: 0.3
          });
        }
        if (textRef.current) {
          gsap.to(textRef.current, {
            opacity: 1,
            duration: 0.2
          });
          textRef.current.innerText = cursorText;
        }
      } else {
        if (dotRef.current) {
          gsap.to(dotRef.current, {
            scale: 1.8,
            backgroundColor: "#f5efe6",
            boxShadow: "none",
            duration: 0.2
          });
        }
        if (ringRef.current) {
          gsap.to(ringRef.current, {
            width: 54,
            height: 54,
            borderColor: "#c084fc",
            backgroundColor: "rgba(192, 132, 252, 0.12)",
            borderWidth: "1.5px",
            boxShadow: "0 0 20px rgba(192, 132, 252, 0.25)",
            duration: 0.2
          });
        }
      }
    };

    const onMouseLeaveInteractive = () => {
      if (!customCursorEnabled) return;
      if (dotRef.current) {
        gsap.to(dotRef.current, {
          scale: 1.0,
          opacity: 1,
          backgroundColor: "#fb7185",
          boxShadow: "0 0 10px rgba(251, 113, 133, 0.8), 0 0 20px rgba(192, 132, 252, 0.4)",
          duration: 0.2
        });
      }
      if (ringRef.current) {
        gsap.to(ringRef.current, {
          width: 44,
          height: 44,
          borderColor: "rgba(251, 113, 133, 0.45)",
          backgroundColor: "rgba(251, 113, 133, 0.03)",
          borderWidth: "1.5px",
          backdropFilter: "blur(0px)",
          boxShadow: "0 0 15px rgba(192, 132, 252, 0.08)",
          duration: 0.3
        });
      }
      if (gradientBorderRef.current) {
        gsap.to(gradientBorderRef.current, {
          opacity: 0,
          duration: 0.2
        });
      }
      if (textRef.current) {
        gsap.to(textRef.current, {
          opacity: 0,
          duration: 0.15
        });
      }
    };

    const updateListeners = () => {
      const targets = document.querySelectorAll(
        "a, button, select, input, textarea, [role='button'], .tilt-card, [data-cursor-text], .collab-logo-animate, #showcase-carousel-canvas"
      );
      targets.forEach((el) => {
        el.addEventListener("mouseenter", onMouseEnterInteractive);
        el.addEventListener("mouseleave", onMouseLeaveInteractive);
      });
    };

    updateListeners();
    const observer = new MutationObserver(updateListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchstart", disableCustomCursor);
      cancelAnimationFrame(animationId);
      observer.disconnect();
      document.body.classList.remove("custom-cursor-active");

      const targets = document.querySelectorAll(
        "a, button, select, input, textarea, [role='button'], .tilt-card, [data-cursor-text], .collab-logo-animate, #showcase-carousel-canvas"
      );
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnterInteractive);
        el.removeEventListener("mouseleave", onMouseLeaveInteractive);
      });
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <canvas ref={canvasRef} className="cursor-particle-canvas" />

      <div
        ref={dotRef}
        className="custom-cursor"
        style={{ left: 0, top: 0 }}
        id="custom-cursor-dot"
      />

      <div
        ref={ringRef}
        className="custom-cursor-ring flex items-center justify-center overflow-hidden"
        style={{ left: 0, top: 0 }}
        id="custom-cursor-ring"
      >
        <div
          ref={gradientBorderRef}
          className="absolute inset-0 rounded-full opacity-0 pointer-events-none transition-opacity duration-300 animate-[spin_3s_linear_infinite]"
          style={{
            padding: "1.5px",
            background: "linear-gradient(45deg, #fb7185, #fdba74, #c084fc, #2dd4bf)",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor"
          }}
        />
        <span ref={textRef} className="custom-cursor-text" />
      </div>
    </>
  );
}
