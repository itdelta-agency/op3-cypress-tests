describe('Task.T1. Create Task', () => {

    let taskName = 'Qa Task 1';


    before(() => {
        cy.admin()
    });

    const visitPage = () => {
        cy.get('.flex.justify-between', { timeout: 10000 }).eq(6).then($tab => {
            const isExpanded = $tab.attr('aria-expanded') === 'true';  // true если открыта
            if (!isExpanded) {
                cy.wrap($tab).click();
            }
        });
        cy.contains('Tasks list').click();
    }

    const checkDays = () => new Date().getDay() > 25

    const selectedDay = () => {
        const today = new Date();
        const baseDate = new Date(today); // копия
        const addDays = 5;

        if (checkDays()) {
            baseDate.setMonth(today.getMonth() + 1);
            baseDate.setDate(1 + addDays);
        }
        else {
            baseDate.setDate(baseDate.getDate() + addDays);
        }

        // Пока день недели — суббота (6) или воскресенье (0), двигаем дальше
        while (baseDate.getDay() === 0 || baseDate.getDay() === 6) {
            baseDate.setDate(baseDate.getDate() + 1);
        }

        return baseDate;
    }
    const formattedDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);

        return `${day}.${month}.${year}`;
    }

    let day = selectedDay();


    it('should create task', function () {
        visitPage()
        cy.wait(1500);
        cy.contains('button', 'Add').click();
        cy.wait(500);

        cy.xpath("//span[text()='Name *']").next().type(taskName);
        cy.xpath("//span[text()='Description']").next().type('Task Description Task Description Task Description');

        cy.xpath("//span[text()='Created by *']").next().click().type('first-name');
        cy.contains("div", 'first-name last-name').click()

        cy.xpath("//span[text()='Responsible *']").next().click().type('Test', { delay: 100 });
        cy.contains("div", 'QA Test').click()


        cy.xpath("//span[text()='Result *']").next().type('Result Result');

        cy.contains('button', 'Save').click();
    })


    it('Edit task', function () {
        cy.login();
        cy.visit('/admin/user');
        cy.wait(1000);
        visitPage()

        cy.xpath(`//div[text()="${taskName}"]`).closest('tr').first().within(() => {
            cy.get('th').eq(0).find('div').click();
        });
        cy.contains('Edit').should('be.visible').click({ multiple: true });
        cy.wait(1500);

        cy.xpath("//span[text()='Auditors']").next().click().type('USER', { delay: 100 });
        cy.contains("div", 'QA Edit USER').click()

        cy.xpath("//span[text()='Deadline']").next().find('button').click(); cy.wait(500);

        if (checkDays()) {
            cy.get("[data-slot='next-button']").click();
            cy.contains("span", day.getDate()).click();
        }
        else {
            cy.contains("span", day.getDate()).click();
        }

        cy.contains('Save').click()
    })

    it('check edits', function () {
        const commentText = 'Текст комментария!';
        cy.login();
        cy.visit('/admin/user');
        cy.wait(1000);
        visitPage()

        // cy.contains('button', 'Add').next().click()
        // cy.wait(1500);

        // if(checkDays()) {
        //     cy.get("[title='Next month']").click();
        // }
        // cy.contains('div', 'Task 1').should('be.visible');
        cy.wait(1000);
        cy.searchRow(taskName);
        cy.wait(500);
        cy.contains('tr', taskName).within(() => {
    
            cy.get('th').first().find('button').click();

            cy.contains('div', 'View').click();
        });
        cy.wait(500);

        cy.contains('dt', 'Responsible').next().should('contain.text', 'QA Test')
        cy.contains('dt', 'Auditors').next().should('contain.text', 'USER QA')

        let text = formattedDate(day);
        cy.contains('dt', 'Deadline').next().should('contain.text', text)

        // Comments 
        cy.get('.relative.flex').eq(3)
            .find('.ql-editor')
            .click()
            .type(commentText)
        cy.get('button').contains('Send').click();
        cy.wait(500);

        cy.get('.max-w-5xl')
            .find('.flex.items-start')
            .filter(':visible')
            .last()
            .should('contain.text', commentText);
        cy.wait(1000);

        cy.get('.w-4.h-4').eq(1).click();
        cy.wait(1000);

        cy.contains('.flex.items-start', commentText).should('not.exist');

    })


    it('delete task', function () {
        cy.login();
        cy.visit('/admin/user');
        cy.wait(1000);
        visitPage();

        cy.xpath(`//div[text()="${taskName}"]`).closest('tr').first().within(() => {
            cy.get('th').eq(0).find('div').click();
        });
        cy.contains('Delete').should('be.visible').click({ multiple: true });
        cy.wait(200);
        cy.get('button').contains('Delete').click();
        cy.contains("p", "Success!").should('be.visible')
    })
})
