describe('Task.T1. Create Task', () => {


    before(() => {
        cy.admin()
    });

    const visitPage =  () =>  {
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Tasks")').click({multiple: true});
        cy.wait(500)
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Tasks list")').click({multiple: true});
        cy.wait(1500)

    }

    const checkDays = () => new Date().getDay() > 25

    const selectedDay = () => {
        const today = new Date();
        const baseDate = new Date(today); // копия
        const addDays = 5;

        if(checkDays()) {
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

        cy.xpath("//span[text()='Name *']").next().type('Task 1');
        cy.xpath("//span[text()='Description']").next().type('Task Description Task Description Task Description');

        cy.xpath("//span[text()='Created by *']").next().click().type('first-name');
        cy.contains("div", 'first-name last-name').click()

        cy.xpath("//span[text()='Responsible *']").next().click().type('Qa');
        cy.contains("div", 'QA Test').click()


        cy.xpath("//span[text()='Result *']").next().type('Result Result');

        cy.contains('button', 'Save').click();
    })

    it('Edit task', function () {
        cy.login();
        cy.visit('/admin/user');
        cy.wait(1000);
        visitPage()

        cy.xpath(`//div[text()='Task 1']`).closest('tr').within(() => {
            cy.get('th').eq(0).find('div').click();
        });
        cy.contains('Edit').should('be.visible').click({ multiple: true });
        cy.wait(1500);

         cy.xpath("//span[text()='Auditors']").next().click().type('Qa');
         cy.contains("div", 'Qa User').click()

        cy.xpath("//span[text()='Deadline']").next().find('button').click();cy.wait(500);

         if(checkDays()) {
             cy.get("[data-slot='next-button']").click();
             cy.contains("span", day.getDate()).click();
         }
         else {
             cy.contains("span", day.getDate()).click();
         }

         cy.contains('Save').click()
    })

    it('check edits', function () {
        cy.login();
        cy.visit('/admin/user');
        cy.wait(1000);
        visitPage()

        cy.contains('button', 'Add').next().click()
        cy.wait(1500);

        if(checkDays()) {
            cy.get("[title='Next month']").click();
        }
        cy.contains('div', 'Task 1').should('be.visible').click();
        cy.wait(1000);


        // check edits data
        cy.contains('dt', 'Responsible').next().find(":contains('QA Test')").should('exist')
        cy.contains('dt', 'Auditors').next().find(":contains('User Qa')").should('exist')

        let text = formattedDate(day);
        cy.contains('dt', 'Deadline').next().find(`:contains('${text}')`).should('exist')
    })


    it('delete task', function () {
        cy.login();
        cy.visit('/admin/user');
        cy.wait(1000);
        visitPage();

        cy.xpath(`//div[text()='Task 1']`).closest('tr').within(() => {
            cy.get('th').eq(0).find('div').click();
        });
        cy.contains('Delete').should('be.visible').click({ multiple: true });
        cy.wait(200);
        cy.get('button').contains('Delete').click();
        cy.contains("p", "Success!").should('be.visible')
    })
})
