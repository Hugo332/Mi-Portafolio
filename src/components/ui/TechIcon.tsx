import type { IconType } from "react-icons";
import {
  SiTypescript,
  SiJavascript,
  SiPhp,
  SiDart,
  SiLaravel,
  SiAngular,
  SiFlutter,
  SiBootstrap,
  SiMysql,
  SiPostgresql,
  SiGit,
  SiFigma,
  SiPostman,
  SiScrumalliance,
} from "react-icons/si";
import { TbApi, TbDatabase } from "react-icons/tb";
import { GoLightBulb } from "react-icons/go";

type IconSpec = { Icon: IconType; color: string };

const REGISTRY: Record<string, IconSpec> = {
  // Lenguajes
  TypeScript: { Icon: SiTypescript, color: "#3178C6" },
  JavaScript: { Icon: SiJavascript, color: "#F7DF1E" },
  PHP: { Icon: SiPhp, color: "#777BB4" },
  Dart: { Icon: SiDart, color: "#0175C2" },
  SQL: { Icon: TbDatabase, color: "#38BDF8" },

  // Frameworks
  Laravel: { Icon: SiLaravel, color: "#FF2D20" },
  Angular: { Icon: SiAngular, color: "#DD0031" },
  Flutter: { Icon: SiFlutter, color: "#02569B" },
  Bootstrap: { Icon: SiBootstrap, color: "#7952B3" },

  // Bases de datos
  MySQL: { Icon: SiMysql, color: "#4479A1" },
  PostgreSQL: { Icon: SiPostgresql, color: "#4169E1" },

  // Herramientas
  Git: { Icon: SiGit, color: "#F05032" },
  Figma: { Icon: SiFigma, color: "#F24E1E" },
  Postman: { Icon: SiPostman, color: "#FF6C37" },

  // Otros
  "APIs REST": { Icon: TbApi, color: "#22D3EE" },
  SCRUM: { Icon: SiScrumalliance, color: "#009FDA" },
  "Principios SOLID": { Icon: GoLightBulb, color: "#FACC15" },
};

type Props = {
  name: string;
  size?: number;
  className?: string;
};

export function TechIcon({ name, size = 20, className = "" }: Props) {
  const spec = REGISTRY[name];
  if (!spec) {
    return (
      <span
        className={`inline-grid h-6 w-6 place-items-center rounded-md bg-white/10 text-[10px] font-bold text-ink ${className}`}
        aria-hidden
      >
        {name.slice(0, 2).toUpperCase()}
      </span>
    );
  }
  const { Icon, color } = spec;
  return (
    <Icon
      size={size}
      color={color}
      className={className}
      aria-hidden
      title={name}
    />
  );
}
