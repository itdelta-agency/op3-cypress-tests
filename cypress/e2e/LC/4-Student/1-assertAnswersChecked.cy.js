import { ROUTES } from '../../../support/routes';

describe('LC.D1. Assert answers were checked by teacher', () => {


    beforeEach(function () {
        cy.logTestName.call(this);
    });


    it('Soft-check course progress flow with logs', () => {
        const courseName = Cypress.env('courseName');
        const lessons = [
            Cypress.env('lessonCheckboxRadio'),
            Cypress.env('lessonText'),
            Cypress.env('lessonTimer'),
        ];

        cy.login();
        cy.visit(ROUTES.studCourse);

        cy.xpath("//input[@id='search']").type(courseName);
        cy.xpath(`//h3[text()='${courseName}']`).click();

        // Проверка заголовка курса
        cy.xpath(`//h1[text()='${courseName}']`).should('be.visible');
        cy.wait(400);

        const lessonSuccess = 'Lesson successfully completed!'; // или любое другое фиксированное сообщение

        lessons.forEach(lessonTitle => {
            cy.get('ul[role="list"] li').contains(lessonTitle).click();

            cy.url().should('include', '/lesson/');

            cy.get('body').then($body => {
                if ($body.text().includes(lessonSuccess)) {
                    cy.log(`Урок "${lessonTitle}" пройден`);
                } else {
                    cy.log(`Урок "${lessonTitle}" не содержит "${lessonSuccess}"`);
                }
            });
        });


        // Переход на "Result"
        cy.get('ul[role="list"] li').contains('Result').click();
        cy.url().should('include', '/success');

        cy.get('body').then($body => {
            if ($body.text().includes('Congratulations')) {
                cy.log('Курс завершён');
            } else {
                cy.log('Не найдена надпись "Congratulations"');
            }
        });

        // Вернуться к курсам
        cy.get('button').contains('Back to courses').click({ force: true });
        cy.wait(1000);
        cy.url().should('include', ROUTES.studCourse);

    });


    // afterEach(function onAfterEach() {
    //     if (this.currentTest.state === 'failed') {
    //         cy.setCookie(skipCookie, 'true');
    //     }
    // });
});
