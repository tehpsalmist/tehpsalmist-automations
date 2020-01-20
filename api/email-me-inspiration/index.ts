import { NowRequest, NowResponse } from '@now/node'
import { tryFor200 } from '../_utils'
import fetch from 'node-fetch'

export default async (req: NowRequest, res: NowResponse): Promise<NowResponse> => {
  const email = req.body.email
  const tz = req.body.tz || 'US/Eastern'

  if (!email) return res.status(400).json({ error: 'email is required in post body' })

  const update = await tryFor200(token => fetch(`https://later-on.com/api/jobs`, {
    method: 'POST',
    body: JSON.stringify({
      actionUrl: `https://tehpsalmist-automations.now.sh/api/send-inspiration/1?email=${email}`,
      method: 'GET',
      time: `${Math.floor(Math.random() * 60)} 14 */2 * *`,
      timeZone: tz
    }),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }))

  if (!update) {
    return res.status(404).json({ error: 'unable to sign up' })
  }

  return res.status(200).json({ success: true })
}