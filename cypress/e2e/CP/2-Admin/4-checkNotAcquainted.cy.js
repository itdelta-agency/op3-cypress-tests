describe("CP4. Check Not Acquainted", () => {

  const userNames = Cypress.env('usersArticle');
  let articleName = Cypress.env('articleName');

  beforeEach(() => {
    cy.login();
  });

  it('checking the ignorance of the article', () => {
    cy.visit('admin/cp/report');
    cy.contains('Report').click();

    cy.xpath('//button[text()="Show results"]').click();
    cy.wait(3000);


    cy.xpath(`//div[text()='${userNames}']`).scrollIntoView();
    cy.xpath(`//div[text()='${userNames}']`).next().click().contains('div', articleName).scrollIntoView().should('be.visible');
    cy.wait(500);
  })
})