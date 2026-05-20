export type Locale = "es" | "en";

export type Bi<T = string> = { es: T; en: T };

export const t = <T,>(value: Bi<T>, locale: Locale): T => value[locale];

export type NavLink = { id: string; label: Bi };

export type Experience = {
  role: Bi;
  company: string;
  location?: string;
  period: Bi;
  duration: Bi;
  bullets: Bi<string[]>;
  stack: string[];
  logo?: string;
  /** When the logo has a transparent or white background, wrap it in a
   *  dark padded container for contrast on the dark theme. */
  logoNeedsBackdrop?: boolean;
};

export type Skill = { name: string; level: number; group: Bi };

export type EducationItem = {
  degree: Bi;
  school: string;
  period: Bi;
  status: Bi<"Graduado" | "Completado" | "En curso" | "Graduated" | "Completed" | "In progress">;
  image?: string;
};

export type CertIssuer = "aws" | "uide" | "istdab" | "self";

export type Certification = {
  title: string;
  issuer: string;
  issuerKey: CertIssuer;
  date: Bi;
  hours?: string;
  image?: string;
};

export type Language = { name: Bi; level: Bi };

export type Training = Bi;

export type Talk = {
  title: Bi;
  topic: Bi;
};

export const assets = {
  photo: "/photo.jpg", // optional — falls back to initials if missing
  cv: "/cv-hugo-lima.pdf", // place file in /public to enable download
};

export const personal = {
  name: "Hugo Alexander Lima Bastidas",
  role: {
    es: "Desarrollador Front-End / Ingeniero en TI",
    en: "Front-End Developer / IT Engineer",
  } as Bi,
  tagline: {
    es: "Construyo experiencias web modernas, rápidas y escalables con Next.js, Angular y Laravel.",
    en: "I build modern, fast and scalable web experiences with Next.js, Angular and Laravel.",
  } as Bi,
  email: "hugoalejandro693@gmail.com",
  phone: "(+593) 099-419-7439",
  location: { es: "Ecuador", en: "Ecuador" } as Bi,
  linkedin:
    "https://www.linkedin.com/in/hugo-alexander-lima-bastidas-15a469362/",
};

export const about: Bi = {
  es: "Ingeniero en Tecnologías de la Información con sólida experiencia en desarrollo de aplicaciones web full-stack utilizando Laravel, Angular y bases de datos relacionales. Especializado en la implementación de soluciones tecnológicas escalables, consumo de APIs REST y metodologías ágiles (SCRUM). Competente en arquitectura de software aplicando principios SOLID y patrones de diseño. Actualmente ampliando competencias en análisis de datos masivos (Big Data).",
  en: "IT Engineer with solid experience in full-stack web application development using Laravel, Angular and relational databases. Specialized in implementing scalable technology solutions, REST API consumption and agile methodologies (SCRUM). Skilled in software architecture applying SOLID principles and design patterns. Currently expanding expertise in big data analytics.",
};

export const navLinks: NavLink[] = [
  { id: "inicio", label: { es: "Inicio", en: "Home" } },
  { id: "sobre-mi", label: { es: "Sobre mí", en: "About" } },
  { id: "experiencia", label: { es: "Experiencia", en: "Experience" } },
  { id: "habilidades", label: { es: "Habilidades", en: "Skills" } },
  { id: "educacion", label: { es: "Educación", en: "Education" } },
  { id: "certificaciones", label: { es: "Certificaciones", en: "Certifications" } },
  { id: "contacto", label: { es: "Contacto", en: "Contact" } },
];

