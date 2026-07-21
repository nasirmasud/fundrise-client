import { useState, type FormEvent } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Loader2, DollarSign, Wallet } from "lucide-react"
import toast from "react-hot-toast"

interface Withdrawal {
  _id: string
  amount: number
  withdrawalAmount: number
  paymentSystem: string
  accountNumber: string
  status: "pending" | "paid" | "rejected"
  createdAt: string
}

interface CreatorStats {
  totalCampaigns: number
  activeCampaigns: number
  totalRaised: number
  pendingContributions: number
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

export default function WithdrawalsPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [amount, setAmount] = useState("")
  const [paymentSystem, setPaymentSystem] = useState("")
  const [accountNumber, setAccountNumber] = useState("")

  const { data: stats, isLoading: statsLoading } = useQuery<CreatorStats>({
    queryKey: ["creator-stats", user?.email],
    queryFn: () => api.get(`/api/campaigns/creator-stats/${user?.email}`),
    enabled: !!user?.email,
  })

  const { data: withdrawals, isLoading: withdrawalsLoading } = useQuery<Withdrawal[]>({
    queryKey: ["creator-withdrawals", user?.email],
    queryFn: () => api.get(`/api/withdrawals/creator/${user?.email}`),
    enabled: !!user?.email,
  })

  const createMutation = useMutation({
    mutationFn: (data: { amount: number; paymentSystem: string; accountNumber: string }) =>
      api.post("/api/withdrawals", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-withdrawals"] })
      toast.success("Withdrawal request submitted")
      setAmount("")
      setPaymentSystem("")
      setAccountNumber("")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to submit withdrawal")
    },
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!paymentSystem || !accountNumber || !amount) {
      toast.error("Please fill in all fields")
      return
    }
    createMutation.mutate({
      amount: Number(amount),
      paymentSystem,
      accountNumber,
    })
  }

  const totalRaised = stats?.totalRaised ?? 0
  const dollarValue = totalRaised / 20
  const canWithdraw = totalRaised >= 200
  const minAmount = 200

  if (statsLoading || withdrawalsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-brand-green" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-6">Withdrawals</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Balance Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-text-muted dark:text-text-muted-dark">
              Available Balance
            </CardTitle>
            <div className="p-2 rounded-lg bg-brand-green/10">
              <Wallet className="h-4 w-4 text-brand-green" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-green">
              {totalRaised} credits
            </div>
            <p className="text-sm text-text-muted dark:text-text-muted-dark mt-1">
              ≈ ${dollarValue.toFixed(2)} USD
            </p>
          </CardContent>
        </Card>

        {/* Withdrawal Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Request Withdrawal</CardTitle>
          </CardHeader>
          <CardContent>
            {!canWithdraw ? (
              <div className="text-center py-4">
                <p className="text-text-muted dark:text-text-muted-dark">
                  You need at least {minAmount} credits to withdraw.
                </p>
                <p className="text-sm text-text-muted dark:text-text-muted-dark mt-1">
                  Current: {totalRaised} credits
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Amount (credits) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    min={minAmount}
                    max={totalRaised}
                    placeholder={String(minAmount)}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                  {amount && (
                    <p className="text-xs text-text-muted dark:text-text-muted-dark">
                      = ${(Number(amount) / 20).toFixed(2)} USD
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Payment System <span className="text-red-500">*</span>
                  </label>
                  <Select value={paymentSystem} onValueChange={setPaymentSystem}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select payment system" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="bkash">bKash</SelectItem>
                      <SelectItem value="nagad">Nagad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Enter account number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={createMutation.isPending || !canWithdraw}
                >
                  {createMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <DollarSign className="h-4 w-4 mr-2" />
                  )}
                  Request Withdrawal
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Withdrawal History</CardTitle>
        </CardHeader>
        <CardContent>
          {!withdrawals?.length ? (
            <p className="text-text-muted dark:text-text-muted-dark text-center py-8">
              No withdrawal history yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Amount</TableHead>
                  <TableHead>USD Value</TableHead>
                  <TableHead>Payment System</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawals.map((w) => (
                  <TableRow key={w._id}>
                    <TableCell className="font-medium">{w.amount} credits</TableCell>
                    <TableCell className="text-brand-green">
                      ${w.withdrawalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell className="capitalize">{w.paymentSystem}</TableCell>
                    <TableCell>{w.accountNumber}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[w.status]}>
                        {w.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(w.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
