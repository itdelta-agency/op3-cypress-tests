const { ROUTES } = require("../../../support/routes");

describe('LC.Z. Clear all created learning items', () => {
    let userEmail;

    const isNonExistentOrHidden = ($el => Cypress.dom.isElement($el));

    // before(() => {
    //     cy.task("getEmailAccount").then((email) => {
    //         cy.log(email);
    //         userEmail = email;
    //     })
    // })

    beforeEach(() => {
        cy.admin();
    })


    it('should delete category if exists', function () {
        const catName = Cypress.env('categoryName');
        cy.visit(ROUTES.categories);
        cy.wait(1000);

        cy.searchRow(catName);
        cy.wait(500);

        // Кастомная команда удаления
        cy.ifRowExists(catName, () => {

            cy.deleteResources(catName);
        });
    });


    it('should delete article', function () {

        const articleName = Cypress.env('articleName');
        cy.visit(ROUTES.articles);
        cy.wait(1000);

        cy.searchRow(articleName);
        cy.wait(500);

        // Кастомная команда удаления
        cy.ifRowExists(articleName, () => {

            cy.deleteResources(articleName);
        });
    });




    it('should delete course', function () {
        let courseName = Cypress.env('courseName');
        cy.visit(ROUTES.courses);
        cy.wait(1000);
        cy.searchRow(courseName);
        cy.wait(500);
        // Используем кастомную команду
        cy.ifRowExists(courseName, () => {
            cy.deleteResources(courseName);
        });
    });

    it('should delete curriculum', function () {
        const curriculumName = Cypress.env('curriculumName');
        cy.wait(1000);
        cy.searchRow(curriculumName);
        cy.wait(500);
        // Используем кастомную команду
        cy.ifRowExists(curriculumName, () => {
            cy.deleteResources(curriculumName);
        });
    })

    it('should delete course group', function () {
        const courseGroupName = Cypress.env('courseGroupName');
        cy.wait(1000);
        cy.searchRow(courseGroupName);
        cy.wait(500);
        // Используем кастомную команду
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

it('delete user', () => {
    let editUser = Cypress.env('editUser');
    cy.visit(ROUTES.users);
    cy.wait(2000);
    cy.searchRow(editUser);
    cy.wait(500);
    // Используем кастомную команду
    cy.ifRowExists(editUser, () => {

        cy.deleteResourses(editUser);
    });

})

it('delete position', function () {
    cy.login();

    cy.visit('ob/admin/positions');
    cy.wait(3000);
    cy.accessAllItems();
    cy.xpath(`//div[text()='QA position']`).closest('tr').within(() => {
        cy.get('th').eq(1).find('div').click();
    });
    cy.contains('Delete position').should('be.visible').click({ multiple: true });
    cy.wait(500);
    cy.get('button').contains('Delete').click();
    cy.wait(500);
    cy.xpath("//p[text()='Success!']", { timeout: 5000 }).should('be.visible');

})

it('delete children departament', function () {
    cy.login();
    cy.visit('ob/admin/departments/scheme');
    cy.wait(3000);
    cy.xpath(`//div[text()='QA department']`).scrollIntoView().click();
    cy.xpath("//span[text()='QA department2']").next().find('svg').last().click({ force: true });
    cy.get('button').contains('Delete').click();
    cy.wait(500);
    cy.xpath("//p[text()='Success!']", { timeout: 5000 }).should('be.visible');

})

it('delete departament', function () {
    cy.login();
    cy.visit('ob/admin/departments/scheme');
    cy.wait(3000);
    cy.xpath(`//div[text()='QA department']`).scrollIntoView().click();
    cy.xpath("//div[text()='QA department']").next().find('svg').last().click({ force: true });
    cy.get('button').contains('Delete').click();
    cy.wait(500);
    cy.xpath("//p[text()='Success!']", { timeout: 5000 }).should('be.visible');
})
});
