import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, CreditCard, Check } from "lucide-react"
import toast from "react-hot-toast"

interface Package {
  credits: number
  amount: number
  usd: number
}

const PACKAGES: Package[] = [
  { credits: 100, amount: 1000, usd: 10 },
  { credits: 300, amount: 2500, usd: 25 },
  { credits: 800, amount: 6000, usd: 60 },
  { credits: 1500, amount: 11000, usd: 110 },
]

export default function PurchaseCreditPage() {
  const { user } = useAuth()
  const [selectedPkg, setSelectedPkg] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const handlePurchase = async (pkg: Package) => {
    setLoading(true)
    try {
      const { clientSecret } = await api.post<{ clientSecret: string }>(
        "/api/payments/create-payment-intent",
        { amount: pkg.amount }
      )
      toast.success("Payment intent created. Complete checkout to add credits.")
      setSelectedPkg(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-6">Purchase Credits</h1>

      <p className="text-text-muted dark:text-text-muted-dark mb-8">
        Buy credits to support campaigns. 10 credits = $1 USD.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PACKAGES.map((pkg, i) => (
          <Card
            key={i}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedPkg === i ? "ring-2 ring-brand-green" : ""
            }`}
            onClick={() => setSelectedPkg(i)}
          >
            <CardHeader className="text-center">
              <CardTitle className="font-heading text-xl">
                {pkg.credits} Credits
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-3xl font-bold">${pkg.usd}</div>
              <p className="text-sm text-text-muted dark:text-text-muted-dark">
                = {pkg.credits} credits
              </p>
              <Button
                className="w-full"
                disabled={loading}
                onClick={(e) => {
                  e.stopPropagation()
                  handlePurchase(pkg)
                }}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CreditCard className="h-4 w-4 mr-2" />
                )}
                Buy Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}