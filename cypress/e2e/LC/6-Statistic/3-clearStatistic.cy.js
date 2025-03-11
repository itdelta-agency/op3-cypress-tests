describe('Statistic.ST3. clear data statistic', () => {

    beforeEach(() => {
        cy.admin();
    });



    it('clearing a value to statistics', function () {
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Statistics")').click({multiple: true});

        cy.contains("a", 'Statistics list').click();

        cy.wait(3000);
        cy.searchRow('Qa');
        cy.wait(1500);
        cy.xpath("//div[text()='Qa statistic']").parent().parent().parent().parent().parent().find('th').eq(1).find('div').click().then(($el) => {
            cy.wrap($el).find(':contains("Statistic data")').click({ multiple: true, force: true });
        })
        cy.wait(1500);
        cy.get('tbody tr:first').find('th').eq(1).find('div').click().then(($el) => {
            cy.wrap($el).find(':contains("Delete value")').click({ multiple: true, force: true });
        })

        cy.wait(1000);
        cy.xpath('//div[@class="fixed z-40 inset-0 overflow-y-auto"]').find('button:contains("Delete")').click();
        cy.wait(1000)
        cy.contains("Success").should('be.visible');
    })

    it('delete statistic', function () {
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Statistics")').click({multiple: true});

        cy.contains("a", 'Statistics list').click();

        cy.wait(1500);
        cy.searchRow('Qa');
        cy.wait(1500);
        cy.xpath("//div[text()='Qa statistic']").parent().parent().parent().parent().parent().find('th').eq(1).find('div').click().then(($el) => {
            cy.wrap($el).find(':contains("Delete statistic")').click({ multiple: true, force: true });
        })
        cy.wait(1000)
        cy.get('button').contains('Delete').click();
        cy.wait(500)
        cy.contains("Success").should('be.visible');
    })

})