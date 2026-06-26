import type { Project, SkillNode } from "./types";

export const DEVELOPER_LORE = {
  alias: "Tanmay Thakur",
  designation: "Software Engineer | AI & Full Stack Developer",
  location: "India",
  status: "OPEN TO OPPORTUNITIES",
  biography:
    "Tech enthusiast passionate about building scalable backend systems, AI-powered applications, and intuitive user experiences. Experienced in FastAPI, React, distributed systems, Retrieval-Augmented Generation (RAG), and modern cloud-native technologies. Always exploring new technologies and continuously improving my problem-solving skills through Competitive Programming."
};

export const PROJECTS: Project[] = [
  {
  id: "learntube",
  title: "LearnTube",
  description:
    "An AI-powered video learning platform that transforms long-form educational videos into searchable knowledge using Retrieval-Augmented Generation (RAG), semantic search, and intelligent question answering.",

  role: "Full Stack Developer",

  period: "2026 - Present",

  category: "Core Engine",

  status: "Deploy Active",

  metrics: [
    "Retrieval-Augmented Generation (RAG) powered contextual chat",
    "Distributed transcript processing with Celery workers",
    "Semantic search using OpenAI embeddings and pgvector"
  ],

  technologies: [
    "FastAPI",
    "React",
    "PostgreSQL",
    "pgvector",
    "Redis",
    "Celery",
    "Docker",
    "OpenAI",
    "JWT"
  ],

  lore:
    "Built to transform educational videos into an interactive learning experience by combining Retrieval-Augmented Generation (RAG), semantic search, contextual AI conversations, and scalable distributed processing.",
  github:
  "https://github.com/TanmayThakur2209/LearnTube",
  link:
    "https://learntubeai.vercel.app/",

  },

  {
    id: "scalora",
    title: "Scalora",
    description:
      "An AI-powered cloud infrastructure optimization platform that predicts workload demand, detects anomalies, and recommends intelligent cost-saving strategies.",
    role: "Machine Learning Engineer",
    period: "2025",
    category: "Neural Nets",
    status: "Stable Network",
    metrics: [
      "LSTM-based workload forecasting",
      "Isolation Forest anomaly detection",
      "Automated cloud resource optimization"
    ],
    technologies: [
      "Python",
      "TensorFlow",
      "Scikit-learn",
      "React",
      "Flask",
      "Docker"
    ],
    lore:
      "Developed to improve cloud resource utilization by combining predictive machine learning with automated optimization recommendations.",
    github:
      "https://github.com/TanmayThakur2209/Scalora",

    link:
      "https://scaloraai.vercel.app/",
  },

  {
    id: "onlyfollowers",
    title: "OnlyFollowers",
    description:
      "A full-stack social networking platform featuring secure authentication, media sharing, responsive user profiles, and modern community interactions.",
    role: "Full Stack Developer",
    period: "2025",
    category: "Interface",
    status: "Stable Network",
    metrics: [
      "JWT-based authentication system",
      "Secure media upload and management",
      "Responsive MERN architecture"
    ],
    technologies: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "JWT",
      "Cloudinary"
    ],
    lore:
      "Built to explore scalable full-stack architecture, secure authentication, and media management using the MERN ecosystem.",
    github:
      "https://github.com/TanmayThakur2209/Onlyfollowers",

    link:
      "https://onlyfollowers.vercel.app/",
  },

  {
    id: "torsional-strain",
    title: "Torsional Strain Calculator",
    description:
      "An interactive engineering web application that visualizes torsional mechanics while calculating shear stress, shear strain, angle of twist, and related shaft design parameters.",
    role: "Frontend Developer",
    period: "2024",
    category: "Interface",
    status: "Deploy Active",
    metrics: [
      "Real-time engineering calculations",
      "Interactive animated visualizations",
      "Responsive educational interface"
    ],
    technologies: [
      "React",
      "Tailwind CSS",
      "JavaScript",
      "HTML5",
      "CSS3"
    ],
    lore:
      "Designed to simplify torsion analysis for engineering students through animated visualizations, intuitive parameter inputs, and instant mathematical computation.",
    github:
      "https://github.com/TanmayThakur2209/Torsional-Strain",

    link:
      "https://torsional-strain-65gn.vercel.app/",
  }
];

export const SKILLS_RAW = [
  {
    name: "Python",
    category: "Language" as const,
    level: 95,
    description:
      "Primary backend language used for building scalable APIs, distributed systems, AI applications, and automation."
  },
  {
    name: "TypeScript",
    category: "Language" as const,
    level: 90,
    description:
      "Developing type-safe frontend applications with React and modern JavaScript ecosystems."
  },
  {
    name: "JavaScript",
    category: "Language" as const,
    level: 90,
    description:
      "Building interactive web applications, asynchronous workflows, and full-stack solutions."
  },
  {
    name: "C++",
    category: "Language" as const,
    level: 85,
    description:
      "Data Structures & Algorithms, competitive programming, and performance-oriented programming."
  },
  {
    name: "React",
    category: "Framework" as const,
    level: 95,
    description:
      "Building responsive, modern user interfaces with React, Vite, React Router, and reusable component architectures."
  },
  {
    name: "FastAPI",
    category: "Framework" as const,
    level: 95,
    description:
      "Developing high-performance REST APIs with JWT authentication, async processing, dependency injection, and OpenAPI documentation."
  },
  {
    name: "Node.js & Express",
    category: "Framework" as const,
    level: 95,
    description:
      "Developing REST APIs, authentication systems, and backend services using the JavaScript ecosystem."
  },
  {
    name: "TensorFlow & PyTorch",
    category: "Framework" as const,
    level: 80,
    description:
      "Building machine learning models, experimenting with deep learning architectures, and AI pipelines."
  },
  {
    name: "Docker",
    category: "Infrastructure" as const,
    level: 85,
    description:
      "Containerizing applications and orchestrating development environments for scalable deployments."
  },
  {
    name: "PostgreSQL, Redis & MongoDB",
    category: "Infrastructure" as const,
    level: 90,
    description:
      "Designing relational and NoSQL databases, caching strategies, and high-performance data storage."
  },
  {
    name: "Celery & Distributed Systems",
    category: "Protocol" as const,
    level: 90,
    description:
      "Building asynchronous task queues, background workers, and distributed processing pipelines."
  },
  {
    name: "OpenAI, RAG & Vector Search",
    category: "Protocol" as const,
    level: 90,
    description:
      "Developing AI-powered applications using embeddings, pgvector, semantic search, and Retrieval-Augmented Generation."
  }
];

// Generate SkillNodes on a Fibonacci Sphere to create a perfect spherical 3D constellation
export const getSkillConstellation = (): SkillNode[] => {
  const count = SKILLS_RAW.length;
  const colors = {
    Language: "#ffffff",       // Pure White
    Framework: "#e5e5e5",      // Platinum Silver
    Infrastructure: "#a3a3a3", // Cool Gray
    Protocol: "#737373"        // Deep Slate
  };

  return SKILLS_RAW.map((skill, index) => {
    // Golden ratio spherical coordinates
    const phi = Math.acos(-1 + (2 * index) / count);
    const theta = Math.sqrt(count * Math.PI) * phi;

    return {
      id: `skill-${index}`,
      name: skill.name,
      category: skill.category,
      level: skill.level,
      description: skill.description,
      x: Math.sin(phi) * Math.cos(theta),
      y: Math.sin(phi) * Math.sin(theta),
      z: Math.cos(phi),
      color: colors[skill.category]
    };
  });
};

