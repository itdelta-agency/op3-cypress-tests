describe('LC.A3. Create course group', () => {


    beforeEach(function () {
        cy.logTestName.call(this);
        cy.admin();
    });

    it('should create course program', function () {
        cy.task('logStep', 'Переход на страницу "Группы курсов"');
        // Go to add curriculums page
        // cy.wait(1500);
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Learning Center")').click({ multiple: true });
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Course groups")').click({ multiple: true });
        cy.wait(1500);
        cy.contains('Add group').click();
        cy.task('logStep', 'Переход на страницу "Создание группы курсов"');
        cy.xpath("//span[text()='Name *']").next().type(Cypress.env('courseGroupName'));
        cy.xpath("//span[@class='ml-6 ml-6 mt-2 text-sm text-gray-900 sm:mt-0 sm:col-span-2']").click();
        cy.xpath("//textarea").type("Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci " +
            "eligendi harum hic quidem. Aliquam amet architecto, id illum laboriosam maxime nobis omnis perspiciatis " +
            "porro provident, quidem reiciendis sequi voluptate voluptatem.")

        // Save group
        cy.xpath('(//input[@type="text"])[2]').type(Cypress.env('courseName'));
        cy.wait(1500);
        cy.contains('div', Cypress.env('courseName')).click()
        cy.xpath("//button[text()='Save']").click();
        cy.task('logInfo', 'Группа курсов созданна');

        cy.checkTextInParagraph();
    });
});
