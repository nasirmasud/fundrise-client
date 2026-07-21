import { BrowserRouter, Routes, Route } from "react-router-dom"
import { MainLayout } from "@/components/layout/main-layout"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { PublicOnlyRoute } from "@/components/public-only-route"
import HomePage from "@/pages/home-page"
import LoginPage from "@/pages/login-page"
import RegisterPage from "@/pages/register-page"
import ExplorePage from "@/pages/explore-page"
import DashboardPage from "@/pages/dashboard-page"
import CreatorHomePage from "@/pages/creator-home-page"
import NotFoundPage from "@/pages/not-found-page"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="campaign/:id" element={<ExplorePage />} />
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
              <Route path="my-contributions" element={<DashboardPage />} />
              <Route path="purchase-credit" element={<DashboardPage />} />
              <Route path="payment-history" element={<DashboardPage />} />
            </Route>

            {/* Creator routes */}
            <Route element={<ProtectedRoute allowedRoles={["creator"]} />}>
              <Route path="creator-home" element={<CreatorHomePage />} />
              <Route path="add-campaign" element={<DashboardPage />} />
              <Route path="my-campaigns" element={<DashboardPage />} />
              <Route path="withdrawals" element={<DashboardPage />} />
              <Route path="creator-payment-history" element={<DashboardPage />} />
            </Route>

            {/* Admin routes */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="admin-home" element={<DashboardPage />} />
              <Route path="manage-users" element={<DashboardPage />} />
              <Route path="manage-campaigns" element={<DashboardPage />} />
              <Route path="withdrawal-requests" element={<DashboardPage />} />
              <Route path="reports" element={<DashboardPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