export const experiences: Experience[] = [
  {
    role: { es: "Desarrollador Full-Stack", en: "Full-Stack Developer" },
    company: "Centro de Especialidades Médicas Reina de El Cisne",
    period: { es: "Feb 2025 — May 2025", en: "Feb 2025 — May 2025" },
    duration: { es: "4 meses", en: "4 months" },
    bullets: {
      es: [
        "Diseño y desarrollo completo de sistema para registro de pacientes, historial clínico y control de citas.",
        "Implementación de base de datos relacional con MySQL.",
        "Desarrollo de interfaz de usuario.",
        "Gestión completa del ciclo de vida del proyecto.",
      ],
      en: [
        "End-to-end design and development of a system for patient registration, clinical history and appointment control.",
        "Relational database implementation with MySQL.",
        "User interface development.",
        "Full project lifecycle management.",
      ],
    },
    stack: ["Laravel", "MySQL", "Bootstrap", "JavaScript"],
    logo: "/experiencia/reina-cisne.png",
    logoNeedsBackdrop: true,
  },
  {
    role: { es: "Desarrollador Front-End", en: "Front-End Developer" },
    company: "Empresa POOL",
    location: "Quito, Ecuador",
    period: { es: "Nov 2023 — May 2024", en: "Nov 2023 — May 2024" },
    duration: { es: "7 meses", en: "7 months" },
    bullets: {
      es: [
        "Desarrollo de Front-end en aplicación móvil con Flutter.",
        "Implementación de componentes responsivos y optimizados para múltiples dispositivos.",
      ],
      en: [
        "Front-end development of a mobile application using Flutter.",
        "Implementation of responsive components optimized for multiple devices.",
      ],
    },
    stack: ["Flutter", "Dart"],
    logo: "/experiencia/POOL-LOGO.png",
    logoNeedsBackdrop: false,
  },
];

const groupL = (es: string, en: string): Bi => ({ es, en });

export const skills: Skill[] = [
  { name: "TypeScript", level: 85, group: groupL("Lenguajes", "Languages") },
  { name: "JavaScript", level: 90, group: groupL("Lenguajes", "Languages") },
  { name: "PHP", level: 85, group: groupL("Lenguajes", "Languages") },
  { name: "SQL", level: 85, group: groupL("Lenguajes", "Languages") },
  { name: "Laravel", level: 85, group: groupL("Frameworks", "Frameworks") },
  { name: "Angular", level: 80, group: groupL("Frameworks", "Frameworks") },
  { name: "Flutter", level: 70, group: groupL("Frameworks", "Frameworks") },
  { name: "Bootstrap", level: 85, group: groupL("Frameworks", "Frameworks") },
  { name: "MySQL", level: 85, group: groupL("Bases de datos", "Databases") },
  { name: "PostgreSQL", level: 75, group: groupL("Bases de datos", "Databases") },
  { name: "Git", level: 85, group: groupL("Herramientas", "Tools") },
  { name: "Figma", level: 75, group: groupL("Herramientas", "Tools") },
  { name: "Postman", level: 85, group: groupL("Herramientas", "Tools") },
  { name: "APIs REST", level: 90, group: groupL("Otros", "Other") },
  { name: "SCRUM", level: 85, group: groupL("Otros", "Other") },
  { name: "Principios SOLID", level: 80, group: groupL("Otros", "Other") },
];

export const education: EducationItem[] = [
  {
    degree: {
      es: "Ingeniero en Tecnologías de la Información",
      en: "Information Technology Engineer",
    },
    school: "Universidad Internacional del Ecuador (UIDE)",
    period: { es: "2021 — 2025", en: "2021 — 2025" },
    status: { es: "Graduado", en: "Graduated" },
    image: "/certificates/titles/titulo-uide.png",
  },
  {
    degree: {
      es: "Tecnólogo en Análisis de Sistemas",
      en: "Systems Analysis Technologist",
    },
    school: "Instituto Superior Tecnológico “Daniel Álvarez Burneo” (ISTDAB)",
    period: { es: "Feb 2018 — Feb 2021", en: "Feb 2018 — Feb 2021" },
    status: { es: "Graduado", en: "Graduated" },
    image: "/certificates/titles/titulo-istdab.png",
  },
  {
    degree: {
      es: "Máster en Análisis de Datos Masivos (Big Data)",
      en: "Master's in Big Data Analytics",
    },
    school: "Universidad Europea",
    period: { es: "Nov 2025 — Ago 2026", en: "Nov 2025 — Aug 2026" },
    status: { es: "En curso", en: "In progress" },
  },
];

