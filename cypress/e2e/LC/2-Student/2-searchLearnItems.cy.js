import { ROUTES } from "../../../support/routes";


describe('LC.B2. Search courses', () => {
    let courseName = Cypress.env('courseName')
    beforeEach(function () {
        cy.logTestName.call(this);
        cy.login();
        cy.wait(500);
        cy.visit(ROUTES.studCourse);
        cy.wait(500);
    });

    it('select Started Finished and All courses', function () {
        cy.task('logInfo', 'Проверка фильтрации на странице "Курсов"');

        // Вкладка Started — позитивный сценарий, курсов нет
        cy.get('button').contains('Started').click();
        cy.get('.flex.justify-between.items-center.w-full.p-4', { timeout: 5000 }).then($el => {
            if ($el.is(':visible')) {
                cy.task('logError', 'Есть начатые курсы, а их не должно быть');
            } else {
                cy.task('logInfo', 'Начатых курсов нет — всё верно');
            }
        });
        cy.wait(500);

        // Вкладка Finished — проверяем, что курсы есть
        cy.get('button').contains('Finished').click();
        cy.get('.flex.justify-between.items-center.w-full.p-4', { timeout: 5000 }).then($el => {
            if ($el.is(':visible')) {
                cy.task('logInfo', 'Завершенные курсы отображаются');
            } else {
                cy.task('logError', 'Нет завершенных курсов');
            }
        });
        cy.wait(500);

        // Вкладка All — проверяем, что курсы отображаются
        cy.get('button').contains('All').click();
        cy.get('.flex.justify-between.items-center.w-full.p-4', { timeout: 5000 }).then($el => {
            if ($el.is(':visible')) {
                cy.task('logInfo', 'Курсы отображаются во вкладке "Все"!');
            } else {
                cy.task('logError', 'Во вкладке "Все" курсов нет');
            }
        });
        cy.wait(500);
    })


    it('search course by name', function () {
        cy.xpath("//input[@id='search']").clear().type(courseName);
        cy.get('h3').contains(courseName).should('be.visible');


        
    });

    it('go to curriculums and search them by name', function () {
        cy.get('a[name="Curriculums"]').click();
        cy.wait(500);
        cy.get('h3').contains(courseName).click({ force: true });
        cy.wait(500);
        cy.get('h1').contains(courseName, {timeout:5000}).should('be.visible');
    });
});

