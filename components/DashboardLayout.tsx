'use client'

import { useState } from "react"
import Sidebar from "./Sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="flex min-h-screen bg-slate-50 relative overflow-x-hidden">
      {/* SIDEBAR WRAPPER */}
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed top-0 left-0 h-full z-50 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]
          ${isHovered ? "w-[280px]" : "w-[88px]"} 
        `}
      >
        <Sidebar isExpanded={isHovered} />
      </div>

      {/* MAIN CONTENT */}
      <main 
        className={`flex-1 min-h-screen transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] p-8
          ${isHovered ? "ml-[280px]" : "ml-[88px]"}
        `}
      >
        {children}
      </main>
    </div>
  )
}