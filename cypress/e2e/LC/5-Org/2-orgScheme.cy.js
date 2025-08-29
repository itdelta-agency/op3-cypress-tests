const { ROUTES } = require("../../../support/routes");

describe('OrgBoard.A2. Create department', () => {
    let department = Cypress.env('department');
    let sortNumb = Cypress.env('sortNumb');
    let namePosition = Cypress.env('namePosition');



    beforeEach(function () {
        cy.resetAppState();
        cy.logTestName.call(this);
        cy.admin();
        cy.visit(ROUTES.orgScheme);
        cy.wait(1000);
        cy.get('h2').contains('OrgBoard').should('be.visible');
        
    });

    it('should create position', function () {
        cy.get('div.px-2.mb-2').click();
        cy.wait(1000);

        cy.get('span').contains('Name *').next().type(department);
        cy.get('.flex-1.shadow-sm').type(sortNumb);

        cy.get('input[role="combobox"]').type(namePosition);
        cy.get('div[role="listbox"]')
            .should('be.visible')
            .find('div[role="option"]')
            .first()
            .click({ force: true });


        cy.xpath("//button[text()='Save']").click();
        cy.checkTextInParagraph();
    })

    it('should create sub position', function () {

        cy.xpath(`//div[text()='${department}']`)
            .scrollIntoView()
            .should('be.visible')
            .click();
        cy.xpath(`//div[text()='${department}']`).next().find('svg').eq(1).click({ force: true });
        cy.wait(1000);

        cy.xpath("//span[text()='Name *']").next().type(department + '2');
        cy.get('.flex-1.shadow-sm').type(sortNumb);
        cy.get('input[role="combobox"]').eq(0).type('Директор');
        cy.get('div[role="listbox"]')
            .should('be.visible')
            .find('div[role="option"]')
            .first()
            .click({ force: true });


        cy.log("Сохраняем");
        cy.xpath("//button[text()='Save']").click();
    })

})