export const certifications: Certification[] = [
  {
    title: "AWS Job Roles in the Cloud",
    issuer: "Amazon Web Services",
    issuerKey: "aws",
    date: { es: "18 Julio 2025", en: "July 18, 2025" },
    image: "/certificates/aws/aws-job-roles.png",
  },
  {
    title: "AWS Cloud Practitioner Essentials",
    issuer: "Amazon Web Services",
    issuerKey: "aws",
    date: { es: "29 Agosto 2025", en: "August 29, 2025" },
    image: "/certificates/aws/aws-cloud-practitioner.png",
  },
  {
    title: "Getting Started with Cloud Acquisition",
    issuer: "Amazon Web Services",
    issuerKey: "aws",
    date: { es: "2 Septiembre 2025", en: "September 2, 2025" },
    image: "/certificates/aws/aws-cloud-acquisition.png",
  },
  {
    title: "AWS Billing and Cost Management",
    issuer: "Amazon Web Services",
    issuerKey: "aws",
    date: { es: "2 Septiembre 2025", en: "September 2, 2025" },
    image: "/certificates/aws/aws-billing.png",
  },
  {
    title: "AWS Foundations: Getting Started with the AWS Cloud Essentials",
    issuer: "Amazon Web Services",
    issuerKey: "aws",
    date: { es: "3 Septiembre 2025", en: "September 3, 2025" },
    image: "/certificates/aws/aws-foundations.png",
  },
  {
    title: "Programa de Entrenamiento Programador Semi Junior",
    issuer: "Universidad Internacional del Ecuador (UIDE)",
    issuerKey: "uide",
    date: { es: "Oct 2022 — Feb 2023", en: "Oct 2022 — Feb 2023" },
    image: "/certificates/courses/programador-junior.png",
  },
  {
    title: "Programación .NET y Manejo de Base de Datos con MySQL",
    issuer: "Instituto Superior Tecnológico Daniel Álvarez Burneo (ISTDAB)",
    issuerKey: "istdab",
    date: { es: "Agosto 2019", en: "August 2019" },
    hours: "32h",
    image: "/certificates/courses/programacion-net.png",
  },
  {
    title: "Seminario Taller de Ética Social y Profesional",
    issuer: "Instituto Superior Tecnológico Daniel Álvarez Burneo (ISTDAB)",
    issuerKey: "istdab",
    date: { es: "Marzo 2019", en: "March 2019" },
    hours: "32h",
    image: "/certificates/courses/etica-social.png",
  },
  {
    title: "Certificación: Tecnología en Análisis de Sistemas",
    issuer: "Instituto Superior Tecnológico Daniel Álvarez Burneo (ISTDAB)",
    issuerKey: "istdab",
    date: { es: "Agosto 2021", en: "August 2021" },
    image: "/certificates/courses/curso-analisis-sitema.png",
  },
  {
    title: "Curso de Animaciones Web con GSAP",
    issuer: "Formación autodidacta",
    issuerKey: "self",
    date: { es: "2025", en: "2025" },
    image: "/certificates/courses/curso-gsap.png",
  },
  {
    title: "Curso de HTML desde Cero",
    issuer: "Formación autodidacta",
    issuerKey: "self",
    date: { es: "Mayo 2026", en: "May 2026" },
    image: "/certificates/courses/curso-html.png",
  },
];

export const trainings: Training[] = [];

export const talks: Talk[] = [
  {
    title: {
      es: "Ponente invitado — I Congreso Internacional de Divulgación y Fomento de la Investigación Científica Tecnológica (ISTDAB)",
      en: "Invited Speaker — I International Congress of Scientific & Technological Research Outreach (ISTDAB)",
    },
    topic: {
      es: "Aplicación de la Economía Circular en el Área Tecnológica",
      en: "Applying the Circular Economy in the Technology Sector",
    },
  },
];

export const languages: Language[] = [
  { name: { es: "Español", en: "Spanish" }, level: { es: "Nativo", en: "Native" } },
  { name: { es: "Inglés", en: "English" }, level: { es: "Avanzado", en: "Advanced" } },
];

