import prisma from "../db/prismaClient.js"

// ---------------- DASHBOARD DATA ----------------
export const getDashboardData = async (req, res) => {
    try {
      const reports = await prisma.report.findMany({
        include: {
          interview: {
            include: { candidate: true }
          }
        },
        orderBy: {
          id: "desc" // fallback safe sort
        }
      })
  
      const totalInterviews = reports.length
      const avgScore =
        reports.reduce((sum, r) => sum + r.avgScore, 0) /
        (reports.length || 1)
  
      res.json({
        reports,
        analytics: {
          totalInterviews,
          avgScore: Math.round(avgScore)
        }
      })
  
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Failed to fetch dashboard" })
    }
  }

// ---------------- SINGLE REPORT ----------------
export const getReportById = async (req, res) => {
  try {
    const { id } = req.params

    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        interview: {
          include: {
            candidate: true,
            questions: {
              include: {
                answer: true
              }
            }
          }
        }
      }
    })
    console.log("GET REPORT HIT:", req.params.id) // 👈 ADD THIS
    if (!report) {
      return res.status(404).json({ error: "Report not found" })
    }

    res.json(report)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to fetch report" })
  }
}