import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Loader2, CheckCircle } from "lucide-react"
import toast from "react-hot-toast"

interface WithdrawalRequest {
  _id: string
  creatorEmail: string
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

export default function WithdrawalRequestsPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: requests, isLoading } = useQuery<WithdrawalRequest[]>({
    queryKey: ["withdrawal-requests"],
    queryFn: () => api.get("/api/withdrawals/pending"),
    enabled: !!user && user.role === "admin",
  })

  const approveMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/api/withdrawals/${id}/approve`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawal-requests"] })
      toast.success("Withdrawal approved")
    },
    onError: () => toast.error("Failed to approve withdrawal"),
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
      <h1 className="font-heading text-2xl font-bold mb-6">Withdrawal Requests</h1>

      <Card>
        <CardContent className="p-0">
          {!requests?.length ? (
            <div className="text-center py-8 text-text-muted dark:text-text-muted-dark">
              No pending withdrawal requests.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Creator</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>USD Amount</TableHead>
                  <TableHead>Payment System</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((r) => (
                  <TableRow key={r._id}>
                    <TableCell className="font-medium">
                      {r.creatorEmail}
                    </TableCell>
                    <TableCell>{r.amount} credits</TableCell>
                    <TableCell className="text-brand-green font-medium">
                      ${r.withdrawalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell className="capitalize">
                      {r.paymentSystem}
                    </TableCell>
                    <TableCell>{r.accountNumber}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[r.status]}>
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(r.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {r.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => approveMutation.mutate(r._id)}
                          disabled={approveMutation.isPending}
                        >
                          {approveMutation.isPending ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          )}
                          Payment Success
                        </Button>
                      )}
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