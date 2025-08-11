module.exports = [

    // 3-Auth-------------------------------------------
  'cypress/e2e/3-Auth/1-Auth-RU-login.cy.js',
  'cypress/e2e/3-Auth/4-Auth-RU-forgot-password.cy.js',

  // 4-ProfileAndInvite---------------------------------
  'cypress/e2e/4-ProfileAndInvite/1-invite.cy.js',
  'cypress/e2e/4-ProfileAndInvite/2-profile.cy.js',

  // 5- Sttings-----------------------------------------
  'cypress/e2e/5-Settings/settings.cy.js',

  // CP  // 2-Admin-------------------------------------
  'cypress/e2e/CP/2-Admin/1-Categories.cy.js',
  'cypress/e2e/CP/2-Admin/2-Post.cy.js',
  'cypress/e2e/CP/2-Admin/3-chekActive.cy.js',
  'cypress/e2e/CP/2-Admin/4-checkNotAcquainted.cy.js',
  'cypress/e2e/CP/2-Admin/5-familiarizationArticle.cy.js',
  'cypress/e2e/CP/2-Admin/6-checkAcquainted.cy.js',
  'cypress/e2e/CP/2-Admin/7-clearArticle.cy.js',

  // LC // 1-Admin---------------------------------------
  'cypress/e2e/LC/1-Admin/1-course.cy.js',
  'cypress/e2e/LC/1-Admin/2-lesson.cy.js',
  'cypress/e2e/LC/1-Admin/3-courseGroup.cy.js',
  'cypress/e2e/LC/1-Admin/4-curriculum.cy.js',
  'cypress/e2e/LC/1-Admin/5-addUser.cy.js',
  'cypress/e2e/LC/1-Admin/6-team.cy.js',

  // LC // 2-Student------------------------------------
  'cypress/e2e/LC/2-Student/1-courseCompletion.cy.js',
  'cypress/e2e/LC/2-Student/2-searchLearnItems.cy.js',

  // LC // 3-Teacher------------------------------------
  'cypress/e2e/LC/3-Teacher/1-checkStudentAnswers.cy.js',

  // LC // 4-Student------------------------------------
  'cypress/e2e/LC/4-Student/1-assertAnswersChecked.cy.js',

  // LC // 5-Org----------------------------------------
  'cypress/e2e/LC/5-Org/1-position.cy.js',
  'cypress/e2e/LC/5-Org/2-orgScheme.cy.js',
  'cypress/e2e/LC/5-Org/3-SettingsOrgScheme.cy.js',

  // LC // 6-Statistic----------------------------------
  'cypress/e2e/LC/6-Statistic/1-createStatistic.cy.js',
  'cypress/e2e/LC/6-Statistic/2-addStatisticData.cy.js',
  'cypress/e2e/LC/6-Statistic/3-clearStatistic.cy.js',

  // LC // 7-Task---------------------------------------
  'cypress/e2e/LC/7-Task/1-createTask.cy.js',

  // LC // 8-Passwords
  'cypress/e2e/LC/8-Passwords/1-passwords.cy.js',

  // LC // 9-clearData----------------------------------
  'cypress/e2e/LC/9-clearData/1-clearData.cy.js'
];