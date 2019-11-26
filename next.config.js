const withCSS = require('@zeit/next-css')
const isProduction = process.env.NODE_ENV === 'production';

require('dotenv').config({
  path: isProduction ? `./.env.production` : './.env',
})

module.exports = withCSS({
  env: {
    firebase_api_key: process.env.firebase_api_key,
    firebase_auth_domain: process.env.firebase_auth_domain,
    firebase_database_url: process.env.firebase_database_url,
    api_url: process.env.api_url,
  },
})