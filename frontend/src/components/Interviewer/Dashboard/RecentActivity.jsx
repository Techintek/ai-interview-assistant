export const RecentActivity = () => {

    const activity = [
      "John completed React interview",
      "New candidate invited to Backend Test",
      "Frontend Test created",
      "Candidate scored 8.5 in System Design"
    ]
  
    return (
      <div className="bg-card border border-border p-6 rounded-xl">
  
        <h2 className="text-xl font-semibold mb-4">
          Recent Activity
        </h2>
  
        <ul className="space-y-3">
  
          {activity.map((item, i) => (
            <li
              key={i}
              className="text-muted-foreground border-b border-border pb-2"
            >
              {item}
            </li>
          ))}
  
        </ul>
  
      </div>
    )
  }