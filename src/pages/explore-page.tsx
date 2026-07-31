import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Link } from "react-router-dom"
import { Loader2, Search, ArrowRight } from "lucide-react"

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
  createdAt: string
}

const categories = ["Technology", "Education", "Environment", "Creative", "Health", "Community"]

export default function ExplorePage() {
  const [category, setCategory] = useState("")
  const [search, setSearch] = useState("")

  const { data: campaigns, isLoading } = useQuery<Campaign[]>({
    queryKey: ["campaigns", category, search],
    queryFn: () => {
      const params = new URLSearchParams()
      if (category) params.set("category", category)
      if (search) params.set("search", search)
      return api.get<Campaign[]>(`/api/campaigns?${params.toString()}`)
    },
  })

  const progressPct = (raised: number, goal: number) =>
    Math.min(100, Math.round((raised / goal) * 100))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-heading text-3xl font-bold mb-2">Explore Campaigns</h1>
      <p className="text-text-muted dark:text-text-muted-dark mb-8">
        Discover and support campaigns that matter to you.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-brand-green" />
        </div>
      ) : !campaigns?.length ? (
        <div className="text-center py-20">
          <p className="text-text-muted dark:text-text-muted-dark text-lg">
            No campaigns found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((c) => (
            <Card key={c._id} className="overflow-hidden group hover:shadow-lg transition-shadow">
              {c.imageURL && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={c.imageURL}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{c.category}</Badge>
                  <Badge
                    className={
                      c.status === "approved"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }
                  >
                    {c.status}
                  </Badge>
                </div>
                <h3 className="font-heading text-lg font-semibold mb-1 line-clamp-1">
                  {c.title}
                </h3>
                <p className="text-sm text-text-muted dark:text-text-muted-dark mb-3 line-clamp-2">
                  {c.story}
                </p>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-brand-green font-medium">
                      {c.raisedAmount.toLocaleString()} credits raised
                    </span>
                    <span className="text-text-muted dark:text-text-muted-dark">
                      {c.fundingGoal.toLocaleString()} goal
                    </span>
                  </div>
                  <div className="h-2 bg-border-subtle dark:bg-border-subtle-dark rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-green rounded-full transition-all"
                      style={{ width: `${progressPct(c.raisedAmount, c.fundingGoal)}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-text-muted dark:text-text-muted-dark">
                  <span>by {c.creatorName}</span>
                  <span>Min: {c.minContribution} credits</span>
                </div>
                <Link
                  to={`/campaign/${c._id}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-green hover:underline"
                >
                  View Details <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}