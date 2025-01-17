describe("CP7. Clear Data", () => {
  let articleName = Cypress.env('articleName');
  let catName = Cypress.env('categoryName');

  beforeEach(() => {
    cy.admin();
  });

   it('should delete Category)', function () {
       cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Regulations")').click({multiple: true});
       cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Categories")').click({multiple: true});
        cy.contains(catName);
        cy.xpath(`//div[text()='${catName}']/../../../../../td[6]/div/div[2]`).last().click();
        cy.get('button').contains('Delete').click();
        cy.xpath("//p[text()='Success!']").should('be.visible');
    });

  it('delete articles', function () {
    cy.visit('cp/admin/post');
    cy.wait(500);
      cy.searchRow('QA')
      cy.xpath(`(//div[text()='${articleName}'])`).last().click();
    cy.get('button').contains('Delete').click();
    cy.xpath('//div[@class="flex flex-row-reverse justify-start mt-4"]').find("button").contains('Delete').click({force: true});
    cy.xpath("//p[text()='Success!']").should('be.visible');
  });
});