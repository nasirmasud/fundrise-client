import { useState } from "react"
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
import { Loader2 } from "lucide-react"
import { Link } from "react-router-dom"

interface Contribution {
  _id: string
  campaignId: string
  campaignTitle: string
  amount: number
  supporterEmail: string
  supporterName: string
  creatorEmail: string
  creatorName: string
  status: "pending" | "approved" | "rejected"
  date: string
}

interface PaginatedResponse {
  items: Contribution[]
  total: number
  page: number
  totalPages: number
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

export default function MyContributionsPage() {
  const { user } = useAuth()
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery<PaginatedResponse>({
    queryKey: ["my-contributions", page],
    queryFn: () =>
      api.get(`/api/contributions/supporter/${user?.email}?page=${page}&limit=10`),
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
      <h1 className="font-heading text-2xl font-bold mb-6">My Contributions</h1>

      <Card>
        <CardContent className="p-0">
          {!data?.items?.length ? (
            <div className="text-center py-8 text-text-muted dark:text-text-muted-dark">
              No contributions yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((c) => (
                  <TableRow key={c._id}>
                    <TableCell className="font-medium">
                      {c.campaignTitle}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{c.amount} credits</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(c.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[c.status]}>
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        to={`/campaign/${c.campaignId}`}
                        className="text-brand-green hover:underline text-sm"
                      >
                        View Campaign
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-text-muted">
            Page {data.page} of {data.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= data.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}