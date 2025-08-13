describe("CP6. Check Acquainted", () => {

  let articleName = Cypress.env('articleName');
  const userNames = Cypress.env('usersArticle');


  beforeEach(function () {
    cy.logTestName.call(this);
    cy.admin();
  });


  it('checking the ignorance of the article', () => {
    cy.task('logStep', 'Переход на страницу отчета, для проверки, что пользователь ознакомлен со статьей');

    cy.get('.flex.justify-between', { timeout: 10000 }).eq(1).then($tab => {
      const isExpanded = $tab.attr('aria-expanded') === 'true';  // true если открыта
      if (!isExpanded) {
        cy.wrap($tab).click();
      }
    });
    cy.get('a.text-indigo-100',).eq(2).click();
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