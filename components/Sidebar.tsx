'use client'

import Link from "next/link"
import Image from "next/image" // Import Image
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, BookOpen, PenTool, Library, 
  TrendingUp, LogOut, Menu
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export default function Sidebar({ isExpanded }: { isExpanded: boolean }) {
  const pathname = usePathname()
  const router = useRouter()

  const menuItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Bank Soal", href: "/bank-soal", icon: BookOpen },
    { name: "Tryout UTBK", href: "/tryout", icon: PenTool },
    { name: "Materi Belajar", href: "/materi", icon: Library },
    { name: "Tracking Progress", href: "/progress", icon: TrendingUp },
    { name: "Profil Saya", href: "/profile", icon: Menu },
  ]

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="h-full w-full bg-[#0F172A] text-slate-300 flex flex-col border-r border-slate-800/50 shadow-2xl">
      
      {/* HEADER LOGO */}
      <div className={`h-24 flex items-center px-6 transition-all duration-500 ${isExpanded ? "justify-start gap-4" : "justify-center"}`}>
        
        {/* LOGO IMAGE (GARUDA) */}
        <div className="relative h-10 w-10 flex-shrink-0">
           <Image 
             src="/garuda.png" 
             alt="Logo Garuda" 
             fill 
             className="object-contain"
             priority
           />
        </div>
        
        {/* Logo Text (Animated) */}
        <div className={`flex flex-col overflow-hidden whitespace-nowrap transition-all duration-500 ease-out
          ${isExpanded ? "opacity-100 max-w-[200px] translate-x-0 ml-1" : "opacity-0 max-w-0 -translate-x-5"}
        `}>
           <h1 className="font-bold text-lg text-white tracking-tight">UTBK Plus</h1>
           <p className="text-[10px] text-slate-400 font-medium tracking-wide">SIAP LOLOS PTN</p>
        </div>
      </div>

      {/* MENU NAVIGATION */}
      <nav className="flex-1 px-4 space-y-2 py-6 overflow-hidden">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
          
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`relative flex items-center h-12 rounded-xl transition-all duration-300 group
                ${isActive 
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-900/30" 
                  : "hover:bg-slate-800/50 hover:text-white"
                }
              `}
            >
              {/* Icon Wrapper - FIXED WIDTH supaya tidak goyang */}
              <div className="w-[56px] flex items-center justify-center flex-shrink-0">
                <item.icon 
                   size={22} 
                   strokeWidth={isActive ? 2.5 : 2}
                   className={`transition-colors duration-300 ${isActive ? "text-white" : "text-slate-400 group-hover:text-blue-400"}`} 
                />
              </div>
              
              {/* Text Wrapper - Animated */}
              <span className={`whitespace-nowrap font-medium text-sm transition-all duration-300 delay-75
                ${isExpanded 
                  ? "opacity-100 translate-x-0 w-auto" 
                  : "opacity-0 -translate-x-4 w-0 overflow-hidden"
                }
              `}>
                {item.name}
              </span>

              {/* Active Indicator Dot */}
              {!isExpanded && isActive && (
                <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* LOGOUT AREA */}
      <div className="p-4 border-t border-slate-800/50 bg-[#0b1121]">
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className={`w-full flex items-center h-12 rounded-xl transition-all hover:bg-red-500/10 hover:text-red-400
             ${isExpanded ? "justify-start px-0" : "justify-center px-0"}
          `}
        >
          <div className="w-[56px] flex items-center justify-center flex-shrink-0">
             <LogOut size={20} />
          </div>
          <span className={`whitespace-nowrap font-medium transition-all duration-300
             ${isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 w-0 overflow-hidden"}
          `}>
            Keluar Aplikasi
          </span>
        </Button>
      </div>
    </div>
  )
}