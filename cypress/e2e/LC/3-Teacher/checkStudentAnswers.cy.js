
const { recurse } = require('cypress-recurse')

describe('LC.C1. Check student answers', () => {
    // const skipCookie = Cypress.env('shouldSkipEduTests');

    let main = Cypress.config('baseUrl').split('.')[1];
    let subject = 'Learning Center | Your answer has been reviewed!';
    let userEmail;

    before(() => {
        cy.resetAppState();
    });

    beforeEach(() => {
        cy.admin();
    });



    it('Check first answer', () => {
        const lessonNames = [
            Cypress.env('lessonText'), 
            Cypress.env('lessonTimer') 
        ];

        cy.wait(1500);

        // Открываем вкладку Student answers
        cy.get('.flex.justify-between', { timeout: 10000 }).eq(2).then($tab => {
            const isExpanded = $tab.attr('aria-expanded') === 'true';
            if (!isExpanded) {
                cy.wrap($tab).click();
            }
        });

        cy.contains('Student answers').should('be.visible').click();
        cy.wait(1500);

        // Проходим по урокам последовательно
        lessonNames.forEach(lessonName => {
            cy.log(`Проверяем урок: ${lessonName}`);

            // Ищем строку с нужным уроком
            cy.get('tbody tr[role="row"]', { timeout: 10000 }).contains('th', lessonName).parents('tr').within(() => {
                // Кликаем по имени ученика (во втором столбце)
                cy.get('th').eq(1).find('a').click();
            });

            // Дожидаемся загрузки страницы с ответом ученика
            cy.location('pathname', { timeout: 10000 }).should('include', '/lc/admin/teacher/');
            cy.wait(1000); // немного подождать, чтобы убедиться, что не происходит переход на другого ученика

            // Работаем с полем комментария
            cy.get('textarea.shadow-sm', { timeout: 10000 }).first()
                .should('not.be.disabled')
                .clear()
                .type('Комментарий к ответу');

            // Сохраняем
            cy.get('button.mt-3').click();

            cy.checkTextInParagraph();

            // Комментарий для ученика
            cy.xpath("//span[text()='Comment for student']").next()
                .should('not.be.disabled')
                .clear()
                .type('Lorem ipsum...');

            cy.xpath("//span[text()='Success']").click();
            cy.xpath("//button[text()='Restart']").next().click();
            cy.checkTextInParagraph();

            // Возвращаемся назад к списку ответов
            cy.go('back');
            cy.wait(1500);
        });
    });


    // ////// НЕ работает отправка сообщений на тенанте!  \\\\\\\\\

    // it('Should get complete the lesson email', function () {
    //     cy.wait(2500);

    //     // Получаем кэшированный inbox
    //     cy.task('getCachedInbox').then((inbox) => {
    //         // В зависимости от окружения вызываем нужный таск, передавая нужные параметры
    //         if (main === 'release') {
    //             cy.task('getAccount', { subject, userEmail: inbox.emailAddress })
    //                 .then(emailData => {
    //                     cy.wrap(emailData).its('html').then((html) => {
    //                         cy.document({ log: false }).invoke({ log: false }, 'write', html);
    //                     });
    //                 });
    //         } else if (main === 'org-online') {
    //             // Для org-online вызываем таск getEmailData без параметров (или с параметрами если нужны)
    //             // При необходимости передай inbox.emailAddress или id, если твой таск это требует
    //             cy.task('getEmailData', { inboxId: inbox.id }).then(emailData => {
    //                 cy.wrap(emailData).its('html').then((html) => {
    //                     cy.document({ log: false }).invoke({ log: false }, 'write', html);
    //                 });
    //             });
    //         }
    //     });

    //     // Проверяем, что заголовок курса виден
    //     cy.xpath("//span[@class='course-title']").should('be.visible');
    // });

});
