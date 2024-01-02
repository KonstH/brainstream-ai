import { Code, ImageIcon, MessageSquare, Music, VideoIcon } from "lucide-react";

export const tools = [
  {
    label: "Chat",
    icon: MessageSquare,
    href: "/chat",
    color: "text-violet-500",
    bgColor: "text-violet-500/10"
  },
  {
    label: "Image",
    icon: ImageIcon,
    href: "/image",
    color: "text-pink-700",
    bgColor: "text-pink-700/10"
  },
  {
    label: "Video",
    icon: VideoIcon,
    href: "/video",
    color: "text-orange-700",
    bgColor: "text-orange-700/10"
  },
  {
    label: "Music",
    icon: Music,
    href: "/music",
    color: "text-emerald-500",
    bgColor: "text-emerald-500/10"
  },
  {
    label: "Code",
    icon: Code,
    href: "/code",
    color: "text-green-700",
    bgColor: "text-green-700/10"
  },
]