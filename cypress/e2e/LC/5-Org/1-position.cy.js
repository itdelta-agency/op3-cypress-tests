describe('OrgBoard.A1. Create position', () => {
    const position = 'QA position';
    const description = 'QA QA position'
    let userEmail
    before(() => {
        cy.task("getUserEmail").then((user) => {
            cy.log(user.email);
            cy.log(user.pass);
            userEmail = user.email;
        })
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
        cy.xpath("//span[text()='Valuable End Product']").next().type(description);

        cy.xpath("//button[text()='Save']").click();
        cy.wait(500);
        cy.contains("Success").should('be.visible');
    })
})