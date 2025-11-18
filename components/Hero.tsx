import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const titleVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 1,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center relative overflow-hidden px-4">
      {/* Dynamic Background Elements - Added pointer-events-none to fix scroll */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] border-[1px] border-neutral-800 rounded-full opacity-20 pointer-events-none"
      />
      <motion.div 
        style={{ y: y2 }}
        className="absolute bottom-[-10%] left-[-5%] w-[30vw] h-[30vw] border-[1px] border-delft rounded-full opacity-10 pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center text-center pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="mb-6 pointer-events-auto"
        >
          <span className="font-mono text-delft text-xs md:text-sm tracking-[0.2em] uppercase border border-delft/30 px-4 py-1 rounded-full bg-delft/5 backdrop-blur-sm">
            Portfolio 2025
          </span>
        </motion.div>

        <div className="overflow-hidden">
          <motion.h1 
            custom={0}
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            className="text-[12vw] md:text-[10vw] leading-[0.8] font-bold tracking-tighter text-white mix-blend-difference"
          >
            ETHAN
          </motion.h1>
        </div>
        
        <div className="overflow-hidden -mt-2 md:-mt-4">
           <motion.h1 
            custom={1}
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            className="text-[12vw] md:text-[10vw] leading-[0.8] font-bold tracking-tighter text-neutral-500 mix-blend-difference"
          >
            DSOUZA
          </motion.h1>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-12 flex flex-col items-center gap-2 pointer-events-auto"
        >
          <p className="text-xl md:text-3xl font-light text-neutral-300">
            Aspiring <span className="serif-italic text-delft">Computer Scientist</span>
          </p>
          <p className="text-sm font-mono text-neutral-500 uppercase tracking-widest">
             Target: TU Delft
          </p>
        </motion.div>
      </div>

      <motion.div 
        style={{ opacity }}
        className="absolute bottom-12 flex flex-col items-center gap-4 text-neutral-600 font-mono text-xs pointer-events-none"
      >
        <span>SCROLL</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ArrowDown size={16} />
        </motion.div>
      </motion.div>
    </div>
  );
};