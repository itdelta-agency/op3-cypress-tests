import { ROUTES } from "../../../support/routes";

describe('Task.T1. Create Task', () => {

    let taskName = 'Qa Task 1';


    beforeEach(function () {
        cy.resetAppState();
        cy.logTestName.call(this);
        cy.admin();
        cy.changeLang();
    });


    const checkDays = () => new Date().getDate() > 25

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
        cy.visit(ROUTES.tasks);
        cy.wait(1500);
        cy.get('h2').contains('Tasks').should('be.visible');
        cy.contains('button', 'Add').click();
        cy.wait(500);

        cy.xpath("//span[text()='Name *']").next().type(taskName);
        cy.xpath("//span[text()='Description']").next().type('Task Description Task Description Task Description');

        cy.xpath("//span[text()='Created by *']").next().click().type('first-name');
        cy.contains("div", 'first-name last-name').click()

        cy.xpath("//span[text()='Responsible *']").next().click().type('USER', { delay: 100 });
        cy.contains("div", 'QA Edit USER').click()


        cy.xpath("//span[text()='Result *']").next().type('Result Result');

        cy.contains('button', 'Save').click();
    })


    it('Edit task', function () {
        cy.visit(ROUTES.tasks);
        cy.wait(1000);
        cy.get('h2').contains('Tasks').should('be.visible');
        cy.searchRow(taskName);

        cy.xpath(`//div[text()="${taskName}"]`).closest('tr').first().within(() => {
            cy.get('th').eq(0).find('div').click();
        });
        cy.contains('Edit').should('be.visible').click({ multiple: true });
        cy.wait(1500);

        cy.xpath("//span[text()='Auditors']").next().click().type('QA Edit', { delay: 100 });
        cy.contains("div", 'QA Edit USER').click();

        cy.xpath("//span[text()='Deadline']").next().find('button').click();
        cy.wait(500);

        // Определяем текущий и целевой месяц
        const currentMonth = new Date().getMonth();
        const targetMonth = day.getMonth();

        if (currentMonth !== targetMonth) {
            cy.get("[data-slot='next-button']").click();
            cy.wait(500);
        }

        cy.get('[data-react-aria-pressable="true"]').contains("span", day.getDate()).click({ force: true });

        cy.get('.focus\\:border-indigo-500').eq(2).clear().type(10);
        cy.get('.focus\\:border-indigo-500').eq(4).clear().type(10);

        cy.contains('Save').click();
    });

    it('check edits', function () {
        const commentText = 'Текст комментария!';
        cy.visit(ROUTES.tasks);
        cy.wait(1000);
        cy.get('h2').contains('Tasks').should('be.visible');

        cy.searchRow(taskName);
        cy.wait(500);
        cy.contains('tr', taskName).within(() => {

            cy.get('th').first().find('button').click();

            cy.contains('div', 'View').click();
        });
        cy.wait(500);

        cy.contains('dt', 'Responsible').next().should('contain.text', 'QA Edit USER')
        cy.contains('dt', 'Auditors').next().should('contain.text', 'USER QA Edit')

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


    })


    it('delete task', function () {
        cy.visit(ROUTES.tasks);
        cy.wait(1000);
        cy.get('h2').contains('Tasks').should('be.visible');
        cy.searchRow(taskName);

        cy.xpath(`//div[text()="${taskName}"]`).closest('tr').first().within(() => {
            cy.get('th').eq(0).find('div').click();
        });
        cy.contains('Delete').should('be.visible').click({ multiple: true });
        cy.wait(200);
        cy.get('button').contains('Delete').click();
        cy.checkTextInParagraph();
    })
})
