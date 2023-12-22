describe('3-Auth-RU-login-invalid.cy.js', () => {
    beforeEach(() => {
        cy.visit('login');
        cy.wait(1000);
        cy.get('[id="headlessui-menu-button-:r0:"]').click();
        cy.wait(1000);
        // Switch to RU
        cy.get('[id="headlessui-menu-item-:r4:"]').click();
        cy.wait(1000);
    });

    it('should move to login page and type wrong login/password', function () {
        const username = Cypress.env('authEmail')
        const password = Cypress.env('authPassword')

        const wrong_username = 'wrong_.ajshd@ajdhajszxmcbnqwdot.wrong'
        const wrong_password = 'wrong_wrong_wrong_wrong_wrong_'

        cy.xpath("//input[@id='email']", { timeout: 10000 }).should('be.visible').clear().type(wrong_username);

        cy.xpath("//input[@id='password']", { timeout: 10000 }).should('be.visible').clear().type(password, { log: false });;

        cy.xpath("//button[@type='submit']", { timeout: 10000 }).should('be.visible').click();

        cy.wait(1500);
        cy.contains("Неверное имя пользователя или пароль.").should('be.visible');
        cy.wait(1000);
        cy.xpath("//input[@id='email']", { timeout: 10000 }).clear().type(username);

        cy.xpath("//input[@id='password']", { timeout: 10000 }).clear().type(wrong_password, { log: false });

        cy.xpath("//button[@type='submit']", { timeout: 10000}).click();
        cy.wait(1000);
        cy.contains("Неверное имя пользователя или пароль.").should('be.visible');
    });
})
