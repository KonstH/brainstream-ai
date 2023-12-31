import { UserButton } from "@clerk/nextjs"

export default function LandingPage() {
  return (
    <div>
      <UserButton afterSignOutUrl="/" />
      <p>Landing Page (unprotected)</p>
    </div>
  )
}
