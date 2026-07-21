import { useState } from "react"
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
import { Loader2, Check, X, Eye } from "lucide-react"
import toast from "react-hot-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Contribution {
  _id: string
  campaignId: string
  campaignTitle: string
  amount: number
  supporterEmail: string
  supporterName: string
  status: "pending" | "approved" | "rejected"
  date: string
}

export default function CreatorContributionsPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null)

  const { data: contributions, isLoading } = useQuery<Contribution[]>({
    queryKey: ["creator-contributions"],
    queryFn: () => api.get("/api/contributions/my-campaigns"),
    enabled: !!user,
  })

  const approveMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/api/contributions/${id}/approve`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-contributions"] })
      queryClient.invalidateQueries({ queryKey: ["creator-stats"] })
      toast.success("Contribution approved")
    },
    onError: () => toast.error("Failed to approve contribution"),
  })

  const rejectMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/api/contributions/${id}/reject`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-contributions"] })
      queryClient.invalidateQueries({ queryKey: ["creator-stats"] })
      toast.success("Contribution rejected")
    },
    onError: () => toast.error("Failed to reject contribution"),
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
      <h1 className="font-heading text-2xl font-bold mb-6">Contributions to Review</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pending Contributions</CardTitle>
        </CardHeader>
        <CardContent>
          {!contributions?.length ? (
            <p className="text-text-muted dark:text-text-muted-dark text-center py-8">
              No pending contributions to review.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Supporter</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contributions.map((c) => (
                  <TableRow key={c._id}>
                    <TableCell className="font-medium">{c.campaignTitle}</TableCell>
                    <TableCell>{c.supporterName}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{c.amount} credits</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(c.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedContribution(c)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => approveMutation.mutate(c._id)}
                          disabled={approveMutation.isPending}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => rejectMutation.mutate(c._id)}
                          disabled={rejectMutation.isPending}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Detail modal */}
      <Dialog open={!!selectedContribution} onOpenChange={() => setSelectedContribution(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contribution Details</DialogTitle>
          </DialogHeader>
          {selectedContribution && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-text-muted dark:text-text-muted-dark">Campaign</p>
                <p className="font-medium">{selectedContribution.campaignTitle}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted dark:text-text-muted-dark">Supporter</p>
                <p className="font-medium">{selectedContribution.supporterName}</p>
                <p className="text-sm text-text-muted dark:text-text-muted-dark">
                  {selectedContribution.supporterEmail}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-muted dark:text-text-muted-dark">Amount</p>
                <p className="font-medium text-brand-green">{selectedContribution.amount} credits</p>
              </div>
              <div>
                <p className="text-sm text-text-muted dark:text-text-muted-dark">Date</p>
                <p className="font-medium">
                  {new Date(selectedContribution.date).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1"
                  onClick={() => {
                    approveMutation.mutate(selectedContribution._id)
                    setSelectedContribution(null)
                  }}
                  disabled={approveMutation.isPending}
                >
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => {
                    rejectMutation.mutate(selectedContribution._id)
                    setSelectedContribution(null)
                  }}
                  disabled={rejectMutation.isPending}
                >
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
