const {recurse} = require("cypress-recurse");
describe('4-Auth-RU-forgot-password.cy.js', () => {
    let main = Cypress.config('baseUrl').split('.')[1];
    let subject = 'Уведомление о сбросе пароля';

    const userEmail = Cypress.env('authEmail');
    const authPassword = Cypress.env('authPassword');
    const wrong_password = 'wrong_wrong_wrong_wrong_wrong_';


    beforeEach(() => {
        cy.visit(Cypress.config().baseUrl)
       // cy.changeLangAuth();
    });

    it('requesting reset-password-email', function () {
        cy.changeLangAuth();
        cy.contains("Забыли пароль?").should('be.visible').click();
       // cy.wait(65000); //временное решение - org-online.ru высылает письмо сброса пароля  с ограничением, 1 раз в минуту
        cy.wait(1500);
        cy.xpath("//input[@id='email']", {timeout: 10000}).type(userEmail);
        cy.wait(500);
        cy.contains("Ссылка для сброса пароля электронной почты").should('be.visible').click();
        cy.wait(500);
        cy.contains("Ссылка на сброс пароля была отправлена!").should('be.visible');
    });

    it('getting last email', function () {
        cy.wait(1000);
        recurse( //эта рекурсия не работает - таск возвращает таймаут
            () => {
                if(main === 'release') return  cy.task('getAccount', {subject, userEmail})
                if(main === 'org-online') return cy.task('getLastEmail', {port: 993, host: 'imap.mail.ru', user:userEmail, pass: authPassword });
            }, // Cypress commands to retry
            Cypress._.isObject, // keep retrying until the task returns an object
            {
                timeout: 180000, // retry up to 3 minutes
                delay: 5000, // wait 5 seconds between attempts
            },
        )
            .its('html')
            .then((html) => {
                console.log(html);
                cy.document({log: false}).invoke({log: false}, 'write', html)
            })
            cy.get('[class="button button-primary"]').should('have.attr', 'href').then(($btn) => {
            cy.visit($btn);
        });
        cy.wait(2000);
        cy.changeLangAuth();
        // Invalid Data
        cy.xpath("//input[@id='password']", { timeout: 10000 }).should('be.visible').type(authPassword);
        cy.xpath("//input[@id='password_confirmation']", { timeout: 10000 }).should('be.visible').type(wrong_password);
        cy.xpath("//button[@type='submit']", { timeout: 10000}).should('be.visible').click();
        cy.wait(500);
        cy.contains('Значение поля Пароль не совпадает с подтверждаемым').should('be.visible');
        cy.wait(500);
        cy.xpath("//input[@id='password']", { timeout: 10000 }).clear().type(wrong_password);
        cy.xpath("//input[@id='password_confirmation']", { timeout: 10000 }).clear().type(authPassword);
        cy.xpath("//button[@type='submit']", { timeout: 10000}).should('be.visible').click();
        cy.wait(500);
        cy.contains('Значение поля Пароль не совпадает с подтверждаемым').should('be.visible');
        cy.wait(500);

        //Valid Data
        cy.xpath("//input[@id='password']", {timeout: 10000}).should('be.visible').clear().type(authPassword);
        cy.xpath("//input[@id='password_confirmation']", {timeout: 10000}).should('be.visible').clear().type(authPassword);
        cy.xpath("//button[@type='submit']", {timeout: 10000}).should('be.visible').click();
        cy.wait(3000);
        cy.login(userEmail, authPassword);
    });

})
