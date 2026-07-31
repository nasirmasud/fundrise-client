import { BrowserRouter, Routes, Route } from "react-router-dom"
import { MainLayout } from "@/components/layout/main-layout"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { PublicOnlyRoute } from "@/components/public-only-route"
import HomePage from "@/pages/home-page"
import LoginPage from "@/pages/login-page"
import RegisterPage from "@/pages/register-page"
import ExplorePage from "@/pages/explore-page"
import CampaignDetailPage from "@/pages/campaign-detail-page"
import DashboardPage from "@/pages/dashboard-page"
import CreatorHomePage from "@/pages/creator-home-page"
import CreatorContributionsPage from "@/pages/creator-contributions-page"
import AddCampaignPage from "@/pages/add-campaign-page"
import MyCampaignsPage from "@/pages/my-campaigns-page"
import WithdrawalsPage from "@/pages/withdrawals-page"
import CreatorPaymentHistoryPage from "@/pages/creator-payment-history-page"
import NotFoundPage from "@/pages/not-found-page"
import MyContributionsPage from "@/pages/my-contributions-page"
import PurchaseCreditPage from "@/pages/purchase-credit-page"
import PaymentHistoryPage from "@/pages/payment-history-page"
import WithdrawalRequestsPage from "@/pages/withdrawal-requests-page"
import ManageUsersPage from "@/pages/manage-users-page"
import ManageCampaignsPage from "@/pages/manage-campaigns-page"
import ReportsPage from "@/pages/reports-page"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="campaign/:id" element={<CampaignDetailPage />} />
          <Route element={<PublicOnlyRoute />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
        </Route>

        {/* Dashboard routes — role-based */}
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />

{/* Supporter routes */}
            <Route element={<ProtectedRoute allowedRoles={["supporter"]} />}>
              <Route path="supporter-home" element={<DashboardPage />} />
              <Route path="explore-campaigns" element={<ExplorePage />} />
              <Route path="my-contributions" element={<MyContributionsPage />} />
              <Route path="purchase-credit" element={<PurchaseCreditPage />} />
              <Route path="payment-history" element={<PaymentHistoryPage />} />
            </Route>

            {/* Creator routes */}
            <Route element={<ProtectedRoute allowedRoles={["creator"]} />}>
              <Route path="creator-home" element={<CreatorHomePage />} />
              <Route path="review-contributions" element={<CreatorContributionsPage />} />
              <Route path="add-campaign" element={<AddCampaignPage />} />
              <Route path="my-campaigns" element={<MyCampaignsPage />} />
              <Route path="withdrawals" element={<WithdrawalsPage />} />
              <Route path="creator-payment-history" element={<CreatorPaymentHistoryPage />} />
            </Route>

            {/* Admin routes */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="admin-home" element={<DashboardPage />} />
              <Route path="manage-users" element={<ManageUsersPage />} />
              <Route path="manage-campaigns" element={<ManageCampaignsPage />} />
              <Route path="withdrawal-requests" element={<WithdrawalRequestsPage />} />
              <Route path="reports" element={<ReportsPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
