const { ROUTES } = require("../../../support/routes");

describe('LC.Z. Clear all created learning items', () => {




    beforeEach(function () {
        cy.logTestName.call(this);
        cy.admin();
    })


    it('should delete category if exists', function () {
        const catName = Cypress.env('categoryName');
        cy.visit(ROUTES.categories);
        cy.wait(1000);

        cy.searchRow(catName);
        cy.wait(500);

        cy.ifRowExists(catName, () => {
            cy.deleteResources(catName);
        });
        cy.checkTextInParagraph();
    });


    it('should delete article', function () {

        const articleName = Cypress.env('articleName');
        cy.visit(ROUTES.articles);
        cy.wait(1000);

        cy.searchRow(articleName);
        cy.wait(500);

        cy.ifRowExists(articleName, () => {
            cy.deleteResources(articleName);
        });
        cy.checkTextInParagraph();
    });




    it('should delete course', function () {
        let courseName = Cypress.env('courseName');
        cy.visit(ROUTES.courses);
        cy.wait(1000);

        cy.searchRow(courseName);
        cy.wait(500);

        cy.ifRowExists(courseName, () => {
            cy.deleteResources(courseName);
        });
    });

    it('should delete curriculum', function () {
        const curriculumName = Cypress.env('curriculumName');
        cy.visit(ROUTES.curriculums)
        cy.wait(1000);

        cy.searchRow(curriculumName);
        cy.wait(500);

        cy.ifRowExists(curriculumName, () => {
            cy.deleteResources(curriculumName);
        });
    })

    it('should delete course group', function () {
        const courseGroupName = Cypress.env('courseGroupName');
        cy.visit(ROUTES.groupCourse)
        cy.wait(1000);
        cy.searchRow(courseGroupName);
        cy.wait(500);

        cy.ifRowExists(courseGroupName, () => {
            cy.deleteResources(courseGroupName);
        });
    })



    it('should delete lessons', function () {
        let lName = Cypress.env('lessonCheckboxRadio');
        let lessonText = Cypress.env('lessonText');
        let lessonTimer = Cypress.env('lessonTimer');
        cy.visit(ROUTES.lessons);
        cy.wait(1000);
        cy.bulkAction(['Delete'], [lName, lessonText, lessonTimer]);
    })

    it('delete user', function () {
        const editUser = Cypress.env('editUser');
        cy.visit(ROUTES.users);
        cy.wait(1500);
        cy.searchRow(editUser);
        cy.wait(500);

        cy.ifRowExists(editUser, () => {
            cy.deleteResources(editUser);
        });

    })

    it('delete position', function () {
        const namePosition = Cypress.env('namePosition');
        cy.visit(ROUTES.position);
        cy.wait(1500);
        cy.searchRow(namePosition);
        cy.wait(500);

        cy.ifRowExists(namePosition, () => {
            cy.deleteResources(namePosition);
        });

    })



    it('delete children departament', function () {

        const department = Cypress.env('department');

        cy.login();
        cy.visit(ROUTES.orgScheme);
        cy.wait(1500);
        cy.xpath(`//div[text()="${department}"]`).scrollIntoView().click();
        cy.get('.text-lg.cursor-pointer').find('svg').last().click({ force: true });
        cy.get('button').contains('Delete').click();
        cy.wait(500);
        cy.xpath("//p[text()='Success!']", { timeout: 5000 }).should('be.visible');

    })

    it('delete departament', function () {
        const department = Cypress.env('department');
        cy.login();
        cy.visit(ROUTES.orgScheme);
        cy.wait(2000);
        cy.xpath(`//div[text()="${department}"]`).scrollIntoView().click();
        cy.get('.overflow-ellipsis').contains(department).next().find('svg').last().click({ force: true });
        cy.get('button').contains('Delete').click();
        cy.wait(500);
        cy.xpath("//p[text()='Success!']", { timeout: 5000 }).should('be.visible');
    })

    it('delete team', function () {
        const teamName = Cypress.env('teamName');
        cy.visit(ROUTES.teams);
        cy.wait(1500);
        cy.searchRow(teamName);
        cy.wait(500);

        cy.ifRowExists(teamName, () => {
            cy.deleteResources(teamName);
        });

    })

    it('delete password', function () {
        const passName = Cypress.env('passName');
        cy.visit(ROUTES.passwords);
        cy.wait(1500);
        cy.searchRow(passName);
        cy.wait(500);

        cy.ifRowExists(passName, () => {
            cy.deleteResources(passName);
        });
    })

});
