import { ImageResponse } from "next/og";

export const size = { width: 256, height: 256 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#10B981",
          color: "#0a0e14",
          fontSize: 180,
          fontWeight: 800,
          fontFamily: "monospace",
        }}
      >
        D
      </div>
    ),
    { ...size }
  );
}
