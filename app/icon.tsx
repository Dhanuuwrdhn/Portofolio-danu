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
          background: "linear-gradient(145deg, #34d399 0%, #059669 100%)",
          color: "#06281d",
          fontSize: 108,
          fontWeight: 800,
          letterSpacing: -6,
          fontFamily: "monospace",
        }}
      >
        SD
      </div>
    ),
    { ...size }
  );
}
