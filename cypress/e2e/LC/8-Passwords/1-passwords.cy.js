import { ROUTES } from "../../../support/routes";

describe('Password page', () => {

    let passName = Cypress.env('passName');
    let passUrl = Cypress.env('passUrl');
    let passLogin = Cypress.env('passLogin');
    let passPassword = Cypress.env('passPassword');
    let passDescription = Cypress.env('passDescription');


    beforeEach(function () {
        cy.resetAppState();
        cy.logTestName.call(this);
        cy.admin();
        // cy.changeLang();
    });

    it('should create password ', () => {
        cy.visit(ROUTES.passwords);
        cy.get('h2').contains('Passwords').should('be.visible');
        cy.contains('Add').click();
        cy.wait(1500);

        cy.task('logStep', `Заполнение полей пароля.`);
        cy.get('.w-full.mt-1.text-sm').eq(0).clear().type(passName);
        cy.get('.text-gray-900.w-full').eq(1).clear().type(passUrl);
        cy.get('.text-gray-900.w-full').eq(2).clear().type(passLogin);
        cy.get('.text-gray-900.w-full').eq(3).clear().type(passPassword);
        cy.get('.text-gray-900.w-full').eq(4).clear().type(passDescription);


        cy.task('logInfo', `Проверка кнопки для просмотра пароля.`);
        cy.get('.p-2.rounded-r-md').eq(2).click();
        cy.get('.text-gray-900.w-full').eq(3)
            .should('have.attr', 'type', 'text')
            .and('have.value', passPassword);
        cy.task('logInfo', `Пароль отображается и соответствует введенному значению: ${passPassword}`);


        let clipboardValue = '';

        cy.window().then((win) => {
            if (!win.navigator.clipboard.writeText.isSinonProxy) {
                cy.stub(win.navigator.clipboard, 'writeText').callsFake((text) => {
                    clipboardValue = text;
                    return Promise.resolve();
                });
            }
        });

        cy.task('logInfo', `Проверка копирования логина.`);
        cy.get('.p-2.rounded-r-md').eq(1).click().then(() => {
            if (clipboardValue === passLogin) {
                cy.task('logInfo', `Буфер обмена содержит правильный логин: "${passLogin}"`);
            } else {
                cy.task('logError', `Ожидалось: "${passLogin}", получили: "${clipboardValue}"`);
            }
        });

        cy.task('logInfo', `Проверка копирования пароля.`);
        cy.get('.p-2.rounded-r-md').eq(3).click().then(() => {
            if (clipboardValue === passPassword) {
                cy.task('logInfo', `Буфер обмена содержит правильный пароль: "${passPassword}"`);
            } else {
                cy.task('logError', `Ожидалось: "${passPassword}", получили: "${clipboardValue}"`);
            }
        });

        cy.get('button').contains('Save').click();
        cy.wait(500);
        cy.checkTextInParagraph();

    });

    it('should create password', () => {
        cy.visit(ROUTES.passwords);
        cy.wait(1000);
        cy.get('h2').contains('Passwords').should('be.visible');
        cy.searchRow(passName);
        cy.contains('th', passName, { timeout: 10000 }).should('be.visible');
        cy.get('tr').contains('th', passName).parents('tr').then($row => {

            cy.wrap($row)
                .find('th').eq(3)
                .invoke('text')
                .then(urlText => {
                    cy.task('logInfo', `Проверка URL: "${urlText.trim()}"`);
                    expect(urlText.trim()).to.eq(passUrl);
                });

            // Проверка логина
            cy.wrap($row)
                .find('th').eq(4)
                .invoke('text')
                .then(loginText => {
                    cy.task('logInfo', `Проверка логина: "${loginText.trim()}"`);
                    expect(loginText.trim()).to.eq(passLogin);
                });

            // Проверка пароля    
            cy.wrap($row)
                .find('th').eq(5)
                .find('svg')
                .first()
                .click();
            cy.wrap($row)
                .find('th').eq(5)
                .find('span') // теперь пароль стал видимым
                .invoke('text')
                .then(passwordText => {
                    cy.task('logInfo', `Проверка пароля: "${passwordText.trim()}"`);
                    expect(passwordText.trim()).to.eq(passPassword);
                });
            // Проверка описания
            cy.wrap($row)
                .find('th').eq(6)
                .find('svg')
                .first()
                .click();

            cy.get('p').contains(passDescription)
                .should('be.visible')
                .invoke('text')
                .then(descriptionText => {
                    cy.task('logInfo', `Проверка описания: "${descriptionText.trim()}"`);
                    expect(descriptionText.trim()).to.eq(passDescription);
                });

            // Закрываем модалку
            cy.get('body')
                .find('svg.w-5.h-5.cursor-pointer.absolute.-right-5.-top-5.text-white')
                .click();
        });
    })
})