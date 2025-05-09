const { recurse } = require('cypress-recurse');
describe('LC.A2. Create course', () => {
   //  const skipCookie = Cypress.env('shouldSkipEduTests');
    let main = Cypress.config('baseUrl').split('.')[1];
    let subject = 'Learning Center | Course has been assigned to you.';
    let userEmail;
    before(() => {

        cy.task("getEmailAccount").then((email) => {
            cy.log(email);
            userEmail = email;
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
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Learning Center")').click({multiple: true});
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Courses")').click({multiple: true});
        cy.wait(3000);
        cy.contains('Add Course').click();
        cy.xpath("//span[text()='Name *']").next().type(Cypress.env('courseName'));
        cy.xpath("//textarea").type("Lorem ipsum dolor sit amet, consectetur adipisicing elit.")
        // Set course as active
        cy.xpath("//button[text()='Select']").click();
        cy.wait(500);
        cy.xpath("/html/body/div[3]/div/div/div/div/div[2]/div[2]/div/div[1]/div[2]/input").type('QA');
        cy.wait(500);
        cy.contains('div', 'QA Test').click();
        // cy.xpath('//div[@id="react-select-4-listbox"]').click();

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
            if(main === 'org-online') return cy.task('getEmailData', {})
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
