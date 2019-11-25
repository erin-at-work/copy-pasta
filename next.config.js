require('dotenv').config()
const withCSS = require('@zeit/next-css')

module.exports = withCSS({
  env: {
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
    FIREBASE_PROEJECT_ID: process.env.FIREBASE_PROEJECT_ID,
  },
})