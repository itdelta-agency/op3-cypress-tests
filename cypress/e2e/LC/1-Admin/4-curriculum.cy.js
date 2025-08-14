import { ROUTES } from "../../../support/routes";

describe('LC.A4. Create curriculum', () => {

    let curriculumName = Cypress.env('curriculumName');
    let sortNumb = Cypress.env('sortNumb');
    let courseName = Cypress.env('courseName');


    beforeEach(function () {
        cy.logTestName.call(this);
        cy.admin();
    });

    it('should create curriculum', function () {
        cy.task('logStep', 'Переход на страницу "Программы обучения"');
        // Go to add curriculums page
        cy.visit(ROUTES.curriculums);
        cy.wait(1500);
        cy.task('logInfo', 'Переход на страницу создания программы обучения');

        cy.get('button').contains('Add curriculum', {timeout:5000}).click();
        cy.get('h2').contains('Create curriculum').should('be.visible');

        cy.contains('Name *').next().type(curriculumName);
        cy.contains('Description').next().type("Lorem ipsum dolor sit amet, consectetur adipisicing elit.");
        cy.wait(500);
        cy.whoCanSee(['Users', 'Teams', 'Others']);

        cy.get("button[role='switch']").eq(0)
            .invoke('attr', 'aria-checked')
            .then(checked => {
                if (checked === 'false') {
                    cy.get("button[role='switch']").eq(0).click();
                }
            });

        cy.contains('Sorting').next().type(sortNumb);
        cy.get('.css-19bb58m').type(courseName);
        cy.xpath(`//*[text()="${courseName}"][1]`).click();


        cy.xpath("//button[text()='Save']").should('be.visible').click();
        cy.checkTextInParagraph();
        cy.task('logInfo', 'Программа обучения создана');
    });

});
