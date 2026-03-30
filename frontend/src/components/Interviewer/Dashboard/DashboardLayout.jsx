import { Sidebar } from "./Sidebar"

export const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background">

      {/* ✅ Hide sidebar on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 overflow-y-auto">
        {/* ✅ Mobile top bar */}
        <div className="md:hidden p-4 border-b">
          <p className="font-bold">AI Interview</p>
        </div>

        {/* ✅ Responsive container */}
        <div className="px-4 sm:px-6 lg:px-10 py-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  )
}