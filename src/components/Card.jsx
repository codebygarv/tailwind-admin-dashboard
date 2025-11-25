import React from "react";

export default function Card({ children, className = "" }) {
  return (
    <div
      className={`p-4 rounded-2xl bg-white/5 backdrop-blur-sm shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
