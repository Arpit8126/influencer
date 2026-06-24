import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// Detect touch/mobile device — skip WebGL entirely on mobile for performance
const isMobileDevice = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 1024);

export default function ThreeCanvas({ imageUrl }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const portraitWrapperRef = useRef(null);
  const [webglActive, setWebGLActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on mount — skip WebGL entirely for performance
    if (isMobileDevice()) {
      setIsMobile(true);
      return;
    }

    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // Dimensions
    let width = container.clientWidth;
    let height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle Texture
    const createCircleTexture = () => {
      const matCanvas = document.createElement('canvas');
      matCanvas.width = 16;
      matCanvas.height = 16;
      const ctx = matCanvas.getContext('2d');
      const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 16, 16);
      return new THREE.CanvasTexture(matCanvas);
    };

    const particleTexture = createCircleTexture();

    // 1. FLOATING BACKGROUND PARTICLES
    const bgParticleCount = 150;
    const bgGeometry = new THREE.BufferGeometry();
    const bgPositions = new Float32Array(bgParticleCount * 3);
    const bgColors = new Float32Array(bgParticleCount * 3);
    const bgSpeeds = [];

    const palette = [
      new THREE.Color(0xfb7185),
      new THREE.Color(0xfdba74),
      new THREE.Color(0xc084fc),
      new THREE.Color(0x2dd4bf)
    ];

    for (let i = 0; i < bgParticleCount; i++) {
      const idx = i * 3;
      bgPositions[idx] = (Math.random() - 0.5) * 6;
      bgPositions[idx + 1] = (Math.random() - 0.5) * 6;
      bgPositions[idx + 2] = (Math.random() - 0.5) * 4;
      const color = palette[Math.floor(Math.random() * palette.length)];
      bgColors[idx] = color.r;
      bgColors[idx + 1] = color.g;
      bgColors[idx + 2] = color.b;
      bgSpeeds.push({
        x: (Math.random() - 0.5) * 0.002,
        y: (Math.random() - 0.5) * 0.002 + 0.0005,
        z: (Math.random() - 0.5) * 0.001
      });
    }

    bgGeometry.setAttribute("position", new THREE.BufferAttribute(bgPositions, 3));
    bgGeometry.setAttribute("color", new THREE.BufferAttribute(bgColors, 3));

    const bgMaterial = new THREE.PointsMaterial({
      size: 0.065,
      map: particleTexture,
      transparent: true,
      vertexColors: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const bgPoints = new THREE.Points(bgGeometry, bgMaterial);
    scene.add(bgPoints);

    // 2. ROTATING HALO / RING PARTICLES
    const haloParticleCount = 800;
    const haloGeometry = new THREE.BufferGeometry();
    const haloPositions = new Float32Array(haloParticleCount * 3);
    const haloColors = new Float32Array(haloParticleCount * 3);
    const haloAngles = new Float32Array(haloParticleCount);
    const haloRadii = new Float32Array(haloParticleCount);
    const haloRadius = 2.2;

    for (let i = 0; i < haloParticleCount; i++) {
      const angle = (i / haloParticleCount) * Math.PI * 2 + Math.random() * 0.1;
      const radius = haloRadius + (Math.random() - 0.5) * 0.15;
      haloAngles[i] = angle;
      haloRadii[i] = radius;
      const idx = i * 3;
      haloPositions[idx] = Math.cos(angle) * radius;
      haloPositions[idx + 1] = Math.sin(angle) * radius;
      haloPositions[idx + 2] = (Math.random() - 0.5) * 0.3;
      const colorProgress = i / haloParticleCount;
      let ringColor;
      if (colorProgress < 0.25) {
        ringColor = new THREE.Color().lerpColors(palette[0], palette[1], colorProgress / 0.25);
      } else if (colorProgress < 0.5) {
        ringColor = new THREE.Color().lerpColors(palette[1], palette[2], (colorProgress - 0.25) / 0.25);
      } else if (colorProgress < 0.75) {
        ringColor = new THREE.Color().lerpColors(palette[2], palette[3], (colorProgress - 0.5) / 0.25);
      } else {
        ringColor = new THREE.Color().lerpColors(palette[3], palette[0], (colorProgress - 0.75) / 0.25);
      }
      haloColors[idx] = ringColor.r;
      haloColors[idx + 1] = ringColor.g;
      haloColors[idx + 2] = ringColor.b;
    }

    haloGeometry.setAttribute("position", new THREE.BufferAttribute(haloPositions, 3));
    haloGeometry.setAttribute("color", new THREE.BufferAttribute(haloColors, 3));

    const haloMaterial = new THREE.PointsMaterial({
      size: 0.045,
      map: particleTexture,
      transparent: true,
      vertexColors: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const haloPoints = new THREE.Points(haloGeometry, haloMaterial);
    haloPoints.rotation.x = Math.PI / 3.5;
    haloPoints.rotation.y = Math.PI / 8;
    scene.add(haloPoints);

    // 3. TEXTURE LOADING & PORTRAIT PLANE
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(imageUrl, () => {
      setWebGLActive(true);
    });
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const vertexShaderSource = `
      varying vec2 vUv;
      uniform float uTime;
      uniform float uHover;
      void main() {
        vUv = uv;
        vec3 pos = position;
        float wave = sin(pos.x * 2.5 + uTime * 1.8) * cos(pos.y * 2.5 + uTime * 1.8) * (0.015 + 0.045 * uHover);
        pos.z += wave;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const fragmentShaderSource = `
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uHover;
      void main() {
        vec2 uv = vUv;
        float distFromCenter = distance(uv, vec2(0.5, 0.5));
        float ripple = sin(distFromCenter * 15.0 - uTime * 2.5) * 0.005 * uHover;
        uv += ripple;
        vec4 color = texture2D(uTexture, uv);
        vec2 lightPos = uMouse * 0.5 + 0.5;
        float distToLight = distance(uv, lightPos);
        float sheen = smoothstep(0.45, 0.0, distToLight) * 0.16 * uHover;
        vec3 colorPink = vec3(0.98, 0.44, 0.52);
        vec3 colorPeach = vec3(0.99, 0.73, 0.45);
        vec3 colorViolet = vec3(0.75, 0.52, 0.99);
        vec3 sweepColor = mix(colorPink, colorPeach, sin(uv.x * 3.14 + uTime * 0.5) * 0.5 + 0.5);
        sweepColor = mix(sweepColor, colorViolet, cos(uv.y * 3.14 - uTime * 0.5) * 0.5 + 0.5);
        vec3 warmBase = color.rgb + (sweepColor * 0.04 * uHover);
        vec3 finalColor = warmBase + (sweepColor * sheen);
        float borderFadeX = smoothstep(0.0, 0.06, uv.x) * smoothstep(1.0, 0.94, uv.x);
        float borderFadeY = smoothstep(0.0, 0.06, uv.y) * smoothstep(1.0, 0.94, uv.y);
        float borderFade = borderFadeX * borderFadeY;
        gl_FragColor = vec4(finalColor, color.a * borderFade);
        if (gl_FragColor.a < 0.01) discard;
      }
    `;

    const portraitGeometry = new THREE.PlaneGeometry(2.9, 3.77);
    const portraitMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShaderSource,
      fragmentShader: fragmentShaderSource,
      uniforms: {
        uTexture: { value: texture },
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uHover: { value: 0 }
      },
      transparent: true,
      depthWrite: true
    });

    const portraitMesh = new THREE.Mesh(portraitGeometry, portraitMaterial);
    portraitMesh.position.set(0, 0, 0.1);
    scene.add(portraitMesh);

    // Mouse Interaction
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const portraitMouse = { targetX: 0, targetY: 0 };
    let targetHover = 0.0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.targetX = ((e.clientX - rect.left) / width) * 2 - 1;
      mouse.targetY = -((e.clientY - rect.top) / height) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Animate background particles
      const bgPositionsAttr = bgPoints.geometry.attributes.position;
      const bgArray = bgPositionsAttr.array;
      for (let i = 0; i < bgParticleCount; i++) {
        const idx = i * 3;
        bgArray[idx] += bgSpeeds[i].x;
        bgArray[idx + 1] += bgSpeeds[i].y;
        bgArray[idx + 2] += bgSpeeds[i].z;
        if (bgArray[idx + 1] > 3) {
          bgArray[idx + 1] = -3;
          bgArray[idx] = (Math.random() - 0.5) * 6;
        }
      }
      bgPositionsAttr.needsUpdate = true;

      // Animate Halo
      haloPoints.rotation.z = elapsedTime * 0.15;
      const haloPositionsAttr = haloPoints.geometry.attributes.position;
      const haloArray = haloPositionsAttr.array;
      for (let i = 0; i < haloParticleCount; i++) {
        const idx = i * 3;
        const angle = haloAngles[i];
        const dynamicRadius = haloRadii[i] + Math.sin(elapsedTime * 2 + angle * 4) * 0.02;
        haloArray[idx] = Math.cos(angle) * dynamicRadius;
        haloArray[idx + 1] = Math.sin(angle) * dynamicRadius;
      }
      haloPositionsAttr.needsUpdate = true;

      // Update uniforms
      portraitMaterial.uniforms.uTime.value = elapsedTime;
      portraitMaterial.uniforms.uHover.value += (targetHover - portraitMaterial.uniforms.uHover.value) * 0.08;
      portraitMaterial.uniforms.uMouse.value.x += (portraitMouse.targetX - portraitMaterial.uniforms.uMouse.value.x) * 0.08;
      portraitMaterial.uniforms.uMouse.value.y += (portraitMouse.targetY - portraitMaterial.uniforms.uMouse.value.y) * 0.08;

      portraitMesh.rotation.y = 0;
      portraitMesh.rotation.x = 0;
      portraitMesh.position.y = 0;
      camera.position.x = 0;
      camera.position.y = 0;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    const handlePortraitMove = () => {
      portraitMouse.targetX = 0;
      portraitMouse.targetY = 0;
      targetHover = 0.0;
    };

    const handlePortraitLeave = () => {
      portraitMouse.targetX = 0;
      portraitMouse.targetY = 0;
      targetHover = 0.0;
    };

    container.addEventListener("mousemove", handlePortraitMove);
    container.addEventListener("mouseleave", handlePortraitLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mousemove", handlePortraitMove);
      container.removeEventListener("mouseleave", handlePortraitLeave);
      resizeObserver.disconnect();
      renderer.dispose();
      bgGeometry.dispose();
      bgMaterial.dispose();
      haloGeometry.dispose();
      haloMaterial.dispose();
      particleTexture.dispose();
      portraitGeometry.dispose();
      portraitMaterial.dispose();
      texture.dispose();
    };
  }, [imageUrl]);

  // ── Mobile fallback: premium CSS portrait, no WebGL overhead ──
  if (isMobile) {
    return (
      <div
        ref={containerRef}
        className="relative w-full flex items-center justify-center select-none py-10"
        style={{ minHeight: "520px" }}
      >
        {/* Ambient background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="w-[320px] h-[420px] rounded-full bg-gradient-to-br from-pink-500/20 via-purple-500/15 to-teal-400/10 blur-[80px] animate-pulse" />
        </div>

        {/* Floating glow orbs */}
        <div className="absolute top-6 -left-6 w-28 h-28 bg-pink-500/25 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-10 -right-6 w-24 h-24 bg-purple-500/25 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1.2s" }} />
        <div className="absolute top-1/2 -right-4 w-16 h-16 bg-teal-400/20 rounded-full blur-xl" />

        {/* Sparkle decorations */}
        <div className="absolute top-8 right-10 animate-spin-sparkle text-pink-400 opacity-80 z-20">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
          </svg>
        </div>
        <div className="absolute top-20 left-6 animate-spin-sparkle text-purple-400 opacity-60 z-20" style={{ animationDuration: "20s" }}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
          </svg>
        </div>
        <div className="absolute bottom-14 right-8 animate-spin-sparkle text-teal-400 opacity-50 z-20" style={{ animationDuration: "14s" }}>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
          </svg>
        </div>
        <div className="absolute bottom-20 left-10 animate-spin-sparkle text-orange-400 opacity-40 z-20" style={{ animationDuration: "16s" }}>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
          </svg>
        </div>

        {/* Main portrait card */}
        <div className="relative z-10 flex flex-col items-center">

          {/* Niche label pill — top */}
          <div className="mb-3 bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono text-[9px] tracking-[0.22em] uppercase font-bold py-1.5 px-4 rounded-full z-30 shadow-lg">
            BEAUTY • LIFESTYLE • SKINCARE
          </div>

          {/* Gradient border wrapper */}
          <div
            className="p-[2.5px] rounded-[1.8rem] shadow-[0_0_50px_rgba(251,113,133,0.35),0_0_100px_rgba(192,132,252,0.2)]"
            style={{
              background: "linear-gradient(135deg, #fb7185 0%, #c084fc 50%, #2dd4bf 100%)",
            }}
          >
            {/* Inner card */}
            <div className="relative w-[272px] h-[354px] sm:w-[310px] sm:h-[403px] rounded-[1.65rem] overflow-hidden bg-[#0c0c0c]">

              {/* Portrait */}
              <img
                src={imageUrl}
                alt="Divya Rana portrait"
                className="w-full h-full object-cover object-center"
                draggable="false"
                loading="eager"
                fetchPriority="high"
              />

              {/* Gradient overlay bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0709]/90 via-[#0b0709]/20 to-transparent z-10" />

              {/* Iridescent sheen top-right */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-pink-500/6 to-purple-500/10 z-10" />

              {/* Stats chips overlaid on image */}
              <div className="absolute bottom-3 left-3 right-3 z-20 flex gap-2">
                <div className="flex-1 rounded-xl border border-pink-500/20 bg-black/55 px-1 py-2 text-center">
                  <span className="font-italiana text-base text-pink-400 block leading-none mb-0.5">34.1K</span>
                  <span className="font-sans text-[7px] text-cream/50 tracking-widest uppercase">Followers</span>
                </div>
                <div className="flex-1 rounded-xl border border-purple-500/20 bg-black/55 px-1 py-2 text-center">
                  <span className="font-italiana text-base text-purple-400 block leading-none mb-0.5">5.8%</span>
                  <span className="font-sans text-[7px] text-cream/50 tracking-widest uppercase">Engage</span>
                </div>
                <div className="flex-1 rounded-xl border border-teal-500/20 bg-black/55 px-1 py-2 text-center">
                  <span className="font-italiana text-base text-teal-400 block leading-none mb-0.5">170</span>
                  <span className="font-sans text-[7px] text-cream/50 tracking-widest uppercase">Posts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Creator badge — bottom */}
          <div className="mt-3 bg-gradient-to-r from-pink-500 to-rose-500 text-background font-mono text-[9px] tracking-widest uppercase font-bold py-2 px-5 rounded-full shadow-xl shadow-pink-500/30 border border-pink-400/30 flex items-center space-x-1.5">
            <span>✦</span>
            <span>DIVYA RANA</span>
            <span className="opacity-60">•</span>
            <span>CREATOR</span>
            <span>✦</span>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div
      ref={containerRef}
      className="relative w-full h-[450px] sm:h-[550px] lg:h-[650px] flex items-center justify-center select-none"
      style={{ perspective: "1200px" }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 w-full h-full pointer-events-none"
      />

      <div
        ref={portraitWrapperRef}
        className="relative w-[300px] h-[390px] sm:w-[380px] sm:h-[494px] lg:w-[440px] lg:h-[572px] z-0 transition-shadow duration-500"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className={`absolute inset-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl z-20 bg-[#0c0c0c] transition-opacity duration-1000 ${
            webglActive ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20" />
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(201,169,110,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-sheen z-20 pointer-events-none" />
          <img
            src={imageUrl}
            alt="Divya Rana portrait"
            className="w-full h-full object-cover object-center filter contrast-[1.03] brightness-[0.93] transition-transform duration-700"
            draggable="false"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gold/5 mix-blend-overlay z-0" />
        </div>

        <div
          className="absolute -bottom-3 -right-3 bg-pink-500 text-background font-mono text-xs tracking-widest uppercase font-bold py-2.5 px-5 rounded-full z-30 shadow-xl border border-pink-400/40 flex items-center space-x-1"
          style={{ transform: "translateZ(30px)" }}
        >
          <span>DIVYA RANA</span>
          <span className="opacity-50">•</span>
          <span>CREATOR</span>
        </div>
      </div>
    </div>
  );
}
