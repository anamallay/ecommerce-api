import nodemailer from 'nodemailer'
import { dev } from '../config'
import { EmailDataType } from '../types/types'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: dev.app.SmtpUsername,
    pass: dev.app.SmtpPassoword,
  },
})

export const handleSendEmail = async (emailData: EmailDataType) => {
  try {
    const mailOptions = {
      from: dev.app.SmtpUsername,
      to: emailData.email,
      subject: emailData.subject,
      html: emailData.html,
    }
      const info = await transporter.sendMail(mailOptions)
      console.log("message sent successfully", info.response);
      
  } catch (error) {
      console.log(error);
      
  }
}
