describe("LC.A1. Create lessons", () => {
  const skipCookie = Cypress.env('shouldSkipEduTests');
  let userName;
  const lName = Cypress.env('lessonCheckboxRadio');
  const qNameR = Cypress.env('questionRadio');
  const qNameCB = Cypress.env('questionCheckbox');
    beforeEach(() => {
      cy.admin();
      cy.task("getUserEmail").then((user) => {
        userName = user.email.replace("@ethereal.email", "");
      });
      // if ( Cypress.browser.isHeaded ) {
      //   cy.clearCookie(skipCookie)
      // } else {
      //   cy.getCookie(skipCookie).then(cookie => {
      //     if (
      //         cookie &&
      //         typeof cookie === 'object' &&
      //         cookie.value === 'true'
      //     ) {
      //       Cypress.runner.stop();
      //     }
      //   });
      // }
    });
  
  it('should create lesson(checkbox + radio)', function () {
    // Go to add courses page
    cy.xpath("//a[text()='Courses']").click();
    cy.wait(500);
    cy.accessAllItems();
    cy.xpath("(//div[text()='" + Cypress.env('courseName') + "'])[1]").click();

    cy.xpath("//span[text()='List of lessons']//following-sibling::span/descendant::input").click();
    cy.xpath("/html/body/div[2]/div/div/div[2]/div[2]/main/div/ul/li[7]/span[2]/div[3]/div[2]/div/div[2]/button").click();

    cy.wait(500);
    // CREATE LESSON
    cy.xpath("//h2[text()='Create lesson']").click();
    cy.xpath("//input[@type='text']").first().type(lName);
    cy.xpath("//button[@role='switch']").click();


    // CREATE QUESTION AND ANSWER RADIO
    cy.xpath("//span[text()='Add question']").click();
    cy.xpath("/html/body/div[6]/div/div/div/div/div[2]/div[2]/button[1]").click();
    cy.wait(500);
    cy.question(qNameR, 2);
    cy.wait(500);
    // CREATE QUESTION AND ANSWER checkbox
    cy.xpath("//span[text()='Add question']").click();
    cy.question(qNameCB, 3);
    //
    // // SAVE LESSON
    cy.xpath("/html/body/div[2]/div/div/div[2]/div[2]/main/div/div/button[2]").click();
    cy.wait(500);
    cy.contains("Success").should('be.visible');

    //SAVE COURSE
    // cy.xpath("//a[text()='Courses']").click();
    // cy.wait(500);
    // cy.xpath("(//div[text()='" + Cypress.env('courseName') + "'])[1]").click();

    // cy.xpath("//span[text()='List of lessons']//following-sibling::span/descendant::input").type(Cypress.env('lessonCheckboxRadio'));
    // cy.xpath("//*[text()='" + Cypress.env('lessonCheckboxRadio') + "'][1]").click();
    // cy.xpath("//span[text()='List of lessons']//following-sibling::span/descendant::input").type(Cypress.env('lessonText'));
    // cy.xpath("//*[text()='" + Cypress.env('lessonText') + "'][1]").click();
    // cy.xpath("//span[text()='List of lessons']//following-sibling::span/descendant::input").type(Cypress.env('lessonTimer'));
    // cy.xpath("//*[text()='" + Cypress.env('lessonTimer') + "'][1]").click();

    //Save course
      //  cy.xpath("//button[text()='Save']").click();
      //    cy.wait(1000);
   // Assert course created
    // cy.contains("Success").should('be.visible');
  });


  it('should create lesson(text)', function () {
    const lName = Cypress.env('lessonText');
    const qName = Cypress.env('questionText');

    cy.xpath("//a[text()='Courses']").click();
    cy.wait(500);
    cy.accessAllItems();
    cy.xpath("(//div[text()='" + Cypress.env('courseName') + "'])[1]").click();

    cy.xpath("//span[text()='List of lessons']//following-sibling::span/descendant::input").click();
    cy.xpath("/html/body/div[2]/div/div/div[2]/div[2]/main/div/ul/li[7]/span[2]/div[3]/div[2]/div/div[2]/button").click();

    //// Create lesson ////
    cy.xpath("//h2[text()='Create lesson']").click();
    cy.xpath("//input[@type='text']").first().type(lName);
    cy.xpath("//button[@role='switch']").click();
      cy.xpath("//span[text()='Add question']").click();
      cy.xpath("/html/body/div[6]/div/div/div/div/div[2]/div[2]/button[1]").click();
    cy.question(qName, 1);
    cy.xpath("//button[text()='Save']").click();
    cy.wait(500);
    cy.contains("Success").should('be.visible');
  });

  
  // it('should create lesson(timer)', function () {
  //   const lName = Cypress.env('lessonTimer');
  //   const qName = Cypress.env('questionText');
  //
  //
  //   cy.xpath("//a[text()='Courses']").click();
  //   cy.wait(500);
  //   cy.accessAllItems();
  //   cy.xpath("(//div[text()='" + Cypress.env('courseName') + "'])[1]").click();
  //
  //   cy.xpath("//span[text()='List of lessons']//following-sibling::span/descendant::input").click();
  //   cy.xpath("/html/body/div[2]/div/div/div[2]/div[2]/main/div/ul/li[7]/span[2]/div[3]/div[2]/div/div[2]/button").click();
  //
  //   // Create lesson
  //   cy.xpath("//h2[text()='Create lesson']").click();
  //   cy.xpath("//input[@type='text']").first().type(lName);
  //   cy.xpath("//button[@role='switch']").click();
  //   cy.xpath("/html/body/div[2]/div/div/div[2]/div[2]/main/div/ul/li[7]/div[2]/label/input").type(2);
  //
  //   // Create text question
  //        cy.xpath("//span[text()='Add question']").click();
  //       cy.xpath("/html/body/div[6]/div/div/div/div/div[2]/div[2]/button[1]").click();
  //   cy.question(qName, 1);
  //
  //
  //   cy.xpath("//button[text()='Save']").click();
  //   cy.wait(500);
  //   cy.contains("Success").should('be.visible');
  //   // delete lesson
  //   // cy.visit('/admin/lc/lessons');
  //   // cy.xpath(`//div[text()='${lName}']/../../../../../th[4]/div/div[2]`).last().click();
  //   // cy.get('button').contains('Delete').click();
  //   // cy.xpath("//p[text()='Success!']").should('be.visible');
  //
  // });
  //
  //
  
  

    // afterEach(function onAfterEach() {
    //     // if (this.currentTest.state === 'failed') {
    //     //     cy.setCookie(skipCookie, 'true');
    //     // }
    // });
});
