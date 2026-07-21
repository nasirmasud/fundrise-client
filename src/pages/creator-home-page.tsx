import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, FolderOpen, Clock, TrendingUp, Bell } from "lucide-react"

interface CreatorStats {
  totalCampaigns: number
  activeCampaigns: number
  totalRaised: number
  pendingContributions: number
}

export default function CreatorHomePage() {
  const { user } = useAuth()

  const { data: stats, isLoading } = useQuery<CreatorStats>({
    queryKey: ["creator-stats", user?.email],
    queryFn: () => api.get(`/api/campaigns/creator-stats/${user?.email}`),
    enabled: !!user?.email,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-brand-green" />
      </div>
    )
  }

  const cards = [
    {
      title: "Total Campaigns",
      value: stats?.totalCampaigns ?? 0,
      icon: FolderOpen,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Active Campaigns",
      value: stats?.activeCampaigns ?? 0,
      icon: Clock,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Total Raised",
      value: `${stats?.totalRaised ?? 0}`,
      icon: TrendingUp,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      title: "Pending Reviews",
      value: stats?.pendingContributions ?? 0,
      icon: Bell,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ]

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-6">
        Welcome back, {user?.name ?? "Creator"}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-text-muted dark:text-text-muted-dark">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${card.color}`}>
                {card.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
