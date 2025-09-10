const { ROUTES } = require("../../support/routes");
const mailhog = require('../../support/mailhog-client');

describe("C. Invite user by 2 ways", () => {
  let confirmationLink; // глобальная переменная для ссылки

  before(() => {
    const emailAddress = process.env.REGISTRATION_EMAIL || 'test@example.com';
    Cypress.env('inboxEmail', emailAddress);
    cy.log('📬 Используем inbox:', emailAddress);
  });

  beforeEach(function () {
    cy.logTestName.call(this);
    cy.resetAppState();
  });

  it('should invite by user menu', () => {
    const inboxEmail = Cypress.env('inboxEmail');
    expect(inboxEmail).to.exist;

    cy.admin();
    cy.visit(ROUTES.invite);

    // Отправка приглашения
    cy.xpath("//input[@id='email']").type(inboxEmail);
    cy.contains('Send').click();
    cy.task('logInfo', `Приглашение отправлено пользователю ${inboxEmail}`);
  });


  it('getting last email', () => {
    cy.task('getLastEmail', { timeout: 90000 }).then(email => {
      if (!email) return cy.task('logError', 'Письмо не получено');

      const link = mailhog.extractConfirmationLink(email);
      if (!link) return cy.task('logError', 'Ссылка в письме не найдена');

      confirmationLink = link;
      cy.task('logInfo', `Найденная ссылка: ${link}`);
    });
  });


  it('accept invitation', function () {
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
