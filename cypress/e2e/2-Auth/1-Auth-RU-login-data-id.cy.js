describe('2-Auth-RU-login-valid.cy.js', () => {
    const username = Cypress.env('email');
    const password = Cypress.env('password');
    const wrong_username = 'wrong_.ajshd@ajdhajszxmcbnqwdot.wrong';
    const wrong_password = 'wrong_wrong_wrong_wrong_wrong_';
    beforeEach(() => {
        cy.log('идем на страницу логина');
        cy.visit(Cypress.config().baseUrl);
        cy.log('Меняем язык на RU');
        cy.changeLangDataId();
    });

    it('should move to login page and log in', function () {
        cy.log('Вводим почту');
        cy.get('[data-test-id="email_input"]').should('be.visible').type(username);
        cy.log('Вводим пароль');
        cy.get('[data-test-id="password_input"]').should('be.visible').type(password, { log: false });
        cy.log('Кликаем на кнопку');
        cy.get('[data-test-id="submit_button"]').should('be.visible').click();
        cy.wait(3000);
        cy.log('переходим на /');
        cy.visit('/')
        cy.log('Проверяем что мы на странице Учебный центр');
        cy.contains("Учебный центр").should('be.visible');
    });

    it('should move to login page and type wrong login/password', function () {
        cy.log('Вводим неверную почту');
        cy.get('[data-test-id="email_input"]').should('be.visible').clear().type(wrong_username);
        cy.log('Вводим пароль');
        cy.get('[data-test-id="password_input"]').should('be.visible').clear().type(password, { log: false });
        cy.log('Кликаем на кнопку');
        cy.get('[data-test-id="submit_button"]').should('be.visible').click();

        cy.wait(1500);
        cy.log('Проверяем красное уведомление');
        cy.contains("Неверное имя пользователя или пароль.").should('be.visible');
        cy.wait(1000);
        cy.log('Вводим почту');
        cy.get('[data-test-id="email_input"]').should('be.visible').clear().type(username);
        cy.log('Вводим неверный пароль');
        cy.wait(500);
        cy.get('[data-test-id="password_input"]').should('be.visible').clear().type(wrong_password, { log: false });
        cy.log('Кликаем на кнопку');
        cy.wait(500);
        cy.get('[data-test-id="submit_button"]').should('be.visible').click();
        cy.wait(1000);
        cy.log('Проверяем красное уведомление');
        cy.contains("Неверное имя пользователя или пароль.").should('be.visible');
    });
})
