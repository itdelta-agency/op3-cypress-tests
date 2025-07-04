describe('Statistic.ST1. Create Statistic', () => {
    const position = 'QA position';
    const description = 'QA QA position'


    before(() => {
        cy.admin()
    });

    it('should create statistics', function () {
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Statistics")').click({multiple: true});

        cy.contains("a", 'Statistics list').click();
        cy.wait(3000);
        cy.contains('Add statistics').click();
        cy.wait(1500);

        cy.xpath("//span[text()='Name *']").next().type('Qa statistic');
        cy.xpath('//span[text()="Status"]/../span[2]/button').click();
        cy.xpath("//span[text()='Post *']").next().children().click();
        cy.xpath("//span[text()='Post *']").next().children().type(position);
        cy.contains('div', position).click();
        cy.contains('button', 'Select').click();
        cy.contains('div', 'Search').next().find('input').type('Qa');
        cy.contains('div', 'QA Test').click();
        cy.xpath('//div[@class="fixed z-40 inset-0 overflow-y-auto"]').find(':contains("Save")').click( { multiple: true });



        cy.xpath('//span[text()="Show in ICO"]/../span[2]/button').click();
        cy.xpath('//span[text()="Main statistics"]/../span[2]/button').click();
        cy.xpath("//button[text()='Save']").click();
        cy.wait(500);
        cy.contains("Success").should('be.visible');
    })
})