import { useState, type FormEvent } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Loader2, Pencil, Trash2 } from "lucide-react"
import toast from "react-hot-toast"

interface Campaign {
  _id: string
  title: string
  story: string
  category: string
  fundingGoal: number
  minContribution: number
  deadline: string
  rewardInfo: string
  imageURL: string
  raisedAmount: number
  status: "pending" | "approved" | "rejected" | "suspended"
  createdAt: string
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  suspended: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
}

export default function MyCampaignsPage() {
  const queryClient = useQueryClient()
  const [editCampaign, setEditCampaign] = useState<Campaign | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editStory, setEditStory] = useState("")
  const [editReward, setEditReward] = useState("")
  const [deleteCampaign, setDeleteCampaign] = useState<Campaign | null>(null)

  const { data: campaigns, isLoading } = useQuery<Campaign[]>({
    queryKey: ["my-campaigns"],
    queryFn: () => api.get("/api/campaigns/my"),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Campaign> }) =>
      api.patch(`/api/campaigns/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-campaigns"] })
      toast.success("Campaign updated")
      setEditCampaign(null)
    },
    onError: () => toast.error("Failed to update campaign"),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/campaigns/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-campaigns"] })
      queryClient.invalidateQueries({ queryKey: ["creator-stats"] })
      toast.success("Campaign deleted")
      setDeleteCampaign(null)
    },
    onError: () => toast.error("Failed to delete campaign"),
  })

  const handleEditSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!editCampaign) return
    updateMutation.mutate({
      id: editCampaign._id,
      data: {
        title: editTitle,
        story: editStory,
        rewardInfo: editReward,
      },
    })
  }

  const openEdit = (campaign: Campaign) => {
    setEditCampaign(campaign)
    setEditTitle(campaign.title)
    setEditStory(campaign.story)
    setEditReward(campaign.rewardInfo)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-brand-green" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-6">My Campaigns</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          {!campaigns?.length ? (
            <p className="text-text-muted dark:text-text-muted-dark text-center py-8">
              No campaigns yet. Create your first campaign!
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Goal</TableHead>
                  <TableHead>Raised</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((c) => (
                  <TableRow key={c._id}>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {c.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{c.category}</Badge>
                    </TableCell>
                    <TableCell>{c.fundingGoal}</TableCell>
                    <TableCell className="text-brand-green font-medium">
                      {c.raisedAmount}
                    </TableCell>
                    <TableCell>
                      {new Date(c.deadline).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[c.status]}>
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEdit(c)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setDeleteCampaign(c)}
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Edit Modal */}
      <Dialog open={!!editCampaign} onOpenChange={() => setEditCampaign(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Update Campaign</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Story</label>
              <Textarea
                rows={5}
                value={editStory}
                onChange={(e) => setEditStory(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Reward Info</label>
              <Textarea
                rows={3}
                value={editReward}
                onChange={(e) => setEditReward(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditCampaign(null)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteCampaign} onOpenChange={() => setDeleteCampaign(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Campaign</DialogTitle>
          </DialogHeader>
          <p className="text-text-muted dark:text-text-muted-dark">
            Are you sure you want to delete <strong>{deleteCampaign?.title}</strong>?
            All approved contributions will be refunded to supporters.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteCampaign(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteCampaign && deleteMutation.mutate(deleteCampaign._id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
