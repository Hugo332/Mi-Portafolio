import { ImageResponse } from "next/og";
import { personal } from "@/lib/data";

export const runtime = "edge";
export const alt = "Hugo Alexander Lima Bastidas — Portafolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(59,130,246,0.35), transparent 60%), radial-gradient(40% 30% at 80% 30%, rgba(201,168,76,0.20), transparent 60%), #0a0a0a",
          color: "#f5f5f5",
          fontFamily: "system-ui",
        }}
      >
        <div
          style={{
            fontSize: 24,
            color: "#3b82f6",
            letterSpacing: 6,
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Portafolio
        </div>
        <div
          style={{
            fontSize: 84,
            fontWeight: 800,
            lineHeight: 1.05,
            marginTop: 24,
            letterSpacing: -2,
          }}
        >
          {personal.name}
        </div>
        <div
          style={{
            fontSize: 36,
            color: "#3b82f6",
            marginTop: 24,
            fontWeight: 500,
          }}
        >
          {personal.role.es}
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 48,
            fontSize: 20,
            color: "#a1a1aa",
          }}
        >
          <span>Next.js</span>
          <span>·</span>
          <span>Laravel</span>
          <span>·</span>
          <span>Angular</span>
          <span>·</span>
          <span>AWS</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
