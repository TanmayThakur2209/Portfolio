import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { TerminalLog } from "../types";
import { DEVELOPER_LORE, PROJECTS, SKILLS_RAW } from "../data";
import { Terminal, Shield, Cpu, Send, CheckCircle } from "lucide-react";

export default function InteractiveTerminal() {
  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const radarCanvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputVal, setInputVal] = useState("");
  const [logs, setLogs] = useState<TerminalLog[]>([
    {
      text: "SYSTEM NODE INITIALIZED: PORTFOLIO_GATEWAY_v1.0.9",
      type: "system",
      timestamp: "15:04:56"
    },
    {
      text: "SECURITY ACCESS LEVEL: UNRESTRICTED GUEST DECOY",
      type: "warning",
      timestamp: "15:04:57"
    },
    {
      text: "TYPE 'help' TO DISCOVER AVAILABLE OPERATIONS ON THIS FABRIC.",
      type: "success",
      timestamp: "15:04:57"
    }
  ]);

  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptProgress, setDecryptProgress] = useState(0);

  const focusTerminal = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    focusTerminal();
  }, []);

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCommandSubmit = (e: FormEvent) => {
    e.preventDefault();
    const command = inputVal.trim().toLowerCase();
    if (!command) return;

    const time = new Date().toLocaleTimeString();
    
    const userLog: TerminalLog = {
      text: `guest@operator_0x8f:~$ ${inputVal}`,
      type: "input",
      timestamp: time
    };

    let responseLogs: TerminalLog[] = [];

    switch (command) {
      case "help":
        responseLogs = [
          {
            text: "--- PORTFOLIO UTILITY SUITE ---",
            type: "system",
            timestamp: time
          },
          {
            text: "whoami   - Output Operator designation and biography core.",
            type: "data",
            timestamp: time
          },
          {
            text: "skills   - Check core capability matrices.",
            type: "data",
            timestamp: time
          },
          {
            text: "projects - List confidential software engine deployment logs.",
            type: "data",
            timestamp: time
          },
          {
            text: "resume  - Decrypt and launch operator resume archive.",
            type: "data",
            timestamp: time
          },
          {
            text: "contact  - Decrypt the messaging relay protocols.",
            type: "data",
            timestamp: time
          },
          {
            text: "clear    - Clear terminal logs.",
            type: "data",
            timestamp: time
          }
        ];
        break;
      
      case "whoami":
        responseLogs = [
          {
            text: `[ALIAS]: ${DEVELOPER_LORE.alias}`,
            type: "success",
            timestamp: time
          },
          {
            text: `[DESIGNATION]: ${DEVELOPER_LORE.designation}`,
            type: "data",
            timestamp: time
          },
          {
            text: `[LOCATION]: ${DEVELOPER_LORE.location}`,
            type: "data",
            timestamp: time
          },
          {
            text: `[STATUS]: ${DEVELOPER_LORE.status}`,
            type: "warning",
            timestamp: time
          },
          {
            text: `[BIO]: ${DEVELOPER_LORE.biography}`,
            type: "system",
            timestamp: time
          }
        ];
        break;

      case "skills":
        responseLogs = [
          {
            text: "--- RETRIEVING COMPETENCY MATRICES ---",
            type: "system",
            timestamp: time
          },
          ...SKILLS_RAW.map(skill => ({
            text: `${skill.name.padEnd(20)} [${"■".repeat(Math.round(skill.level / 10))}${".".repeat(10 - Math.round(skill.level / 10))}] ${skill.level}%`,
            type: "success" as const,
            timestamp: time
          }))
        ];
        break;

      case "projects":
        responseLogs = [
          {
            text: "--- EXTRACTING SECURE DEPLOYMENT REGISTRIES ---",
            type: "system",
            timestamp: time
          },
          ...PROJECTS.flatMap(p => [
            {
              text: `[PROJECT]: ${p.title} (${p.status})`,
              type: "success" as const,
              timestamp: time
            },
            {
              text: `ROLE: ${p.role} // TECH: ${p.technologies.join(", ")}`,
              type: "data" as const,
              timestamp: time
            },
            {
              text: `METRICS: ${p.metrics.join(" | ")}`,
              type: "system" as const,
              timestamp: time
            },
            {
              text: `------------------------------------------------`,
              type: "system" as const,
              timestamp: time
            }
          ])
        ];
        break;

      case "resume":
        if (isDecrypting) {
          responseLogs = [{ text: "CRITICAL: Decryption process already in execution state.", type: "warning", timestamp: time }];
        } else {
          setIsDecrypting(true);
          setDecryptProgress(0);
          responseLogs = [{ text: "LAUNCHING BRUTE-FORCE ENTROPY CIPHER AT NODE 0x8F...", type: "warning", timestamp: time }];
        }
        break;

      case "contact":
        responseLogs = [
          {
            text: "--- OPENING MESSAGING INTERFACE RELAY ---",
            type: "system",
            timestamp: time
          },
          {
            text: "RELAY PROTOCOL STATUS: SECURE",
            type: "success",
            timestamp: time
          },
          {
            text: "USE THE SECURE MESSAGE FORM BELOW THE TERMINAL OR DIRECTLY DISPATCH ENCRYPTED PACKETS TO:",
            type: "data",
            timestamp: time
          },
          {
            text: "Phone: +91 9205704031",
            type: "success",
            timestamp: time
          },
          {
            text: "EMAIL: tanmaythakur2209@gmail.com",
            type: "success",
            timestamp: time
          },
          {
            text: "COORDINATES SECURED. GUEST FEEDBACK BUFFER OPEN.",
            type: "system",
            timestamp: time
          }
        ];
        break;

      case "clear":
        setLogs([]);
        setInputVal("");
        return;

      default:
        responseLogs = [
          {
            text: `bash: ${command}: operation not registered on this node. Type 'help' to audit commands.`,
            type: "warning",
            timestamp: time
          }
        ];
    }

    setLogs(prev => [...prev, userLog, ...responseLogs]);
    setInputVal("");
  };

  useEffect(() => {
    if (!isDecrypting) return;
    
    const interval = setInterval(() => {
      setDecryptProgress(p => {
        const next = p + 5;
        if (next >= 100) {
          clearInterval(interval);
          setIsDecrypting(false);
          
          const time = new Date().toLocaleTimeString();
          const charOptions = "0123456789ABCDEF!@#$%^&*()_";
          const randomHash = Array.from({ length: 32 }, () => charOptions[Math.floor(Math.random() * charOptions.length)]).join("");
          
          setLogs(prev => [
            ...prev,
            {
              text: `[DECRYPTION SUCCESSFUL]: ENTROPY STABILIZED`,
              type: "success",
              timestamp: time
            },
            {
              text: `DECRYPTED_TOKEN: ${randomHash}`,
              type: "success",
              timestamp: time
            },
            {
              text: "OPERATOR COORDINATES CONFIRMED. SYSTEM FULLY UNLOCKED.",
              type: "data",
              timestamp: time
            },
            {
              text: "RESUME DECRYPTED.",
              type: "success",
              timestamp: time,
              link: "/Tanmay_Thakur_CV.pdf",
              linkLabel: "Click here to open resume"
            }
          ]);
          return 100;
        }
        if (next % 20 === 0) {
          const fakeAddr = "0x" + Math.floor(Math.random() * 16777215).toString(16).toUpperCase();
          setLogs(prev => [
            ...prev,
            {
              text: `Scanning memory frame ${fakeAddr}... [COMPLETED]`,
              type: "data",
              timestamp: new Date().toLocaleTimeString()
            }
          ]);
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isDecrypting]);

  useEffect(() => {
    const canvas = radarCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let angle = 0;
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

    resizeObserver.observe(canvas.parentElement!);

    const targets = [
      { r: 0.35, phi: Math.PI / 4, label: "Aegis", color: "#ffffff" },
      { r: 0.65, phi: Math.PI * 0.8, label: "NeuroMesh", color: "#e5e5e5" },
      { r: 0.45, phi: Math.PI * 1.4, label: "Helios", color: "#a3a3a3" },
      { r: 0.8, phi: Math.PI * 1.8, label: "Lumina", color: "#737373" }
    ];

    const renderRadar = () => {
      if (!ctx || width === 0 || height === 0) {
        animationId = requestAnimationFrame(renderRadar);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(centerX, centerY) * 0.9;

      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;

      for (let r = 0.2; r <= 1.01; r += 0.2) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, maxRadius * r, 0, Math.PI * 2);
        ctx.stroke();

        if (r < 1) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
          ctx.font = "8px 'JetBrains Mono', monospace";
          ctx.fillText(`${(r * 100).toFixed(0)}km`, centerX + maxRadius * r + 4, centerY + 3);
        }
      }

      ctx.beginPath();
      ctx.moveTo(centerX - maxRadius, centerY);
      ctx.lineTo(centerX + maxRadius, centerY);
      ctx.moveTo(centerX, centerY - maxRadius);
      ctx.lineTo(centerX, centerY + maxRadius);
      ctx.stroke();

      angle = (angle + 0.015) % (Math.PI * 2);
      const sweepX = centerX + Math.cos(angle) * maxRadius;
      const sweepY = centerY + Math.sin(angle) * maxRadius;

      const gradient = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, maxRadius);
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.005)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0.015)");

      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(sweepX, sweepY);
      ctx.stroke();

      ctx.fillStyle = "rgba(255, 255, 255, 0.015)";
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, maxRadius, angle - 0.4, angle);
      ctx.closePath();
      ctx.fill();

      targets.forEach((tgt) => {
        const tx = centerX + Math.cos(tgt.phi) * maxRadius * tgt.r;
        const ty = centerY + Math.sin(tgt.phi) * maxRadius * tgt.r;

        let diff = angle - tgt.phi;
        if (diff < 0) diff += Math.PI * 2;

        let alpha = 0.25;
        if (diff < 1.5) {
          alpha = 1 - diff / 1.5;
        }

        if (alpha > 0.25) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.15})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.arc(tx, ty, 6 + (1 - alpha) * 15, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = tgt.color;
        ctx.beginPath();
        ctx.arc(tx, ty, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(240, 240, 240, ${Math.max(0.4, alpha)})`;
        ctx.font = "8px 'JetBrains Mono', monospace";
        ctx.fillText(tgt.label.toUpperCase(), tx + 8, ty - 2);

        ctx.fillStyle = `rgba(160, 160, 160, ${Math.max(0.2, alpha * 0.7)})`;
        ctx.font = "7px 'JetBrains Mono', monospace";
        ctx.fillText(`SIG:${(tgt.r * 100).toFixed(0)}%`, tx + 8, ty + 6);
      });

      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx.font = "7px 'JetBrains Mono', monospace";
      ctx.fillText(`SYS: OPERATIONAL`, 10, height - 20);
      ctx.fillText(`GRID_ROT: ${angle.toFixed(4)}RAD`, 10, height - 10);

      animationId = requestAnimationFrame(renderRadar);
    };

    renderRadar();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch" id="terminal-radar-grid">
      
      <div 
        className="col-span-1 lg:col-span-8 bg-black/20 border border-neutral-900/60 rounded-xl p-4 sm:p-6 backdrop-blur-md flex flex-col justify-between min-h-[420px] cursor-text select-text"
        onClick={focusTerminal}
        id="terminal-card"
      >
        <div className="flex items-center justify-between border-b border-neutral-900/60 pb-3 mb-4 select-none">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
            </div>
            <span className="ml-2 font-mono text-[9px] text-neutral-500 tracking-wider flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-neutral-500" />
              SECURE_SHELL://guest@developer
            </span>
          </div>
          
          <div className="flex items-center gap-1 px-2 py-0.5 bg-neutral-900 border border-neutral-850 rounded text-[8px] font-mono text-neutral-400">
            <Shield className="w-3 h-3 text-neutral-500" />
            SECURE CONNECTION
          </div>
        </div>

        <div 
          ref={terminalBodyRef}
          className="flex-1 overflow-y-auto font-mono text-xs space-y-3 pr-2 scrollbar-thin scrollbar-thumb-neutral-900 max-h-[300px] select-text"
          id="terminal-logs"
        >
          {logs.map((log, i) => (
            <div key={i} className="flex items-start gap-2 select-text leading-relaxed">
              <span className="text-[9px] text-neutral-600 font-mono mt-0.5 select-none">[{log.timestamp}]</span>
              <span 
                className={`font-mono break-all whitespace-pre-wrap select-text ${
                  log.type === "system" 
                    ? "text-neutral-300 font-medium" 
                    : log.type === "warning" 
                      ? "text-neutral-500" 
                      : log.type === "success" 
                        ? "text-white" 
                        : log.type === "data" 
                          ? "text-neutral-400" 
                          : "text-neutral-350"
                }`}
              >
                <span>
                  {log.text}

                  {log.link && (
                    <>
                      {" "}
                      <a
                        href={log.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-white hover:text-neutral-300 transition-colors"
                      >
                        {log.linkLabel}
                      </a>
                    </>
                  )}
                </span>
              </span>
            </div>
          ))}

          {isDecrypting && (
            <div className="space-y-1 font-mono text-xs">
              <div className="flex justify-between text-neutral-300">
                <span>[DECRYPT_SEQUENCE_CALCULATION]:</span>
                <span>{decryptProgress}%</span>
              </div>
              <div className="w-full bg-neutral-950 h-1 rounded overflow-hidden border border-neutral-900">
                <div 
                  className="h-full bg-white rounded"
                  style={{ width: `${decryptProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleCommandSubmit} className="mt-4 border-t border-neutral-900/60 pt-3 flex items-center gap-2 select-none">
          <span className="font-mono text-xs text-neutral-450 select-none">guest@developer:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isDecrypting}
            className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-white placeholder-neutral-700 caret-white select-text"
            placeholder="Type 'help' for options..."
            autoComplete="off"
            id="terminal-user-input"
          />
          <button 
            type="submit" 
            disabled={isDecrypting}
            className="p-1 hover:bg-white/5 rounded transition-colors text-neutral-400 disabled:opacity-40"
            id="terminal-submit-btn"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      <div className="col-span-1 lg:col-span-4 bg-black/10 border border-neutral-900/60 rounded-xl p-5 sm:p-6 backdrop-blur-md flex flex-col justify-between items-center min-h-[420px] select-none relative" id="radar-card">
        <div className="w-full text-center mb-2">
          <h4 className="text-[9px] font-mono text-neutral-400 tracking-widest uppercase">ACTIVE MONITOR</h4>
          <p className="text-[8px] font-mono text-neutral-600 mt-0.5">SCANNING DEPTH PERSPECTIVE RADAR</p>
        </div>

        <div className="w-full flex-1 flex items-center justify-center min-h-[220px]">
          <canvas ref={radarCanvasRef} className="block w-[220px] h-[220px] sm:w-[240px] sm:h-[240px]" id="radar-view-canvas" />
        </div>

        <div className="w-full grid grid-cols-2 gap-3 mt-2 border-t border-neutral-900/60 pt-4 font-mono text-[9px] text-neutral-500">
          <div className="bg-neutral-950/20 border border-neutral-900/60 p-2 rounded flex flex-col gap-1">
            <span className="text-[7px] text-neutral-600 uppercase">SYS STABILITY</span>
            <span className="text-white font-medium flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-neutral-400" />
              100% SECURE
            </span>
          </div>
          <div className="bg-neutral-950/20 border border-neutral-900/60 p-2 rounded flex flex-col gap-1">
            <span className="text-[7px] text-neutral-600 uppercase">ACTIVE SIGNALS</span>
            <span className="text-white font-medium flex items-center gap-1">
              <Cpu className="w-3 h-3 text-neutral-400" />
              0x04 STREAM
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
