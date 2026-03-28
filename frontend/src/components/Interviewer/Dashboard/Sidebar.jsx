import { NavLink } from "react-router-dom"

export const Sidebar = () => {

  const links = [
    { name: "Analytics", path: "/dashboard" },
    { name: "Tests", path: "/tests" },
    { name: "Candidates", path: "/candidates" },
    { name: "Invitations", path: "/invitations" }
  ]

  return (
    <aside className="w-64 bg-card border-r border-border p-6">

      <h2 className="text-xl font-bold mb-8">
        AI Interview
      </h2>

      <nav className="space-y-3">

        {links.map(link => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-primary text-white"
                  : "hover:bg-secondary"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}

      </nav>

    </aside>
  )
}