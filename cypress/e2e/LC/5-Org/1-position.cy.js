describe('OrgBoard.A1. Create position', () => {
    const position = 'QA position';
    const description = 'QA QA position'
    let userEmail
    before(() => {
        const ctx = Cypress.mocha.getRunner().suite.ctx
        if (Cypress.config().baseUrl !== Cypress.config().prodUrl) {
            cy.task("getEmailAccount").then((email) => {
                cy.log(email);
                userEmail = email;
            })
        } else {
            ctx.skip();
        }
    });

    beforeEach(() => {
        cy.admin();
    });

    it('should create position', function () {
        cy.visit('ob/admin/positions');
        cy.wait(3000);
        cy.contains('Add').click();
        cy.wait(1500);

        cy.xpath("//span[text()='Name *']").next().type(position);
        cy.xpath("//button[@role='switch']").click();
        cy.xpath("//span[text()='Description']").next().type(description);
        cy.xpath("//span[text()='user']").next().children().click();
        cy.xpath("//div[text()='Qa User']").scrollIntoView().click();

        cy.xpath("//span[text()='Functions']").next().type(description);
        cy.xpath("//span[text()='VFP']").next().type(description);

        cy.xpath("//button[text()='Save']").click();
        cy.wait(500);
        cy.contains("Success").should('be.visible');
    })
})