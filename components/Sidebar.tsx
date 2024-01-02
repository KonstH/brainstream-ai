"use client";

import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Code, ImageIcon, LayoutDashboard, LucideIcon, MessageSquare, Music, Settings, VideoIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import TrialTracker from "@/components/TrialTracker";

const montserrat = Montserrat({ weight: "600", subsets: ["latin"]})

type SidebarProps = {
  apiLimitCount: number
  isProUser: boolean
}

type Route = (
  {
    label: string;
    icon: LucideIcon;
    href: string;
    color: string;
  } |
  {
    label: string;
    icon: LucideIcon;
    href: string;
    color?: undefined;
  }
)

const routes: Route[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500"
  },
  {
    label: "Chat",
    icon: MessageSquare,
    href: "/chat",
    color: "text-violet-500"
  },
  {
    label: "Image",
    icon: ImageIcon,
    href: "/image",
    color: "text-pink-700"
  },
  {
    label: "Video",
    icon: VideoIcon,
    href: "/video",
    color: "text-orange-700"
  },
  {
    label: "Music",
    icon: Music,
    href: "/music",
    color: "text-emerald-500"
  },
  {
    label: "Code",
    icon: Code,
    href: "/code",
    color: "text-green-700"
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  }
]

export default function Sidebar({ apiLimitCount = 0, isProUser = false }: SidebarProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null;
  
  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-4">
            <Image fill alt="Logo" src="/logo.png" />
          </div>
          <h1 className={cn("text-xl font-bold", montserrat.className)}>
            Brainstream
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map(route => RouteLink(route))}
        </div>
      </div>
      <TrialTracker apiLimitCount={apiLimitCount} isProUser={isProUser} />
    </div>
  )
}

function RouteLink(route: Route) {
  const pathname = usePathname();

  return (
    <Link
      href={route.href}
      key={route.href}
      className={cn(
        "text-sm group flex p-3 w-full justify-start font-medium rounded-lg transition",
        pathname === route.href ? "bg-zinc-600" : "hover:bg-white/10 cursor-pointer"
      )}
    >
      <div className="flex items-center flex-1">
        <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
        { route.label }
      </div>
    </Link>
  )
}
