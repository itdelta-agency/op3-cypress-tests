describe('LC.A4. Create curriculum', () => {
  //  const skipCookie = Cypress.env('shouldSkipEduTests');

    // before(() => {
    //     if ( Cypress.browser.isHeaded ) {
    //         cy.clearCookie(skipCookie)
    //     } else {
    //         cy.getCookie(skipCookie).then(cookie => {
    //             if (
    //                 cookie &&
    //                 typeof cookie === 'object' &&
    //                 cookie.value === 'true'
    //             ) {
    //                 Cypress.runner.stop();
    //             }
    //         });
    //     }
    // });

    beforeEach(() => {
        cy.admin();
    });

    it('should create curriculum', function () {
        // Go to add curriculums page
        cy.wait(1500);
        cy.visit('/lc/admin/curriculums');
        cy.xpath("//button[text()='Add curriculum']").click();

        cy.xpath("//span[text()='Name *']").next().type(Cypress.env('curriculumName'));
        cy.xpath("//textarea").type("Lorem ipsum dolor sit amet, consectetur adipisicing elit.")

        cy.xpath("(//input[@type='text'])[2]").type(Cypress.env('courseName'));
        cy.xpath("//*[text()='" + Cypress.env('courseName') + "'][1]").click();

        cy.xpath("//button[text()='Select']").click();
        cy.wait(500);
        cy.xpath("/html/body/div[3]/div/div/div/div/div[2]/div[2]/div/div[1]/div[2]/input").type('QA');
        cy.wait(500);
        cy.xpath("//div[text()='QA Test']").click();

        cy.xpath("/html/body/div[3]/div/div/div/div/div[2]/button").click();
        cy.wait(500);

        //Save curriculum
        cy.xpath("//button[text()='Save']").click();
        // Assert curriculum created
        cy.xpath("//p[text()='Success!']", { timeout: 5000 }).should('be.visible');
    });


    // afterEach(function onAfterEach() {
    //     if (this.currentTest.state === 'failed') {
    //         cy.setCookie(skipCookie, 'true');
    //     }
    // });
});
