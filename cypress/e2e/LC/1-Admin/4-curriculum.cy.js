import { ROUTES } from "../../../support/routes";


describe('LC.A4. Create curriculum', () => {
 

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

        cy.xpath("//button[text()='Save']").should('be.visible').click();
        cy.checkTextInParagraph();
        cy.task('logInfo', 'Программа обучения создана');
    });

});
