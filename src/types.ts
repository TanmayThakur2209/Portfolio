export interface Project {
  id: string;
  title: string;
  description: string;
  role: string;
  period: string;
  category: "Core Engine" | "Neural Nets" | "Decentralized" | "Interface";
  status: "Deploy Active" | "Classified" | "Experimental" | "Stable Network";
  metrics: string[];
  technologies: string[];
  lore: string; 
  github: string;
  link: string;
}

export interface SkillNode {
  id: string;
  name: string;
  category: "Language" | "Infrastructure" | "Framework" | "Protocol";
  level: number; // 1 to 100
  description: string;
  // 3D coordinates on unit sphere
  x: number;
  y: number;
  z: number;
  color: string;
}

export interface TerminalLog {
  text: string;
  type: "system" | "input" | "success" | "warning" | "data";
  timestamp: string;
  link?: string;
  linkLabel?: string;
}

export interface Star3D {
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
  glow: boolean;
}

export interface SpaceGrid3D {
  x1: number;
  y1: number;
  z1: number;
  x2: number;
  y2: number;
  z2: number;
  color: string;
}
