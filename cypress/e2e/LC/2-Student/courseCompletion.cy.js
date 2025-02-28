describe('LC.B1. Complete the course which we have created in previous tests', () => {
    beforeEach(() => {
        cy.task("getEmailAccount").then((email) => {
            cy.login(email, Cypress.env('password'));
        })
      // cy.login('nagopib486@chambile.com', '123');
    });

    it('Student should answer the lesson', function () {
        cy.visit('/lc/courses');
        // Find the course by name
        cy.xpath("//input[@id='search']").type(Cypress.env('courseName'));
        // Go to the course
        cy.xpath("//h3[text()='" + Cypress.env('courseName') + "']").first().click();
        // Assert that we're in the course
        cy.xpath("//h1[text()='" + Cypress.env('courseName') + "']");
        // Start the course (click on run)
        cy.xpath("//button[@class='my-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500']")
            .click();

        //// FIRST LESSON ////
        // Assert we're in the second lesson
        cy.xpath("//h1[text()='" + Cypress.env('lessonCheckboxRadio') + "']");
        // Select correct radio answer
        cy.xpath("(//input[@type='radio'])").parent().find(":contains('answer 1')").click();


        cy.xpath("//label[text()='answer 1']").click();
        // Select correct checkbox answer
        // cy.xpath("(//input[@type='checkbox'])").parent().parent().find(":contains('answer 1')").click({multiple: true});
        // Go to the next lesson
        cy.wait(2000)
        cy.xpath('//button[text()=\'Check\']').click();

        //// SECOND LESSON ////
        // Assert we're in the third lesson
        cy.xpath("//h1[text()='" + Cypress.env('lessonText') + "']");
        // Input answer
        cy.xpath("//div[@contenteditable='true']").click().type("Lorem ipsum dolor sit amet, consectetur " +
            "adipisicing elit. Accusamus aspernatur dolorem dolorum eligendi esse facilis impedit ipsa maxime minus " +
            "molestiae nostrum odit provident quam ratione, sequi similique, tempore. Nemo, sunt?");
        // Go to the next lesson
        cy.xpath('//button[text()=\'Check\']').click();
      //
       cy.wait(500);
      // cy.xpath("/html/body/div[3]/div/div/div/div/div[2]/div[2]/button[1]").click();
      //
      // cy.xpath("//h1[text()='" + Cypress.env('lessonTimer') + "']");
      // // Input answer
      // cy.xpath("//div[@contenteditable='true']").click().type("Lorem ipsum dolor sit amet, consectetur " +
      //   "adipisicing elit. Accusamus aspernatur dolorem dolorum eligendi esse facilis impedit ipsa maxime minus " +
      //   "molestiae nostrum odit provident quam ratione, sequi similique, tempore. Nemo, sunt?");
      // // Go to the next lesson
      // cy.xpath('//button[text()=\'Check\']').click();
      //
      //
         cy.get('div').contains('The lesson is awaiting teacher review').should('be.visible')
      //
        //// BACK TO THE FIRST LESSON
      cy.get('p').contains('QA Test lesson (checkbox + radio)').click();
      cy.get('div').contains('Lesson successfully completed!').should('be.visible')
    });

});
