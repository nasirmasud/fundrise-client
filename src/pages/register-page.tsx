import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

export default function RegisterPage() {
  const { register, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"supporter" | "creator">("supporter")
  const [photoURL, setPhotoURL] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) {
      toast.error("Please fill in all required fields")
      return
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }
    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain at least one uppercase letter")
      return
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      toast.error("Password must contain at least one special character")
      return
    }
    setSubmitting(true)
    try {
      await register({ name, email, password, role, photoURL: photoURL || undefined })
      toast.success("Account created successfully")
      navigate("/dashboard")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogle = async () => {
    try {
      await signInWithGoogle()
      toast.success("Signed in successfully")
      navigate("/dashboard")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed")
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-heading text-2xl">Create your account</CardTitle>
          <CardDescription>Join FundRise as a creator or supporter</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Full Name</label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="photoURL" className="text-sm font-medium">
                Profile Picture URL <span className="text-text-muted dark:text-text-muted-dark">(optional)</span>
              </label>
              <Input
                id="photoURL"
                type="url"
                placeholder="https://example.com/avatar.jpg"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">I want to join as</label>
              <Select value={role} onValueChange={(v) => setRole(v as "supporter" | "creator")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supporter">Supporter — Browse &amp; contribute to campaigns</SelectItem>
                  <SelectItem value="creator">Creator — Launch &amp; manage campaigns</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
            </Button>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border-subtle dark:border-border-subtle-dark" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-bg-card dark:bg-bg-card-dark px-2 text-text-muted dark:text-text-muted-dark">or</span>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleGoogle}>
            Sign up with Google
          </Button>
          <p className="mt-4 text-center text-sm text-text-muted dark:text-text-muted-dark">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-green hover:underline">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
