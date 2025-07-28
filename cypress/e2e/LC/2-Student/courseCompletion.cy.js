describe('LC.B1. Complete the course which we have created in previous tests', () => {

  const courseName = Cypress.env('courseName');
  beforeEach(() => {
    cy.task("getUserEmail").then((data) => {
      // data — объект, берем поле email
      cy.login(data.email, Cypress.env('password'));
    });
  });

  it('Student should answer the lesson', function () {
    cy.login();
    cy.visit('/lc/courses');
    // Find the course by name
    cy.xpath("//input[@id='search']").type(courseName);
    cy.wait(200);

    cy.get('.flex.justify-between').eq(4)
      .invoke('attr', 'aria-expanded')
      .then(checked => {
        if (checked === 'false') {
          cy.get('.flex.justify-between').eq(4).click();
        }
        // Если 'true' — ничего не делаем
      });
    // Go to the course
    cy.xpath(`//h3[text()='${courseName}']`).click();
    cy.wait(200);
    // Assert that we're in the course
    cy.xpath("//h1[text()='" + courseName + "']");
    cy.wait(200);
    // Start the course (click on run)
    cy.xpath("//button[@class='my-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500']")
      .click();
    cy.wait(800);

    //// FIRST LESSON ////
    // Assert we're in the second lesson
    cy.contains('Lesson successfully completed!', { timeout: 5000 }).then($el => {
      if ($el.length > 0 && $el.is(':visible')) {
        // Урок пройден — переходим к следующему
        cy.log('Урок завершен — переходим к следующему');
        cy.contains('QA Test lesson (text)').click();
      } else {
        // Урок не завершен — отвечаем на вопросы
        cy.log('Урок не завершен — отвечаем на вопросы');

        cy.xpath("//h1[text()='" + Cypress.env('lessonCheckboxRadio') + "']").should('exist');
        cy.wait(200);

        cy.xpath("(//input[@type='radio'])").parent().contains('answer 1').click();
        cy.xpath("//label[text()='answer 1']").click();
        cy.wait(200);

        // Если нужны чекбоксы, раскомментируй
        // cy.xpath("(//input[@type='checkbox'])").parent().parent().contains('answer 1').click({ multiple: true });

        cy.wait(2000);
        cy.xpath("//button[text()='Check']").click();
      }
    });

    //// SECOND LESSON ////
    // Assert we're in the third lesson
    cy.contains('The lesson is awaiting teacher review', { timeout: 5000 }).then($el => {
      if ($el.length > 0 && $el.is(':visible')) {
        // Урок пройден — переходим к следующему
        cy.log('Урок завершен — переходим к следующему');
        cy.contains('QA Test lesson (timer)').click();
      } else {
        cy.xpath("//h1[text()='" + Cypress.env('lessonText') + "']");
        cy.wait(200);
        // Input answer
        cy.xpath("//div[@contenteditable='true']").click().type("Lorem ipsum dolor sit amet, consectetur " +
          "adipisicing elit. Accusamus aspernatur dolorem dolorum eligendi esse facilis impedit ipsa maxime minus " +
          "molestiae nostrum odit provident quam ratione, sequi similique, tempore. Nemo, sunt?");
        // Go to the next lesson
        cy.xpath('//button[text()=\'Check\']').click();
        //
        cy.wait(500);
      }


      cy.contains('The lesson is awaiting teacher review', { timeout: 5000 }).then($el => {
        if ($el.length > 0 && $el.is(':visible')) {
          // Урок пройден — переходим к следующему
          cy.log('Урок завершен — переходим к следующему');
        } else {
          cy.get('button').contains('Start lesson').should('be.visible').click();
          cy.wait(1000);
          cy.get('.ql-editor.ql-blank').eq(1).type("Lorem ipsum dolor sit amet, consectetur " +
            "adipisicing elit. Accusamus aspernatur dolorem dolorum eligendi esse facilis impedit ipsa maxime minus " +
            "molestiae nostrum odit provident quam ratione, sequi similique, tempore. Nemo, sunt?");
          cy.get('button').contains('Check').click();
          cy.wait(200);
        }
          cy.get('div').contains('The lesson is awaiting teacher review').should('be.visible');

          //
          //// BACK TO THE FIRST LESSON
          cy.get('p').contains('QA Test lesson (checkbox + radio)').click();
          cy.wait(200);
          cy.get('div').contains('Lesson successfully completed!').should('be.visible')
        
      });
    })
  })

});
