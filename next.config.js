require('dotenv').config()
const withCSS = require('@zeit/next-css')

module.exports = withCSS({
  env: {
    firebase_api_key: process.env.firebase_api_key,
    firebase_auth_domain: process.env.firebase_auth_domain,
    firebase_database_url: process.env.firebase_database_url,
    api_url: process.env.api_url,
  },
})