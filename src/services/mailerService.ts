import nodemailer from 'nodemailer'

import { appHost, createPasswordAppPath, recoverPasswordAppPath } from '@/utils/paths'

const transporter = nodemailer.createTransport({
  host: process.env.MAILER_HOST,
  port: +process.env.MAILER_PORT!,
  secure: true,
  auth: { user: process.env.MAILER_USER, pass: process.env.MAILER_PASS },
})

export const sendCreatePassMail = async ({ to, token, name }: { to: string; token: string; name: string }): Promise<void> => {
  try {
    const result = await transporter.sendMail({
      from: { name: `noreply@${appHost}`, address: process.env.MAILER_USER! },
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

export const sendRecoverPassMail = async ({ to, token }: { to: string; token: string }): Promise<void> => {
  try {
    const result = await transporter.sendMail({
      from: { name: `noreply@${appHost}`, address: process.env.MAILER_USER! },
      to,
      subject: 'Password recovery.',
      html: `
        <p>Hello, this is your link to recover password.</p>
        <a href='${appHost}${recoverPasswordAppPath}?token=${token}'>
          Link for password recovering
        </a>
        <p>This link will be expired in 30 minutes.</p>
      `,
    })

    console.log('email sending result - ', result)
  } catch (error) {
    console.log('sendRecoverPassMail error - ', error)

    throw error
  }
}
