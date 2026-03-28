// Note: In production, email sending should be done server-side
// For demo, we'll use a proxy or Supabase Edge Function
// For now, we'll create the invitation URL that can be shared

export const emailService = {
    // For demo - just copies link to clipboard
    async sendInvitationEmail(invitation, recipientEmail) {
      const invitationUrl = `${window.location.origin}/interview/${invitation.token}`
      
      // In production, you'd call your backend/edge function here
      // For now, we'll just return the URL to copy
      return {
        url: invitationUrl,
        email: recipientEmail
      }
    },
  
    // Copy invitation link to clipboard
    copyInvitationLink(token) {
      const url = `${window.location.origin}/interview/${token}`
      navigator.clipboard.writeText(url)
      return url
    }
  }
  