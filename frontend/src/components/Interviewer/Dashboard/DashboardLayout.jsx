import { useState } from "react"
import { Sidebar } from "./Sidebar"

export const DashboardLayout = ({ children }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background overflow-hidden">

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed md:static z-50
          h-full
          w-64
          bg-background border-r
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <Sidebar closeSidebar={() => setOpen(false)} />
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col w-full">

        {/* TOP BAR (MOBILE ONLY) */}
        <div className="md:hidden p-4 border-b flex items-center">
          <button
            onClick={() => setOpen(true)}
            className="text-white text-xl"
          >
            ☰
          </button>

          <h1 className="ml-4 font-semibold">AI Interview</h1>
        </div>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {children}
        </main>

      </div>
    </div>
  )
}