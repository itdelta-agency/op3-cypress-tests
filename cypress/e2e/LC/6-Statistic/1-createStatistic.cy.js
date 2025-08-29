import { ROUTES } from "../../../support/routes";

describe('Statistic.ST1. Create Statistic', () => {
    let namePosition = Cypress.env('namePosition');
    let statisticName = Cypress.env('statisticName');



    beforeEach(function () {
        cy.resetAppState();
        cy.logTestName.call(this);
        cy.admin();
    });

    it('should create statistics', function () {
        cy.visit(ROUTES.statistics);
        cy.wait(500);

        cy.contains('Add statistics').click();
        cy.wait(1500);

        cy.get('input.shadow-sm').type(statisticName);
        cy.get("button[role='switch']").eq(0)
            .invoke('attr', 'aria-checked')
            .then(checked => {
                if (checked === 'false') {
                    cy.get("button[role='switch']").eq(0).click();
                }
            });

        cy.get('div.css-19bb58m input[role="combobox"]').eq(0)
            .click({ force: true });
        cy.get('div[role="option"]')
            .first()
            .click({ force: true });

        cy.xpath("//span[text()='Post *']").next().children().click();
        cy.xpath("//span[text()='Post *']").next().children().type(namePosition);
        cy.contains('div', namePosition).click();

        cy.whoCanSee(['Users', 'Departments', 'Teams', 'Others']);



        cy.get('input.shadow-sm').type(statisticName);
        cy.get("button[role='switch']").eq(1)
            .invoke('attr', 'aria-checked')
            .then(checked => {
                if (checked === 'false') {
                    cy.get("button[role='switch']").eq(1).click();
                }
            });

        cy.get('input.shadow-sm').type(statisticName);
        cy.get("button[role='switch']").eq(2)
            .invoke('attr', 'aria-checked')
            .then(checked => {
                if (checked === 'false') {
                    cy.get("button[role='switch']").eq(2).click();
                }
            });
        cy.get('input.shadow-sm').type(statisticName);
        cy.get("button[role='switch']").eq(3)
            .invoke('attr', 'aria-checked')
            .then(checked => {
                if (checked === 'true') {
                    cy.get("button[role='switch']").eq(3).click();
                }
            });
        cy.xpath("//button[text()='Save']").click();
        cy.checkTextInParagraph();
    })
})