const { recurse } = require('cypress-recurse')

describe('LC.C1. Check student answers', () => {
    // const skipCookie = Cypress.env('shouldSkipEduTests');

    let main = Cypress.config('baseUrl').split('.')[1];
    let subject = 'Learning Center | Your answer has been reviewed!';
    let userEmail;

    // before(() => {
    //     // if ( Cypress.browser.isHeaded ) {
    //     //     cy.clearCookie(skipCookie)
    //     // } else {
    //     //     cy.getCookie(skipCookie).then(cookie => {
    //     //         if (
    //     //             cookie &&
    //     //             typeof cookie === 'object' &&
    //     //             cookie.value === 'true'
    //     //         ) {
    //     //             Cypress.runner.stop();
    //     //         }
    //     //     });
    //     // }
    //     //
    //     // cy.admin();
    //     cy.task("getEmailAccount").then((email) => {
    //         cy.log(email);
    //         userEmail = email;
    //     })
    // });

    beforeEach(() => {
        cy.admin();
    });

    it('Check first answer', function () {
        //  Go to the students answers page
        cy.wait(1500);
        // cy.visit('lc/admin/teacher/lessons');
        cy.get('.flex.justify-between', { timeout: 10000 }).eq(2).then($tab => {
            const isExpanded = $tab.attr('aria-expanded') === 'true';  // true если открыта
            if (!isExpanded) {
                cy.wrap($tab).click();
            }
        });
        cy.contains('Student answers').should('be.visible').click();
        cy.wait(1500);

        const lessonNames = [
            Cypress.env('lessonText'),
            Cypress.env('lessonCheckboxRadio'),
            Cypress.env('lessonTimer')
        ];

        cy.get('tbody tr[role="row"]').each($row => {
            cy.wrap($row).within(() => {
                cy.get('th').eq(3).invoke('text').then(text => {
                    const trimmedLesson = text.trim();

                    if (lessonNames.includes(trimmedLesson)) {
                        cy.log(`Найден урок: ${trimmedLesson}`);

                        // Кликаем по имени ученика (во втором столбце)
                        cy.get('th').eq(1).find('a').click();

                        // Здесь твоя логика проверки ответа:
                        cy.wait(500);
                        cy.xpath("//span[text()='Comment']").next().type("Comment");
                        cy.xpath("//span[text()='Comment']").next().next().click();
                        cy.contains('Success!').should('be.visible');

                        cy.xpath("//span[text()='Comment for student']").next().type("Lorem ipsum...");
                        cy.xpath("//span[text()='Success']").click();
                        cy.xpath("//button[text()='Restart']").next().click();

                        cy.xpath("//p[text()='Success!']", { timeout: 5000 }).should('be.visible');

                        // Возвращаемся к таблице — если это действительно нужно
                        // cy.go('back'); // или не нужно, если ты и так возвращаешься
                    }
                });
            });
        });
    });
        it('Should get complete the lesson email', function () {
            cy.wait(2500);
            recurse(
                () => {
                    if (main === 'release') return cy.task('getAccount', { subject, userEmail })
                    if (main === 'org-online') return cy.task('getEmailData')
                }, // Cypress commands to retry
                Cypress._.isObject, // keep retrying until the task returns an object
                {
                    timeout: 60000, // retry up to 1 minute
                    delay: 5000, // wait 5 seconds between attempts
                },
            )
                .its('html')
                .then((html) => {
                    cy.document({ log: false }).invoke({ log: false }, 'write', html)
                });
            cy.xpath("//span[@class='course-title']").should('be.visible')

        });

    });
