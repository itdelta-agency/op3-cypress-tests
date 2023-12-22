const { recurse } = require('cypress-recurse')

describe('LC.C1. Check student answers', () => {
    // const skipCookie = Cypress.env('shouldSkipEduTests');

    let main = Cypress.config('baseUrl').split('.')[1];
    let subject = 'Learning Center | Your answer has been reviewed!';
    let userEmail;

    before(() => {
        // if ( Cypress.browser.isHeaded ) {
        //     cy.clearCookie(skipCookie)
        // } else {
        //     cy.getCookie(skipCookie).then(cookie => {
        //         if (
        //             cookie &&
        //             typeof cookie === 'object' &&
        //             cookie.value === 'true'
        //         ) {
        //             Cypress.runner.stop();
        //         }
        //     });
        // }
        //
        // cy.admin();
        cy.task("getUserEmail").then((user) => {
            cy.log(user.email);
            cy.log(user.pass);
            userEmail = user.email;
        })
    });

    beforeEach(() => {
        cy.admin();
    });

   it('Check first answer', function () {
      //  Go to the students answers page
        cy.wait(1500);
        cy.visit('admin/lc/teacher/lessons');
        cy.wait(500);

        // Go to the lesson
        // cy.xpath("//div[text()='" + Cypress.env('userName') + "']").click();
        cy.get('button').contains('Check').first().click()
        // Assert we're in the lesson
        cy.xpath("//h2[text()='Checking the lesson']");
        // Input comment for the student
        cy.xpath("//textarea").type("Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium " +
            "ad beatae consectetur consequuntur dicta est et incidunt magni maxime minima natus nihil numquam " +
            "perferendis rem sequi, temporibus, totam. Eligendi, eos?");
        // Set answer as correct
        // cy.xpath("//button[@role='switch']").click();
        cy.get('span').contains('Success').parent().click()
        // Save answer
        cy.xpath("//button[text()='Save']").click();
        cy.xpath(3000);
        // Assert answer saved
        cy.xpath("//p[text()='Success!']", { timeout: 5000 }).should('be.visible');
    });

    it('Should get complete the lesson email', function() {
        cy.wait(2500);
        recurse(
            () => {
                if(main === 'release') return  cy.task('getAccount', {subject, userEmail})
                if(main === 'org-online') return cy.task('getLastEmail', {})
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
