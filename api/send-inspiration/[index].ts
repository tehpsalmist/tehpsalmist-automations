import { NowRequest, NowResponse } from '@now/node'
import fetch from 'node-fetch'
import { ideas } from '../_data/inspiration'
import { sendEmail, tryFor200 } from '../_utils'

export default async (req: NowRequest, res: NowResponse) => {
  const { index, email } = req.query
  const jobId = req.headers['job-id']

  if (!jobId) return res.status(400).json({ success: false, message: 'missing headers' })

  const indexInt = parseInt(Array.isArray(index) ? index[0]: index, 10)

  const success = await sendEmail({
    to: email,
    html: `<p>${ideas[indexInt] || ideas[0]}</p>`,
    subject: `Inspire Your Wife: Tip ${indexInt}`
  })
    .catch(err => err instanceof Error ? err : new Error(JSON.stringify(err)))
    
  if (success instanceof Error) {
    console.log(success)
    return res.status(500).json({ success: false })
  }

  const update = await tryFor200(token => fetch(`https://later-on.com/api/jobs/${jobId}`, {
    method: 'PUT',
    body: JSON.stringify({
      actionUrl: `https://${req.headers.host}/api/send-inspiration/${indexInt < 50 ? indexInt + 1 : 1}?email=${email}`,
      time: '30 14 */2 * *'
    }),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }))
  
  if (!update) {
    console.log('failed to update')
  }

  res.status(200).json({ jobId })
}