// UI strings used across the app
export const ui = {
  cta: {
    viewCv: { es: "Ver CV", en: "View CV" },
    contact: { es: "Contacto", en: "Contact" },
    letsTalk: { es: "Hablemos", en: "Let's talk" },
    send: { es: "Enviar mensaje", en: "Send message" },
    sending: { es: "Enviando...", en: "Sending..." },
    sent: { es: "¡Mensaje enviado! Te respondo pronto.", en: "Message sent! I'll reply soon." },
    fallbackOpened: { es: "Se abrió tu cliente de correo — ¡gracias!", en: "Your email client opened — thanks!" },
    error: { es: "Hubo un problema. Probá de nuevo o escribime por email.", en: "Something went wrong. Try again or email me directly." },
  },
  hero: {
    eyebrow: { es: "Portafolio profesional", en: "Professional portfolio" },
  },
  about: {
    eyebrow: { es: "Sobre mí", en: "About me" },
    title: { es: "Ingeniero en TI con foco full-stack y experiencia en producto.", en: "IT Engineer focused on full-stack and product experience." },
    location: { es: "Ubicación", en: "Location" },
    email: { es: "Email", en: "Email" },
    phone: { es: "Teléfono", en: "Phone" },
    linkedin: { es: "LinkedIn", en: "LinkedIn" },
    viewProfile: { es: "Ver perfil", en: "View profile" },
  },
  experience: {
    eyebrow: { es: "Trayectoria", en: "Journey" },
    title: { es: "Experiencia profesional", en: "Professional experience" },
    subtitle: { es: "Proyectos donde he aportado al frontend, al backend y al ciclo completo de desarrollo.", en: "Projects where I've contributed to frontend, backend and the full development lifecycle." },
  },
  skills: {
    eyebrow: { es: "Stack", en: "Stack" },
    title: { es: "Habilidades técnicas", en: "Technical skills" },
    subtitle: { es: "Tecnologías y metodologías que utilizo a diario para diseñar y construir productos web.", en: "Technologies and methodologies I use daily to design and build web products." },
  },
  education: {
    eyebrow: { es: "Formación", en: "Education" },
    title: { es: "Educación", en: "Education" },
    subtitle: { es: "Mi recorrido académico — desde el análisis de sistemas hasta el análisis de datos masivos.", en: "My academic journey — from systems analysis to big data analytics." },
  },
  certifications: {
    eyebrow: { es: "Acreditaciones", en: "Credentials" },
    title: { es: "Certificaciones", en: "Certifications" },
    subtitle: {
      es: "Formación continua en cloud computing con AWS, programación con UIDE y capacitaciones técnicas con ISTDAB.",
      en: "Continuous learning: cloud computing with AWS, programming with UIDE and technical training with ISTDAB.",
    },
  },
  extras: {
    eyebrow: { es: "Más", en: "More" },
    title: { es: "Idiomas y ponencias", en: "Languages & talks" },
    languages: { es: "Idiomas", en: "Languages" },
    trainings: { es: "Capacitaciones", en: "Training" },
    talks: { es: "Ponencias", en: "Talks" },
  },
  modal: {
    close: { es: "Cerrar", en: "Close" },
    viewCert: { es: "Ver certificado", en: "View certificate" },
    viewDiploma: { es: "Ver Título", en: "View Diploma" },
    openTab: { es: "Abrir en nueva pestaña", en: "Open in new tab" },
    pending: {
      es: "Certificado disponible próximamente",
      en: "Certificate coming soon",
    },
  },
  contact: {
    eyebrow: { es: "Contacto", en: "Contact" },
    title: { es: "¿Conversamos?", en: "Let's talk?" },
    subtitle: { es: "Cuéntame sobre tu proyecto o idea — respondo en menos de 24 horas.", en: "Tell me about your project or idea — I reply within 24 hours." },
    name: { es: "Nombre", en: "Name" },
    namePh: { es: "Tu nombre", en: "Your name" },
    emailPh: { es: "tu@correo.com", en: "you@email.com" },
    message: { es: "Mensaje", en: "Message" },
    messagePh: { es: "Cuéntame sobre tu proyecto...", en: "Tell me about your project..." },
    footerRights: { es: "Todos los derechos reservados.", en: "All rights reserved." },
    builtWith: { es: "Construido con Next.js, TypeScript y GSAP.", en: "Built with Next.js, TypeScript and GSAP." },
  },
};
