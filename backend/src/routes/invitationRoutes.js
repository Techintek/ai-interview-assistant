import express from "express"
import { createInvitation } from "../controllers/invitationController.js"
import { authenticateUser } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/", authenticateUser, createInvitation)

export default router