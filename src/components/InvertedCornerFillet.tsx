// Da login.ticly.it/src/app/dashboard/page.tsx
export function InvertedCornerFillet({
  position = "bottom-right",
  size = 12,
  color = "rgba(255, 255, 255, 0.06)",
  className,
}: {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  size?: number;
  color?: string;
  className?: string;
}) {
  let path = "";
  if (position === "bottom-right") {
    path = `M0,0 L0,${size} A${size},${size} 0 0,0 ${size},0 Z`;
  } else if (position === "bottom-left") {
    path = `M${size},0 L${size},${size} A${size},${size} 0 0,1 0,0 Z`;
  } else if (position === "top-right") {
    path = `M0,${size} L0,0 A${size},${size} 0 0,1 ${size},${size} Z`;
  } else {
    path = `M${size},${size} L${size},0 A${size},${size} 0 0,0 0,${size} Z`;
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={{ display: "block", flexShrink: 0, pointerEvents: "none" }}
    >
      <path d={path} fill={color} />
    </svg>
  );
}
