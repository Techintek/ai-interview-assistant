import prisma from "../db/prismaClient.js"
import crypto from "crypto"
import nodemailer from "nodemailer"

export const createInvitation = async (req, res) => {
  try {

    const { email, jobRoleId } = req.body

    if (!email || !jobRoleId) {
      return res.status(400).json({ error: "Missing fields" })
    }

    const token = crypto.randomBytes(32).toString("hex")

    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)

    // ✅ create invitation
    const invitation = await prisma.invitation.create({
      data: {
        email,
        token,
        expiresAt,
        jobRoleId
      }
    })

    const link = `http://localhost:5173/interview/${token}`

    // ✅ email setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    await transporter.sendMail({
      from: `"AI Interview" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Interview Link",
      html: `
        <h2>You are invited for an interview</h2>
        <p>Click below to start:</p>
        <a href="${link}">${link}</a>
        <p>This link expires in 24 hours</p>
      `
    })

    res.json({
      message: "Invitation sent successfully",
      link // helpful for testing
    })

  } catch (error) {
    console.error("INVITE ERROR:", error)
    res.status(500).json({ error: "Failed to send invite" })
  }
}