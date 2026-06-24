import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { influencerData } from "../config/content";


export default function Carousel3D() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [hoveredCardTitle, setHoveredCardTitle] = useState("");
  const [hoveredCardCat, setHoveredCardCat] = useState("");

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    let width = container.clientWidth;
    let height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 5.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 2));

    // Bright scene lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);  // Much brighter ambient
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xfff5e0, 4, 12);    // Warm key light — brighter
    pointLight.position.set(0, 2, 3);
    scene.add(pointLight);

    const fillLight = new THREE.PointLight(0xffffff, 3.0, 10);   // Front white fill light
    fillLight.position.set(0, 0, 5);
    scene.add(fillLight);

    // Carousel Group
    const carouselGroup = new THREE.Group();
    scene.add(carouselGroup);

    // Fallback Texture
    const createFallbackTexture = (title, category) => {
      const cardCanvas = document.createElement("canvas");
      cardCanvas.width = 512;
      cardCanvas.height = 640;
      const ctx = cardCanvas.getContext("2d");

      const gradient = ctx.createLinearGradient(0, 0, 0, 640);
      gradient.addColorStop(0, "#1a0f14");
      gradient.addColorStop(1, "#0a0a0a");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 640);

      ctx.strokeStyle = "#c9a96e";
      ctx.lineWidth = 6;
      ctx.strokeRect(10, 10, 492, 620);

      ctx.fillStyle = "rgba(201, 169, 110, 0.1)";
      ctx.fillRect(15, 15, 482, 610);

      ctx.strokeStyle = "rgba(201, 169, 110, 0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(30, 200);
      ctx.lineTo(482, 200);
      ctx.stroke();

      ctx.fillStyle = "#c9a96e";
      ctx.font = "bold 20px monospace";
      ctx.textAlign = "center";
      ctx.fillText(category.toUpperCase(), 256, 120);

      ctx.fillStyle = "#f5efe6";
      ctx.font = "italic 32px serif";
      ctx.fillText(title, 256, 320);

      ctx.fillStyle = "rgba(245, 239, 230, 0.6)";
      ctx.font = "14px monospace";
      ctx.fillText("TAP TO VIEW POST", 256, 540);

      return new THREE.CanvasTexture(cardCanvas);
    };

    // Cards Setup
    const cards = influencerData.carouselCards;
    const N = cards.length;
    const radius = 1.9;
    const cardWidth = 1.45;
    const cardHeight = 1.9;
    const cardMeshes = [];
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = "anonymous";

    const cardGeometry = new THREE.PlaneGeometry(cardWidth, cardHeight, 32, 32);

    cards.forEach((card, index) => {
      const material = new THREE.MeshStandardMaterial({
        roughness: 0.05,   // Very smooth — reflects lights vividly
        metalness: 0.3,    // Slight metalness for bright specular highlights
        side: THREE.DoubleSide
      });

      textureLoader.load(
        card.imageUrl,
        (texture) => {
          texture.minFilter = THREE.LinearFilter;
          texture.flipY = true;
          if (texture.image) {
            const imgAspect = texture.image.width / texture.image.height;
            const planeAspect = cardWidth / cardHeight;
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            if (imgAspect > planeAspect) {
              texture.repeat.set(planeAspect / imgAspect, 1.0);
              texture.offset.set((1.0 - planeAspect / imgAspect) / 2.0, 0.0);
            } else {
              texture.repeat.set(1.0, imgAspect / planeAspect);
              texture.offset.set(0.0, (1.0 - imgAspect / planeAspect) / 2.0);
            }
          }
          material.map = texture;
          material.needsUpdate = true;
        },
        undefined,
        () => {
          material.map = createFallbackTexture(card.title, card.category);
          material.needsUpdate = true;
        }
      );

      const mesh = new THREE.Mesh(cardGeometry, material);
      const theta = (index / N) * Math.PI * 2;
      mesh.position.x = Math.sin(theta) * radius;
      mesh.position.z = Math.cos(theta) * radius;
      mesh.position.y = 0;
      mesh.rotation.y = theta;

      mesh.userData = {
        id: card.id,
        title: card.title,
        category: card.category,
        link: card.link,
        initialTheta: theta,
        targetScale: 1.0,
        targetY: 0
      };

      carouselGroup.add(mesh);
      cardMeshes.push(mesh);
    });

    // Interaction Variables
    let isDragging = false;
    let previousMouseX = 0;
    let dragDeltaX = 0;
    let targetRotationY = 0;
    let idleTimer = 0;

    // Raycasting & Hover State
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-9999, -9999);
    let hoveredMesh = null;

    const onPointerDown = (e) => {
      isDragging = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      previousMouseX = clientX;
      dragDeltaX = 0;
      idleTimer = 0;
    };

    const onPointerMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      if (isDragging) {
        const deltaX = clientX - previousMouseX;
        previousMouseX = clientX;
        dragDeltaX = deltaX;
        targetRotationY += deltaX * 0.005;
      }

      if (!e.touches) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((clientX - rect.left) / width) * 2 - 1;
        mouse.y = -((clientY - rect.top) / height) * 2 + 1;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
      if (Math.abs(dragDeltaX) < 1.5) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(cardMeshes);
        if (intersects.length > 0) {
          const clickedMesh = intersects[0].object;
          window.open(clickedMesh.userData.link, "_blank");
        }
      }
      dragDeltaX = 0;
    };

    canvas.addEventListener("mousedown", onPointerDown);
    canvas.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    canvas.addEventListener("touchstart", onPointerDown, { passive: true });
    canvas.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);

    // Animation loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      carouselGroup.rotation.y += (targetRotationY - carouselGroup.rotation.y) * 0.1;

      if (!isDragging) {
        idleTimer += 1;
        if (idleTimer > 150) {
          targetRotationY += 0.002;
        }
      }

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(cardMeshes);

      if (intersects.length > 0) {
        const firstIntersected = intersects[0].object;
        if (hoveredMesh !== firstIntersected) {
          hoveredMesh = firstIntersected;
          setHoveredCardTitle(hoveredMesh.userData.title);
          setHoveredCardCat(hoveredMesh.userData.category);
          document.body.style.cursor = "pointer";
        }
        hoveredMesh.userData.targetScale = 1.1;
        hoveredMesh.userData.targetY = 0.15;
      } else {
        if (hoveredMesh) {
          hoveredMesh = null;
          setHoveredCardTitle("");
          setHoveredCardCat("");
          document.body.style.cursor = "none";
        }
      }

      cardMeshes.forEach((mesh) => {
        const isThisHovered = mesh === hoveredMesh;
        mesh.userData.targetScale = isThisHovered ? 1.1 : 1.0;
        mesh.userData.targetY = isThisHovered ? 0.18 : 0.0;

        const currentScale = mesh.scale.x;
        const nextScale = currentScale + (mesh.userData.targetScale - currentScale) * 0.15;
        mesh.scale.set(nextScale, nextScale, 1);

        mesh.position.y += (mesh.userData.targetY - mesh.position.y) * 0.15;

        if (mesh.material) {
          mesh.material.emissive.setHex(isThisHovered ? 0x221711 : 0x000000);
        }
      });

      carouselGroup.rotation.x = Math.sin(Date.now() * 0.0005) * 0.03 - 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      if (width < 640) {
        camera.position.z = 7.0;
      } else if (width < 1024) {
        camera.position.z = 6.0;
      } else {
        camera.position.z = 5.5;
      }
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);
    handleResize();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      if (canvas) {
        canvas.removeEventListener("mousedown", onPointerDown);
        canvas.removeEventListener("mousemove", onPointerMove);
        canvas.removeEventListener("touchstart", onPointerDown);
        canvas.removeEventListener("touchmove", onPointerMove);
      }
      window.removeEventListener("mouseup", onPointerUp);
      window.removeEventListener("touchend", onPointerUp);
      renderer.dispose();
      cardGeometry.dispose();
      cardMeshes.forEach((mesh) => {
        if (mesh.material) {
          if (mesh.material.map) mesh.material.map.dispose();
          mesh.material.dispose();
        }
      });
      ambientLight.dispose();
      pointLight.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[500px] flex flex-col justify-center items-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full select-none"
        style={{ touchAction: "none" }}
        id="showcase-carousel-canvas"
      />

      <div
        className={`absolute bottom-6 flex flex-col items-center pointer-events-none transition-all duration-500 ease-out select-none ${
          hoveredCardTitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <span className="font-mono text-xs text-pink-400 tracking-widest uppercase mb-1">
          {hoveredCardCat}
        </span>
        <h3 className="text-xl sm:text-2xl font-playfair font-medium text-cream">
          {hoveredCardTitle}
        </h3>
        <span className="font-mono text-xs text-white/40 tracking-wider mt-2">
          DRAG TO ROTATE | CLICK TO VIEW ON INSTAGRAM
        </span>
      </div>

      <div
        className={`absolute bottom-6 flex flex-col items-center pointer-events-none transition-all duration-500 ${
          !hoveredCardTitle ? "opacity-40" : "opacity-0"
        }`}
      >
        <span className="font-mono text-xs text-cream/70 tracking-widest uppercase">
          ✦ Drag to Rotate the Lookbook ✦
        </span>
      </div>
    </div>
  );
}
