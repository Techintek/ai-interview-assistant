import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import dotenv from "dotenv"

dotenv.config()
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // fallback fix
  }
})

const prisma = new PrismaClient({ adapter })

export default prisma