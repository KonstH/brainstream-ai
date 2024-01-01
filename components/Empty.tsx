import Image from "next/image"

type EmptyProps = {
  label: string
}

export default function Empty({ label }: EmptyProps) {
  return (
    <div className="h-full p-20 flex flex-col items-center justify-center">
      <div className="relative h-72 w-72">
        <Image fill alt="Empty" src="/empty.png" className="object-contain" />
      </div>
      <p className="mt-4 text-muted-foreground text-sm text-center">{label}</p>
    </div>
  )
}
