import { ImageResponse } from "next/og";
import { LOGO_PATHS } from "@/components/brand/Logo";

export const size = { width: 256, height: 256 };
export const contentType = "image/png";

// App icon: the monogram on a zinc tile, as drawn in the logo board (48px grid, 11px radius)
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
          background: "#18181B",
          borderRadius: 59,
        }}
      >
        <svg width="171" height="122" viewBox="0 0 28 20">
          <rect {...LOGO_PATHS.bar} fill="#FFFFFF" />
          <path d={LOGO_PATHS.chevron} fill="#FFFFFF" />
          <rect {...LOGO_PATHS.underscore} fill="#10B981" />
          <path d={LOGO_PATHS.d} fill="#FFFFFF" fillRule="evenodd" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
