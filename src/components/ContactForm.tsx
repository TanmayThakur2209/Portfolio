import { useState, useEffect  } from "react";
import type { FormEvent } from "react";
import { Send, CheckCircle2, History, AlertCircle, Database } from "lucide-react";
import emailjs from "@emailjs/browser";

interface DispatchLog {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  status: "SENT" | "BUFFERED" | "ROUTING";
}

export default function ContactForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);
  const [sentLogs, setSentLogs] = useState<DispatchLog[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState(""); 

  useEffect(() => {
    try {
      const stored = localStorage.getItem("operator_dispatch_queue");
      if (stored) {
        setSentLogs(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to read storage buffer:", e);
    }
  }, []);

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);
    setSendProgress(0);
    setSuccess(false);
    try {
      const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          name: name || "Anonymous",
          email: email || "Not Provided",
          message: message,
        },
        PUBLIC_KEY,
      );

      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error(err);
    }

    setIsSending(false);


    const interval = setInterval(() => {
      setSendProgress((p) => {
        const next = p + 4;
        if (next >= 100) {
          clearInterval(interval);
          
          // Complete transfer
          const newLog: DispatchLog = {
            id: `packet-${Date.now()}`,
            sender: email,
            message: message,
            timestamp: new Date().toLocaleTimeString(),
            status: "SENT"
          };

          const updatedLogs = [newLog, ...sentLogs];
          setSentLogs(updatedLogs);
          localStorage.setItem("operator_dispatch_queue", JSON.stringify(updatedLogs));

          setIsSending(false);
          setSuccess(true);
          setEmail("");
          setMessage("");
          return 100;
        }
        return next;
      });
    }, 80);
  };

  const clearQueue = () => {
    setSentLogs([]);
    localStorage.removeItem("operator_dispatch_queue");
  };

  return (
    <div className="bg-black/20 border border-neutral-900/60 rounded-xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden" id="contact-wrapper-panel">
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch" id="contact-grid">
        
        <div className="col-span-1 md:col-span-7 flex flex-col justify-between" id="contact-form-col">
          <div>
            <h3 className="text-xl font-display font-light text-white mb-2">
              Communications Portal
            </h3>
            <p className="text-neutral-400 text-xs sm:text-sm mb-6 leading-relaxed font-light">
              Dispatch messages directly to the architect. Transmissions are packed into custom frame formats and logged to the local node ledger.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4" id="relay-dispatch-form">
              <div>
                <label className="block text-[9px] font-mono text-neutral-400 tracking-wider uppercase mb-1.5">
                  Operator Name (Optional)
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSending}
                  placeholder="Your name (optional)"
                  className="w-full bg-black/30 border border-neutral-900 focus:border-neutral-700 rounded px-4 py-2.5 text-xs text-white placeholder-neutral-700 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-[9px] font-mono text-neutral-400 tracking-wider uppercase mb-1.5">
                  Sender Coordinate (Email / Handle) (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSending}
                  placeholder="coordinate@server.com"
                  className="w-full bg-black/30 border border-neutral-900 focus:border-neutral-700 rounded px-4 py-2.5 text-xs text-white placeholder-neutral-700 outline-none transition-colors"
                  id="contact-sender-input"
                />
              </div>

              <div>
                <label className="block text-[9px] font-mono text-neutral-400 tracking-wider uppercase mb-1.5">
                  Message Payload
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isSending}
                  required
                  rows={4}
                  placeholder="Enter message text..."
                  className="w-full bg-black/30 border border-neutral-900 focus:border-neutral-700 rounded px-4 py-2.5 text-xs text-white placeholder-neutral-700 outline-none transition-colors resize-none"
                  id="contact-message-input"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogs(!showLogs)}
                  className="flex items-center gap-1.5 font-mono text-[9px] text-neutral-500 hover:text-neutral-300 transition-colors"
                  id="toggle-queue-btn"
                >
                  <History className="w-3.5 h-3.5 text-neutral-600" />
                  DISPATCH QUEUE ({sentLogs.length})
                </button>

                <button
                  type="submit"
                  disabled={isSending || !message.trim()}
                  className="px-4 py-2 bg-white hover:bg-neutral-100 disabled:opacity-40 disabled:bg-neutral-800 disabled:text-neutral-500 rounded font-sans text-xs font-medium text-black transition-all duration-200 flex items-center gap-2"
                  id="submit-dispatch-btn"
                >
                  {isSending ? "Transmitting..." : "Encrypt & Dispatch"}
                  <Send className="w-3.5 h-3.5 text-neutral-800" />
                </button>
              </div>
            </form>
          </div>

          {isSending && (
            <div className="mt-6 space-y-1.5 font-mono text-[10px] text-neutral-300" id="encryption-progress">
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 animate-spin" />
                  ALIGNED ENCRYPTING SHA-256 PACKET FRAMES...
                </span>
                <span>{sendProgress}%</span>
              </div>
              <div className="w-full bg-neutral-950 h-1 rounded overflow-hidden border border-neutral-900">
                <div 
                  className="h-full bg-white transition-all duration-100" 
                  style={{ width: `${sendProgress}%` }}
                />
              </div>
            </div>
          )}

          {success && (
            <div className="mt-6 p-4 bg-neutral-900/40 border border-neutral-800/40 rounded flex items-start gap-3" id="dispatch-success-banner">
              <CheckCircle2 className="w-5 h-5 text-neutral-300 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-mono text-xs font-medium text-white">PACKET TRANSMITTED SUCCESSFULLY</h5>
                <p className="text-neutral-400 text-[11px] mt-0.5 leading-relaxed font-light">
                  Message queued. System has mapped it to slot 0x{Math.floor(Math.random() * 255).toString(16).toUpperCase()}. The operator will respond when parameters align.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="col-span-1 md:col-span-5 border-t md:border-t-0 md:border-l border-neutral-900/60 pt-6 md:pt-0 md:pl-6 flex flex-col justify-between" id="dispatch-history-col">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-mono text-[9px] text-neutral-450 tracking-wider uppercase flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-neutral-500" />
                DISPATCH_QUEUE_LEDGER
              </h4>
              {sentLogs.length > 0 && (
                <button 
                  onClick={clearQueue}
                  className="text-[8px] font-mono text-neutral-500 hover:text-neutral-300 underline"
                  id="clear-queue-btn"
                >
                  PURGE
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto max-h-[250px] space-y-3 pr-1 scrollbar-thin scrollbar-thumb-neutral-900" id="dispatch-log-list">
              {sentLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center text-neutral-600 font-mono text-[9px]">
                  <Database className="w-6 h-6 text-neutral-800 mb-2" />
                  NO QUEUED DISPATCH PACKETS FOUND
                </div>
              ) : (
                sentLogs.map((log) => (
                  <div key={log.id} className="bg-black/40 border border-neutral-900/60 p-3 rounded space-y-1.5 font-mono text-[10px]">
                    <div className="flex justify-between items-center text-[9px] text-neutral-500">
                      <span>FROM: {log.sender}</span>
                      <span className="text-white border border-neutral-800 px-1 rounded text-[8px] tracking-wide bg-neutral-900">
                        {log.status}
                      </span>
                    </div>
                    <p className="text-neutral-300 leading-normal line-clamp-2 select-text font-light">{log.message}</p>
                    <div className="text-right text-[8px] text-neutral-600">
                      TIMESTAMP: {log.timestamp}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
