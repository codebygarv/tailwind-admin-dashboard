import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Sidebar />
      {/* Push content to the right by the sidebar width */}
      <div className="ml-60 flex flex-col min-h-screen">
        <Navbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
