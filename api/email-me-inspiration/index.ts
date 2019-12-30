import { NowRequest, NowResponse } from '@now/node'
import { tryFor200 } from '../_utils'

export default async (req: NowRequest, res: NowResponse): Promise<NowResponse> => {
  const email = req.body.email

  if (!email) return res.status(400).json({ error: 'email is required in post body' })

  const update = await tryFor200(token => fetch(`https://later-on.com/api/jobs`, {
    method: 'POST',
    body: JSON.stringify({
      actionUrl: `https://later-on.com/api/send-inspiration/1?email=${email}`,
      time: `${Math.floor(Math.random() * 60)} 14 */2 * *`,
      timeZone: 'US/Eastern'
    }),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }))
  
  if (!update) {
    console.log('failed to update')
  }
}