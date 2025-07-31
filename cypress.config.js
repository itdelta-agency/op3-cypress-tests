const { defineConfig } = require("cypress");
const makeEmailAccount = require('./cypress/support/email-account');
const getLastInboxByCreatedDate = require('./cypress/support/get-last-inbox');

const allureWriter = require('@shelex/cypress-allure-plugin/writer');
const emailApi = require('./cypress/support/emailApi');
const { MailSlurp } = require('mailslurp-client');
const mailslurp = new MailSlurp({ apiKey: process.env.MAILSLURP_API_KEY });
require('dotenv').config();

module.exports = defineConfig({
  chromeWebSecurity: false,
  env: {
    lessonSuccess: "Lesson successfully completed!",
    registrationEmail: "QAtest+" + Math.random() * 100 + "@lc.com",
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
    authEmail: process.env.QA_TEST_LOGIN,
    authPassword: process.env.QA_TEST_PASSWORD,
    leadSecretKey: process.env.BITRIX24_SECRET_KEY,
    leadUrl: process.env.BITRIX24_URL,
    leadUserId: process.env.BITRIX24_USER_ID,
    courseGroupName: "QA Test Course Group",
    curriculumName: "QA Test Curriculum",
    teamName: "Qa Test Team",
    courseName: "QA Test Course",
    lessonCheckboxRadio: "QA Test lesson (checkbox + radio)",
    lessonText: "QA Test lesson (text)",
    lessonTimer: "QA Test lesson (timer)",
    courseUser: 'QA Test',
    questionRadio: "radio question",
    questionText: "text question",
    questionCheckbox: "checkbox question",
    answer1: "answer 1",
    answer2: "answer 2",
    answer3: "answer 3",
    namePosition: 'QA position',
    descriptionPosition: 'QA position description ',
    department: 'QA Department name',
    shouldSkipEduTests: 'shouldSkipEduTests',
    categoryName: 'QA Test Category',
    articleName: 'QA Test Article',
    usersArticle: "first-name last-name",
    editUser: 'QA Edit USER',
    firstName: 'QA',
    lastName: 'USER',
    fullName: 'QA USER',
    sortNumb: 666,
    statisticName: 'Statistic name',


  },
  defaultCommandTimeout: 3000,
  requestTimeout: 30000,
  viewportHeight: 800,
  viewportWidth: 800,
  e2e: {
    baseUrl: process.env.URL,
    prodUrl: 'https://qa-testing.org-online.ru/',
    registerUrl: 'https://app.org-online.ru/register',
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',



    setupNodeEvents: async (on, config) => {
      const emailAccount = await makeEmailAccount(); // один раз — создаём или получаем inbox
      const account = await emailApi();              // один раз — объект с методами для писем

      on('task', {

        getLastInbox: async () => {
          try {
            const inbox = await getLastInboxByCreatedDate();
            if (!inbox || !inbox.emailAddress) {
              throw new Error('Inbox не получен или невалиден в задаче');
            }
            return inbox;
          } catch (err) {
            console.error('Ошибка в getLastInbox task:', err);
            return null; // Или выбрасывай ошибку
          }
        },

        getLastEmail: async ({ inboxId, timeout = 60000 }) => {
          try {
            const email = await mailslurp.waitForLatestEmail(inboxId, timeout);
            return email;
          } catch (error) {
            throw new Error(`Письмо не пришло в течение ${timeout / 1000} секунд`);
          }
        },
        async getCachedInbox() {
          if (!cachedInbox) {
            cachedInbox = await getLastInboxByDate();
          }
          return cachedInbox;
        },
        resetInboxCache() {
          cachedInbox = null;
          return null;
        },

        getUserEmail() {
          return emailAccount.user;
        },

        sendEmail() {
          return emailAccount.sendEmail ? emailAccount.sendEmail() : null;
        },

        getAccount(params) {
          return emailAccount.openMessage ? emailAccount.openMessage(params) : null;
        },

        getTestAccount() {
          return emailAccount.testAccountCreate ? emailAccount.testAccountCreate() : null;
        },

        getConfirmationLink() {
          return emailAccount.getConfirmationLink();
        },

        getEmailData() {
          return account.getEmailData();
        },

        // Если нужны дополнительные методы, вызывай их через emailAccount или account
      });

      allureWriter(on, config);
      return config;
    }
  },
});