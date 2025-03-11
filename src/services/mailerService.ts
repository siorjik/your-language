import nodemailer from 'nodemailer'

import { appHost, createPasswordAppPath } from '@/utils/paths'

const transporter = nodemailer.createTransport({
  host: process.env.MAILER_HOST,
  port: +process.env.MAILER_PORT!,
  secure: true,
  auth: { user: process.env.MAILER_USER, pass: process.env.MAILER_PASS },
})

export const sendCreatePassMail = async ({ to, token, name }: { to: string; token: string; name: string }): Promise<void> => {
  try {
    const result = await transporter.sendMail({
      from: { name: 'noreply@language-for-you.online', address: process.env.MAILER_USER! },
      to,
      subject: 'Password creation.',
      html: `
        <p>Hello ${name}, you need to create password for your account.</p>
        <a href='${appHost}${createPasswordAppPath}?token=${token}'>
          Link for password creating
        </a>
        <p>This link will be expired in 30 minutes.</p>
      `,
    })

    console.log('email sending result - ', result)
  } catch (error) {
    console.log('sendCreatePassMail error - ', error)

    throw error
  }
}
