describe('Statistic.ST1. Create Statistic', () => {
    const position = 'QA position';
    const description = 'QA QA position'


    beforeEach(() => {
        cy.admin();
    });

    it('should create position', function () {
        cy.visit('/st/admin');
        cy.wait(3000);
        cy.contains('Add statistics').click();
        cy.wait(1500);

        cy.xpath("//span[text()='Name *']").next().type('Qa statistic');
        cy.xpath('//span[text()="Active"]/../span[2]/button').click();
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