"use client";

import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { useState } from "react";

type SubscriptionButtonProps = {
  isProUser: boolean
}

export default function SubscriptionButton({ isProUser = false }: SubscriptionButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscription = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get("/api/stripe")
      window.location.href = response.data.url
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant={isProUser ? "default" : "premium"} onClick={handleSubscription} disabled={isLoading}>
      {isProUser ? "Manage Subscription" : "Upgrade"}
      {!isProUser && <Zap className="w-4 h-4 ml-2 fill-white" />}
    </Button>
  )
}
