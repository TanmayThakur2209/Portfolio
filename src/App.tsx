import { useEffect, useState } from "react";
import { motion } from "motion/react";
import SpaceBackground from "./components/SpaceBackground";
import Interactive3DShape from "./components/Interactive3DShape";
import ProjectCosmos from "./components/ProjectCosmos";
import InteractiveTerminal from "./components/InteractiveTerminal";
import ContactForm from "./components/ContactForm";
import {ArrowDown, ChevronRight, Clock} from "lucide-react";
import { FaGithub, FaLinkedin, FaPhoneAlt } from "react-icons/fa";
import { MdMail } from "react-icons/md";
// import { SiLeetcode, SiCodeforces  } from "react-icons/si";
export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(window.scrollY / totalScroll);
      }

      const sections = ["hero", "skills", "projects", "terminal", "contact"];
      const scrollPos = window.scrollY + 300;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  const localTime = new Date().toLocaleString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "long",
  });

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(localTime);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-[#d4d4d4] font-sans selection:bg-white/10 selection:text-white overflow-x-hidden relative" id="portfolio-app-root">
      
      <div className="absolute inset-0 pointer-events-none editorial-grid -z-40" />

      <div className="absolute top-[-5%] left-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[140px] -z-45 pointer-events-none" />
      <div className="absolute bottom-[15%] right-[-5%] w-[600px] h-[600px] bg-neutral-900/40 rounded-full blur-[160px] -z-45 pointer-events-none" />

      <SpaceBackground />

      <div className="fixed top-0 left-0 w-full h-0.5 bg-neutral-950/60 z-50 pointer-events-none" id="progress-bar-container">
        <div 
          className="h-full bg-white transition-all duration-100"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-5xl bg-[#090909]/80 border border-neutral-900/60 rounded-full px-6 py-2.5 backdrop-blur-md flex items-center justify-between z-40 transition-all duration-300" id="hud-navigation">
        <div className="flex items-center gap-2">
          <div className="flex flex-col select-none">
            <span className="font-display font-medium text-lg tracking-wider text-white">Tanmay Thakur</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-2 text-sm font-mono text-neutral-400" id="hud-anchors">
          {[
            { id: "hero", label: "About" },
            { id: "skills", label: "skills" },
            { id: "projects", label: "projects" },
            { id: "terminal", label: "more..." },
            { id: "contact", label: "contact" }
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className={`px-3 py-1 rounded-full transition-all duration-200 lowercase ${
                activeSection === sec.id
                  ? "bg-white/10 text-white font-medium"
                  : "hover:text-white"
              }`}
              id={`nav-btn-${sec.id}`}
            >
              {sec.label}
            </button>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-2 font-mono text-[9px] text-neutral-400 select-none">
          <Clock className="w-3 h-3 text-neutral-400" />
          <span>{currentTime || "STABILIZING..."}</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 relative pt-28 pb-16 space-y-36 z-10" id="portfolio-main-body">
        
        <section 
          id="hero" 
          className="min-h-[80vh] flex flex-col justify-center items-center text-center relative pt-8 pb-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 text-[9px] font-mono tracking-[0.2em] text-neutral-450 uppercase select-none">
              <span>Software Engineer</span>
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-light text-white tracking-tight leading-[1.05] select-none">
              building scalable<br />
              <span className="italic text-neutral-400 font-light font-display">software systems</span>
            </h1>

            <p className="text-neutral-400 font-sans text-sm sm:text-base max-w-lg mx-auto leading-relaxed font-light">
              Engineering high-throughput asynchronous core engines and mathematically projected, immersive client viewports.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-5 border border-neutral-900/60 rounded-xl text-left max-w-2xl mx-auto font-mono text-[9px] text-neutral-500 bg-[#070707]/30 backdrop-blur-sm select-none">
              <div className="space-y-1">
                <span className="text-neutral-500 uppercase block">location:</span>
                <span className="text-neutral-300">India</span>
              </div>
              <div className="space-y-1">
                <span className="text-neutral-500 uppercase block">Focus:</span>
                <span className="text-neutral-300">Backend+AI</span>
              </div>
              <div className="space-y-1">
                <span className="text-neutral-500 uppercase block">Projects:</span>
                <span className="text-neutral-300">5+</span>
              </div>
              <div className="space-y-1">
                <span className="text-neutral-500 uppercase block">Status:</span>
                <span className="text-neutral-300 flex items-center gap-1.5">
                  <span className="w-1.2 h-1.2 rounded-full bg-neutral-400 animate-pulse" />
                  Open to Contribute
                </span>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => scrollToSection("skills")}
                className="group inline-flex flex-col items-center gap-3 text-neutral-500 hover:text-white transition-colors duration-300 font-mono text-[9px] uppercase tracking-[0.2em]"
                id="hero-scroll-btn"
              >
                <span>ENTER MY SYSTEM</span>
                <div className="p-2.5 bg-[#0a0a0a] border border-neutral-900 group-hover:border-neutral-700 rounded-full transition-all duration-300">
                  <ArrowDown className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-y-0.5 transition-transform" />
                </div>
              </button>
            </div>
          </motion.div>
        </section>


        <section id="skills" className="space-y-8 scroll-mt-24">
          <div className="flex flex-col gap-1.5 select-none">
            <span className="font-mono text-[9px] text-neutral-500 tracking-[0.2em] uppercase block">SECTION 01 / CAPABILITIES</span>
            <h2 className="text-3xl sm:text-4xl font-display font-light text-white tracking-tight">
              Tech Stack
            </h2>
          </div>

          <p className="text-neutral-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Drag the interactive skill constellation to explore my technical expertise. Select any node to view proficiency, experience, and the technologies I've worked with.
          </p>

          <Interactive3DShape />
        </section>

        <section id="projects" className="space-y-8 scroll-mt-24">
          {/* Section Marker */}
          <div className="flex flex-col gap-1.5 select-none">
            <span className="font-mono text-[9px] text-neutral-500 tracking-[0.2em] uppercase block">SECTION 02 / WORKS</span>
            <h2 className="text-3xl sm:text-4xl font-display font-light text-white tracking-tight">
              Featured Projects
            </h2>
          </div>

          <p className="text-neutral-400 text-xs sm:text-sm max-w-2xl leading-relaxed font-light">
            Choose a coordinate below to explore my production-ready software projects, architecture, technologies, and engineering decisions.
          </p>

          <ProjectCosmos />
        </section>

        <section id="terminal" className="space-y-8 scroll-mt-24">
          <div className="flex flex-col gap-1.5 select-none">
            <span className="font-mono text-[9px] text-neutral-500 tracking-[0.2em] uppercase block">SECTION 03 / DIAGNOSTICS</span>
            <h2 className="text-3xl sm:text-4xl font-display font-light text-white tracking-tight">
              Core Command Shell & Radar
            </h2>
          </div>

          <p className="text-neutral-400 text-xs sm:text-sm max-w-2xl leading-relaxed font-light">
            Execute commands below to query subsystems. Use the space radar to monitor active project orbital paths.
          </p>

          <InteractiveTerminal />
        </section>

        <section id="contact" className="space-y-8 scroll-mt-24">
          <div className="flex flex-col gap-1.5 select-none">
            <span className="font-mono text-[9px] text-neutral-500 tracking-[0.2em] uppercase block">SECTION 04 / SECURE DISPATCH</span>
            <h2 className="text-3xl sm:text-4xl font-display font-light text-white tracking-tight">
              Let's Connect
            </h2>
          </div>

          <p className="text-neutral-400 text-xs sm:text-sm max-w-3xl leading-relaxed font-light">
            Interested in working together, discussing software engineering, or just saying hello? Feel free to reach out.<br/>
            Secure communication channel established. Every transmission is encrypted and delivered directly to its destination.
          </p>

          <ContactForm />
        </section>

      </main>

      <footer className="border-t border-neutral-900 bg-black/10 backdrop-blur-sm py-12 mt-32 relative select-none" id="portfolio-footer">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 text-neutral-500 text-xs font-mono">
          
          <div className="col-span-1 md:col-span-6 space-y-3">
            <span className="text-neutral-100 font-medium block">TANMAY THAKUR PORTFOLIO</span>
            <p className="text-neutral-400 leading-relaxed text-[11px] font-sans font-light">
              Designed and developed by Tanmay Thakur.<br/>
              Built using React, TypeScript, Tailwind CSS and modern web technologies.
            </p>
          </div>

          <div className="col-span-1 md:col-span-3 space-y-2">
            <span className="text-neutral-100 font-medium block">ACTIVE CHANNELS</span>
            <ul className="space-y-1 text-[11px] font-sans font-light text-neutral-400">
              <li className="flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3 text-neutral-400" />
                <a href="tel:+919205704031" target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><span className="flex gap-1"><FaPhoneAlt className="mt-0.5"/>+91 9205704031</span></a>
              </li> 
              <li className="flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3 text-neutral-400" />
                <a href="mailto:tanmaythakur2209@gmail.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><span className="flex gap-1"><MdMail className="mt-0.5"/>tanmaythakur2209@gmail.com</span></a>
              </li> 
              <li className="flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3 text-neutral-400" />
                <a href="https://www.linkedin.com/in/tanmaythakur22/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><span className="flex gap-1"><FaLinkedin className="mt-0.5"/>TanmayThakur22</span></a>
              </li> 
              <li className="flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3 text-neutral-400" />
                <a href="https://github.com/TanmayThakur2209" target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><span className="flex gap-1"><FaGithub className="mt-0.5"/>TanmayThakur2209</span></a>
              </li> 
            
            </ul>
          </div>

          <div className="col-span-1 md:col-span-3 flex flex-col md:items-end gap-4 text-right">
            <div className="space-y-1">
              <span className="text-neutral-400 font-medium block">LOCATION</span>
              <span className="text-neutral-500 block">INDIA</span>
            </div>

            <div className="w-16 h-16 relative mt-1 shrink-0 self-end">
              <div className="absolute inset-0 border border-neutral-800 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 border border-neutral-800/60 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1 h-1 bg-white/40 rounded-full"></div>
              </div>
            </div>
          </div>

        </div>

        <div className="max-w-5xl mx-auto px-6 mt-8 pt-6 border-t border-neutral-900/60 text-center text-[9px] text-neutral-600 font-mono tracking-wider">
          © {new Date().getFullYear()} TANMAY THAKUR // ALL RIGHTS CONFIDENTIAL. NO DATA LOGGED EXTERNALLY.
        </div>
      </footer>

    </div>
  );
}
