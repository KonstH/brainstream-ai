import Image from "next/image";

type LoaderProps = {
  label?: string
}

export default function Loader({ label = "Thinking..." }: LoaderProps) {
  return (
    <div className="p-20">
      <div className="h-full flex flex-col-reverse gap-y-4 items-center justify-center">
        <div className="w-10 h-10 relative animate-pulse">
          <Image fill alt="logo" src="/logo.png" />
        </div>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}
