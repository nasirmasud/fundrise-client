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
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"

interface Report {
  _id: string
  reporterName: string
  reporterEmail: string
  campaignId: string
  campaignTitle: string
  reason: string
  date: string
  status: "pending" | "resolved" | "dismissed"
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  dismissed: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
}

export default function ReportsPage() {
  const queryClient = useQueryClient()

  const { data: reports, isLoading } = useQuery<Report[]>({
    queryKey: ["admin-reports"],
    queryFn: () => api.get("/api/admin/reports"),
  })

  const resolveMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/api/admin/reports/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reports"] })
      toast.success("Report updated")
    },
    onError: () => toast.error("Failed to update report"),
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
      <h1 className="font-heading text-2xl font-bold mb-6">Reports</h1>

      <Card>
        <CardContent className="p-0">
          {!reports?.length ? (
            <div className="text-center py-8 text-text-muted dark:text-text-muted-dark">
              No reports.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((r) => (
                  <TableRow key={r._id}>
                    <TableCell>
                      <div className="font-medium">{r.reporterName}</div>
                      <div className="text-xs text-text-muted">
                        {r.reporterEmail}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {r.campaignTitle}
                    </TableCell>
                    <TableCell>{r.reason}</TableCell>
                    <TableCell>
                      {new Date(r.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[r.status]}>
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {r.status === "pending" && (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() =>
                              resolveMutation.mutate({
                                id: r._id,
                                status: "resolved",
                              })
                            }
                            disabled={resolveMutation.isPending}
                          >
                            Suspend
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              resolveMutation.mutate({
                                id: r._id,
                                status: "dismissed",
                              })
                            }
                            disabled={resolveMutation.isPending}
                          >
                            Delete
                          </Button>
                        </div>
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