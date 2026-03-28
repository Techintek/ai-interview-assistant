import { GoogleGenerativeAI } from '@google/generative-ai'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

// Use Gemini 1.5 Flash for faster responses (or gemini-1.5-pro for better quality)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

const difficultyLevels = {
  easy: { time: 20, count: 2 },
  medium: { time: 60, count: 2 },
  hard: { time: 120, count: 2 }
}

export const generateInterviewQuestions = async (candidateInfo, difficulty, questionNumber) => {
  const prompt = `Generate a single ${difficulty} level technical interview question for a Full Stack (React/Node.js) developer position.

Candidate background: ${candidateInfo.name}
Question number: ${questionNumber}
Difficulty: ${difficulty}

Return ONLY the question text, no numbering, formatting, or additional text.`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text().trim()
  } catch (error) {
    console.error('Error generating question:', error)
    throw error
  }
}

export const evaluateAnswer = async (question, answer, difficulty) => {
  const prompt = `Evaluate this technical interview answer:

Question: ${question}
Answer: ${answer}
Difficulty Level: ${difficulty}

Provide:
1. A score from 0-100
2. Brief feedback (2-3 sentences)

Return ONLY valid JSON in this exact format: {"score": number, "feedback": "text"}
Do not include any markdown formatting or extra text.`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text().trim()
    
    // Remove markdown code blocks if present
    const jsonText = text.replace(/``````/g, '').trim()
    
    const evaluation = JSON.parse(jsonText)
    return {
      score: evaluation.score,
      feedback: evaluation.feedback
    }
  } catch (error) {
    console.error('Error evaluating answer:', error)
    // Fallback response
    return {
      score: 50,
      feedback: 'Unable to evaluate answer at this time.'
    }
  }
}

export const generateFinalSummary = async (candidateInfo, qaHistory) => {
  const averageScore = qaHistory.reduce((acc, qa) => acc + qa.ai_score, 0) / qaHistory.length
  
  const prompt = `Create a concise interview summary for ${candidateInfo.name}:

Total Questions: ${qaHistory.length}
Average Score: ${averageScore.toFixed(1)}

Performance breakdown:
${qaHistory.map((qa, idx) => `Q${idx + 1} (${qa.difficulty}): ${qa.ai_score}/100`).join('\n')}

Provide a 3-4 sentence summary highlighting:
1. Overall performance
2. Key strengths
3. Areas for improvement

Write in a professional, constructive tone.`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text().trim()
  } catch (error) {
    console.error('Error generating summary:', error)
    return `${candidateInfo.name} completed the interview with an average score of ${averageScore.toFixed(1)}/100.`
  }
}

// Optional: For collecting missing candidate information through chat
export const generateFollowUpQuestion = async (missingField) => {
  const fieldPrompts = {
    name: "Could you please provide your full name?",
    email: "What is your email address?",
    phone: "What is your phone number?"
  }
  
  return fieldPrompts[missingField] || `Please provide your ${missingField}.`
}

// Optional: Generate a contextual response for chatbot interactions
export const generateChatResponse = async (userMessage, context) => {
  const prompt = `You are a friendly interview assistant. Respond to the candidate's message professionally and helpfully.

Context: ${context}
Candidate message: ${userMessage}

Provide a brief, helpful response (1-2 sentences).`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text().trim()
  } catch (error) {
    console.error('Error generating chat response:', error)
    return "I understand. Let's continue with the interview."
  }
}
