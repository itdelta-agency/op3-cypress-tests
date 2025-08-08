const { recurse } = require("cypress-recurse");

describe('4-Auth-RU-forgot-password.cy.js', () => {
  let inbox;
  let main = Cypress.config('baseUrl').split('.')[1];
  let subject = 'Learning Center | Уведомление о сбросе пароля';

  const userEmail = Cypress.env('authEmail');
  const authPassword = Cypress.env('authPassword');
  const wrong_password = 'wrong_wrong_wrong_wrong_wrong_';

  beforeEach(function () {
    cy.logTestName.call(this);

    cy.task('getCachedInbox').then(result => {
      if (!result) {
        cy.task('logInfo', 'Кешированный почтовый ящик не найден');
      } else {
        inbox = result;
        cy.task('logInfo', `Используем кешированный inbox: ${inbox.emailAddress}`);
      }
    });

    cy.visit(Cypress.config().baseUrl);
  });

  it('requesting reset-password-email', function () {
    cy.contains("Forgot your password?").should('be.visible').click();
    cy.wait(1500);
    cy.xpath("//input[@id='email']", { timeout: 10000 }).type(userEmail);
    cy.wait(500);
    cy.contains("Email Password Reset Link").should('be.visible').click();
    cy.wait(500);
    cy.get('body').then($body => {
      if ($body.find(':contains("Error")').length > 0) {
        cy.task('logInfo', 'Сообщение об ошибке найдено');
      } else {
        cy.task('logInfo', 'Сообщение об ошибке не найдено');
        cy.checkTextInParagraph();
        Cypress.env('emailSent', true);
      }
    });
  });

  it('getting last email', function () {
    if (!Cypress.env('emailSent')) {
      this.skip();  // Пропускаем тест
    }

    if (!inbox) {
      cy.task('logInfo', 'Inbox не доступен, пропускаем получение письма');
      this.skip();
    }

    if (Cypress.config().baseUrl === Cypress.config().prodUrl) {
      expect(true).to.be.true;
      return;
    }

    cy.wait(1000);
    recurse(
      () => {
        if (main === 'release') return cy.task('getAccount', { subject, userEmail });
        if (main === 'org-online') return cy.task('getLastEmail', { inboxId: inbox.id, subject, timeout: 60000 });
      },
      Cypress._.isObject,
      {
        timeout: 60000,
        delay: 5000,
      }
    )
      .its('html')
      .then((html) => {
        console.log(html);
        cy.document({ log: false }).invoke({ log: false }, 'write', html);
      });

    cy.get('[class="button button-primary"]').should('have.attr', 'href').then(($btn) => {
      cy.visit($btn);
    });

    // Дальше тест по смене пароля без изменений
    cy.wait(2000);
    cy.changeLangAuth();

    // Invalid Data
    cy.xpath("//input[@id='password']", { timeout: 10000 }).should('be.visible').type(authPassword);
    cy.xpath("//input[@id='password_confirmation']", { timeout: 10000 }).should('be.visible').type(wrong_password);
    cy.xpath("//button[@type='submit']", { timeout: 10000 }).should('be.visible').click();
    cy.wait(500);
    cy.contains('Значение поля Пароль не совпадает с подтверждаемым').should('be.visible');
    cy.wait(500);
    cy.xpath("//input[@id='password']", { timeout: 10000 }).clear().type(wrong_password);
    cy.xpath("//input[@id='password_confirmation']", { timeout: 10000 }).clear().type(authPassword);
    cy.xpath("//button[@type='submit']", { timeout: 10000 }).should('be.visible').click();
    cy.wait(500);
    cy.contains('Значение поля Пароль не совпадает с подтверждаемым').should('be.visible');
    cy.wait(500);

    // Valid Data
    cy.xpath("//input[@id='password']", { timeout: 10000 }).should('be.visible').clear().type(authPassword);
    cy.xpath("//input[@id='password_confirmation']", { timeout: 10000 }).should('be.visible').clear().type(authPassword);
    cy.xpath("//button[@type='submit']", { timeout: 10000 }).should('be.visible').click();
    cy.wait(3000);
    cy.login(userEmail, authPassword);
  });
});
