describe("CP4. Check Not Acquainted", () => {

  const userNames = Cypress.env('usersArticle');
  let articleName = Cypress.env('articleName');

  beforeEach(function () {
    cy.resetAppState();
    cy.logTestName.call(this);
    cy.admin();
  });

  it('checking the ignorance of the article', () => {
    cy.task('logStep', 'Переход на страницу "Отчет" для проверки незнания стaтьи');
    cy.get('.flex.justify-between', { timeout: 10000 }).eq(1).then($tab => {
      const isExpanded = $tab.attr('aria-expanded') === 'true';  // true если открыта
      if (!isExpanded) {
        cy.wrap($tab).click();
      }
    });
    cy.get('a.text-indigo-100',).eq(2).click();
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