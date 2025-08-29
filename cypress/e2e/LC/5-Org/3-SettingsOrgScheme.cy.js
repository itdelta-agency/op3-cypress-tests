import { ROUTES } from "../../../support/routes";

describe('OrgBoard.A4.Settings', () => {

    let namePosition = Cypress.env('namePosition');

    beforeEach(function () {
        cy.resetAppState();
        cy.logTestName.call(this);
        cy.admin();
    });

    it('edit settings', function () {
        cy.get('a.text-indigo-100').contains('Settings').click();
        cy.wait(1500);
        cy.xpath("//a[@name='OrgScheme']").click();
        cy.wait(1500);

        cy.get('.shadow-sm').eq(0).clear().type('QA COMPANY');
        cy.get('.shadow-sm').eq(1).clear().type('QA COMPANY DESCRIPTION');

        cy.get('div.css-19bb58m').eq(0).type('QA position');
        cy.get('div[role="listbox"]')
            .should('be.visible')
            .find('div[role="option"]')
            .first()
            .click({ force: true });




        cy.xpath("//button[text()='Save']").click();
        cy.checkTextInParagraph();
    })

    it('check save data', function () {
        cy.visit(ROUTES.settings);
        cy.wait(500);
        cy.get('h2').contains('Settings').should('be.visible');
        cy.xpath("//a[@name='OrgScheme']").click();
        cy.wait(1000);
        cy.contains('QA COMPANY').should('be.visible');
        cy.contains('QA COMPANY DESCRIPTION').should('be.visible');
        cy.contains(namePosition).should('be.visible');
    })

    it('defalut settings', function () {
        cy.visit(ROUTES.settings);
        cy.wait(500);
        cy.get('h2').contains('Settings').should('be.visible');
        cy.xpath("//a[@name='OrgScheme']").click();
        cy.wait(1000);
        cy.xpath("//span[text()='Company name']").next().clear().type('Производственная Компания №1');
        cy.xpath("//span[text()='VFP']").next().clear().type('Изделия из металла высокого качества, используемые широким кругом профессионалов при строительстве сооружений по всей России');
        cy.contains(namePosition).next().click();
        cy.xpath("//button[text()='Save']").click();
        cy.checkTextInParagraph();

    })
})
