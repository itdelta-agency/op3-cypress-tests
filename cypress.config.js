require('dotenv').config();
const { defineConfig } = require("cypress");
const mailhog = require('./cypress/support/mailhog-client'); // MailHog client
const { getLoggingTasks } = require('./setupLogging');
const allureWriter = require('@shelex/cypress-allure-plugin/writer');

module.exports = defineConfig({
  chromeWebSecurity: false,
  env: {
    lessonSuccess: "Lesson successfully completed!",
    registrationEmail: "QAtest+" + Math.random() * 100 + "@lc.com",
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
    authEmail: process.env.QA_TEST_LOGIN,
    authPassword: process.env.QA_TEST_PASSWORD,
    courseGroupName: "QA Test Course Group",
    curriculumName: "QA Test Curriculum",
    teamName: "Qa Test Team",
    courseName: "QA Test Course",
    lessonCheckboxRadio: "QA Test lesson (checkbox + radio)",
    lessonText: "QA Test lesson (text)",
    lessonTimer: "QA Test lesson (timer)",
    qaUser: 'QA Test',
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
    passName: "IT-DELTA",
    passUrl: "https://tenant1.release.company-policy.com/",
    passLogin: "Login",
    passPassword: "123123",
    passDescription: "Pass description: Convenient application!",
  },
  defaultCommandTimeout: 15000,
  requestTimeout: 30000,
  viewportHeight: 800,
  viewportWidth: 800,

  e2e: {
    baseUrl: process.env.URL,
    prodUrl: 'https://qa-testing.org-online.ru/',
    registerUrl: 'https://app.org-online.ru/register',
    specPattern: "cypress/e2e/**/*.cy.js",

    setupNodeEvents: async (on, config) => {
      const loggingTasks = getLoggingTasks();

      on('task', {
        ...loggingTasks,

        // Ждём новое письмо с MailHog
  getLastEmail: async ({ timeout = 60000 }) => {
    try {
      const email = await mailhog.getLastEmail(timeout);
      return email || null;
    } catch (err) {
      console.error('[task] mail client error:', err.message || err);
      return null;
    }
  },

        getConfirmationLink: async () => {
          const email = await mailhog.waitForLatestEmail(60000);
          return mailhog.extractConfirmationLink(email);
        },
      });

      allureWriter(on, config);
      return config;
    }
  },
});
