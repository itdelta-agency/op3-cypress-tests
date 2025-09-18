const { ROUTES } = require("../../../support/routes");

describe("CP4. Check Not Acquainted", () => {

  const userNames = Cypress.env('usersArticle');
  let articleName = Cypress.env('articleName');

  beforeEach(function () {
    cy.resetAppState();
    cy.logTestName.call(this);
    cy.admin();
    // cy.changeLang();
  });

  it('checking the ignorance of the article', () => {
    cy.task('logStep', 'Переход на страницу "Отчет" для проверки незнания стaтьи');
    cy.visit(ROUTES.report);
    cy.get('h2').contains('Report').should('be.visible');

    cy.whoCanSee(['Users']);
    cy.get('.px-3.py-1').click();

    cy.get('.grid.grid', { timeout: 30000 }).should('be.visible');
    cy.xpath(`//div[text()='${userNames}']`).scrollIntoView();
    cy.xpath(`//div[text()='${userNames}']`).then($userEl => {
      cy.wrap($userEl).next().click();
      cy.task('logInfo', 'Пользователь не ознакомлен со статьей');
      cy.contains('div', articleName).scrollIntoView().should('be.visible');
    });
    cy.wait(500);
  })
})