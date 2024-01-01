import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function BotAvatar() {
  const { user } = useUser();

  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src="/logo.png" />
    </Avatar>
  )
}
