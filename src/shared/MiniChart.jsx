import React from "react";

export default function MiniChart() {
  return (
    <svg
      width="100%"
      height="100"
      viewBox="0 0 100 30"
      preserveAspectRatio="none"
    >
      <polyline
        fill="none"
        stroke="white"
        strokeWidth="2"
        points="0,20 20,10 40,12 60,6 80,10 100,8"
      />
    </svg>
  );
}
