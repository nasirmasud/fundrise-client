import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "react-hot-toast"
import App from "./App.tsx"
import "./index.css"

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          className: "!bg-bg-card !text-text-primary dark:!bg-bg-card-dark dark:!text-text-primary-dark !border !border-border-subtle dark:!border-border-subtle-dark",
        }}
      />
    </QueryClientProvider>
  </StrictMode>,
)
