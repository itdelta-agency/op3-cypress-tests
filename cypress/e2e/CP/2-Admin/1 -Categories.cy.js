describe("CP1. Categories List", () => {
    let catName = Cypress.env('categoryName');

    beforeEach(() => {
        cy.admin();
    });

    it('should create Category)', function () {

        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Regulations")').click({multiple: true});
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Categories")').click({multiple: true});

        cy.wait(1000);

        cy.contains('Add category').click();

        // create post
        cy.get('ul li:first input').type(catName);
        cy.xpath("//button[@role='switch']").click();
        cy.wait(500);

        cy.xpath("//button[text()='Save']").should('be.visible').click();
        cy.wait(500);
        cy.contains("Success!").should('be.visible');

        // // check active
        cy.xpath(`//div[text()='${catName}']/../../../../../td[6]`).last().contains('Inactive');
    });
   
    it('should edit Category)', function () {

        cy.visit('cp/admin/category');

        // cy.accessAllItems();
        cy.xpath(`(//div[text()='${catName}'])`).click();
        //
        cy.contains('Edit category');

        cy.xpath("//button[@role='switch']").click();
        cy.wait(500);

        cy.xpath("//button[text()='Save & Close']").should('be.visible').click();
        cy.wait(1000);

        cy.xpath("//p[text()='Success!']").should('be.visible');

         cy.xpath(`//div[text()='${catName}']/../../../../../td[6]`).last().contains('Active');
    });

    after(() => {
        cy.clearCookies();
    });
  
});
