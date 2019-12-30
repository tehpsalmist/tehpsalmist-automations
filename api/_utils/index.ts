import nodemailer from 'nodemailer'
import fetch, { Response } from 'node-fetch'

const {
  EMAIL,
  ID,
  SECRET,
  REFRESH,
  LATER_ON_REFRESH_TOKEN
} = process.env

const smtpTransport = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: EMAIL,
    type: 'oauth2',
    clientId: ID,
    clientSecret: SECRET,
    refreshToken: REFRESH
  }
})

export const sendEmail = (mailOptions: { to: string | string[], subject: string, html: string }) => {
  return new Promise((resolve, reject) => {
    smtpTransport.sendMail({
      from: EMAIL,
      ...mailOptions,
      dsn: {
        id: `${new Date().toISOString()}:${mailOptions.to}:${mailOptions.subject}`,
        return: 'headers',
        notify: ['success', 'failure', 'delay'],
        recipient: EMAIL
      }
    }, (error, response) => {
      if (error || response.rejected[0]) return reject(error || response)
      return resolve(response)
    })
  })
}

export const sendText = (textOptions: { to: string | string[], subject: string, text: string }) => {
  return new Promise((resolve, reject) => {
    smtpTransport.sendMail({
      from: EMAIL,
      ...textOptions,
      subject: textOptions.subject
        ? textOptions.subject.substring(0, 140 - 6 - EMAIL.length - textOptions.text.length)
        : 'Automation',
      dsn: {
        id: `${new Date().toISOString()}:${textOptions.to}`,
        return: 'headers',
        notify: ['success', 'failure', 'delay'],
        recipient: EMAIL
      }
    }, (error, response) => {
      if (error || response.rejected[0]) {
        return reject(error || response)
      }

      return resolve(response)
    })
  })
}

let access_token = 'abc123.jkl456.xyz789'

export const tryFor200 = async (request: (token: string) => Promise<Response>): Promise<string | null> => {
  try {
    const firstResponse = await request(access_token)

    if (firstResponse.ok) {
      const json = await firstResponse.json()

      return json.job._id
    } else if (firstResponse.status === 401) {
      const refreshBody = await fetch('https://later-on.com/api/auth/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refreshToken: LATER_ON_REFRESH_TOKEN
        })
      }).then((r: Response) => r.json())

      access_token = refreshBody.authData.access_token

      const secondResponse = await request(access_token)

      if (secondResponse.ok) {
        const json = await secondResponse.json()

        return json.job._id
      }
    }

    return null
  } catch (e) {
    console.error('trying to hit Later On:', e)

    return null
  }
}
