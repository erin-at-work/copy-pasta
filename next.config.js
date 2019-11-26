const withCSS = require('@zeit/next-css')
const isProduction = process.env.NODE_ENV === 'production';

require('dotenv').config({
  path: isProduction ? `./.env.production` : './.env',
})

module.exports = withCSS({
  env: {
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
    API_URL: process.env.API_URL
  }
})