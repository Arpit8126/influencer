import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

export default function ThreeCanvas({ imageUrl }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const portraitWrapperRef = useRef(null);
  const [webglActive, setWebGLActive] = useState(false);

  useEffect(() => {
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

    // Particle Texture - create a circular canvas texture programmatically to avoid external asset dependency
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

      const texture = new THREE.CanvasTexture(matCanvas);
      return texture;
    };

    const particleTexture = createCircleTexture();

    // 1. FLOATING BACKGROUND PARTICLES (Cloud)
    const bgParticleCount = 150;
    const bgGeometry = new THREE.BufferGeometry();
    const bgPositions = new Float32Array(bgParticleCount * 3);
    const bgSpeeds = [];

    for (let i = 0; i < bgParticleCount * 3; i += 3) {
      // Sparser distribution in 3D
      bgPositions[i] = (Math.random() - 0.5) * 6; // X
      bgPositions[i + 1] = (Math.random() - 0.5) * 6; // Y
      bgPositions[i + 2] = (Math.random() - 0.5) * 4; // Z

      bgSpeeds.push({
        x: (Math.random() - 0.5) * 0.002,
        y: (Math.random() - 0.5) * 0.002 + 0.0005, // gentle upward float
        z: (Math.random() - 0.5) * 0.001
      });
    }

    bgGeometry.setAttribute("position", new THREE.BufferAttribute(bgPositions, 3));

    const bgMaterial = new THREE.PointsMaterial({
      size: 0.06,
      map: particleTexture,
      transparent: true,
      color: 0xc9a96e, // Rose gold
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const bgPoints = new THREE.Points(bgGeometry, bgMaterial);
    scene.add(bgPoints);


    // 2. ROTATING HALO / RING PARTICLES
    const haloParticleCount = 800;
    const haloGeometry = new THREE.BufferGeometry();
    const haloPositions = new Float32Array(haloParticleCount * 3);
    const haloAngles = new Float32Array(haloParticleCount);
    const haloRadii = new Float32Array(haloParticleCount);
    
    const haloRadius = 2.2; // Fits around the larger portrait in 3D scene space

    for (let i = 0; i < haloParticleCount; i++) {
      const angle = (i / haloParticleCount) * Math.PI * 2 + Math.random() * 0.1;
      const radius = haloRadius + (Math.random() - 0.5) * 0.15; // minor thickness
      
      haloAngles[i] = angle;
      haloRadii[i] = radius;

      const idx = i * 3;
      haloPositions[idx] = Math.cos(angle) * radius; // X
      haloPositions[idx + 1] = Math.sin(angle) * radius; // Y
      haloPositions[idx + 2] = (Math.random() - 0.5) * 0.3; // Z (minor depth spread)
    }

    haloGeometry.setAttribute("position", new THREE.BufferAttribute(haloPositions, 3));

    const haloMaterial = new THREE.PointsMaterial({
      size: 0.045,
      map: particleTexture,
      transparent: true,
      color: 0xc9a96e, // Rose gold
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const haloPoints = new THREE.Points(haloGeometry, haloMaterial);
    
    // Tilt the halo ring in 3D space
    haloPoints.rotation.x = Math.PI / 3.5; // Tilt forward
    haloPoints.rotation.y = Math.PI / 8; // Tilted slightly to side
    
    scene.add(haloPoints);


    // 3. TEXTURE LOADING & PORTRAIT plane mesh inside WebGL
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(imageUrl, () => {
      // Once texture is successfully loaded, activate WebGL render overlay
      setWebGLActive(true);
    });
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    // GLSL Shaders for Liquid Ripple & Spotlight Light Sweep
    const vertexShaderSource = `
      varying vec2 vUv;
      uniform float uTime;
      uniform float uHover;
      void main() {
        vUv = uv;
        vec3 pos = position;
        // Silk wave ripple in vertices
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
        // 1. Liquid coordinate distortion ripple based on time and center distance
        float distFromCenter = distance(uv, vec2(0.5, 0.5));
        float ripple = sin(distFromCenter * 15.0 - uTime * 2.5) * 0.005 * uHover;
        uv += ripple;
        
        vec4 color = texture2D(uTexture, uv);
        
        // 2. Gold reflective sweep (spotlight reflection)
        vec2 lightPos = uMouse * 0.5 + 0.5;
        float distToLight = distance(uv, lightPos);
        float sheen = smoothstep(0.4, 0.0, distToLight) * 0.14 * uHover;
        vec3 goldTint = vec3(0.79, 0.66, 0.43); // #c9a96e
        
        // Global ambient gold tint on hover
        vec3 warmBase = color.rgb + (goldTint * 0.03 * uHover);
        vec3 finalColor = warmBase + (goldTint * sheen);
        
        // 3. Edge vignette fade to avoid harsh card boundaries
        float borderFadeX = smoothstep(0.0, 0.06, uv.x) * smoothstep(1.0, 0.94, uv.x);
        float borderFadeY = smoothstep(0.0, 0.06, uv.y) * smoothstep(1.0, 0.94, uv.y);
        float borderFade = borderFadeX * borderFadeY;
        
        gl_FragColor = vec4(finalColor, color.a * borderFade);
        
        // Discard low alpha pixels to allow background particles to render behind transparent card edges
        if (gl_FragColor.a < 0.01) {
          discard;
        }
      }
    `;

    // Plane geometry matching 350:455 aspect ratio (approx 2.9:3.77)
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
      depthWrite: true // Allows correct Z-occlusion for background/halo particles
    });

    const portraitMesh = new THREE.Mesh(portraitGeometry, portraitMaterial);
    portraitMesh.position.set(0, 0, 0.1); // Slightly forward from particles at Z = 0
    scene.add(portraitMesh);


    // Mouse Interaction
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const portraitMouse = { targetX: 0, targetY: 0 };
    let targetHover = 0.0;

    const handleMouseMove = (e) => {
      // Normalized coordinates -1 to 1 for global camera parallax
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

      // Smooth camera mouse follow (global parallax)
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // 1. Animate background particles
      const bgPositionsAttr = bgPoints.geometry.attributes.position;
      const bgArray = bgPositionsAttr.array;

      for (let i = 0; i < bgParticleCount; i++) {
        const idx = i * 3;
        // Apply speed
        bgArray[idx] += bgSpeeds[i].x;
        bgArray[idx + 1] += bgSpeeds[i].y;
        bgArray[idx + 2] += bgSpeeds[i].z;

        // Reset if float out of viewport boundaries in local space
        if (bgArray[idx + 1] > 3) {
          bgArray[idx + 1] = -3;
          bgArray[idx] = (Math.random() - 0.5) * 6;
        }
      }
      bgPositionsAttr.needsUpdate = true;

      // 2. Animate Halo (slow rotate and wiggle)
      haloPoints.rotation.z = elapsedTime * 0.15; // Slow spin
      
      // Dynamic breathing effect on halo radii
      const haloPositionsAttr = haloPoints.geometry.attributes.position;
      const haloArray = haloPositionsAttr.array;

      for (let i = 0; i < haloParticleCount; i++) {
        const idx = i * 3;
        const angle = haloAngles[i];
        // add small sine wave breathing
        const dynamicRadius = haloRadii[i] + Math.sin(elapsedTime * 2 + angle * 4) * 0.02;
        
        haloArray[idx] = Math.cos(angle) * dynamicRadius;
        haloArray[idx + 1] = Math.sin(angle) * dynamicRadius;
      }
      haloPositionsAttr.needsUpdate = true;

      // 3. Update WebGL Portrait Uniforms & Animations
      portraitMaterial.uniforms.uTime.value = elapsedTime;
      portraitMaterial.uniforms.uHover.value += (targetHover - portraitMaterial.uniforms.uHover.value) * 0.08;
      portraitMaterial.uniforms.uMouse.value.x += (portraitMouse.targetX - portraitMaterial.uniforms.uMouse.value.x) * 0.08;
      portraitMaterial.uniforms.uMouse.value.y += (portraitMouse.targetY - portraitMaterial.uniforms.uMouse.value.y) * 0.08;

      // Local 3D mesh tilt inside WebGL scene (corresponds to degrees tilted outside)
      portraitMesh.rotation.y = portraitMaterial.uniforms.uMouse.value.x * 0.18;
      portraitMesh.rotation.x = -portraitMaterial.uniforms.uMouse.value.y * 0.15;

      // Y-axis breathing float displacement
      portraitMesh.position.y = Math.sin(elapsedTime * 1.2) * 0.06;

      // 4. Camera parallax based on mouse
      camera.position.x = mouse.x * 0.8;
      camera.position.y = mouse.y * 0.8;
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

    // Dynamic Hover Handlers to Tilt Wrapper and Update Shaders
    const handlePortraitMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Normalized deltas (-1 to 1)
      const dx = (x - centerX) / centerX;
      const dy = (y - centerY) / centerY;

      portraitMouse.targetX = dx;
      portraitMouse.targetY = -dy;
      targetHover = 1.0;

      // 3D Tilt the portrait HTML wrapper container in perfect sync with WebGL mesh
      gsap.to(portraitWrapperRef.current, {
        rotateY: dx * 10,
        rotateX: -dy * 10,
        transformPerspective: 1000,
        ease: "power2.out",
        duration: 0.5,
        overwrite: "auto"
      });
    };

    const handlePortraitLeave = () => {
      portraitMouse.targetX = 0;
      portraitMouse.targetY = 0;
      targetHover = 0.0;

      gsap.to(portraitWrapperRef.current, {
        rotateY: 0,
        rotateX: 0,
        ease: "power3.out",
        duration: 0.8,
        overwrite: "auto"
      });
    };

    container.addEventListener("mousemove", handlePortraitMove);
    container.addEventListener("mouseleave", handlePortraitLeave);

    // Cleanup
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

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[450px] sm:h-[550px] lg:h-[650px] flex items-center justify-center select-none"
      style={{ perspective: "1200px" }}
    >
      {/* 3D Canvas overlaid on background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-10 w-full h-full pointer-events-none" 
      />

      {/* Portrait Container with GSAP Parallax */}
      <div 
        ref={portraitWrapperRef}
        className="relative w-[300px] h-[390px] sm:w-[380px] sm:h-[494px] lg:w-[440px] lg:h-[572px] z-0 transition-shadow duration-500"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Layer 2: Main Portrait Image Card (Fallback: displays instantly, fades out when WebGL loads) */}
        <div 
          className={`absolute inset-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl z-20 bg-[#0c0c0c] transition-opacity duration-1000 ${
            webglActive ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          {/* Frosted vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20" />
          
          {/* Moving light sheen overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(201,169,110,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-sheen z-20 pointer-events-none" />

          <img 
            src={imageUrl} 
            alt="Divya Rana portrait" 
            className="w-full h-full object-cover object-center filter contrast-[1.03] brightness-[0.93] transition-transform duration-700"
            draggable="false"
          />
          {/* Subtle gold overlay filter */}
          <div className="absolute inset-0 bg-gold/5 mix-blend-overlay z-0" />
        </div>

        {/* Layer 3: Dynamic overlay label badge */}
        <div 
          className="absolute -bottom-3 -right-3 bg-gold text-background font-mono text-[9px] tracking-widest uppercase font-bold py-2.5 px-5 rounded-full z-30 shadow-xl border border-gold/40 flex items-center space-x-1"
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
