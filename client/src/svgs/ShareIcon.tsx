import React from "react";

export default function ShareIcon({ width = 20, height = 20, style = {} }: { width?: number; height?: number; style?: React.CSSProperties }) {
  return (
    <svg
      width={width}
      height={height}
      fill="none"
      stroke="#2761da"
      strokeWidth={2}
      viewBox="0 0 24 24"
      style={{
        display: "block",
        border: "2px solid white",
        borderRadius: "50%",
        boxSizing: "border-box",
        background: "transparent",
        ...style,
      }}
    >
      <circle cx="6" cy="12" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="18" cy="18" r="2" />
      <path d="M8.59 13.51l6.83 3.98" />
      <path d="M15.41 6.51l-6.82 3.98" />
    </svg>
  );
}