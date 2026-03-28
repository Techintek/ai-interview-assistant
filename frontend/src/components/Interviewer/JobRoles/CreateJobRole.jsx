import prisma from "../db/prismaClient.js"

export const createJobRole = async (req, res) => {
  try {

    const { title, description, difficulty, duration } = req.body

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
        }
      }
    })

    res.json(jobRole)

  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: "Failed to create test"
    })
  }
}