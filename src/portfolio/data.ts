import socialProject from "@/assets/project-social.png.asset.json";
import quranProject from "@/assets/project-quran.png.asset.json";
import trelloProject from "@/assets/project-trello.png.asset.json";
import portfolioProject from "@/assets/project-portfolio.png.asset.json";
import chatProject from "@/assets/project-chatApp.png.asset.json";
import appreciationCertificate from "@/assets/certificate-appr2.png.asset.json";
import professionalCertificate from "@/assets/certificate-tempo.png.asset.json";
import huaweiCertificate from "@/assets/certificate-huawe.png.asset.json";
import ciscoCertificate from "@/assets/certificate-cisco.png.asset.json";
import developmentCertificate from "@/assets/certificate-bago.png.asset.json";
import technicalCertificate from "@/assets/certificate-mosq2.png.asset.json";
import oracleCertificate from "@/assets/certificate-orac.png.asset.json";

export type Project = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
};

export const projects: Project[] = [
  {
    id: 1,
    title: "ProShop",
    subtitle: "E-commerce Platform",
    description:
      "A full-featured e-commerce platform with product listings, cart management, and secure checkout.",
    image: socialProject.url,
    technologies: ["React.js", "MongoDB", "Node.js", "Express.js", "CSS"],
    githubUrl: "https://github.com/ezadin2/proshop-demo",
  },
  {
    id: 2,
    title: "ሀሴት Delivery",
    subtitle: "Delivery Management Platform",
    description:
      "An Ethiopian delivery platform with customer booking, real-time tracking, admin analytics, and a driver operations interface.",
    image: quranProject.url,
    technologies: ["React.js", "TypeScript", "Node.js", "Tailwind CSS", "Express.js"],
    liveUrl: "https://hasset-delivery-front-end-side.onrender.com/",
    githubUrl: "https://github.com/ezadin2/Hasset_Delivery_Front-End_Side",
  },
  {
    id: 3,
    title: "Dina Mart",
    subtitle: "Complete E-commerce System",
    description:
      "A secure cross-platform shopping experience with verified Firebase authentication, product browsing, cart management, orders, and user accounts.",
    image: "/projects-imgs/notes.png",
    technologies: ["Flutter", "Firebase", "Node.js", "MongoDB"],
    liveUrl: "https://adminpanel-bx43q6fid-ezadin-badrus-projects.vercel.app/",
  },
  {
    id: 4,
    title: "Privacy Checker",
    subtitle: "Data Privacy Compliance",
    description:
      "A Streamlit tool built at INSA Summer Camp for PII scanning, anonymization, NLP entity detection, and automated compliance scoring.",
    image: trelloProject.url,
    technologies: ["Python", "Streamlit", "NLP", "Pandas"],
    githubUrl: "https://github.com/ezadin2",
  },
  {
    id: 5,
    title: "Audio Application",
    subtitle: "Cross-platform Audio Experience",
    description:
      "An audio-based mobile application showcasing sound features, modern UI, and responsive state management.",
    image: portfolioProject.url,
    technologies: ["Flutter", "Firebase", "Dart", "State Management"],
    githubUrl: "https://github.com/ezadin2/Audio-player",
  },
  {
    id: 6,
    title: "Chat Application",
    subtitle: "Real-time Messaging",
    description:
      "A real-time chat application with a modern interface, user messaging, and a responsive design.",
    image: chatProject.url,
    technologies: ["Next.js", "Node.js", "Socket.io", "Tailwind CSS"],
    liveUrl: "https://nextjs-setup-gilt.vercel.app/",
    githubUrl: "https://github.com/ezadin2/nextjs-setup",
  },
];

export type Certificate = {
  id: number;
  title: string;
  image: string;
  link: string;
};

export const certificates: Certificate[] = [
  {
    id: 1,
    title: "Certificate of Appreciation",
    image: appreciationCertificate.url,
    link: appreciationCertificate.url,
  },
  {
    id: 2,
    title: "Academic Achievement",
    image: "/imgs/appre1.png",
    link: "/imgs/appre1.png",
  },
  {
    id: 3,
    title: "Professional Certificate",
    image: professionalCertificate.url,
    link: professionalCertificate.url,
  },
  {
    id: 4,
    title: "Huawei Certificate",
    image: huaweiCertificate.url,
    link: huaweiCertificate.url,
  },
  {
    id: 5,
    title: "Cisco Certificate",
    image: ciscoCertificate.url,
    link: ciscoCertificate.url,
  },
  {
    id: 6,
    title: "Development Certificate",
    image: developmentCertificate.url,
    link: developmentCertificate.url,
  },
  {
    id: 7,
    title: "Technical Certificate",
    image: technicalCertificate.url,
    link: technicalCertificate.url,
  },
  {
    id: 8,
    title: "Oracle Certificate",
    image: oracleCertificate.url,
    link: oracleCertificate.url,
  },
];

export const resumeUrl = "/imports/Ezadin_Badiru_Resume.pdf";
