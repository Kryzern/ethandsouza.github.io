import React, { useState, useEffect, useRef } from 'react';
import { Hero } from './components/Hero';
import { Section } from './components/Section';
import { CourseCard } from './components/CourseCard';
import { Course, Project } from './types';
import { Terminal, Shield, Code, Cpu, ExternalLink, Github, Mail, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useVelocity } from 'framer-motion';

const coursework: Course[] = [
  {
    id: 'EMF',
    title: 'Elements of Mathematics: Foundations',
    institution: 'IMACS',
    year: '2022 - Present',
    description: 'A hyper-rigorous program for mathematically talented students. The curriculum entirely bypasses standard rote calculation, focusing instead on the axiomatic construction of mathematics. Covered Operational Systems, Set Theory (ZFC foundations), Modular Arithmetic, and formal Abstract Algebra.',
    skills: ['Formal Proofs', 'Set Theory', 'Modular Arithmetic', 'Abstract Algebra', 'Boolean Logic']
  },
  {
    id: 'AoPS',
    title: 'Art of Problem Solving',
    institution: 'AoPS',
    year: '2021 - 2023',
    description: 'Advanced problem-solving curriculum targeted at competition-level mathematics. Deep dive into Number Theory (primes, divisibility, congruences) and Counting & Probability (combinatorial identities, geometric probability). Developed the ability to approach non-standard problems with lateral thinking.',
    skills: ['Number Theory', 'Combinatorics', 'Geometric Probability', 'Competition Math']
  },
  {
    id: 'UCS1',
    title: 'University Computer Science I',
    institution: 'IMACS',
    year: '2023',
    description: 'Undergraduate-level functional programming course utilizing Scheme/Racket. Focused on mathematical models of computation, functional abstraction, recursion patterns, and algorithmic efficiency analysis. This course lays the theoretical groundwork for compiler design and AI.',
    skills: ['Scheme/Racket', 'Functional Programming', 'Recursion', 'Algorithm Analysis', 'Data Structures']
  }
];

const projects: Project[] = [
  {
    title: 'Packet Sniffer',
    description: 'A raw-socket based network analysis tool written in Python. Manually parses TCP/IP headers to identify potentially malicious traffic patterns.',
    tech: ['Python', 'Raw Sockets', 'TCP/IP', 'Cybersec']
  },
  {
    title: 'Logic Gate Visualizer',
    description: 'Interactive simulation of digital logic circuits. Built from scratch using HTML5 Canvas to demonstrate rendering optimization and graph traversal.',
    tech: ['Canvas API', 'JavaScript', 'Graph Theory']
  }
];

