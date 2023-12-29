describe('2-Auth-RU-login-valid.cy.js', () => {
    const username = Cypress.env('email');
    const password = Cypress.env('password');

    const wrong_username = 'wrong_.ajshd@ajdhajszxmcbnqwdot.wrong';
    const wrong_password = 'wrong_wrong_wrong_wrong_wrong_';
    beforeEach(() => {
        cy.visit(Cypress.config().baseUrl);
        cy.changeLangAuth();
    });

    it('should move to login page and log in', function () {
        cy.xpath("//input[@id='email']", { timeout: 10000 }).should('be.visible');
        cy.xpath("//input[@id='email']", { timeout: 10000 }).type(username);

        cy.xpath("//input[@id='password']", { timeout: 10000 }).should('be.visible');
        cy.xpath("//input[@id='password']", { timeout: 10000 }).type(password, { log: false });

        cy.xpath("//button[@type='submit']", { timeout: 10000}).should('be.visible');
        cy.xpath("//button[@type='submit']", { timeout: 10000}).click();
        cy.wait(3000);
        cy.xpath("//h2[text()='Учебный центр']").should('be.visible');
    });

    it('should move to login page and type wrong login/password', function () {

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
