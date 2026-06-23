import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeCanvas({ imageUrl }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

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
      // Sparser distribution
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
    
    const haloRadius = 1.75; // Fits around the portrait in 3D scene space

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

    // Mouse Interaction
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e) => {
      // Normalized coordinates -1 to 1
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

      // Smooth mouse follow
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

      // 3. Camera parallax based on mouse
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

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();
      renderer.dispose();
      bgGeometry.dispose();
      bgMaterial.dispose();
      haloGeometry.dispose();
      haloMaterial.dispose();
      particleTexture.dispose();
    };
  }, [imageUrl]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center select-none"
    >
      {/* 3D Canvas overlaid on background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-10 w-full h-full pointer-events-none" 
      />

      {/* The portrait image in the center */}
      <div 
        className="relative w-[280px] h-[360px] sm:w-[350px] sm:h-[450px] lg:w-[400px] lg:h-[520px] rounded-t-[120px] rounded-b-[20px] overflow-hidden border border-gold/20 shadow-2xl z-0"
        style={{
          boxShadow: "0 25px 50px -12px rgba(199, 169, 110, 0.15)"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
        <img 
          src={imageUrl} 
          alt="Divya Rana portrait" 
          className="w-full h-full object-cover object-center filter contrast-[1.05] brightness-[0.9] grayscale-[15%]"
          draggable="false"
        />
        {/* Subtle gold glow behind photo */}
        <div className="absolute inset-0 bg-gold/5 mix-blend-overlay z-0" />
      </div>
    </div>
  );
}
