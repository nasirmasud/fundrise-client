import { useState, type FormEvent } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowLeft, CreditCard } from "lucide-react"
import toast from "react-hot-toast"

interface Campaign {
  _id: string
  title: string
  story: string
  category: string
  fundingGoal: number
  minContribution: number
  deadline: string
  rewardInfo?: string
  imageURL?: string
  raisedAmount: number
  status: string
  creatorName: string
  creatorEmail: string
  createdAt: string
}

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [amount, setAmount] = useState("")

  const { data: campaign, isLoading } = useQuery<Campaign>({
    queryKey: ["campaign", id],
    queryFn: () => api.get(`/api/campaigns/${id}`),
  })

  const contributeMutation = useMutation({
    mutationFn: (data: { campaignId: string; amount: number }) =>
      api.post("/api/contributions", data),
    onSuccess: () => {
      toast.success("Contribution submitted successfully")
      setAmount("")
      queryClient.invalidateQueries({ queryKey: ["campaign", id] })
      navigate(`/campaign/${id}`)
    },
    onError: (err: Error) => {
      toast.error(err.message || "Contribution failed")
    },
  })

  const progressPct = campaign
    ? Math.min(100, Math.round((campaign.raisedAmount / campaign.fundingGoal) * 100))
    : 0

  const handleContribute = async (e: FormEvent) => {
    e.preventDefault()
    if (!amount || Number(amount) < campaign?.minContribution!) {
      toast.error(`Minimum contribution is ${campaign?.minContribution} credits`)
      return
    }
    if (user && user.credits < Number(amount)) {
      toast.error("Insufficient credits")
      return
    }
    contributeMutation.mutate({ campaignId: id!, amount: Number(amount) })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-brand-green" />
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="font-heading text-2xl font-bold mb-4">Campaign not found</h1>
        <Link to="/explore" className="text-brand-green hover:underline">
          Back to Explore
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/explore"
        className="inline-flex items-center gap-1 text-sm text-brand-green hover:underline mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Explore
      </Link>

      {campaign.imageURL && (
        <div className="h-64 sm:h-80 rounded-lg overflow-hidden mb-6">
          <img
            src={campaign.imageURL}
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <Badge variant="secondary" className="mb-2">
            {campaign.category}
          </Badge>
          <h1 className="font-heading text-3xl font-bold">{campaign.title}</h1>
        </div>
        <Badge
          className={
            campaign.status === "approved"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
          }
        >
          {campaign.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About This Campaign</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-primary dark:text-text-primary-dark whitespace-pre-line">
                {campaign.story}
              </p>
            </CardContent>
          </Card>

          {campaign.rewardInfo && (
            <Card>
              <CardHeader>
                <CardTitle>Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-primary dark:text-text-primary-dark">
                  {campaign.rewardInfo}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-brand-green font-medium">
                    {campaign.raisedAmount.toLocaleString()} credits raised
                  </span>
                  <span className="text-text-muted dark:text-text-muted-dark">
                    of {campaign.fundingGoal.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 bg-border-subtle dark:bg-border-subtle-dark rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-green rounded-full"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
              <div className="text-sm text-text-muted dark:text-text-muted-dark">
                <p>Min contribution: {campaign.minContribution} credits</p>
                <p>Deadline: {new Date(campaign.deadline).toLocaleDateString()}</p>
                <p>Created by: {campaign.creatorName}</p>
              </div>
            </CardContent>
          </Card>

          {user && user.role === "supporter" && (
            <Card>
              <CardHeader>
                <CardTitle>Contribute</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContribute} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Credits to contribute</Label>
                    <Input
                      id="amount"
                      type="number"
                      min={campaign.minContribution}
                      placeholder={`Min ${campaign.minContribution}`}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                    <p className="text-xs text-text-muted dark:text-text-muted-dark">
                      Your balance: {user.credits} credits
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={contributeMutation.isPending}
                  >
                    {contributeMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CreditCard className="h-4 w-4 mr-2" />
                    )}
                    Contribute
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {!user && (
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-text-muted dark:text-text-muted-dark mb-3">
                  Sign in to contribute to this campaign
                </p>
                <Button asChild className="w-full">
                  <Link to="/login">Sign In</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}