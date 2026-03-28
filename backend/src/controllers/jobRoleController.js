import prisma from "../db/prismaClient.js"
export const getJobRoles = async (req, res) => {
  try {

    const userId = req.user.userId

    const jobRoles = await prisma.jobRole.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    res.json(jobRoles)

  } catch (error) {

    console.error(error)
    res.status(500).json({ error: "Failed to fetch job roles" })

  }
}

export const getJobRoleById = async (req, res) => {
  try {

    const { id } = req.params

    const jobRole = await prisma.jobRole.findUnique({
      where: { id },
      include: {
        questions: true
      }
    })

    res.json(jobRole)

  } catch (error) {

    console.error(error)
    res.status(500).json({ error: "Failed to fetch test" })

  }
}

export const createJobRole = async (req, res) => {
  try {

    const { title, description, difficulty, duration, questions } = req.body

    const jobRole = await prisma.jobRole.create({
      data: {
        title,
        description,
        difficulty,
        duration,
        user: {
          connect: {
            id: req.user.userId
          }
        },

        questions: {
          create: questions.map(q => ({
            question: q.question,
            answer: q.answer
          }))
        }

      },
      include: {
        questions: true
      }
    })

    res.json(jobRole)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to create test" })
  }
}