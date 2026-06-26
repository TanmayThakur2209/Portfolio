import { useState } from "react";
import { PROJECTS } from "../data";
import type { Project } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, Cpu, Database, Network, ExternalLink, ShieldCheck, Cpu as ChipIcon } from "lucide-react";

export default function ProjectCosmos() {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(PROJECTS[0]?.id || null);

  const selectedProject = PROJECTS.find((p) => p.id === activeProjectId) || PROJECTS[0];

  const getCategoryIcon = (category: Project["category"]) => {
    switch (category) {
      case "Core Engine":
        return <Cpu className="w-4 h-4 text-neutral-400" />;
      case "Neural Nets":
        return <ChipIcon className="w-4 h-4 text-neutral-400" />;
      case "Decentralized":
        return <Database className="w-4 h-4 text-neutral-400" />;
      case "Interface":
        return <Network className="w-4 h-4 text-neutral-400" />;
    }
  };

  const [telemetryStatus, setTelemetryStatus] = useState<string | null>(null);

  const triggerTelemetry = () => {
    setTelemetryStatus("Establishing connection...");
    setTimeout(() => {
      window.open(selectedProject.link, "_blank", "noopener,noreferrer");
      setTelemetryStatus(null);
    }, 500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="projects-grid-layout">
      <div className="col-span-1 lg:col-span-4 space-y-2.5" id="projects-sidebar">
        <div className="font-mono text-[9px] text-neutral-500 tracking-wider mb-2 flex items-center gap-1.5 px-1 select-none">
          <Terminal className="w-3.5 h-3.5 text-neutral-500" />
          REGISTRY_INDEX // CHOOSE COORDINATE
        </div>
        
        {PROJECTS.map((project) => {
          const isActive = project.id === activeProjectId;
          return (
            <button
              key={project.id}
              onClick={() => setActiveProjectId(project.id)}
              className={`w-full text-left p-3.5 rounded-lg border transition-all duration-300 backdrop-blur-sm relative group flex items-center justify-between ${
                isActive
                  ? "bg-white/5 border-neutral-700 text-white"
                  : "bg-black/10 border-neutral-900/60 hover:border-neutral-800 text-neutral-400 hover:text-neutral-200"
              }`}
              id={`proj-btn-${project.id}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded transition-colors duration-300 ${
                  isActive ? "bg-white/10" : "bg-neutral-950/40 group-hover:bg-neutral-900/40"
                }`}>
                  {getCategoryIcon(project.category)}
                </div>
                <div>
                  <h4 className="font-sans font-medium text-xs text-neutral-200 group-hover:text-white transition-colors">
                    {project.title}
                  </h4>
                  <span className="font-mono text-[8px] text-neutral-550 uppercase tracking-widest mt-0.5 block">
                    {project.category}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`w-1 h-1 rounded-full ${
                  isActive ? "bg-white animate-ping" : "bg-transparent"
                }`} />
                <span className={`w-1 h-1 rounded-full -ml-3 ${
                  isActive ? "bg-white" : "bg-neutral-800"
                }`} />
              </div>
            </button>
          );
        })}
      </div>

      <div className="col-span-1 lg:col-span-8" id="projects-main-display">
        <AnimatePresence mode="wait">
          {selectedProject && (
            <motion.div
              key={selectedProject.id}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
              className="bg-black/20 border border-neutral-900/60 rounded-xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden flex flex-col justify-between min-h-[460px]"
              id="selected-project-panel"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-900/60 pb-4 mb-6">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-300 rounded text-[9px] font-mono tracking-widest uppercase">
                      SYS://{selectedProject.id.toUpperCase()}
                    </span>
                    <span className="text-neutral-700 font-mono text-[10px] select-none">|</span>
                    <span className="text-neutral-400 font-mono text-[9px] tracking-wider uppercase flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                      STATUS: {selectedProject.status}
                    </span>
                  </div>
                  
                  <span className="text-xs font-mono text-neutral-400">
                    {selectedProject.period}
                  </span>
                </div>

                <h3 className="text-3xl font-display font-light tracking-tight text-white mb-1.5">
                  {selectedProject.title}
                </h3>
                
                <p className="font-mono text-[10px] text-neutral-400 mb-6 tracking-wide lowercase">
                  role: {selectedProject.role}
                </p>

                <p className="text-neutral-300 text-[13px] leading-relaxed mb-6 font-sans font-light">
                  {selectedProject.description}
                </p>

                <div className="bg-neutral-950/20 border border-neutral-900/60 rounded-lg p-4 mb-6 font-sans text-xs italic text-neutral-400 flex gap-3 relative">
                  <span className="text-neutral-500 font-mono text-base font-bold select-none">“</span>
                  <p className="font-light">{selectedProject.lore}</p>
                </div>

                <div className="mb-6">
                  <h4 className="font-mono text-[8px] text-neutral-500 tracking-widest uppercase mb-3">SYSTEM PERFORMANCE METRICS</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {selectedProject.metrics.map((metric, i) => (
                      <div key={i} className="bg-neutral-950/40 border border-neutral-900/60 p-3.5 rounded flex flex-col gap-1">
                        <span className="text-white font-mono font-medium text-xs">
                          {metric.split(" ")[0]}
                        </span>
                        <span className="text-neutral-400 text-[10px] leading-tight font-sans font-light">
                          {metric.split(" ").slice(1).join(" ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-neutral-900/60 pt-5 mt-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-1.5 max-w-[70%]">
                  {selectedProject.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 bg-neutral-900/30 border border-neutral-900 text-[9px] font-mono text-neutral-450 rounded hover:bg-neutral-900 hover:text-white transition-colors duration-200"
                    >
                      #{tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 relative">
                  {telemetryStatus && (
                    <span className="absolute -top-7 right-0 text-[9px] font-mono text-neutral-400 whitespace-nowrap animate-pulse">
                      {telemetryStatus}
                    </span>
                  )}
                  
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 bg-transparent border border-neutral-900 hover:border-neutral-700 hover:bg-neutral-900/30 rounded font-sans text-xs text-neutral-300 transition-all duration-200 flex items-center gap-1.5"
                    id="proj-git-btn"
                  >
                    View Stack
                  </a>
                  <button
                    onClick={triggerTelemetry}
                    className="px-3.5 py-1.5 bg-white hover:bg-neutral-100 text-black rounded font-sans text-xs font-medium transition-all duration-200 flex items-center gap-1.5"
                    id="proj-launch-btn"
                  >
                    Launch Telemetry
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
