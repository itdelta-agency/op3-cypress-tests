import { ROUTES } from "../../../support/routes";

describe('Statistic.ST3. clear data statistic', () => {
    let statisticName = Cypress.env('statisticName');


    beforeEach(function () {
        cy.resetAppState();
        cy.logTestName.call(this);
        cy.admin();
    });



    it('clearing a value to statistics', function () {
        cy.visit(ROUTES.statistics);
        cy.wait(500);


        cy.get('body').then($body => {
            if ($body.find('.mt-1.relative.flex').length === 0) {
                cy.xpath("//div[@class='tooltip']").click();
            }
        });

        cy.get('[placeholder="Search"], [placeholder="Поиск"]').eq(1)
            .should('be.visible')
            .clear()
            .wait(100)
            .type(statisticName, { delay: 100 });

        cy.wait(500); // Подожди, пока таблица обновится

        cy.get('tr').contains(statisticName).closest('tr').within(() => {
            // Клик по кнопке "⋯"
            cy.get('.p-2.rounded-full').click();
        });

        // Клик по пункту меню "Statistic data"
        cy.contains('div', /Statistic data\s*/i).click();

        cy.wait(800); // Подождать, пока закроется/откроется что нужно

        // Повторный клик по ⋯
        cy.get('.p-2.rounded-full').click();


        cy.contains('div', /Delete\s*/i).click();
        cy.wait(200);
        cy.contains('button', 'Delete').click();
        cy.checkTextInParagraph();
    })

    it('delete statistic', function () {
        cy.visit(ROUTES.statistics);
        cy.wait(500);


        cy.get('body').then($body => {
            if ($body.find('.mt-1.relative.flex').length === 0) {
                cy.xpath("//div[@class='tooltip']").click();
            }
        });

        cy.get('[placeholder="Search"], [placeholder="Поиск"]').eq(1)
            .should('be.visible')
            .clear()
            .wait(100)
            .type(statisticName, { delay: 100 });

        cy.wait(500); // Подожди, пока таблица обновится

        cy.get('tr').contains(statisticName).closest('tr').within(() => {
            // Клик по кнопке "⋯"
            cy.get('.p-2.rounded-full').click();


            // Клик по пункту меню "Statistic data"
            cy.contains('div', /Delete*/i).click();
        });

        cy.wait(200);
        cy.contains('button', 'Delete').click();
        cy.checkTextInParagraph();;
    })

})
