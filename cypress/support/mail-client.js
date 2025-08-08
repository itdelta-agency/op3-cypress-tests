require('dotenv').config(); 

const { MailSlurp } = require('mailslurp-client');
const mailslurp = new MailSlurp({ apiKey: process.env.MAILSLURP_API_KEY });

module.exports = mailslurp;