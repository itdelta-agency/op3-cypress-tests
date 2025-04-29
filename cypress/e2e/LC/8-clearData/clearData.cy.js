describe('LC.Z. Clear all created learning items', () => {
    let userEmail;

    const isNonExistentOrHidden  = ($el => Cypress.dom.isElement($el));

    before(() => {
        cy.task("getEmailAccount").then((email) => {
            cy.log(email);
            userEmail = email;
        })
    })

    before(() => {
        cy.admin();
    })

    it('should delete course', function () {
        // cy.login();
        // cy.visit('/')
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Learning Center")').click({multiple: true});
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Courses")').click({multiple: true});

      cy.wait(1000);
        cy.accessAllItems();
        cy.wait(500);
        cy.xpath(`//div[text()='${Cypress.env("courseName")}']`).closest('tr').within(() => {
            cy.get('th').eq(1).find('div').click();
        });
        cy.contains('Delete course').should('be.visible').click({ multiple: true });
        cy.wait(500);
        cy.get('button').contains('Delete').click({force: true});
        cy.xpath("//p[text()='Success!']").should('be.visible');
    });


    it('should delete lessons', function () {
        cy.login();
        cy.visit('/admin/user')
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Learning Center")').click({multiple: true});
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Lessons")').click({multiple: true});
        cy.wait(1500);
        cy.accessAllItems();
        cy.xpath(`//div[text()='${Cypress.env('lessonText')}']`).closest('tr').within(() => {
                cy.get('th').eq(1).find('div').click();
            });
        cy.contains('Delete lesson').should('be.visible').click({ multiple: true });

        cy.contains('button', 'Delete')
            .should('be.visible')
            .click();
        cy.wait(500);
        cy.xpath("//p[text()='Success!']").should('be.visible');

        cy.wait(1000);
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Learning Center")').click({multiple: true});
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Lessons")').click({multiple: true});
        cy.wait(1500);
        cy.xpath(`//div[text()='${Cypress.env('lessonCheckboxRadio')}']`).closest('tr').within(() => {
                        cy.get('th').eq(1).find('div').click();
                    });
        cy.contains('Delete lesson').should('be.visible').click({ multiple: true });
        cy.get('button').contains('Delete').click();
        cy.wait(500);
        cy.xpath("//p[text()='Success!']").should('be.visible');

        // cy.wait(500);
        // cy.visit('/lc/admin/lessons');
        // cy.wait(500);
        // cy.xpath(`//div[text()='${Cypress.env('lessonTimer')}']`).parent().parent().parent().parent().parent().find('.tooltip').last().click();
        // cy.get('button').contains('Delete').click();
        // cy.xpath("//p[text()='Success!']").should('be.visible');
    });

    it('delete curriculum', function () {
        cy.login();
        cy.visit('/admin/user')
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Learning Center")').click({multiple: true});
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Curriculums")').click({multiple: true});
        cy.wait(500);
        cy.xpath(`//div[text()='${Cypress.env('curriculumName')}']`).closest('tr').within(() => {
            cy.get('th').eq(1).find('div').click();
        });
        cy.contains('Delete curriculum').should('be.visible').click({ multiple: true });
        cy.wait(500);
        cy.get('button').contains('Delete').click();
        cy.wait(500);
        cy.xpath("//p[text()='Success!']").should('be.visible');
    });
    //
    it('delete course group', function () {
        cy.login();
        cy.visit('/admin/user')
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Learning Center")').click({multiple: true});
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Course groups")').click({multiple: true});
        cy.wait(3000);
        cy.contains(Cypress.env('courseGroupName')).closest('tr').within(() => {
            cy.get('th').eq(1).find('div').click();
        });
        cy.contains('Delete group').should('be.visible').click({ multiple: true });

        cy.wait(500);
        cy.get('button').contains('Delete').click();
        cy.wait(500);
        cy.xpath("//p[text()='Success!']").should('be.visible');
    });
    //
    it('should delete team', function () {
        cy.login();
        cy.visit('/admin/user')
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Teams")').click({multiple: true});
        cy.wait(1000);
        cy.accessAllItems();
        cy.contains(Cypress.env('teemName')).closest('tr').within(() => {
            cy.get('th').eq(1).find('div').click();
        });
        cy.contains('Delete team').should('be.visible').click({ multiple: true });
        cy.wait(500);
        cy.xpath('//div[@class="fixed z-40 inset-0 overflow-y-auto"]').find(':contains("Delete")').click({multiple: true});
        cy.wait(500)
        // Assert team deleted
        cy.xpath("//p[text()='Success!']", { timeout: 5000 }).should('be.visible');
    });
    //
    it('delete invite user', function() {
        cy.login();
        cy.visit('/admin/user');
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Users")').click({multiple: true});
        cy.wait(1000);
        cy.accessAllItems();

        cy.contains(userEmail).closest('tr').within(() => {
            cy.get('th').eq(1).find('div').click();
        });
        cy.contains('Delete user').should('be.visible').click({ multiple: true });
        cy.wait(500)
        cy.get('button').contains('Delete').click();
        cy.wait(500)
        cy.xpath("//p[text()='Success!']").should('be.visible');
    })


    it('delete User', () => {
        cy.login();
        cy.visit('/admin/user');
        cy.wait(1000);
        cy.accessAllItems();

        cy.xpath(`//div[text()='QA QA USER USER']`).closest('tr').within(() => {
            cy.get('th').eq(1).find('div').click();
        });
        cy.contains('Delete user').should('be.visible').click({ multiple: true });
        cy.wait(500);
        cy.get('button').contains('Delete').click();
        cy.wait(500);
        cy.xpath("//p[text()='Success!']", { timeout: 5000 }).should('be.visible');
    })

    it('check Delete', () => {
        cy.login();
        cy.visit('/admin/user');
        cy.wait(1000);
        cy.contains('div', 'Qa Test').should(($el) => {
            console.log(isNonExistentOrHidden($el))
            if(!isNonExistentOrHidden($el)) {
                expect(isNonExistentOrHidden($el)).to.be.false
            }
        }).then((res) => {
            if(res.length) {
                cy.contains('Qa Test').closest('tr').within(() => {
                    cy.get('th').eq(1).find('div').click();
                });
                cy.contains('Delete user').should('be.visible').click({ multiple: true });
                cy.wait(500);
                cy.get('button').contains('Delete').click();
                cy.wait(500);
                cy.xpath("//p[text()='Success!']", { timeout: 5000 }).should('be.visible');
            }
        })
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
            cy.xpath("//span[text()='QA department2']").next().find('svg').last().click({force: true});
            cy.get('button').contains('Delete').click();
            cy.wait(500);
            cy.xpath("//p[text()='Success!']", { timeout: 5000 }).should('be.visible');

    })

    it('delete departament', function () {
        cy.login();
            cy.visit('ob/admin/departments/scheme');
            cy.wait(3000);
            cy.xpath(`//div[text()='QA department']`).scrollIntoView().click();
            cy.xpath("//div[text()='QA department']").next().find('svg').last().click({force: true});
            cy.get('button').contains('Delete').click();
            cy.wait(500);
            cy.xpath("//p[text()='Success!']", { timeout: 5000 }).should('be.visible');
    })
});
