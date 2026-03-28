import * as pdfjsLib from 'pdfjs-dist'

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

export const extractTextFromPDF = async (file) => {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise
  let fullText = ''

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    const pageText = textContent.items.map(item => item.str).join(' ')
    fullText += pageText + ' '
  }

  return fullText
}

export const extractCandidateInfo = (text) => {
  // Simple regex patterns for extraction
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/
  const phoneRegex = /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/
  
  const email = text.match(emailRegex)?.[0] || ''
  const phone = text.match(phoneRegex)?.[0] || ''
  
  // Name extraction (usually at the beginning)
  const lines = text.split('\n').filter(line => line.trim())
  const name = lines[0]?.trim() || ''

  return { name, email, phone }
}
