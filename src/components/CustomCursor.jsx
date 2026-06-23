import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the device supports touch
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      return; // Do not use custom cursor on touch devices
    }

    setIsVisible(true);

    const onMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;
      
      // Move the dot instantly
      gsap.to(dotRef.current, {
        x: x,
        y: y,
        duration: 0.1,
        ease: "power2.out",
        overwrite: "auto"
      });

      // Move the ring with a slight lag
      gsap.to(ringRef.current, {
        x: x,
        y: y,
        duration: 0.4,
        ease: "power3.out",
        overwrite: "auto"
      });
    };

    const onMouseEnterInteractive = () => {
      gsap.to(dotRef.current, {
        scale: 2,
        backgroundColor: "#f5efe6",
        duration: 0.2
      });
      gsap.to(ringRef.current, {
        scale: 1.8,
        borderColor: "#c9a96e",
        backgroundColor: "rgba(201, 169, 110, 0.1)",
        borderWidth: "1px",
        duration: 0.2
      });
    };

    const onMouseLeaveInteractive = () => {
      gsap.to(dotRef.current, {
        scale: 1,
        backgroundColor: "#c9a96e",
        duration: 0.2
      });
      gsap.to(ringRef.current, {
        scale: 1,
        borderColor: "rgba(201, 169, 110, 0.4)",
        backgroundColor: "rgba(201, 169, 110, 0)",
        borderWidth: "1.5px",
        duration: 0.2
      });
    };

    window.addEventListener("mousemove", onMouseMove);

    // Setup hover listeners for interactive elements
    const updateInteractiveListeners = () => {
      const interactives = document.querySelectorAll(
        "a, button, select, input, textarea, [role='button'], .tilt-card"
      );
      
      interactives.forEach((el) => {
        el.addEventListener("mouseenter", onMouseEnterInteractive);
        el.addEventListener("mouseleave", onMouseLeaveInteractive);
      });
    };

    // Initial setup
    updateInteractiveListeners();

    // Re-bind when DOM changes (helpful in React dynamic routes/renders)
    const observer = new MutationObserver(updateInteractiveListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      observer.disconnect();
      const interactives = document.querySelectorAll(
        "a, button, select, input, textarea, [role='button'], .tilt-card"
      );
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnterInteractive);
        el.removeEventListener("mouseleave", onMouseLeaveInteractive);
      });
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="custom-cursor"
        style={{ left: 0, top: 0 }}
        id="custom-cursor-dot"
      />
      <div
        ref={ringRef}
        className="custom-cursor-ring"
        style={{ left: 0, top: 0 }}
        id="custom-cursor-ring"
      />
    </>
  );
}
