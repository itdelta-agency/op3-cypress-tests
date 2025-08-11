require('dotenv').config();
const orderedSpecs = require('./ordered-specs');
const { defineConfig } = require("cypress");
const makeEmailAccount = require('./cypress/support/email-account');
const getLastInboxByCreatedDate = require('./cypress/support/get-last-inbox');
const {getLoggingTasks} = require('./setupLogging');
let cachedInbox = null;
const allureWriter = require('@shelex/cypress-allure-plugin/writer');
const emailApi = require('./cypress/support/emailApi');
const { MailSlurp } = require('mailslurp-client');
const mailslurp = new MailSlurp({ apiKey: process.env.MAILSLURP_API_KEY });


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
    // Pass data
    passName: 'AT-Delta',
    passUrl:  process.env.URL,
    passLogin: process.env.EMAIL,
    passPassword: process.env.PASSWORD,
    passDescription: 'Pass description: Convenient application!'


    
  },
  defaultCommandTimeout: 3000,
  requestTimeout: 30000,
  viewportHeight: 800,
  viewportWidth: 800,

  e2e: {
    baseUrl: process.env.URL,
    prodUrl: 'https://qa-testing.org-online.ru/',
    registerUrl: 'https://app.org-online.ru/register',
    specPattern: `{${orderedSpecs.join(',')}}`,



     setupNodeEvents: async (on, config) => {
      // Кешируем inbox один раз
      if (!cachedInbox) {
        cachedInbox = await getLastInboxByCreatedDate();
        if (!cachedInbox || !cachedInbox.emailAddress) {
          throw new Error('Не удалось получить или создать Inbox');
        }
        console.log('📬 Кешируем inbox:', cachedInbox.emailAddress);
      }

      // Создаём объект emailAccount с уже кешированным inbox
      const emailAccount = await makeEmailAccount(cachedInbox); // Если makeEmailAccount принимает inbox, передай его
      const account = await emailApi();
      const loggingTasks = getLoggingTasks();

      on('task', {
        ...loggingTasks,

        // Возвращаем кешированный inbox, не создаём новый
        getCachedInbox() {
          return cachedInbox;
        },

        getLastInbox: async () => {
          // Можно обновить кеш, если нужно
          cachedInbox = await getLastInboxByCreatedDate();
          return cachedInbox;
        },

        getLastEmail: async ({ timeout = 60000 }) => {
          try {
            return await mailslurp.waitForLatestEmail(cachedInbox.id, timeout);
          } catch (error) {
            throw new Error(`Письмо не пришло в течение ${timeout / 1000} секунд`);
          }
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

       
      });

      allureWriter(on, config);
      return config;
    }
  },
});