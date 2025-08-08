import { ROUTES } from "../../../support/routes";

describe('Password page'), () => {

    passName = Cypress.env('passName');
    passUrl = Cypress.env('passUrl');
    passLogin = Cypress.env('passLogin');
    passPasword = Cypress.env('passPasword');
    passDescription = Cypress.env('passDescription');

    before(() => {
        cy.resetAppState();
    })

    before(() => {
        cy.admin()
    });

    it('should create password ', function() {
        cy.visit(ROUTES.passwords);
        cy.wait(1000);

        cy.contains('Add').click();
        cy.wait(1500);


        cy.get('.w-full.mt-1.text-sm').eq(0).type('passName');
        


    })





}