describe("CP5. Familiarization with the article", () => {

  const article = Cypress.env('articleName');

  before(() => {
  });

  beforeEach(() => {
    cy.login();
  });

  it('checking the ignorance of the article', () => {
    cy.visit('/cp');

    cy.xpath('//div[text()="Not acquainted"]').click();
    cy.wait(500);

    cy.xpath(`//a[text()="${article}"]`).click();

    cy.wait(500);

    cy.xpath("//label[text()='Answer 1']").click();
    cy.xpath("//button[text()='Next']").click();
    cy.wait(500);
    cy.xpath("//label[text()='Answer 3']").click();
    cy.xpath("//button[text()='Check it']").click();
    cy.wait(500);

    cy.xpath("//div[text()='Congratulations!']", { timeout: 5000 }).should('be.visible')
  });

});