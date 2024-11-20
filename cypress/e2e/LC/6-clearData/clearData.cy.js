describe('LC.Z. Clear all created learning items', () => {
    let userEmail;

    const isNonExistentOrHidden  = ($el => Cypress.dom.isElement($el));

    before(() => {
        cy.task("getUserEmail").then((user) => {
            cy.log(user.email);
            cy.log(user.pass);
            userEmail = user.email;
        })
    });

    beforeEach(() => {
        cy.admin();
    })

    it('should delete course', function () {
      cy.visit('/admin/lc/courses');
      cy.wait(1000);

        cy.xpath(`//div[text()='${Cypress.env("courseName")}']`).parent().parent().parent().parent().parent().scrollIntoView().find('.tooltip').last().click();
        cy.wait(500);
        cy.get('button').contains('Delete').click();
        cy.xpath("//p[text()='Success!']").should('be.visible');
    });

    it('should delete lessons', function () {
        cy.visit('/admin/lc/lessons');
        cy.wait(1500);
        cy.accessAllItems();
        cy.xpath(`//div[text()='${Cypress.env('lessonText')}']`).parent().parent().parent().parent().parent().find('.tooltip').last().click();
        cy.get('button').contains('Delete').click();
        cy.wait(500);
        cy.xpath("//p[text()='Success!']").should('be.visible');

        cy.wait(1000);
        cy.visit('/admin/lc/lessons');
        cy.wait(1500);
        cy.xpath(`//div[text()='${Cypress.env('lessonCheckboxRadio')}']`).parent().parent().parent().parent().parent().find('.tooltip').last().click();
        cy.get('button').contains('Delete').click();
        cy.wait(500);
        cy.xpath("//p[text()='Success!']").should('be.visible');

        // cy.wait(500);
        // cy.visit('/admin/lc/lessons');
        // cy.wait(500);
        // cy.xpath(`//div[text()='${Cypress.env('lessonTimer')}']`).parent().parent().parent().parent().parent().find('.tooltip').last().click();
        // cy.get('button').contains('Delete').click();
        // cy.xpath("//p[text()='Success!']").should('be.visible');
    });

    it('delete curriculum', function () {
        cy.visit('/admin/lc/curriculums');
        cy.wait(500);
        cy.xpath(`//div[text()='${Cypress.env('curriculumName')}']`).parent().parent().parent().parent().parent().find('.tooltip').last().click();
        cy.wait(500);
        cy.get('button').contains('Delete').click();
        cy.wait(500);
        cy.xpath("//p[text()='Success!']").should('be.visible');
    });

    it('delete course group', function () {
        cy.visit('/admin/lc/groups');
        cy.wait(1000);
        cy.xpath(`//div[text()='${Cypress.env('courseGroupName')}']/../../../../../th[5]/div/div[2]`).last().click();
        cy.wait(500);
        cy.get('button').contains('Delete').click();
        cy.wait(500);
        cy.xpath("//p[text()='Success!']").should('be.visible');
    });

    it('should delete team', function () {
        cy.visit('/admin/teams');
        cy.wait(1000);
        cy.accessAllItems();
        cy.xpath(`//div[text()='${Cypress.env('teemName')}']`).parent().parent().parent().parent().parent().find('.tooltip').last().click();
        cy.wait(500);
        cy.get('button').contains('Delete').click();
        cy.wait(500);
        // Assert team deleted
        cy.xpath("//p[text()='Success!']", { timeout: 5000 }).should('be.visible');
    });

    it('delete invite user', function() {
        cy.visit('/admin/user');
        cy.wait(1000);
        cy.contains(userEmail).parent().parent().last().scrollIntoView().find('.tooltip').last().click();
        cy.wait(500)
        cy.get('button').contains('Delete').click();
        cy.wait(500)
        cy.xpath("//p[text()='Success!']").should('be.visible');
    })


    it('delete User', () => {
        cy.visit('/admin/user');
        cy.wait(1000);
        cy.xpath(`//div[text()='QA QA USER USER']`).parent().parent().parent().parent().parent().find('.tooltip').last().click();
        cy.wait(500);
        cy.get('button').contains('Delete').click();
        cy.wait(500);
        cy.xpath("//p[text()='Success!']", { timeout: 5000 }).should('be.visible');
    })

    it('check Delete', () => {
        cy.visit('/admin/user');
        cy.wait(1000);
        cy.contains('div', 'Qa Test').should(($el) => {
            console.log(isNonExistentOrHidden($el))
            if(!isNonExistentOrHidden($el)) {
                expect(isNonExistentOrHidden($el)).to.be.false
            }
        }).then((res) => {
            if(res.length) {
                cy.contains('Qa Test').parent().parent().last().scrollIntoView().find('.tooltip').last().click();
                cy.wait(500);
                cy.get('button').contains('Delete').click();
                cy.wait(500);
                cy.xpath("//p[text()='Success!']", { timeout: 5000 }).should('be.visible');
            }
        })
    })

    it('delete position', function () {
        cy.visit('ob/admin/positions');
        cy.wait(3000);
        cy.accessAllItems();
        cy.xpath(`//div[text()='QA position']`).parent().parent().parent().parent().parent().find('.tooltip').last().click();
        cy.wait(500);
        cy.get('button').contains('Delete').click();
        cy.wait(500);
        cy.xpath("//p[text()='Success!']", { timeout: 5000 }).should('be.visible');
    })

    it('delete children departament', function () {
        cy.visit('ob/admin/departments/scheme');
        cy.wait(3000);
        cy.xpath(`//div[text()='QA department']`).scrollIntoView().click();
        cy.xpath("//span[text()='QA department2']").next().find('svg').last().click({force: true});
        cy.get('button').contains('Delete').click();
        cy.wait(500);
        cy.xpath("//p[text()='Success!']", { timeout: 5000 }).should('be.visible');
    })

    it('delete departament', function () {
        cy.visit('ob/admin/departments/scheme');
        cy.wait(3000);
        cy.xpath(`//div[text()='QA department']`).scrollIntoView().click();
        cy.xpath("//div[text()='QA department']").next().find('svg').last().click({force: true});
        cy.get('button').contains('Delete').click();
        cy.wait(500);
        cy.xpath("//p[text()='Success!']", { timeout: 5000 }).should('be.visible');
    })
});
