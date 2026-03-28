export const StatsCards = () => {

  const stats = [
    { title: "Total Tests", value: 12 },
    { title: "Candidates Invited", value: 54 },
    { title: "Completed Interviews", value: 21 },
    { title: "Average Score", value: "7.8 / 10" }
  ]

  return (
    <div className="grid grid-cols-4 gap-6">

      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-card border border-border p-6 rounded-xl shadow-sm"
        >

          <p className="text-sm text-muted-foreground">
            {stat.title}
          </p>

          <p className="text-3xl font-bold mt-2">
            {stat.value}
          </p>

        </div>
      ))}

    </div>
  )
}