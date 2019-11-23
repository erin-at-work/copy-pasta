require('dotenv').config()
const withCSS = require('@zeit/next-css')

module.exports = withCSS({
  env: {
    TEST_VAR: process.env.TEST_VAR,
  },
})