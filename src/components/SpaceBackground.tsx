import { useEffect, useRef } from "react";
import type { Star3D } from "../types";

interface FloatingSpaceObject3D {
  id: string;
  x: number;
  y: number;
  z: number;
  type: "planet" | "satellites" | "rings" | "cube";
  size: number;
  color: string;
  rotX: number;
  rotY: number;
  rotSpeedX: number;
  rotSpeedY: number;
}

export default function SpaceBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const scrollYRef = useRef(0);
  const targetScrollYRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 }); 
  
  const starsRef = useRef<Star3D[]>([]);
  const gridLinesRef = useRef<{ z: number; size: number; alpha: number }[]>([]);
  const objects3DRef = useRef<FloatingSpaceObject3D[]>([]);
  
  const initSpace = (width: number, height: number) => {
    const starCount = 280; 
    const stars: Star3D[] = [];
    const colors = ["#ffffff", "#fafafa", "#f5f5f5", "#e5e5e5", "#d4d4d4", "#a3a3a3"];
    
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 4,
        y: (Math.random() - 0.5) * height * 4,
        z: Math.random() * 1600 + 1,
        size: Math.random() * 1.4 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        glow: Math.random() > 0.92,
      });
    }
    starsRef.current = stars;
    
    const gridCount = 5;
    const grids = [];
    for (let i = 0; i < gridCount; i++) {
      grids.push({
        z: (i / gridCount) * 1600,
        size: Math.min(width, height) * 0.95,
        alpha: 0,
      });
    }
    gridLinesRef.current = grids;

    objects3DRef.current = [
      {
        id: "space-planet-1",
        x: -width * 0.35,
        y: -height * 0.25,
        z: 400,
        type: "planet",
        size: 80,
        color: "rgba(255, 255, 255, 0.18)", 
        rotX: 0.1,
        rotY: 0.4,
        rotSpeedX: 0.001,
        rotSpeedY: 0.002,
      },
      {
        id: "space-rings-1",
        x: width * 0.4,
        y: height * 0.15,
        z: 800,
        type: "rings",
        size: 110,
        color: "rgba(229, 231, 235, 0.15)",
        rotX: -0.4,
        rotY: 0.2,
        rotSpeedX: 0.0015,
        rotSpeedY: 0.001,
      },
      {
        id: "space-cube-1",
        x: -width * 0.25,
        y: height * 0.35,
        z: 1150,
        type: "cube",
        size: 50,
        color: "rgba(156, 163, 175, 0.15)",
        rotX: 0.3,
        rotY: 0.6,
        rotSpeedX: 0.002,
        rotSpeedY: 0.003,
      },
      {
        id: "space-satellites-1",
        x: width * 0.2,
        y: -height * 0.3,
        z: 1450,
        type: "satellites",
        size: 60,
        color: "rgba(107, 114, 128, 0.12)", 
        rotX: 0.05,
        rotY: -0.2,
        rotSpeedX: 0.001,
        rotSpeedY: 0.004,
      }
    ];
  };

  useEffect(() => {
    const handleScroll = () => {
      targetScrollYRef.current = window.scrollY;
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseRef.current.tx = (e.clientX / innerWidth) * 2 - 1;
      mouseRef.current.ty = (e.clientY / innerHeight) * 2 - 1;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      const { width: newWidth, height: newHeight } = entry.contentRect;
      
      width = newWidth;
      height = newHeight;
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      initSpace(newWidth, newHeight);
    });

    resizeObserver.observe(container);

    const render = () => {
      if (!ctx || width === 0 || height === 0) {
        animationId = requestAnimationFrame(render);
        return;
      }

      const scrollDiff = targetScrollYRef.current - scrollYRef.current;
      const scrollSpeed = Math.abs(scrollDiff);
      scrollYRef.current += scrollDiff * 0.07;

      mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.04;

      ctx.fillStyle = "#030712"; 
      ctx.fillRect(0, 0, width, height);

      const gradientX1 = width / 2 + mouseRef.current.x * -120;
      const gradientY1 = height / 2 + mouseRef.current.y * -120 + Math.sin(Date.now() * 0.00015) * 60;
      const radGrad1 = ctx.createRadialGradient(gradientX1, gradientY1, 20, gradientX1, gradientY1, Math.max(width, height) * 0.85);
      radGrad1.addColorStop(0, "rgba(88, 28, 135, 0.16)");
      radGrad1.addColorStop(0.5, "rgba(30, 58, 138, 0.07)"); 
      radGrad1.addColorStop(1, "rgba(3, 7, 18, 0)");
      ctx.fillStyle = radGrad1;
      ctx.fillRect(0, 0, width, height);

      const gradientX2 = width * 0.8 + mouseRef.current.x * -160;
      const gradientY2 = height * 0.2 + mouseRef.current.y * -160 + Math.cos(Date.now() * 0.00025) * 70;
      const radGrad2 = ctx.createRadialGradient(gradientX2, gradientY2, 10, gradientX2, gradientY2, Math.max(width, height) * 0.6);
      radGrad2.addColorStop(0, "rgba(13, 148, 136, 0.12)"); // Teal glow
      radGrad2.addColorStop(0.6, "rgba(15, 23, 42, 0.04)");
      radGrad2.addColorStop(1, "rgba(3, 7, 18, 0)");
      ctx.fillStyle = radGrad2;
      ctx.fillRect(0, 0, width, height);

      const focalLength = 400;
      const centerX = width / 2 + mouseRef.current.x * -70;
      const centerY = height / 2 + mouseRef.current.y * -70;

      gridLinesRef.current.forEach((grid) => {
        let currentZ = (grid.z - scrollYRef.current * 0.55) % 1600;
        if (currentZ < 0) currentZ += 1600;

        const scale = focalLength / (currentZ + 1);
        const radius = grid.size * scale;
        
        if (radius > 2 && radius < Math.max(width, height) * 2.5) {
          let alpha = 1;
          if (currentZ < 250) {
            alpha = currentZ / 250;
          } else if (currentZ > 1300) {
            alpha = (1600 - currentZ) / 300;
          }
          
          ctx.strokeStyle = `rgba(147, 197, 253, ${alpha * 0.065})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.stroke();

          ctx.strokeStyle = `rgba(147, 197, 253, ${alpha * 0.025})`;
          for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
            const rx1 = centerX + Math.cos(angle) * (radius * 0.75);
            const ry1 = centerY + Math.sin(angle) * (radius * 0.75);
            const rx2 = centerX + Math.cos(angle) * (radius * 1.25);
            const ry2 = centerY + Math.sin(angle) * (radius * 1.25);
            ctx.beginPath();
            ctx.moveTo(rx1, ry1);
            ctx.lineTo(rx2, ry2);
            ctx.stroke();
          }
        }
      });

      objects3DRef.current.forEach((obj) => {
        let z = (obj.z - scrollYRef.current * 1.1) % 1600;
        if (z < 0) z += 1600;
        obj.rotX += obj.rotSpeedX;
        obj.rotY += obj.rotSpeedY;

        const scale = focalLength / z;
        const x2d = obj.x * scale + centerX;
        const y2d = obj.y * scale + centerY;

        let alpha = 1;
        if (z < 150) {
          alpha = z / 150; 
        } else if (z > 1300) {
          alpha = (1600 - z) / 300; 
        }

        if (z > 20 && z < 1550 && x2d > -200 && x2d < width + 200 && y2d > -200 && y2d < height + 200) {
          ctx.strokeStyle = obj.color.replace("0.45", (alpha * 0.35).toString());
          ctx.lineWidth = Math.max(0.5, scale * 0.8);

          if (obj.type === "planet") {
            const ringCount = 8;
            const pointsPerRing = 12;
            
            for (let i = 1; i < ringCount; i++) {
              const lat = (i / ringCount) * Math.PI - Math.PI / 2;
              const r = Math.cos(lat) * obj.size;
              const py = Math.sin(lat) * obj.size;
              
              ctx.beginPath();
              for (let j = 0; j <= pointsPerRing; j++) {
                const lng = (j / pointsPerRing) * Math.PI * 2;
                
                let px = Math.cos(lng) * r;
                let pz = Math.sin(lng) * r;

                const rx = px * Math.cos(obj.rotY) - pz * Math.sin(obj.rotY);
                const rz = px * Math.sin(obj.rotY) + pz * Math.cos(obj.rotY);
                
                const sx = (rx) * scale + x2d;
                const sy = (py * Math.cos(obj.rotX) - rz * Math.sin(obj.rotX)) * scale + y2d;
                
                if (j === 0) ctx.moveTo(sx, sy);
                else ctx.lineTo(sx, sy);
              }
              ctx.stroke();
            }

            for (let i = 0; i < pointsPerRing; i++) {
              const lng = (i / pointsPerRing) * Math.PI * 2;
              ctx.beginPath();
              
              for (let j = 0; j <= ringCount; j++) {
                const lat = (j / ringCount) * Math.PI - Math.PI / 2;
                const r = Math.cos(lat) * obj.size;
                const py = Math.sin(lat) * obj.size;
                
                let px = Math.cos(lng) * r;
                let pz = Math.sin(lng) * r;

                const rx = px * Math.cos(obj.rotY) - pz * Math.sin(obj.rotY);
                const rz = px * Math.sin(obj.rotY) + pz * Math.cos(obj.rotY);
                
                const sx = (rx) * scale + x2d;
                const sy = (py * Math.cos(obj.rotX) - rz * Math.sin(obj.rotX)) * scale + y2d;
                
                if (j === 0) ctx.moveTo(sx, sy);
                else ctx.lineTo(sx, sy);
              }
              ctx.stroke();
            }
          }

          else if (obj.type === "rings") {
            const radii = [obj.size * 0.6, obj.size * 0.85, obj.size * 1.1];
            
            radii.forEach((r) => {
              ctx.beginPath();
              const points = 24;
              for (let i = 0; i <= points; i++) {
                const theta = (i / points) * Math.PI * 2;
                let px = Math.cos(theta) * r;
                let pz = Math.sin(theta) * r;

                const rx = px * Math.cos(obj.rotY) - pz * Math.sin(obj.rotY);
                const rz = px * Math.sin(obj.rotY) + pz * Math.cos(obj.rotY);
                
                const sx = (rx) * scale + x2d;
                const sy = (-rz * Math.sin(obj.rotX)) * scale + y2d;

                if (i === 0) ctx.moveTo(sx, sy);
                else ctx.lineTo(sx, sy);
              }
              ctx.stroke();
            });

            ctx.fillStyle = obj.color.replace("0.45", (alpha * 0.15).toString());
            ctx.beginPath();
            ctx.arc(x2d, y2d, obj.size * 0.45 * scale, 0, Math.PI * 2);
            ctx.fill();
          }

          else if (obj.type === "cube") {
            const size = obj.size;
            const vertices = [
              {x: -size, y: -size, z: -size},
              {x: size, y: -size, z: -size},
              {x: size, y: size, z: -size},
              {x: -size, y: size, z: -size},
              {x: -size, y: -size, z: size},
              {x: size, y: -size, z: size},
              {x: size, y: size, z: size},
              {x: -size, y: size, z: size}
            ];

            const projectedVerts = vertices.map((v) => {
              let x1 = v.x * Math.cos(obj.rotY) - v.z * Math.sin(obj.rotY);
              let z1 = v.x * Math.sin(obj.rotY) + v.z * Math.cos(obj.rotY);
              
              let y2 = v.y * Math.cos(obj.rotX) - z1 * Math.sin(obj.rotX);
              let z2 = v.y * Math.sin(obj.rotX) + z1 * Math.cos(obj.rotX);

              return {
                x: x1 * scale + x2d,
                y: y2 * scale + y2d
              };
            });

            const edges = [
              [0,1], [1,2], [2,3], [3,0], 
              [4,5], [5,6], [6,7], [7,4],
              [0,4], [1,5], [2,6], [3,7] 
            ];

            ctx.beginPath();
            edges.forEach(([u, v]) => {
              ctx.moveTo(projectedVerts[u].x, projectedVerts[u].y);
              ctx.lineTo(projectedVerts[v].x, projectedVerts[v].y);
            });
            ctx.stroke();

            ctx.fillStyle = obj.color.replace("0.4", (alpha * 0.1).toString());
            ctx.beginPath();
            ctx.arc(x2d, y2d, size * 0.5 * scale, 0, Math.PI * 2);
            ctx.fill();
          }

          else if (obj.type === "satellites") {
            ctx.strokeStyle = obj.color.replace("0.4", (alpha * 0.15).toString());
            ctx.beginPath();
            ctx.ellipse(x2d, y2d, obj.size * scale, obj.size * 0.4 * scale, obj.rotY, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = obj.color.replace("0.4", (alpha * 0.8).toString());
            const particleCount = 4;
            for (let i = 0; i < particleCount; i++) {
              const offsetAngle = obj.rotX * 2 + (i * Math.PI * 2) / particleCount;
              const px = Math.cos(offsetAngle) * obj.size;
              const pz = Math.sin(offsetAngle) * obj.size;

              const rx = px * Math.cos(obj.rotY) - pz * Math.sin(obj.rotY);
              const sx = rx * scale + x2d;
              const sy = (pz * Math.cos(obj.rotY) * 0.4) * scale + y2d;

              ctx.beginPath();
              ctx.arc(sx, sy, Math.max(1, 2.5 * scale), 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      });

      starsRef.current.forEach((star) => {
        let z = (star.z - scrollYRef.current * 1.35) % 1600;
        if (z < 0) z += 1600;

        const scale = focalLength / z;
        const x2d = star.x * scale + centerX;
        const y2d = star.y * scale + centerY;

        if (x2d >= 0 && x2d <= width && y2d >= 0 && y2d <= height) {
          let opacity = Math.min(1, scale * 2.2);
          
          if (z < 100) opacity *= (z / 100);
          else if (z > 1450) opacity *= ((1600 - z) / 150);

          ctx.fillStyle = star.color;

          if (scrollSpeed > 8) {
            const warpLength = Math.min(32, scrollSpeed * 0.22 * scale);
            const angle = Math.atan2(y2d - centerY, x2d - centerX);
            const endX = x2d + Math.cos(angle) * warpLength;
            const endY = y2d + Math.sin(angle) * warpLength;
            
            ctx.strokeStyle = star.color;
            ctx.lineWidth = star.size * Math.max(1, opacity);
            ctx.beginPath();
            ctx.moveTo(x2d, y2d);
            ctx.lineTo(endX, endY);
            ctx.stroke();
          } else {
            ctx.beginPath();
            const radius = star.size * Math.max(0.45, scale * 0.8);
            ctx.arc(x2d, y2d, radius, 0, Math.PI * 2);
            ctx.fill();

            if (star.glow && z > 250 && z < 800) {
              const glowRadius = radius * 3.8;
              const glowGrad = ctx.createRadialGradient(x2d, y2d, radius, x2d, y2d, glowRadius);
              glowGrad.addColorStop(0, "rgba(56, 189, 248, 0.25)");
              glowGrad.addColorStop(1, "rgba(56, 189, 248, 0)");
              ctx.fillStyle = glowGrad;
              ctx.beginPath();
              ctx.arc(x2d, y2d, glowRadius, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full -z-50 overflow-hidden pointer-events-none"
      id="space-canvas-container"
    >
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" id="space-canvas" />
    </div>
  );
}
