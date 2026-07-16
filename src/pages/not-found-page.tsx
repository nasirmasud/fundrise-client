import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="font-heading text-6xl font-bold text-brand-green">404</h1>
      <p className="mt-4 text-lg text-text-muted dark:text-text-muted-dark">
        Page not found
      </p>
      <Link to="/" className="mt-6">
        <Button>Go Home</Button>
      </Link>
    </div>
  )
}
