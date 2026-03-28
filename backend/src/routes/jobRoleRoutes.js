import express from "express"
import { createJobRole, getJobRoles,getJobRoleById } from "../controllers/jobRoleController.js"
import { authenticateUser } from "../middleware/authMiddleware.js"

const router = express.Router()

// ✅ CREATE TEST
router.post("/", authenticateUser, createJobRole)

// ✅ FETCH ALL TESTS (THIS IS MISSING)
router.get("/", authenticateUser, getJobRoles)

router.get("/:id", authenticateUser, getJobRoleById)

export default router