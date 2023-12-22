const { recurse } = require('cypress-recurse');
describe('LC.A2. Create course', () => {
   //  const skipCookie = Cypress.env('shouldSkipEduTests');
    let main = Cypress.config('baseUrl').split('.')[1];
    let subject = 'Learning Center | Course has been assigned to you.';
    let userEmail;
    before(() => {

        cy.task("getUserEmail").then((user) => {
            cy.log(user.email);
            cy.log(user.pass);
            userEmail = user.email;
        })
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
    });
    
    beforeEach(() => {
        cy.admin();
    });

    it('should create course', function () {

        // Go to add courses page
        cy.xpath("//a[text()='Courses']").click();
        cy.contains('Add Course').click();

        cy.xpath("(//input[@type='text'])[1]").type(Cypress.env('courseName'));
        cy.xpath("//textarea").type("Lorem ipsum dolor sit amet, consectetur adipisicing elit.")
        // Set course as active
        cy.xpath("//button[text()='Select']").click();
        cy.wait(500);
        cy.xpath("/html/body/div[3]/div/div/div/div/div[2]/div[2]/div/div[1]/div[2]/input").type('QA');
        cy.wait(500);
        cy.xpath('//div[@id="react-select-4-listbox"]').click();

        // cy.xpath("/html/body/div[3]/div/div/div/div/div[2]/div[2]/div[2]/div/div[text()='QA TEST']").click();
        cy.xpath("/html/body/div[3]/div/div/div/div/div[2]/button").click();
        cy.wait(500);
        cy.xpath("//button[text()='Save']").click();
        cy.wait(1000);
        cy.contains("Success").should('be.visible');
    });
  
    it('check get email', function () {
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
          cy.document({ log: false }).invoke({ log: false }, 'write', html);
        });
      cy.xpath("//span[@class='course-title']").should('be.visible');
    })
});
