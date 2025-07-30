const { ROUTES } = require("../../../support/routes");

describe('OrgBoard.A1. Create position', () => {

    let namePosition = Cypress.env('namePosition');
    let descriptionPosition = Cypress.env('descriptionPosition');
    let lastName = Cypress.env('lastName');
    let editUser = Cypress.env('editUser');


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
                if (checked === 'false') {
                    cy.get("button[role='switch']").click();
                }
            });
        cy.get('input.shadow-sm').eq(1).clear().type(666);
        cy.get('textarea.shadow-sm').type(descriptionPosition);
        cy.get('.css-19bb58m').eq(0).click().type(lastName);
        cy.get('div').contains(editUser).click();

        cy.xpath("//span[text()='Functions']").next().type(descriptionPosition);
        cy.xpath("//span[text()='VFP']").next().type(descriptionPosition);

        cy.xpath("//button[text()='Save']").click();
        cy.wait(500);
        cy.contains("Success").should('be.visible');
    })
})