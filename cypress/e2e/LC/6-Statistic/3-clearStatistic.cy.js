describe('Statistic.ST3. clear data statistic', () => {



    beforeEach(() => {
        cy.admin();
    });

    it('clearing a value to statistics', function () {
        cy.visit('/st/admin');

        cy.wait(1000);
        cy.searchRow('Qa');
        cy.xpath(`//div[text()='Qa statistic']`).parent().parent().parent().parent().parent().find('.tooltip').eq(2).scrollIntoView().first().click();
        cy.wait(1000);
        cy.get('tbody tr:first').find('.tooltip').last().click();
        cy.wait(1000);
        cy.get('button').contains('Delete').click();
        cy.contains("Success").should('be.visible');
    })

    it('delete statistic', function () {
        cy.visit('/st/admin');
        console.log(window.location);
        cy.wait(1500);
        cy.searchRow('Qa');
        cy.xpath(`//div[text()='Qa statistic']`).parent().parent().parent().parent().parent().find('.tooltip').last().scrollIntoView().first().click();
        cy.wait(1000);
        cy.get('button').contains('Delete').click();
        cy.contains("Success").should('be.visible');
    })

})