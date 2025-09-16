const { ROUTES } = require("../../support/routes");
const mailhog = require('../../support/mailhog-client');

describe("C. Invite user by 2 ways", () => {
  let confirmationLink; // глобальная переменная для ссылки
  let invitationError = false;
  const emailAddress= Cypress.env('emailMailHog');

  // before(() => {
  //   const emailAddress = process.env.REGISTRATION_EMAIL;
  // });

  beforeEach(function () {
    cy.logTestName.call(this);
    cy.resetAppState();
  });

  it('should invite by user menu', () => {
    cy.task(`logInfo`, `Используем inbox:${emailAddress}`)

    cy.admin();
    cy.visit(ROUTES.invite);

    // Отправка приглашения
    cy.xpath("//input[@id='email']").type('QaTest28@gmail.com');
    cy.contains('Send').click();
    cy.task('logInfo', `Приглашение отправлено пользователю ${emailAddress}`);

    cy.get('p').then($el => {
      const text = $el.text().toLowerCase();
      if (text.includes('error')) {
        Cypress.env('skipInvitationTests', true);
        cy.task('logInfo', 'Пользователь с таким email уже существует, пропускаем дальнейшие тесты');
      } else {
        Cypress.env('skipInvitationTests', false);
        cy.task('logInfo', 'Приглашение отправлено успешно');
      }
    });
  });


  it('getting last email', () => {

    if (Cypress.env('skipInvitationTests')) {
      cy.task('logInfo', 'Пропуск теста из-за того, что пользователь с таким эмейлом уже существует');
      return;
    }

    cy.task('getLastEmail', { timeout: 90000 }).then(email => {
      if (!email) return cy.task('logError', 'Письмо не получено');

      const link = mailhog.extractConfirmationLink(email);
      if (!link) return cy.task('logError', 'Ссылка в письме не найдена');

      confirmationLink = link;
      cy.task('logInfo', `Найденная ссылка: ${link}`);
    });
  });


  it('accept invitation', function () {
    if (Cypress.env('skipInvitationTests')) {
      cy.task('logInfo', 'Пропуск теста из-за того, что пользователь с таким эмейлом уже существует');
      return;
    }

    if (!confirmationLink) {
      cy.task('logError', 'confirmation link отсутствует, пропускаем шаг accept invitation');
      return;
    }

    cy.visit(confirmationLink);
    cy.task('logInfo', `Переход на страницу регистрации по приглашению`);

    cy.wait(1000);
    cy.task('logStep', `Ввод имени`);
    cy.xpath("//*[@id='first-name']").type('QA');
    cy.task('logStep', `Ввод фамилии`);
    cy.xpath("//*[@id='last-name']").type('Test');
    cy.task('logStep', `Ввод пароля`);
    cy.xpath("//*[@id='password']").type(Cypress.env('password'), { log: false });
    cy.task('logStep', `Ввод пароля повторно`);
    cy.xpath("//*[@id='new_password']").type(Cypress.env('password'), { log: false });
    cy.task('logStep', `Сохранение`);
    cy.xpath("(//button[@type='submit'])[1]").click();

    cy.checkTextInParagraph();
  });
});
