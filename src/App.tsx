import { BrowserRouter, Routes, Route } from "react-router-dom"
import { MainLayout } from "@/components/layout/main-layout"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import HomePage from "@/pages/home-page"
import LoginPage from "@/pages/login-page"
import RegisterPage from "@/pages/register-page"
import ExplorePage from "@/pages/explore-page"
import DashboardPage from "@/pages/dashboard-page"
import NotFoundPage from "@/pages/not-found-page"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
