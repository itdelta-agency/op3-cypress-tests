describe("CP1. Categories List", () => {
    let catName = Cypress.env('categoryName');

    beforeEach(() => {
        cy.login();
    });

    it('should create Category)', function () {
        cy.visit('admin/cp/category');
        cy.contains('Categories').click();
        cy.contains('Add category').click();

        // create post
        cy.get('ul li:first input').type(catName);
        cy.xpath("//button[@role='switch']").click();
        cy.wait(500);

        cy.xpath("//button[text()='Save']").should('be.visible').click();
        cy.wait(500);
        cy.contains("Success!").should('be.visible');

        // check active 
        cy.xpath(`//div[text()='${catName}']/../../../../../td[5]`).last().contains('Inactive');
    });
   
    it('should edit Category)', function () {

        cy.visit('admin/cp/category');

        // cy.accessAllItems();
        cy.xpath(`(//div[text()='${catName}'])`).last().click();
        //
        cy.contains('Edit category');

        cy.xpath("//button[@role='switch']").click();
        cy.wait(500);

        cy.xpath("//button[text()='Save & Close']").should('be.visible').click();
        cy.wait(1000);

        cy.xpath("//p[text()='Success!']").should('be.visible');

        cy.xpath(`//div[text()='${catName}']/../../../../../td[5]`).last().contains('Active');
    });

    after(() => {
        cy.clearCookies();
    });
  
});
