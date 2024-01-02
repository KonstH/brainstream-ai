"use client";

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { MAX_FREE_COUNTS } from "@/constants";
import { Zap } from "lucide-react";
import { useProModal } from "@/hooks/useProModal";

type TrackerProps = {
  apiLimitCount: number
  isProUser: boolean
}

export default function TrialTracker({ apiLimitCount, isProUser = false }: TrackerProps) {
  const proModal = useProModal();
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => { setIsMounted(true) }, [])

  if (!isMounted || isProUser) return null;
  
  return (
    <div className="px-3">
      <Card className="bg-white/10 border-0">
        <CardContent className="py-6">
          <div className="text-center text-sm text-white mb-2 space-y-2">
            <p>{apiLimitCount} / {MAX_FREE_COUNTS} Free Generations</p>
          </div>
          <Progress className="h-3 mb-6" value={(apiLimitCount / MAX_FREE_COUNTS) * 100} />
          <Button onClick={proModal.onOpen} className="w-full" variant="premium">
            Upgrade
            <Zap className="w-4 h-4 ml-2 fill-white" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
