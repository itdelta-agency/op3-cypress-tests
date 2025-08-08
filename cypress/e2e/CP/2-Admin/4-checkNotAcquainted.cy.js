describe("CP4. Check Not Acquainted", () => {

  const userNames = Cypress.env('usersArticle');
  let articleName = Cypress.env('articleName');

  beforeEach(() => {
    cy.resetAppState();
    cy.admin();
  });

  it('checking the ignorance of the article', () => {
    cy.get('.flex.justify-between', { timeout: 10000 }).eq(1).then($tab => {
      const isExpanded = $tab.attr('aria-expanded') === 'true';  // true если открыта
      if (!isExpanded) {
        cy.wrap($tab).click();
      }
    });
    cy.get('a.text-indigo-100',).eq(2).click();
    cy.wait(2000);

    cy.whoCanSee(['Users']);
    cy.get('.px-3.py-1').click();

    cy.xpath(`//div[text()='${userNames}']`).scrollIntoView();
    cy.xpath(`//div[text()='${userNames}']`).then($userEl => {
      cy.wrap($userEl).next().click();

      // После клика нужно заново искать элемент с articleName,
      // так как DOM мог обновиться
      cy.contains('div', articleName).scrollIntoView().should('be.visible');
    });
    cy.wait(500);
  })
})