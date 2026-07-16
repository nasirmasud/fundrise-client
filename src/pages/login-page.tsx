import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-heading text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your FundRise account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <Button className="w-full">Sign In</Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border-subtle dark:border-border-subtle-dark" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-bg-card dark:bg-bg-card-dark px-2 text-text-muted dark:text-text-muted-dark">or</span>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            Continue with Google
          </Button>
          <p className="text-center text-sm text-text-muted dark:text-text-muted-dark">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-brand-green hover:underline">Sign up</a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
