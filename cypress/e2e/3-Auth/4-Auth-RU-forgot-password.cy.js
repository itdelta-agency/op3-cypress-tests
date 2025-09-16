const { recurse } = require("cypress-recurse");
const mailhog = require('../../support/mailhog-client');

describe('4-Auth-RU-forgot-password.cy.js', () => {

  const userEmail = Cypress.env('authEmail');
  const authPassword = Cypress.env('authPassword');
  const wrong_password = 'wrong_wrong_wrong_wrong_wrong_';

  beforeEach(function () {
    cy.logTestName.call(this);
    cy.visit(Cypress.config().baseUrl);
    // cy.changeLang();
  });

  it('requesting reset-password-email', function () {
    cy.task('logStep', `Клик на кнопку восстановления пароля`);
    cy.get('[data-test-id="request_password_reset_link"]').should('be.visible').click();
    cy.wait(1500);
    cy.task('logStep', `Ввод почты`);
    cy.xpath("//input[@id='email']", { timeout: 10000 }).type(userEmail);
    cy.wait(500);
    cy.get('[data-test-id="submit_button"]').should('be.visible').click();
    cy.wait(500);
    cy.get('body').then($body => {
      if ($body.find(':contains("Error")').length > 0) {
        cy.task('logInfo', 'Сообщение об ошибке найдено');
      } else {
        cy.task('logError', 'Сообщение об ошибке не найдено');
        cy.checkTextInParagraph();
        Cypress.env('emailSent', true);
      }
    });
  });

  it('getting last email', function () {
    if (!Cypress.env('emailSent')) {
      // Логируем через console.log, а потом пропускаем тест
      console.log('Сообщение для восстановления пароля не было отправлено, пропускаем остальную проверку');
      this.skip();
    }
    // Если дошли сюда — значит тест не пропускаем и делаем дальше логирование через cy.task (или другие действия)
    cy.task('logInfo', 'Тест выполняется, все условия выполнены');

    cy.task('getLastEmail', { timeout: 90000 }).then(email => {
      if (!email) return cy.task('logError', 'Письмо не получено');

      const link = mailhog.extractConfirmationLink(email);
      if (!link) return cy.task('logError', 'Ссылка в письме не найдена');

      confirmationLink = link;
      cy.task('logInfo', `Найденная ссылка: ${link}`);
    });
     cy.visit(confirmationLink);
  

  // Дальше тест по смене пароля без изменений
  cy.wait(2000);
  cy.changeLangAuth();

  // Invalid Data
  cy.task('logStep', `Ввод пароля ${authPassword}`);
  cy.xpath("//input[@id='password']", { timeout: 10000 }).should('be.visible').type(authPassword);
  cy.task('logStep', `Повторный ввод пароля: ${wrong_password}`);
  cy.xpath("//input[@id='password_confirmation']", { timeout: 10000 }).should('be.visible').type(wrong_password);
  cy.task('logStep', `Сохранение`);
  cy.xpath("//button[@type='submit']", { timeout: 10000 }).should('be.visible').click();
  cy.wait(500);
  cy.task('logInfo', `Получено сообщение об ошибке ввода паролей`);
  cy.contains('Значение поля Пароль не совпадает с подтверждаемым').should('be.visible');
  cy.wait(500);
  cy.task('logStep', `Ввод пароля ${wrong_password}`);
  cy.xpath("//input[@id='password']", { timeout: 10000 }).clear().type(wrong_password);
  cy.task('logStep', `Повторный ввод пароля: ${authPassword}`);
  cy.xpath("//input[@id='password_confirmation']", { timeout: 10000 }).clear().type(authPassword);
  cy.task('logStep', `Сохранение`);
  cy.xpath("//button[@type='submit']", { timeout: 10000 }).should('be.visible').click();
  cy.wait(500);
  cy.task('logInfo', `Получено сообщение об ошибке ввода паролей`);
  cy.contains('Значение поля Пароль не совпадает с подтверждаемым').should('be.visible');
  cy.wait(500);

  // Valid Data
  cy.task('logStep', `Ввод пароля ${authPassword}`);
  cy.xpath("//input[@id='password']", { timeout: 10000 }).should('be.visible').clear().type(authPassword);
  cy.task('logStep', `Повторный ввод пароля: ${authPassword}`);
  cy.xpath("//input[@id='password_confirmation']", { timeout: 10000 }).should('be.visible').clear().type(authPassword);
  cy.task('logStep', `Сохранение`);
  cy.xpath("//button[@type='submit']", { timeout: 10000 }).should('be.visible').click();
  cy.wait(3000);
  cy.login(userEmail, authPassword);
});
});
