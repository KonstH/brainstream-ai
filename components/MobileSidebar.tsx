"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";

type MobileSidebarProps = {
  apiLimitCount: number
  isProUser: boolean
}

export default function Navbar({ apiLimitCount = 0, isProUser = false }: MobileSidebarProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>        
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <Sidebar apiLimitCount={apiLimitCount} isProUser={isProUser} />
      </SheetContent>
    </Sheet>
  )
}


