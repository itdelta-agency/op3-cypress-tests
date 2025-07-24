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
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Learning Center")').click({ multiple: true });
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Curriculums")').click({ multiple: true });
        cy.xpath("//button[text()='Add curriculum']").click();

        cy.xpath("//span[text()='Name *']").next().type(Cypress.env('curriculumName'));
        cy.xpath("//textarea").type("Lorem ipsum dolor sit amet, consectetur adipisicing elit.")
        cy.whoCanSee(['Users', 'Teams', 'Others']);

        cy.xpath("(//input[@type='text'])[2]").type(Cypress.env('courseName'));
        cy.xpath("//*[text()='" + Cypress.env('courseName') + "'][1]").click();

        cy.get("button[role='switch']").eq(0)
            .invoke('attr', 'aria-checked')
            .then(checked => {
                if (checked === 'false') {
                    cy.get("button[role='switch']").eq(0).click();
                }
            });

        // cy.xpath("/html/body/div[3]/div/div/div/div/div[2]/button").click();
        // cy.wait(500);

        //Save curriculum
        cy.xpath("//button[text()='Save']").should('be.visible').click();
        cy.xpath("//p[text()='Success!']", { timeout: 5000 }).should('be.visible');
    });


    // afterEach(function onAfterEach() {
    //     if (this.currentTest.state === 'failed') {
    //         cy.setCookie(skipCookie, 'true');
    //     }
    // });
});
