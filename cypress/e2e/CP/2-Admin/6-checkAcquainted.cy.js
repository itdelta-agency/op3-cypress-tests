describe("CP6. Check Acquainted", () => {

  let articleName = Cypress.env('articleName');
  const userNames = Cypress.env('usersArticle');


  beforeEach(() => {
    cy.login();
  });

  it('checking the ignorance of the article', () => {
    cy.visit('cp/admin/report');
    cy.xpath('//button[text()="Show results"]').click();
    cy.wait(1500);

    cy.contains(userNames).next().next().click();
    cy.contains(articleName).scrollIntoView().click({force: true});
  });
});