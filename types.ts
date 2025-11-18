import { LucideIcon } from "lucide-react";

export interface Course {
  id: string;
  title: string;
  institution: string;
  description: string;
  skills: string[];
  icon?: LucideIcon;
  year?: string;
}

export interface Skill {
  name: string;
  level: number; // 1-100
  category: 'language' | 'tool' | 'concept';
}

export interface Project {
  title: string;
  description: string;
  tech: string[];
  link?: string;
}