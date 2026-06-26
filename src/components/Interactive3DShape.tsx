import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { getSkillConstellation } from "../data";
import type { SkillNode } from "../types";
import { Sparkles, Terminal, Cpu, Network } from "lucide-react";

export default function Interactive3DShape() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [skills, setSkills] = useState<SkillNode[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<SkillNode | null>(null);

  const rotationRef = useRef({ x: 0.5, y: 0.5, speedX: 0.003, speedY: 0.005 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, rotX: 0, rotY: 0 });
  const projectedNodesRef = useRef<{ node: SkillNode; x2d: number; y2d: number; scale: number; depth: number }[]>([]);

  useEffect(() => {
    const nodes = getSkillConstellation();
    setSkills(nodes);
    if (nodes.length > 0) {
      setSelectedSkill(nodes[0]);
    }
  }, []);

  const handleMouseDown = (e: MouseEvent) => {
    isDraggingRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    dragStartRef.current = {
      x,
      y,
      rotX: rotationRef.current.x,
      rotY: rotationRef.current.y
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDraggingRef.current) {
      const dx = x - dragStartRef.current.x;
      const dy = y - dragStartRef.current.y;
      
      // Update angles
      rotationRef.current.y = dragStartRef.current.rotY + dx * 0.008;
      rotationRef.current.x = dragStartRef.current.rotX + dy * 0.008;
    } else {
      let closestNode: SkillNode | null = null;
      let minDistance = 30; 

      projectedNodesRef.current.forEach((proj) => {
        const dist = Math.hypot(x - proj.x2d, y - proj.y2d);
        if (dist < minDistance) {
          minDistance = dist;
          closestNode = proj.node;
        }
      });

      if (closestNode !== hoveredSkill) {
        setHoveredSkill(closestNode);
      }

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const mouseOffsetPercentX = (x - centerX) / centerX;
      const mouseOffsetPercentY = (y - centerY) / centerY;
      
      rotationRef.current.speedX = mouseOffsetPercentY * 0.008;
      rotationRef.current.speedY = mouseOffsetPercentX * 0.008;
    }
  };

  const handleMouseUp = () => {
      isDraggingRef.current = false;
    
    if (hoveredSkill) {
      setSelectedSkill(hoveredSkill);
    }
  };

  const handleMouseLeave = () => {
    isDraggingRef.current = false;
    setHoveredSkill(null);
    rotationRef.current.speedX = 0.002;
    rotationRef.current.speedY = 0.003;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || skills.length === 0) return;

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
    });

    resizeObserver.observe(container);

    const render = () => {
      if (!ctx || width === 0 || height === 0) {
        animationId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      if (!isDraggingRef.current) {
        rotationRef.current.x += rotationRef.current.speedX;
        rotationRef.current.y += rotationRef.current.speedY;
      }

      const cosX = Math.cos(rotationRef.current.x);
      const sinX = Math.sin(rotationRef.current.x);
      const cosY = Math.cos(rotationRef.current.y);
      const sinY = Math.sin(rotationRef.current.y);

      const radius = Math.min(width, height) * 0.35;
      const centerX = width / 2;
      const centerY = height / 2;
      const focalLength = 400;

      const projected = skills.map((node) => {
        let x1 = node.x * cosY - node.z * sinY;
        let z1 = node.x * sinY + node.z * cosY;

        let y2 = node.y * cosX - z1 * sinX;
        let z2 = node.y * sinX + z1 * cosX;

        const scale = focalLength / (focalLength + z2 * radius);
        const x2d = centerX + x1 * radius * scale;
        const y2d = centerY + y2 * radius * scale;

        return {
          node,
          x2d,
          y2d,
          scale,
          depth: z2,
        };
      });

      projectedNodesRef.current = projected;

      projected.sort((a, b) => b.depth - a.depth);

      ctx.lineWidth = 1;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];

          const distanceOnSphere = Math.hypot(
            p1.node.x - p2.node.x,
            p1.node.y - p2.node.y,
            p1.node.z - p2.node.z
          );

          if (distanceOnSphere < 0.95) {
            const avgDepth = (p1.depth + p2.depth) / 2;
            const alpha = Math.max(0.04, (1.2 - avgDepth) * 0.18);
            
            const lineGrad = ctx.createLinearGradient(p1.x2d, p1.y2d, p2.x2d, p2.y2d);
            lineGrad.addColorStop(0, p1.node.id === hoveredSkill?.id || p1.node.id === selectedSkill?.id ? "rgba(255, 255, 255, 0.4)" : `rgba(255, 255, 255, ${alpha * 0.2})`);
            lineGrad.addColorStop(1, p2.node.id === hoveredSkill?.id || p2.node.id === selectedSkill?.id ? "rgba(255, 255, 255, 0.4)" : `rgba(255, 255, 255, ${alpha * 0.2})`);

            ctx.strokeStyle = lineGrad;
            ctx.beginPath();
            ctx.moveTo(p1.x2d, p1.y2d);
            ctx.lineTo(p2.x2d, p2.y2d);
            ctx.stroke();
          }
        }
      }
      projected.forEach((proj) => {
        const isHovered = hoveredSkill?.id === proj.node.id;
        const isSelected = selectedSkill?.id === proj.node.id;
        
        let nodeSize = isSelected ? 7 : isHovered ? 5 : 3.5;
        nodeSize = nodeSize * proj.scale;

        const isBack = proj.depth > 0.3; 

        if (isSelected || isHovered) {
          const glow = ctx.createRadialGradient(proj.x2d, proj.y2d, 1, proj.x2d, proj.y2d, nodeSize * 2.5);
          glow.addColorStop(0, "rgba(255, 255, 255, 0.2)");
          glow.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(proj.x2d, proj.y2d, nodeSize * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = isSelected ? "#ffffff" : proj.node.color;
        ctx.shadowBlur = (isSelected || isHovered) ? 6 : 0;
        ctx.shadowColor = "#ffffff";

        ctx.beginPath();
        ctx.arc(proj.x2d, proj.y2d, nodeSize, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;

        if (isSelected) {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(proj.x2d, proj.y2d, nodeSize * 2.2, 0, Math.PI * 2);
          ctx.stroke();
          
          ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(proj.x2d - 15, proj.y2d);
          ctx.lineTo(proj.x2d + 15, proj.y2d);
          ctx.moveTo(proj.x2d, proj.y2d - 15);
          ctx.lineTo(proj.x2d, proj.y2d + 15);
          ctx.stroke();
        }

        let alpha = isSelected ? 1 : isHovered ? 0.95 : Math.max(0.15, (1 - proj.depth) * 0.6);
        if (isBack && !isSelected && !isHovered) {
          alpha *= 0.3; 
        }

        ctx.fillStyle = isSelected 
          ? "#ffffff" 
          : isHovered 
            ? "#ffffff" 
            : `rgba(200, 200, 200, ${alpha})`;
            
        ctx.font = isSelected 
          ? "500 11px 'JetBrains Mono', monospace" 
          : isHovered 
            ? "500 11px 'JetBrains Mono', monospace" 
            : "400 10px 'Inter', sans-serif";
            
        ctx.textAlign = "left";
        ctx.fillText(proj.node.name, proj.x2d + nodeSize + 6, proj.y2d + 4);

        if (isSelected) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
          ctx.font = "400 8px 'JetBrains Mono', monospace";
          ctx.fillText(`[${proj.node.category.toUpperCase()}]`, proj.x2d + nodeSize + 6, proj.y2d - 6);
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [skills, hoveredSkill, selectedSkill]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-black/10 border border-neutral-900/60 rounded-xl p-6 lg:p-8 backdrop-blur-md relative overflow-hidden" id="skills-3d-panel">
      
      <div className="col-span-1 lg:col-span-7 flex flex-col items-center justify-center relative min-h-[350px] sm:min-h-[420px]" id="constellation-3d-col">
        <div className="absolute top-0 flex items-center gap-2 px-3.5 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-mono tracking-wider text-neutral-300">
          <Network className="w-3 h-3 text-neutral-400" />
          INTERACTIVE CONSTELLATION — DRAG TO ROTATE
        </div>
        
        <div ref={containerRef} className="w-full h-[320px] sm:h-[380px] cursor-grab active:cursor-grabbing relative overflow-visible select-none">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            className="absolute inset-0 block w-full h-full"
            id="skill-node-canvas"
          />
        </div>
        
        <div className="flex flex-wrap gap-4 justify-center mt-2 text-[9px] font-mono text-neutral-500">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#ffffff" }} />
            <span>Languages</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#e5e5e5" }} />
            <span>Frameworks</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#a3a3a3" }} />
            <span>Infrastructure</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#737373" }} />
            <span>Protocols</span>
          </div>
        </div>
      </div>

      <div className="col-span-1 lg:col-span-5 flex flex-col justify-between h-full bg-black/30 border border-neutral-900/60 rounded-xl p-6 relative min-h-[340px]" id="skill-detail-col">
        
        {selectedSkill ? (
          <div className="flex flex-col h-full justify-between" id="skill-content-panel">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 bg-neutral-900/80 border border-neutral-800 rounded text-[9px] font-mono tracking-widest text-neutral-400 uppercase">
                  {selectedSkill.category}
                </span>
                
                <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-300 bg-neutral-900/60 border border-neutral-850 px-2 py-0.5 rounded">
                  <Cpu className="w-3 h-3 text-neutral-400" />
                  LEVEL: {selectedSkill.level}%
                </div>
              </div>

              <h3 className="text-3xl font-display font-medium text-white tracking-tight">
                {selectedSkill.name}
              </h3>
              
              <div className="w-full bg-neutral-900 rounded-full h-1 overflow-hidden border border-neutral-800/40">
                <div 
                  className="h-full rounded-full transition-all duration-500 bg-white" 
                  style={{ 
                    width: `${selectedSkill.level}%`
                  }}
                />
              </div>

              <p className="text-neutral-300 text-[13px] leading-relaxed font-sans font-light">
                {selectedSkill.description}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-neutral-900/60 font-mono text-[9px] text-neutral-500 space-y-1.5">
              <div className="flex justify-between">
                <span>VIRTUAL_ADDRESS:</span>
                <span className="text-neutral-400">0x7FFF98{selectedSkill.level.toString(16).toUpperCase()}02</span>
              </div>
              <div className="flex justify-between">
                <span>VECTOR_SPHERE_X:</span>
                <span className="text-neutral-400">{selectedSkill.x.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span>VECTOR_SPHERE_Y:</span>
                <span className="text-neutral-400">{selectedSkill.y.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span>VECTOR_SPHERE_Z:</span>
                <span className="text-neutral-400">{selectedSkill.z.toFixed(4)}</span>
              </div>
              <div className="flex justify-between items-center text-neutral-400 pt-1">
                <div className="flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-neutral-500" />
                  <span>MATRIX_READY_STATE</span>
                </div>
                <span className="text-[8px] px-1 bg-neutral-900 text-neutral-300 border border-neutral-800 rounded">OK</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-12 text-neutral-500 font-mono text-xs">
            <Sparkles className="w-6 h-6 text-neutral-600 mb-3 animate-pulse" />
            SELECT A NODE TO DECIPHER VECTOR CAPABILITIES
          </div>
        )}
      </div>
    </div>
  );
}
