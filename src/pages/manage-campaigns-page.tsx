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
import { Loader2, Trash2 } from "lucide-react"
import toast from "react-hot-toast"

interface Campaign {
  _id: string
  title: string
  category: string
  fundingGoal: number
  raisedAmount: number
  status: "pending" | "approved" | "rejected" | "suspended"
  creatorName: string
  deadline: string
  createdAt: string
}

export default function ManageCampaignsPage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending")

  const { data: pendingCampaigns, isLoading: pendingLoading } = useQuery<Campaign[]>({
    queryKey: ["admin-pending-campaigns"],
    queryFn: () => api.get("/api/campaigns/all?status=pending"),
  })

  const { data: allCampaigns, isLoading: allLoading } = useQuery<Campaign[]>({
    queryKey: ["admin-all-campaigns"],
    queryFn: () => api.get("/api/campaigns/all"),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/api/campaigns/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pending-campaigns"] })
      queryClient.invalidateQueries({ queryKey: ["admin-all-campaigns"] })
      toast.success("Campaign status updated")
    },
    onError: () => toast.error("Failed to update campaign status"),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/campaigns/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-all-campaigns"] })
      toast.success("Campaign deleted")
    },
    onError: () => toast.error("Failed to delete campaign"),
  })

  const isLoading = pendingLoading || allLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-brand-green" />
      </div>
    )
  }

  const campaigns = activeTab === "pending" ? pendingCampaigns : allCampaigns

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-6">Manage Campaigns</h1>

      <div className="flex gap-2 mb-4">
        <Button
          variant={activeTab === "pending" ? "default" : "outline"}
          onClick={() => setActiveTab("pending")}
        >
          Pending Approval
        </Button>
        <Button
          variant={activeTab === "all" ? "default" : "outline"}
          onClick={() => setActiveTab("all")}
        >
          All Campaigns
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {!campaigns?.length ? (
            <div className="text-center py-8 text-text-muted dark:text-text-muted-dark">
              No campaigns found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Raised</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((c) => (
                  <TableRow key={c._id}>
                    <TableCell className="font-medium">
                      {c.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{c.category}</Badge>
                    </TableCell>
                    <TableCell>{c.creatorName}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          c.status === "approved"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : c.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : c.status === "rejected"
                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                        }
                      >
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-brand-green">
                      {c.raisedAmount}
                    </TableCell>
                    <TableCell>
                      {new Date(c.deadline).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {activeTab === "pending" && (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() =>
                              statusMutation.mutate({
                                id: c._id,
                                status: "approved",
                              })
                            }
                            disabled={statusMutation.isPending}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              statusMutation.mutate({
                                id: c._id,
                                status: "rejected",
                              })
                            }
                            disabled={statusMutation.isPending}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                      {activeTab === "all" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => deleteMutation.mutate(c._id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
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