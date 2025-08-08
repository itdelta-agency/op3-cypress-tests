const mailslurp = require('./mail-client');
const { getCachedInbox } = require('./getSession'); 

const { JSDOM } = require('jsdom');
const nodemailer = require('nodemailer');
require('dotenv').config();

const makeEmailAccount = async () => {
const inbox = await getCachedInbox();



  const userEmail = {
    user: {
      email: inbox.emailAddress,
      id: inbox.id,
    },

    async getLastEmail() {
      console.log('Waiting for the latest email...');
      try {
        const email = await mailslurp.waitForLatestEmail(inbox.id, 30000);
        return {
          subject: email.subject,
          text: email.body,
          html: email.body,
          attachments: email.attachments || [],
        };
      } catch (error) {
        console.error('Error getting latest email:', error);
        throw error;
      }
    },

    async getConfirmationLink() {
      console.log('⏳ Ждём письмо и ищем ссылку...');
      try {
        const email = await mailslurp.waitForLatestEmail(inbox.id, 30000);
        const html = email.bodyHTML || email.body;
        console.log(' HTML письма загружен. Длина:', html?.length);

        const dom = new JSDOM(html);
        const document = dom.window.document;

        const linkElement = document.querySelector('a.button.button-primary');
        console.log('🔍 Найденный элемент:', linkElement ? linkElement.outerHTML : 'Не найден');

        const confirmationLink = linkElement ? linkElement.href : null;
        console.log('🔗 Ссылка из письма:', confirmationLink);

        return confirmationLink;
      } catch (error) {
        console.error('Ошибка при извлечении ссылки:', error);
        return null;
      }
    },

    // async sendEmail() {
    //   const transporter = nodemailer.createTransport({
    //     host: 'smtp.mailslurp.com',
    //     port: 587,
    //     secure: false,
    //     auth: {
    //       user: process.env.MAILSLURP_SMTP_USERNAME,
    //       pass: process.env.MAILSLURP_SMTP_PASSWORD,
    //     },
    //   });

    //   const info = await transporter.sendMail({
    //     from: `"QA Test" <${inbox.emailAddress}>`,
    //     to: inbox.emailAddress,
    //     subject: 'Hello from MailSlurp',
    //     text: 'Hello world',
    //     html: '<b>Hello world</b>',
    //   });

    //   console.log(' Письмо отправлено: %s', info.messageId);
    //   return info.messageId;
    // },
  };

  return userEmail;
};

module.exports = makeEmailAccount;