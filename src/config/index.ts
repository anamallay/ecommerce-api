import 'dotenv/config'
export const dev = {
  app: {
    port: Number(process.env.PORT) || 3003,
    defaultImagePath:
      process.env.DEFAULT_IMG_PATH || 'public/images/default.png',
    userActivationkey: process.env.JWT_USER_ACTIVATION_KEY || 'shhh',
    SmtpUsername: process.env.SMTP_USERNAME || 'amalalikhardli@gmail.com',
    SmtpPassoword: process.env.SMTP_PASSWORD || 'aaaa',
  },
  db: {
    url: process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/ecommerce-api',
  },
}
