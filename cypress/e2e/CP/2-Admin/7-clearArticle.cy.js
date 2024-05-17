describe("CP7. Clear Data", () => {
  let articleName = Cypress.env('articleName');
  let catName = Cypress.env('categoryName');

  beforeEach(() => {
    cy.admin();
  });

   it('should delete Category)', function () {
        cy.visit('admin/cp/category');
        cy.contains(catName);
        cy.xpath(`//div[text()='${catName}']/../../../../../td[6]/div/div[2]`).last().click();
        cy.get('button').contains('Delete').click();
        cy.xpath("//p[text()='Success!']").should('be.visible');
    });

  it('delete articles', function () {
    cy.visit('admin/cp/post');
    cy.wait(500);
    cy.xpath(`//div[text()="${articleName}"]/../../../../../th[5]/div/div[3]`).first().click();
    cy.get('button').contains('Delete').click();
    cy.xpath("//p[text()='Success!']").should('be.visible');
  });
});