describe("CP4. Check Not Acquainted", () => {

  const userNames = Cypress.env('usersArticle');
  let articleName = Cypress.env('articleName');

  beforeEach(() => {
    cy.admin();
  });

  it('checking the ignorance of the article', () => {
      cy.searchReport(userNames);


    cy.xpath(`//div[text()='${userNames}']`).scrollIntoView();
    cy.xpath(`//div[text()='${userNames}']`).next().click().contains('div', articleName).scrollIntoView().should('be.visible');
    cy.wait(500);
  })
})