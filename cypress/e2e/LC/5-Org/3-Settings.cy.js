describe('OrgBoard.A4.Settings', () => {


    before(() => {
        cy.admin();
    });

    it('edit settings', function () {
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Settings")').click({multiple: true});
        cy.wait(3000);
        cy.xpath("//a[@name='OrgScheme']").click();
        cy.wait(3000);

        cy.xpath("//span[text()='Company name']").next().clear().type('QA COMPANY');
        cy.xpath("//span[text()='VFP']").next().clear().type('QA COMPANY DESCRIPTION');

        cy.xpath("//span[text()='Owners']").next().click();
        cy.xpath("//span[text()='Owners']").next().type('QA position');
        cy.xpath("//div[text()='QA position: User Qa']").click();
        cy.xpath("//button[text()='Save']").click();
        cy.wait(500);
        cy.contains("Success").should('be.visible');
    })

    it('check save data', function () {
        cy.login();
        cy.visit('/')
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Settings")').click({multiple: true});
        cy.wait(3000);
        cy.xpath("//a[@name='OrgScheme']").click();
        cy.wait(3000);
        cy.contains('QA COMPANY').should('be.visible');
        cy.contains('QA COMPANY DESCRIPTION').should('be.visible');
        cy.contains('QA position: User Qa').should('be.visible');
    })

    it('defalut settings', function () {
        cy.login();
        cy.visit('/')
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Settings")').click({multiple: true});
        cy.wait(3000);
        cy.xpath("//a[@name='OrgScheme']").click();
        cy.wait(3000);
        cy.xpath("//span[text()='Company name']").next().clear().type('Производственная Компания №1');
        cy.xpath("//span[text()='VFP']").next().clear().type('Изделия из металла высокого качества, используемые широким кругом профессионалов при строительстве сооружений по всей России');
        cy.contains('QA position: User Qa').next().click();
        cy.xpath("//button[text()='Save']").click();
        cy.wait(500);
        cy.contains("Success").should('be.visible');
    })
})
