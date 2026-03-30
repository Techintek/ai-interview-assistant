export const Sidebar = ({ closeSidebar }) => {
  return (
    <div className="h-full flex flex-col p-6">

      <h1 className="text-xl font-bold mb-8">AI Interview</h1>

      <nav className="flex flex-col gap-4">

        <a
          href="/dashboard"
          onClick={closeSidebar}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          Analytics
        </a>

        <a href="/tests" onClick={closeSidebar}>Tests</a>
        <a href="/candidates" onClick={closeSidebar}>Candidates</a>
        <a href="/invitations" onClick={closeSidebar}>Invitations</a>

      </nav>
    </div>
  )
}