// Custom Cursor Component
const Cursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // Check if hovering over clickable
      const target = e.target as HTMLElement;
      const isClickable = target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button');
      setIsHovering(!!isClickable);
    };
    window.addEventListener('mousemove', updateMouse);
    return () => window.removeEventListener('mousemove', updateMouse);
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-delft rounded-full pointer-events-none z-[100] mix-blend-difference"
        animate={{ 
          x: mousePos.x - 8, 
          y: mousePos.y - 8,
          scale: isHovering ? 1.5 : 1
        }}
        transition={{ type: "spring", stiffness: 1000, damping: 50, mass: 0.1 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 border border-delft rounded-full pointer-events-none z-[100] opacity-50"
        animate={{ 
          x: mousePos.x - 24, 
          y: mousePos.y - 24,
          scale: isHovering ? 1.5 : 1,
          borderColor: isHovering ? '#fff' : '#00A6D6'
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
      />
    </>
  );
};

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const lenisRef = useRef<any>(null);
  const rafRef = useRef<number>(null);

  // Scroll Skew Effect
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const skew = useTransform(scrollVelocity, [-2000, 2000], [2, -2]); // Slight skew based on speed
  const springSkew = useSpring(skew, { stiffness: 400, damping: 90 });
  
  // Smooth Scroll Init
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    let lenis: any = null;
    
    const initLenis = () => {
        // @ts-ignore
        if (typeof window.Lenis !== 'undefined' && !lenisRef.current) {
            // @ts-ignore
            lenis = new window.Lenis({
              duration: 1.2,
              easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
              smoothWheel: true,
              wheelMultiplier: 1,
              touchMultiplier: 2,
              infinite: false,
            });
            
            lenisRef.current = lenis;
            setLoaded(true);

            const raf = (time: number) => {
              lenis.raf(time);
              // @ts-ignore
              rafRef.current = requestAnimationFrame(raf);
            };
            // @ts-ignore
            rafRef.current = requestAnimationFrame(raf);
        }
    }

    // Poll for Lenis script load
    const checkForLenis = setInterval(() => {
        if (lenisRef.current) {
            clearInterval(checkForLenis);
            return;
        }
        // @ts-ignore
        if (typeof window.Lenis !== 'undefined') {
            initLenis();
            clearInterval(checkForLenis);
        }
    }, 100);
    
    // Fallback
    const fallbackTimeout = setTimeout(() => {
        if (!loaded) setLoaded(true);
    }, 1500);

    return () => {
      clearInterval(checkForLenis);
      clearTimeout(fallbackTimeout);
      window.removeEventListener('scroll', handleScroll);
      
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        // @ts-ignore
        rafRef.current = null;
      }
    };
  }, []);

  return (
    // IMPORTANT: Removed overflow-x-hidden from here as it can trap scroll in some viewport configs
    // We handle global overflow in the body tag now.
    <div className="bg-surface min-h-screen text-neutral-100 font-sans relative selection:bg-delft selection:text-black">
      <Cursor />
      
      {/* Preloader */}
      <AnimatePresence>
        {!loaded && (
          <motion.div 
            exit={{ opacity: 0, pointerEvents: 'none' }}
            transition={{ duration: 1 }}
            className="fixed inset-0 bg-black z-[999] flex items-center justify-center"
          >
             <div className="flex gap-2">
               <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-delft rounded-full" />
               <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-delft rounded-full" />
               <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-delft rounded-full" />
             </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Noise Texture Overlay - z-index 1 */}
      <div className="fixed inset-0 bg-noise opacity-[0.03] pointer-events-none z-[1]" />
      {/* Grid Pattern - z-index 0 */}
      <div className="fixed inset-0 grid-pattern opacity-40 pointer-events-none z-[0]" />

      {/* Navigation - z-index 40 */}
      <nav className={`fixed top-0 w-full z-40 transition-all duration-500 ${scrolled ? 'py-4 bg-surface/80 backdrop-blur-xl border-b border-white/5' : 'py-8 bg-transparent'}`}>
        <div className="max-w-[90rem] mx-auto px-6 flex justify-between items-center">
          <a href="#" className="text-2xl font-bold tracking-tighter group">
            E<span className="text-delft group-hover:text-white transition-colors">.</span>
          </a>
          
          <div className="flex gap-8 text-xs font-mono tracking-widest text-neutral-400">
            {['About', 'Coursework', 'Skills', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="hover:text-delft transition-colors uppercase relative group"
                onClick={(e) => {
                  e.preventDefault();
                  // Custom scroll to anchor with Lenis if available
                  const elem = document.querySelector(`#${item.toLowerCase()}`);
                  if (lenisRef.current && elem) {
                    lenisRef.current.scrollTo(elem);
                  } else if (elem) {
                    elem.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <span className="relative z-10">{item}</span>
                <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-delft group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content Wrapper - z-index 10 to stay above background */}
      {/* Applied skew transformation here for the jelly effect */}
      <motion.main 
        className="relative z-10 will-change-transform"
        style={{ skewY: springSkew }}
      >
        <Hero />

        {/* About Section */}
        <Section id="about">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl md:text-7xl font-bold mb-10 tracking-tighter leading-[0.9]">
                Logic <br/>
                <span className="serif-italic text-neutral-500 font-light text-6xl md:text-8xl">&</span> Code
              </h2>
              <div className="space-y-6 text-lg text-neutral-400 font-light leading-relaxed">
                <p>
                  I don't just write code; I architect solutions based on fundamental truths. 
                  My journey traverses the abstract landscapes of <span className="text-white font-medium">advanced mathematics</span> and the concrete battlegrounds of <span className="text-white font-medium">cybersecurity</span>.
                </p>
                <p>
                  Currently aimed at <span className="text-delft">TU Delft</span>, I combine the rigor of formal logic with the creativity of engineering to build systems that are secure by design.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-delft to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-surfaceHighlight border border-neutral-800 rounded-lg p-8 overflow-hidden font-mono text-sm">
                  <div className="flex gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                  </div>
                  <div className="space-y-2 text-neutral-300">
                    <div className="flex">
                      <span className="text-delft mr-2">➜</span>
                      <span>whoami</span>
                    </div>
                    <div className="pl-4 text-neutral-500 opacity-80">
                      Ethan Dsouza<br/>
                      Student @ IMACS / AoPS<br/>
                      Future TU Delft Engineer
                    </div>
                    
                    <div className="flex pt-4">
                      <span className="text-delft mr-2">➜</span>
                      <span>skills --list</span>
                    </div>
                    <div className="pl-4 text-neutral-500 opacity-80 grid grid-cols-2 gap-4">
                      <span>[✓] Python</span>
                      <span>[✓] Logic</span>
                      <span>[✓] Cybersec</span>
                      <span>[✓] Scheme</span>
                    </div>

                    <div className="flex pt-4">
                      <span className="text-delft mr-2">➜</span>
                      <motion.span 
                        animate={{ opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="w-2 h-5 bg-delft inline-block align-middle" 
                      />
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Coursework Section */}
        <Section id="coursework">
          <div className="border-b border-neutral-800 pb-12 mb-12 flex flex-col md:flex-row justify-between items-end">
            <div>
              <span className="text-delft font-mono text-xs tracking-widest uppercase mb-2 block">Academic Foundation</span>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">Rigorous Coursework</h2>
            </div>
            <p className="text-neutral-500 max-w-md text-right mt-6 md:mt-0">
              University-level mathematics and computer science completed during high school.
            </p>
          </div>
          
          <div className="flex flex-col">
            {coursework.map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} />
            ))}
          </div>
        </Section>

        {/* Skills Grid */}
        <Section id="skills">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-16 text-center">Technical Arsenal</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-800 border border-neutral-800">
            {[
              { icon: Terminal, title: 'Development', skills: ['Python (Expert)', 'HTML/CSS', 'TypeScript', 'React'] },
              { icon: Shield, title: 'Cybersecurity', skills: ['Network Analysis', 'Packet Sniffing', 'Linux Hardening', 'Cryptography'] },
              { icon: Cpu, title: 'Mathematics', skills: ['Formal Logic', 'Graph Theory', 'Combinatorics', 'Set Theory'] }
            ].map((cat, i) => (
              <div key={i} className="bg-surface p-10 hover:bg-neutral-900 transition-colors group">
                <cat.icon className="w-8 h-8 text-neutral-600 mb-6 group-hover:text-delft transition-colors" />
                <h3 className="text-xl font-bold mb-6">{cat.title}</h3>
                <ul className="space-y-3">
                  {cat.skills.map(s => (
                    <li key={s} className="text-neutral-400 text-sm font-mono flex items-center gap-2">
                      <span className="w-1 h-1 bg-neutral-700 group-hover:bg-delft rounded-full transition-colors"></span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* Projects */}
        <Section>
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">Featured Projects</h2>
            <div className="h-[1px] bg-neutral-800 flex-grow"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="group p-8 border border-neutral-800 bg-neutral-900/20 hover:border-delft/50 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-surface border border-neutral-800 rounded-lg">
                    <Code className="text-white" size={24} />
                  </div>
                  <ArrowRight className="text-neutral-700 group-hover:text-delft -rotate-45 group-hover:rotate-0 transition-all duration-300" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3 group-hover:text-delft transition-colors">{project.title}</h3>
                <p className="text-neutral-400 mb-6 text-sm leading-relaxed h-12">
                  {project.description}
                </p>
                
                <div className="flex gap-2 mt-auto">
                  {project.tech.map(t => (
                    <span key={t} className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 border border-neutral-800 px-2 py-1">
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Footer */}
        <footer id="contact" className="border-t border-neutral-800 bg-surface relative overflow-hidden py-24">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(0,166,214,0.1),transparent_50%)]"></div>
          
          <div className="max-w-[90rem] mx-auto px-6 relative z-10 flex flex-col items-center text-center">
            <h2 className="text-6xl md:text-9xl font-bold tracking-tighter mb-8 mix-blend-overlay opacity-50">
              GET IN TOUCH
            </h2>
            <p className="text-xl md:text-2xl text-neutral-400 serif-italic mb-12">
              Ready to engineer the future.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              <a href="mailto:ethan@example.com" className="group flex items-center gap-3 px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-delft hover:text-white transition-all duration-300">
                <Mail size={18} /> 
                <span>Contact Me</span>
              </a>
              <a href="#" className="group flex items-center gap-3 px-8 py-4 border border-neutral-700 text-white font-medium rounded-full hover:border-delft hover:bg-delft/10 transition-all duration-300">
                <Github size={18} /> 
                <span>GitHub Profile</span>
              </a>
            </div>

            <div className="mt-32 flex flex-col md:flex-row justify-between items-center w-full text-xs font-mono text-neutral-600 uppercase tracking-widest border-t border-neutral-900 pt-8">
              <div>© 2025 Ethan Dsouza</div>
              <div className="mt-2 md:mt-0">Built with React • Tailwind • Framer Motion</div>
            </div>
          </div>
        </footer>
      </motion.main>
    </div>
  );
}