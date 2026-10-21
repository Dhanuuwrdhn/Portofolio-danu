// "Sigma prompt" monogram: the S doubles as a ">" prompt, the D closes the pair.
// The top bar is drawn separately so it can lift away and leave ">_" during the mode switch.

export const LOGO_PATHS = {
  bar: { x: 0, y: 0, width: 12, height: 4 },
  chevron: "M0 4 H5.66 L11.66 10 L5.66 16 H0 L6 10 Z",
  underscore: { x: 0, y: 16, width: 12, height: 4 },
  d: "M15 0 H22 L28 6 V14 L22 20 H15 Z M19 4 V16 H20.3 L24 12.3 V7.7 L20.3 4 Z",
};

interface LogoMarkProps {
  color?: string;
  accent?: string;
  lifted?: boolean;
  className?: string;
  title?: string;
}

export function LogoMark({
  color = "#18181B",
  accent = "#10B981",
  lifted = false,
  className,
  title,
}: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 28 20"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      style={{ overflow: "visible" }}
    >
      <rect
        {...LOGO_PATHS.bar}
        fill={color}
        style={{
          transform: lifted ? "translateY(-6px)" : "none",
          opacity: lifted ? 0 : 1,
          transition: "transform 180ms cubic-bezier(.3,1.6,.5,1), opacity 160ms ease",
        }}
      />
      <path fill={color} d={LOGO_PATHS.chevron} />
      <rect {...LOGO_PATHS.underscore} fill={accent} />
      <path fill={color} fillRule="evenodd" d={LOGO_PATHS.d} />
    </svg>
  );
}
