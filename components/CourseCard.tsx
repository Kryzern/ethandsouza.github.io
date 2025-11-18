import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  index: number;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative border-t border-neutral-800 py-12 transition-all duration-500 hover:bg-neutral-900/20 overflow-hidden"
    >
       <motion.div 
         className="absolute inset-0 bg-gradient-to-r from-delft/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
       />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start relative z-10">
        {/* Year / ID */}
        <div className="col-span-1 md:col-span-2">
            <span className="font-mono text-xs text-neutral-500 block mb-1 group-hover:translate-x-2 transition-transform duration-300">{course.year}</span>
            <span className="font-mono text-delft text-xs tracking-wider uppercase">/{course.id}</span>
        </div>

        {/* Title & Inst */}
        <div className="col-span-1 md:col-span-4">
          <h3 className="text-3xl font-medium text-white mb-2 group-hover:text-delft transition-colors duration-300 group-hover:translate-x-2 transform">
            {course.title}
          </h3>
          <p className="serif-italic text-neutral-400 text-xl">{course.institution}</p>
        </div>

        {/* Description & Skills */}
        <div className="col-span-1 md:col-span-6">
          <p className="text-neutral-400 leading-relaxed mb-6 font-body text-sm md:text-base group-hover:text-neutral-300 transition-colors">
            {course.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {course.skills.map((skill, i) => (
              <motion.span 
                key={i} 
                whileHover={{ scale: 1.05, backgroundColor: "rgba(0, 166, 214, 0.1)" }}
                className="px-3 py-1 text-xs font-mono border border-neutral-800 text-neutral-400 rounded-full group-hover:border-delft/30 group-hover:text-delft transition-all duration-300 cursor-default"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Decorative animated line */}
      <motion.div 
        className="absolute bottom-0 left-0 h-[1px] bg-delft w-0 group-hover:w-full transition-all duration-700 ease-out"
      />
    </motion.div>
  );
};