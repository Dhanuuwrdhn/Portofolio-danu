import { ImageResponse } from "next/og";

export const alt = "Syahrial Danu — Software Engineer";
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
          background: "linear-gradient(135deg, #0a0e14 0%, #131821 100%)",
          fontFamily: "monospace",
          padding: 60,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            borderRadius: 24,
            border: "1px solid #1f2937",
            background: "#0d1117",
            boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
            padding: 56,
          }}
        >
          {/* window dots */}
          <div style={{ display: "flex", gap: 12, marginBottom: 40 }}>
            <div style={{ width: 16, height: 16, borderRadius: 16, background: "#FF6059" }} />
            <div style={{ width: 16, height: 16, borderRadius: 16, background: "#FFBE2F" }} />
            <div style={{ width: 16, height: 16, borderRadius: 16, background: "#29CE42" }} />
          </div>

          {/* prompt */}
          <div style={{ display: "flex", fontSize: 30, marginBottom: 28 }}>
            <span style={{ color: "#FFA23E" }}>visitor@Danu.me:~$</span>
            <span style={{ color: "#e2e8f0", marginLeft: 16 }}>whois</span>
          </div>

          {/* name */}
          <div style={{ display: "flex", color: "#ffffff", fontSize: 84, fontWeight: 700, marginBottom: 16 }}>
            Syahrial Danu
          </div>

          {/* role */}
          <div style={{ display: "flex", color: "#94a3b8", fontSize: 34, marginBottom: 28 }}>
            Software Engineer · Fullstack & AI
          </div>

          {/* tech */}
          <div style={{ display: "flex", color: "#10B981", fontSize: 26 }}>
            Next.js · Flutter · NestJS · React Native · AI
          </div>

          {/* footer domain */}
          <div
            style={{
              display: "flex",
              marginTop: 44,
              paddingTop: 28,
              borderTop: "1px solid #1f2937",
              color: "#10B981",
              fontSize: 30,
            }}
          >
            syahrialdanu.my.id
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
