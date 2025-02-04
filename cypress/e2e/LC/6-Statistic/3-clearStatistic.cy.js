describe('Statistic.ST3. clear data statistic', () => {



    before(() => {
        const ctx = Cypress.mocha.getRunner().suite.ctx
        if (Cypress.config().baseUrl !== Cypress.config().prodUrl) {
            cy.admin();
        } else {
            ctx.skip();
        }
    });

    beforeEach(() => {
        cy.admin();
    });



    it('clearing a value to statistics', function () {
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Statistics")').click({multiple: true});

        cy.contains("a", 'Statistics list').click();

        cy.wait(1000);
        cy.searchRow('Qa');
        cy.xpath(`//div[text()='Qa statistic']`).parent().parent().parent().parent().parent().find('.tooltip').eq(2).scrollIntoView().first().click();
        cy.wait(1000);
        cy.get('tbody tr:first').find('.tooltip').last().click();
        cy.wait(1000);
        cy.xpath('//div[@class="fixed z-40 inset-0 overflow-y-auto"]').find('button:contains("Delete")').click();
        cy.wait(1000)
        cy.contains("Success").should('be.visible');
    })

    it('delete statistic', function () {
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Statistics")').click({multiple: true});

        cy.contains("a", 'Statistics list').click();
        console.log(window.location);
        cy.wait(1500);
        cy.searchRow('Qa');
        cy.xpath(`//div[text()='Qa statistic']`).parent().parent().parent().parent().parent().find('.tooltip').last().scrollIntoView().first().click();
        cy.wait(1000)
        cy.get('button').contains('Delete').click();
        cy.wait(500)
        cy.contains("Success").should('be.visible');
    })

})