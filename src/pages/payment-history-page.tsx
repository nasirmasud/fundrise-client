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
import { Loader2, CreditCard } from "lucide-react"

interface Payment {
  _id: string
  email: string
  type: string
  credits: number
  amount: number
  transactionId: string
  description: string
  createdAt: string
}

export default function PaymentHistoryPage() {
  const { user } = useAuth()

  const { data: payments, isLoading } = useQuery<Payment[]>({
    queryKey: ["payment-history", user?.email],
    queryFn: () => api.get(`/api/payments/supporter/${user?.email}`),
    enabled: !!user,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-brand-green" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-6">Payment History</h1>

      <Card>
        <CardContent className="p-0">
          {!payments?.length ? (
            <div className="text-center py-8 text-text-muted dark:text-text-muted-dark">
              No payment history yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell>
                      {new Date(p.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      {p.credits} credits
                    </TableCell>
                    <TableCell className="text-brand-green font-medium">
                      ${p.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-xs">
                      {p.transactionId}
                    </TableCell>
                    <TableCell className="text-sm">
                      {p.description}
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