/* eslint-disable max-len */
import nodemailer from 'nodemailer'

import { appHost, createPasswordAppPath, recoverPasswordAppPath } from '@/utils/paths'

const transporter = nodemailer.createTransport({
  host: process.env.MAILER_HOST,
  port: +process.env.MAILER_PORT!,
  secure: true,
  auth: { user: process.env.MAILER_USER, pass: process.env.MAILER_PASS },
})

const getEmailTemplate = ({
  token,
  text,
  btnText,
  url,
  name,
}: {
  token: string
  text: string
  btnText: string
  url: string
  name: string
}) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Create Your Password</title>
    </head>
    <body style="margin:0; padding:0; background:#f4f4f4; font-family:Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; padding:40px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

              <!-- Logo / Header -->
              <tr>
                <td align="center" style="padding-bottom: 20px;">
                  <a href="${appHost}" target="_blank" style="text-decoration:none; color:#4A6CF7; font-size:28px; font-weight:bold;">
                    Language Bro
                  </a>
                </td>
              </tr>

              <!-- Greeting -->
              <tr>
                <td style="font-size:16px; line-height:24px; color:#333;">
                  <p style="margin:0 0 16px 0;">Hello ${name},</p>
                  <p style="margin:0 0 24px 0;">
                    ${text}
                  </p>
                </td>
              </tr>

              <!-- Button -->
              <tr>
                <td align="center" style="padding: 20px 0;">
                  <a href="${appHost}${url}?token=${token}"
                    style="background:#4A6CF7; color:#ffffff; padding:14px 28px; border-radius:8px; text-decoration:none; font-size:16px; font-weight:600;">
                    ${btnText}
                  </a>
                </td>
              </tr>

              <!-- Fallback link -->
              <tr>
                <td style="font-size:14px; color:#555; line-height:20px; padding-bottom:20px;">
                  <p style="margin:0;">
                    If the button doesn't work, copy and paste this URL into your browser:
                  </p>
                  <p style="word-break:break-all; margin-top:8px;">
                    <a href="${appHost}${url}?token=${token}" style="color:#4A6CF7;">
                      ${appHost}${url}?token=${token}
                    </a>
                  </p>
                </td>
              </tr>

              <!-- Expiration -->
              <tr>
                <td style="font-size:14px; color:#999; line-height:20px;">
                  <p style="margin:0;">This link will expire in <strong>30 minutes</strong>.</p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td align="center" style="padding-top: 30px; font-size:12px; color:#aaa;">
                  © ${new Date().getFullYear()} Language Bro.
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
`

export const sendCreatePassMail = async ({
  to,
  token,
  name,
  locale,
}: {
  to: string
  token: string
  name: string
  locale: string
}): Promise<void> => {
  const text = 'To complete your account setup, please create a password using the secure link below:'
  const btnText = 'Create Password'

  try {
    const result = await transporter.sendMail({
      from: { name: `noreply@${appHost}`, address: process.env.MAILER_USER! },
      to,
      subject: 'Password creation.',
      html: getEmailTemplate({ name, token, text, btnText, url: `/${locale}${createPasswordAppPath}` }),
    })

    console.log('email sending result - ', result)
  } catch (error) {
    console.log('sendCreatePassMail error - ', error)

    throw error
  }
}

export const sendRecoverPassMail = async ({
  to,
  token,
  locale,
}: {
  to: string
  token: string
  locale: string
}): Promise<void> => {
  const text = 'This is the link to recover your password:'

  try {
    const result = await transporter.sendMail({
      from: { name: `noreply@${appHost}`, address: process.env.MAILER_USER! },
      to,
      subject: 'Password recovery.',
      html: getEmailTemplate({
        text,
        btnText: 'Password recovery',
        token,
        url: `/${locale}${recoverPasswordAppPath}`,
        name: 'user',
      }),
    })

    console.log('email sending result - ', result)
  } catch (error) {
    console.log('sendRecoverPassMail error - ', error)

    throw error
  }
}

export const sendContactUsMail = async ({ email, subject, text }: { email: string; subject: string; text: string }) => {
  try {
    const result = await transporter.sendMail({
      from: { name: `noreply-support@${appHost}`, address: process.env.MAILER_USER! },
      to: process.env.MAILER_USER,
      subject: 'Email for language-bro support team.',
      html: `
        <p>Subject: ${subject}</p>
        <p>From user: ${email}</p>
        <p>Message: ${text}</p>
      `,
    })

    console.log('email sending result - ', result)
  } catch (error) {
    console.log('sendContactUsMail error - ', error)

    throw error
  }
}
