const { ROUTES } = require("../../../support/routes");

describe("CP6. Check Acquainted", () => {

  let articleName = Cypress.env('articleName');
  const userNames = Cypress.env('usersArticle');


  beforeEach(function () {
    cy.resetAppState();
    cy.logTestName.call(this);
    cy.admin();
    // cy.changeLang();
  });


  it('checking the ignorance of the article', () => {
    cy.task('logStep', 'Переход на страницу отчета, для проверки, что пользователь ознакомлен со статьей');

    cy.visit(ROUTES.report);

    cy.get('h2').contains('Report').should('be.visible');
    cy.whoCanSee(['Users']);
    cy.wait(500);
    cy.get('.px-3.py-1').click();

    cy.get('.grid.grid', { timeout: 30000 }).should('be.visible');
    cy.xpath(`//div[text()='${userNames}']`).next().next().scrollIntoView()
      .click().type(articleName);

    // Проверка, что статья в колонке "Ознакомлен"
    cy.task('logInfo', 'Пользователь ознакомлен со статьей');
    cy.contains(articleName).scrollIntoView().click({ force: true });

  });
});