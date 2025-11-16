import { githubRepository } from '#server/repository/github'
import { z } from 'zod'

const bodySchema = z.object({
  email: z.email(),
  message: z.string().min(3),
  name: z.string().min(2),
  subject: z.string().min(3)
})

export default defineEventHandler(async (event) => {
  const { message, name, subject } = await readValidatedBody(event, bodySchema.parse)

  const res = await githubRepository.createIssue(
    subject,
    `
**Name:** ${name}

**Message:**
${message}
  `,
    { labels: ['Status: Triage'], type: '❔ Discussion' }
  )

  return { issueNumber: res.number, success: true, url: res.html_url }
})
