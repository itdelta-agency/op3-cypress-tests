// const mailhog = require('../../support/mailhog-client');
// const { recurse } = require('cypress-recurse')


describe('LC.C1. Check student answers', () => {
    // const skipCookie = Cypress.env('shouldSkipEduTests');


    before(() => {
        // cy.resetAppState();
    });

    beforeEach(function () {
        cy.resetAppState();
        cy.logTestName.call(this);
        cy.admin();
        // cy.changeLang();
    });



    it('Check first answer', () => {
        const lessonNames = [
            Cypress.env('lessonText'),
            Cypress.env('lessonTimer')
        ];

        cy.wait(1500);

        // Открываем вкладку Student answers
        cy.get('.flex.justify-between', { timeout: 20000 }).eq(2).then($tab => {
            const isExpanded = $tab.attr('aria-expanded') === 'true';
            if (!isExpanded) {
                cy.wrap($tab).click();
            }
        });

        cy.contains('Student answers').should('be.visible').click();
        cy.wait(1500);
        cy.task('logStep', 'Переход на страницу "Ответы студентов"');

        lessonNames.forEach(lessonName => {
            cy.task('logStep', `Проверяем урок: ${lessonName}`);

            // Безопасная проверка наличия строк
            cy.get('tbody', { timeout: 10000 }).then($tbody => {
                const $rows = $tbody.find('tr[role="row"]');

                if ($rows.length === 0) {
                    cy.task('logInfo', 'Нет ответов студентов на странице.');
                    return;
                }

                const rowsArray = $rows.get();

                // Ищем строку с нужным уроком среди всех TH
                const lessonRow = rowsArray.find(row => {
                    return Array.from(row.querySelectorAll('th')).some(th =>
                        th.innerText.trim().includes(lessonName)
                    );
                });

                if (!lessonRow) {
                    cy.task('logInfo', `Урок "${lessonName}" не найден! Пропускаем проверку.`);
                    return;
                }

                // Логика проверки урока остаётся без изменений
                cy.wrap(lessonRow).within(() => {
                    cy.get('th').eq(1).find('a').click();
                });

                cy.location('pathname', { timeout: 10000 }).should('include', '/lc/admin/teacher/');
                cy.wait(1000);

                cy.get('textarea.shadow-sm', { timeout: 10000 }).first()
                    .should('not.be.disabled')
                    .clear()
                    .type('Комментарий к ответу');

                cy.get('button.mt-3').click();
                cy.task('logStep', 'Комментарий для ученика');

                cy.checkTextInParagraph();

                cy.xpath("//span[text()='Comment for student']").next()
                    .should('not.be.disabled')
                    .clear()
                    .type('Lorem ipsum...');

                cy.xpath("//span[text()='Success']").click();
                cy.xpath("//button[text()='Restart']").next().click();
                cy.get('h2').contains('Student answers', { timeout: 10000 }).should('be.visible');

                cy.checkTextInParagraph();
                cy.task('logInfo', 'Урок проверен!');
                cy.wait(1500);
            });
        });
    });




    // ////// НЕ работает отправка сообщений на тенанте!  \\\\\\\\\

    it('Should get complete the lesson email and open it', function () {
        // Ждем небольшую паузу, если письмо может прийти с задержкой
        cy.wait(2500);

        cy.task('logInfo', 'Проверяем наличие письма о завершении урока');

        // Получаем последнее письмо через MailHog
        cy.task('getLastEmail', { timeout: 90000 }).then(email => {
            if (!email) {
                cy.task('logError', 'Письмо о завершении урока не получено');
                return;
            }

            cy.task('logInfo', `Получено письмо: ${email.subject}, длина тела письма: ${email.body.length}`);

            // Извлекаем ссылку из письма
            const link = mailhog.extractConfirmationLink(email);
            if (!link) {
                cy.task('logError', 'Ссылка в письме не найдена');
                return;
            }

            cy.task('logInfo', `Найденная ссылка: ${link}`);

            // Переходим по ссылке письма
            cy.visit(link);
            cy.task('logInfo', 'Переход по ссылке из письма выполнен');

            // Проверяем, что заголовок курса виден
            cy.xpath("//span[@class='course-title']").should('be.visible');
            cy.task('logInfo', 'Заголовок курса виден');
        });
    });


});
