describe('LC.B2. Search courses', () => {

    beforeEach(() => {
        cy.login();
        cy.visit('/lc/courses');
    });

    it('select Started Finished and All courses', function () {
        cy.xpath("//button[text()='Started']").click()
        cy.xpath("//button[text()='Finished']").click()
        cy.xpath("//button[text()='All']").click()
    });

    it('search course by name', function () {
        cy.xpath("//input[@id='search']").type(Cypress.env('courseName')).clear();
    });

    it('go to curriculums', function () {
        cy.xpath("//a[@name='Curriculums']").click();
        // cy.xpath("//span[text()='" + Cypress.env('curriculumName') + "']").should('be.visible').click();
    });

    // afterEach(function onAfterEach() {
    //     if (this.currentTest.state === 'failed') {
    //         Cypress.runner.stop();
    //         cy.setCookie(skipCookie, 'true');
    //     }
    // });
});

// describe('Search curriculums', function () {
//     before(() => {
//         cy.login(Cypress.env('email'), Cypress.env('password'), { log: false });
//     });
//
//     it('go to curriculums and search them by name', function () {
//         cy.xpath("//a[@name='Curriculums']").click();
//         cy.xpath("//h3[text()='Архитектура']").should('be.visible').click();
//         cy.xpath("//h1[text()='Архитектура']").should('be.visible');
//     });
// });
