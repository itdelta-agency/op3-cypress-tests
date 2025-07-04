describe('OrgBoard.A4.Settings', () => {


    before(() => {
        cy.admin();
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Settings")').click({multiple: true});
        cy.wait(3000);
    });

    it('Regulations settings', function ()  {
        cy.xpath("//a[@name='Regulations']").click();
        cy.get('button[role="switch"]').eq(0).then($switch => {
            const isChecked = $switch.attr('aria-checked') === 'true';

            if (isChecked) {
                cy.wrap($switch).click(); // Выключаем, если включен
            }
        });
        cy.contains('Save').click();
    })

})