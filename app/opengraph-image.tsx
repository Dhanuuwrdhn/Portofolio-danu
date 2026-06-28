import { ImageResponse } from "next/og";

export const alt = "Syahrial Danu";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background:
            "radial-gradient(circle at 50% 35%, #16241f 0%, #0a0e14 60%)",
          fontFamily: "monospace",
        }}
      >
        {/* brand mark */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 140,
            height: 140,
            borderRadius: 36,
            background: "#10B981",
            color: "#0a0e14",
            fontSize: 96,
            fontWeight: 800,
            marginBottom: 44,
            boxShadow: "0 20px 60px rgba(16,185,129,0.35)",
          }}
        >
          D
        </div>

        {/* name */}
        <div
          style={{
            display: "flex",
            color: "#ffffff",
            fontSize: 86,
            fontWeight: 700,
            letterSpacing: -1,
          }}
        >
          Syahrial Danu
        </div>

        {/* tagline */}
        <div style={{ display: "flex", color: "#94a3b8", fontSize: 32, marginTop: 14 }}>
          Software Engineer
        </div>

        {/* domain */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 56,
            color: "#10B981",
            fontSize: 28,
          }}
        >
          <span style={{ marginRight: 12, color: "#475569" }}>~$</span>
          syahrialdanu.my.id
        </div>
      </div>
    ),
    { ...size }
  );
}
