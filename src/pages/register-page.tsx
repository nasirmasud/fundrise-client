import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-heading text-2xl">Create your account</CardTitle>
          <CardDescription>Join FundRise as a creator or supporter</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <Input placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <Button className="w-full">Create Account</Button>
          <Button variant="outline" className="w-full">
            Sign up with Google
          </Button>
          <p className="text-center text-sm text-text-muted dark:text-text-muted-dark">
            Already have an account?{" "}
            <a href="/login" className="text-brand-green hover:underline">Sign in</a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
