const {recurse} = require("cypress-recurse");
describe('6-Auth-RU-reset-password-valid.cy.js', () => {
    beforeEach(() => {
        cy.visit('login');
        cy.wait(1000);
        cy.get('[id="headlessui-menu-button-:r0:"]').click();
        cy.wait(1000);
        // Switch to RU
        cy.get('[id="headlessui-menu-item-:r4:"]').click();
        cy.wait(1000);
    });

    it('requesting reset-password-email', function () {
        const email = Cypress.env('authEmail')

        cy.contains("Забыли пароль?").should('be.visible').click();

        cy.wait(65000); //временное решение - org-online.ru высылает письмо сброса пароля  с ограничением, 1 раз в минуту

        cy.xpath("//input[@id='email']", {timeout: 10000}).type(email);
        cy.wait(1000);
        cy.contains("Ссылка для сброса пароля электронной почты").should('be.visible').click();
        cy.wait(1000);
        cy.contains("Ссылка на сброс пароля была отправлена!").should('be.visible');
    });

    it('getting last email at proguniversal@mail.ru && entering valid reset passwords', function () {
        const authPassword = Cypress.env('authPassword')
        cy.wait(1000);
        recurse( //эта рекурсия не работает - таск возвращает таймаут
            () => cy.task('getLastEmailFromMailRu'), // Cypress commands to retry
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

        cy.xpath("//input[@id='password']", {timeout: 10000}).should('be.visible').type(authPassword);

        cy.xpath("//input[@id='password_confirmation']", {timeout: 10000}).should('be.visible').type(authPassword);


        cy.xpath("//button[@type='submit']", {timeout: 10000}).should('be.visible').click();
        cy.wait(2000);

        cy.contains("Войти").should('be.visible');
        cy.xpath("//input[@id='email']", {timeout: 10000}).should('be.visible');
        cy.xpath("//input[@id='password']", {timeout: 10000}).should('be.visible');
    });
})