describe('Statistic.ST3. clear data statistic', () => {

    before(() => {
        cy.admin();
    });



    it('clearing a value to statistics', function () {
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Statistics")').click({multiple: true});

        cy.contains("a", 'Statistics list').click();

        cy.wait(3000);
        cy.searchRow('Qa');
        cy.wait(1500);
        cy.xpath("//div[text()='Qa statistic']").closest('tr').within(() => {
            cy.get('th').eq(1).find('div').click();
        });
        cy.contains('Statistic data').should('be.visible').click({ multiple: true });
        cy.wait(1500);

        cy.get('tbody tr:first').closest('tr').within(() => {
            cy.get('th').eq(1).find('div').click();
        });
        cy.contains('Delete value').should('be.visible').click({ multiple: true });

        cy.wait(1000);
        cy.xpath('//div[@class="fixed z-40 inset-0 overflow-y-auto"]').find('button:contains("Delete")').click();
        cy.wait(1000)
        cy.contains("Success").should('be.visible');
    })

    it('delete statistic', function () {
        cy.login();
        cy.visit('/admin/user')
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Statistics")').click({multiple: true});

        cy.contains("a", 'Statistics list').click();

        cy.wait(1500);
        cy.searchRow('Qa');
        cy.wait(1500);
        cy.xpath("//div[text()='Qa statistic']").closest('tr').within(() => {
            cy.get('th').eq(1).find('div').click();
        });
        cy.contains('Delete statistic').scrollIntoView().should('be.visible').click({ multiple: true });
        cy.wait(1000)
        cy.get('button').contains('Delete').click();
        cy.wait(500)
        cy.contains("Success").should('be.visible');
    })

})
