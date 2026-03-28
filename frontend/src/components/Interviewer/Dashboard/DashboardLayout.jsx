import { Sidebar } from "./Sidebar"

export const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background">

      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>

    </div>
  )
}