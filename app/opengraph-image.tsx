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
          justifyContent: "space-between",
          background: "#0A0E14",
          backgroundImage:
            "radial-gradient(circle at 12% 8%, rgba(16,185,129,0.18), transparent 42%), radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 30px 30px",
          fontFamily: "monospace",
          padding: 76,
        }}
      >
        {/* top: brand mark + prompt */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 96,
              height: 96,
              borderRadius: 26,
              background: "linear-gradient(145deg, #34d399 0%, #059669 100%)",
              color: "#06281d",
              fontSize: 44,
              fontWeight: 800,
              letterSpacing: -2,
              boxShadow: "0 16px 40px rgba(16,185,129,0.35)",
            }}
          >
            SD
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 26 }}>
            <span style={{ color: "#FFA23E" }}>visitor@Danu.me:~$</span>
            <span style={{ color: "#64748b", marginLeft: 14 }}>whois</span>
          </div>
        </div>

        {/* middle: name + role */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: "#ffffff",
              fontSize: 92,
              fontWeight: 700,
              letterSpacing: -2,
            }}
          >
            Syahrial Danu
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 16,
              fontSize: 32,
            }}
          >
            <div style={{ display: "flex", width: 40, height: 3, background: "#10B981", marginRight: 18 }} />
            <span style={{ color: "#cbd5e1" }}>Software Engineer</span>
          </div>
        </div>

        {/* footer: domain + socials */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", width: "100%", height: 1, background: "#1e293b", marginBottom: 26 }} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", color: "#10B981", fontSize: 28 }}>
              <span style={{ color: "#475569", marginRight: 12 }}>~$</span>
              syahrialdanu.my.id
            </div>
            <div style={{ display: "flex", alignItems: "center", color: "#94a3b8", fontSize: 22 }}>
              <span>in/dhanuwardhana</span>
              <span style={{ margin: "0 14px", color: "#475569" }}>·</span>
              <span>github.com/Dhanuuwrdhn</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
