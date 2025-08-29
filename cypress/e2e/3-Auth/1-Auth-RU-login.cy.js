describe('2-Auth-RU-login-valid.cy.js', () => {

    const username = Cypress.env('email');
    const password = Cypress.env('password');

    const wrong_username = 'wrong_.ajshd@ajdhajszxmcbnqwdot.wrong';
    const wrong_password = 'wrong_wrong_wrong_wrong_wrong_';
    beforeEach(function () {
        cy.logTestName.call(this);
        cy.resetAppState();
        cy.visit(Cypress.config().baseUrl);
    });


    before(function() {
        cy.resetAppState();
    });

    it('should move to login page and log in', function () {
        
        cy.task('logInfo', 'Переход на страницу Авторизации');
        cy.task('logStep', 'Ввод почты');
        cy.xpath("//input[@id='email']", { timeout: 10000 }).should('be.visible');
        cy.xpath("//input[@id='email']", { timeout: 10000 }).type(username);
        
        cy.task('logStep', 'Ввод пароля');
        cy.xpath("//input[@id='password']", { timeout: 10000 }).should('be.visible');
        cy.xpath("//input[@id='password']", { timeout: 10000 }).type(password, { log: false });
        
        cy.task('logStep', 'Клик на кнопку');
        cy.xpath("//button[@type='submit']", { timeout: 10000 }).should('be.visible');
        cy.xpath("//button[@type='submit']", { timeout: 10000 }).click();
        cy.wait(3000);
        cy.task('logInfo', 'Тест перойден');
        cy.visit('/')
    });

    it('should move to login page and type wrong login/password', function () {
        cy.task('logInfo', 'Переход на страницу Авторизации');

        cy.task('logStep', 'Ввод некорректной почты');
        cy.xpath("//input[@id='email']", { timeout: 10000 }).should('be.visible').clear().type(wrong_username);
        cy.task('logStep', 'Ввод пароля');
        cy.xpath("//input[@id='password']", { timeout: 10000 }).should('be.visible').clear().type(password, { log: false });;
        cy.task('logStep', 'Клик на кнопку войти');
        cy.xpath("//button[@type='submit']", { timeout: 10000 }).should('be.visible').click();

        cy.wait(1500);
        cy.contains('p', 'Error').should('be.visible');
        cy.task('logInfo', 'Ввод корректной почты');
        cy.wait(1000);
        cy.xpath("//input[@id='email']", { timeout: 10000 }).clear().type(username);
        cy.task('logInfo', 'Ввод некорректного пароля');
        cy.xpath("//input[@id='password']", { timeout: 10000 }).clear().type(wrong_password, { log: false });
        cy.task('logInfo', 'Клик на кнопку войти');
        cy.xpath("//button[@type='submit']", { timeout: 10000 }).click();
        cy.wait(1000);
        cy.contains('p', 'Error').should('be.visible');
        cy.task('logInfo', 'Тест пройден !');
    });
})
