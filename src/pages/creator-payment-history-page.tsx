import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Loader2, DollarSign } from "lucide-react"

interface Withdrawal {
  _id: string
  amount: number
  withdrawalAmount: number
  paymentSystem: string
  accountNumber: string
  status: "pending" | "paid" | "rejected"
  createdAt: string
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

export default function CreatorPaymentHistoryPage() {
  const { user } = useAuth()

  const { data: withdrawals, isLoading } = useQuery<Withdrawal[]>({
    queryKey: ["creator-withdrawals", user?.email],
    queryFn: () => api.get(`/api/withdrawals/creator/${user?.email}`),
    enabled: !!user?.email,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-brand-green" />
      </div>
    )
  }

  const totalWithdrawn = withdrawals
    ?.filter((w) => w.status === "paid")
    .reduce((sum, w) => sum + w.withdrawalAmount, 0) ?? 0

  const pendingAmount = withdrawals
    ?.filter((w) => w.status === "pending")
    .reduce((sum, w) => sum + w.withdrawalAmount, 0) ?? 0

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-6">Payment History</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-text-muted dark:text-text-muted-dark">
              Total Withdrawn
            </CardTitle>
            <div className="p-2 rounded-lg bg-green-500/10">
              <DollarSign className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              ${totalWithdrawn.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-text-muted dark:text-text-muted-dark">
              Pending
            </CardTitle>
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <DollarSign className="h-4 w-4 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              ${pendingAmount.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Withdrawal Records</CardTitle>
        </CardHeader>
        <CardContent>
          {!withdrawals?.length ? (
            <p className="text-text-muted dark:text-text-muted-dark text-center py-8">
              No payment history yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>USD Amount</TableHead>
                  <TableHead>Payment System</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawals.map((w) => (
                  <TableRow key={w._id}>
                    <TableCell>
                      {new Date(w.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">{w.amount}</TableCell>
                    <TableCell className="text-brand-green font-medium">
                      ${w.withdrawalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell className="capitalize">{w.paymentSystem}</TableCell>
                    <TableCell>{w.accountNumber}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[w.status]}>
                        {w.status}
                      </Badge>
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
