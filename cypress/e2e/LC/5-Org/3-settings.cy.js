describe('OrgBoard.A4.Settings', () => {
    let userEmail
    before(() => {
        cy.task("getUserEmail").then((user) => {
            cy.log(user.email);
            cy.log(user.pass);
            userEmail = user.email;
        })
    });

    beforeEach(() => {
        cy.admin();
        cy.visit('/ob/admin/settings');
        cy.wait(3000);
    });

    it('edit settings', function () {

        cy.xpath("//span[text()='Company name']").next().clear().type('QA COMPANY');
        cy.xpath("//span[text()='Valuable End Product']").next().clear().type('QA COMPANY DESCRIPTION');

        cy.xpath("//span[text()='Owners']").next().click();
        cy.xpath("//span[text()='Owners']").next().type('QA position');
        cy.xpath("//div[text()='QA position: User Qa']").click();
        cy.xpath("//button[text()='Save']").click();
        cy.wait(500);
        cy.contains("Success").should('be.visible');
    })

    it('check save data', function () {
        cy.contains('QA COMPANY').should('be.visible');
        cy.contains('QA COMPANY DESCRIPTION').should('be.visible');
        cy.contains('QA position: User Qa').should('be.visible');
    })

    it('defalut settings', function () {
        cy.xpath("//span[text()='Company name']").next().clear().type('Производственная Компания №1');
        cy.xpath("//span[text()='Valuable End Product']").next().clear().type('Изделия из металла высокого качества, используемые широким кругом профессионалов при строительстве сооружений по всей России');
        cy.contains('QA position: User Qa').next().click();
        cy.xpath("//button[text()='Save']").click();
        cy.wait(500);
        cy.contains("Success").should('be.visible');
    })
})