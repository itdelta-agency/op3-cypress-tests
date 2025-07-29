const { ROUTES } = require("../../../support/routes");

describe('OrgBoard.A1. Create position', () => {
    let namePosition = 'QA position';
    let description = 'QA QA position'
    let editUser = Cypress.env('editUser');
    let userEmail
    // before(() => {
    //         cy.task("getEmailAccount").then((email) => {
    //             cy.log(email);
    //             userEmail = email;
    //         })
    // });

    beforeEach(() => {
        cy.admin();
    });

    it('should create position', function () {
        cy.visit(ROUTES.position);
        cy.wait(1000);
        cy.contains('Add').click();
        cy.wait(1500);

        cy.get('input.shadow-sm').eq(0).type(namePosition);
        cy.get("button[role='switch']")
            .invoke('attr', 'aria-checked')
            .then(checked => {
                if (checked === 'false' || checked === undefined) {
                    cy.get("button[role='switch']").click();
                }
            });
        cy.get('input.shadow-sm').eq(1).type(666);
        cy.get('textarea.shadow-sm').type(description);
        cy.get('.css-19bb58m').click().type('USER');
        cy.get('div').contains('editUser').click();

        cy.xpath("//span[text()='Functions']").next().type(description);
        cy.xpath("//span[text()='VFP']").next().type(description);

        cy.xpath("//button[text()='Save']").click();
        cy.wait(500);
        cy.contains("Success").should('be.visible');
    })
})