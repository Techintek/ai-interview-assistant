import express from "express"
import { getDashboardData, getReportById } from "../controllers/reportController.js"
import { authenticateUser } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/dashboard", authenticateUser, getDashboardData)
router.get("/:id", authenticateUser, getReportById)

export default router