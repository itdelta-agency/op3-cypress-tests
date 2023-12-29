const { defineConfig } = require("cypress");
const allureWriter = require('@shelex/cypress-allure-plugin/writer');
const makeEmailAccount = require('./cypress/support/email-account new');
require('dotenv').config();

module.exports = defineConfig({
  chromeWebSecurity: false,
  env: {
    lessonSuccess: "Lesson successfully completed!",
    registrationEmail: "QAtest+" + Math.random() * 100 + "@lc.com",
    email:  process.env.EMAIL,
    password: process.env.PASSWORD,
    authEmail: process.env.QA_TEST_LOGIN,
    authPassword: process.env.QA_TEST_PASSWORD,
    courseGroupName: "QA Test Course Group",
    curriculumName: "QA Test Curriculum",
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
    shouldSkipEduTests: 'shouldSkipEduTests',
    categoryName: 'QA Test Category',
    articleName: 'QA Test Article',
    usersArticle: "first-name last-name",
  },
  defaultCommandTimeout: 3000,
  requestTimeout: 30000,
  viewportHeight: 800,
  viewportWidth: 800,
  e2e: {
    baseUrl: process.env.URL,
    setupNodeEvents: async (on, config) => {
  
      const emailAccount = await makeEmailAccount();

      on('task', {
        getUserEmail() {
          return emailAccount.user;
        },
        getLastEmail(params) {
          return emailAccount.getLastEmail(params);
        },
        sendEmail() {
          return emailAccount.sendEmail();
        },
        getAccount(params) {
          return emailAccount.openMessage(params);
        }
      });

      allureWriter(on, config);
      return config;
    },
  },
});
