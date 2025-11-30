import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20 animate-fade-in">
      <div className="animate-scale-in">
        <SignUp />
      </div>
    </div>
  )
}