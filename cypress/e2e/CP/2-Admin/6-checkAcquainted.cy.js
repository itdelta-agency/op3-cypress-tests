describe("CP6. Check Acquainted", () => {

  let articleName = Cypress.env('articleName');
  const userNames = Cypress.env('usersArticle');


  beforeEach(() => {
    cy.admin();
  });

  it('checking the ignorance of the article', () => {
    cy.searchReport(userNames);
    cy.wait(1000);
    cy.contains('div', userNames).next().next().click();
    cy.contains(articleName).scrollIntoView().click({force: true});
  });
});