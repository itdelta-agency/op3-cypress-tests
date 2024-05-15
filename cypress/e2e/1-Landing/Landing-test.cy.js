describe('Landing-Test.js', () => {
    let landingUrl = 'https://org-online.ru';
    const date_in_milliseconds = new Date().getTime();
    const lead_secret_key = Cypress.env('leadSecretKey');
    const lead_url = Cypress.env('leadUrl');
    const lead_user = Cypress.env('leadUserId');
    let fake_unique_email = 'abrakadabra@thisisafakedomainthatdoesntexisthaveanicedayandhereijust.com'


    before(() => {
        const ctx = Cypress.mocha.getRunner().suite.ctx
        if (Cypress.config().baseUrl == 'https://qa-testing.org-online.ru/') {
            //continue;
            cy.request({ url: `${lead_url}/rest/${lead_user}/${lead_secret_key}/crm.lead.list?FILTER[>DATE_CREATE]=2024-01-01&FILTER[CREATED_BY_ID]=1&FILTER[EMAIL]=${fake_unique_email}`,
            }).as('content').then((response) => {
                const content = response.body
                const result = content.result;
                cy.log('Пробуем удалить старые тестовые лиды(если такие есть)');
                console.log('Пробуем удалить старые тестовые лиды(если такие есть)');
                result.forEach((element) => {
                    console.log('Лид ' + element.ID + ' удален');
                    cy.request({url: `${lead_url}/rest/${lead_user}/${lead_secret_key}/crm.lead.delete?id=${element.ID}`});
                    });
            });
        } else {
            ctx.skip();
        }
    });

    it('зайти на лэндинг и проверить кнопки', function () {
    //     cy.visit(landingUrl);
    //     cy.xpath("//a[text()='Начать']", { timeout: 10000 }).eq(0).should('be.visible').click();
    //     //cy.wait(2500);
    //     cy.url().should('include', '/register');
    //     cy.wait(2500);
    //     cy.visit(landingUrl);
    //     cy.xpath("//a[text()='Начать']", { timeout: 10000 }).eq(1).should('be.visible').click();
    //     //cy.wait(2500);
    //     cy.url().should('include', '/register');
    //     cy.wait(2500);
        cy.visit(landingUrl);
        cy.xpath("//a[text()='Подробнее']", { timeout: 10000 }).eq(0).should('be.visible').click();
        //cy.wait(2500);
        cy.url().should('include', '/learning-center');
        cy.wait(2500);
        cy.visit(landingUrl);
        cy.xpath("//a[text()='Подробнее']", { timeout: 10000 }).eq(1).should('be.visible').click();
        //cy.wait(2500);
        cy.url().should('include', '/policy');
        cy.visit(landingUrl);
    });

    it('Открыть модалку Техническая поддержка на главной и создать & проверить Лид', function () {
        cy.visit('https://org-online.ru');
        cy.xpath("//span[text()='Связаться']", { timeout: 10000 }).should('be.visible').eq(1).click();
        cy.wait(500);
        cy.xpath("//span[text()='Имя  *']", { timeout: 10000 }).should('be.visible').next().type('QA_TEST_1');
        cy.wait(500);
        cy.xpath("//span[text()='Фамилия']", { timeout: 10000 }).should('be.visible').next().type('QA_TEST_1');
        cy.wait(500);
        cy.xpath("//span[text()='email *']", { timeout: 10000 }).should('be.visible').next().type(fake_unique_email);
        cy.wait(500);
        cy.xpath("//span[text()='Телефон *']", { timeout: 10000 }).should('be.visible').next().type('1234567890');
        cy.wait(500);
        cy.xpath("//span[text()='Сообщение']", { timeout: 10000 }).should('be.visible').parent().parent().next().type(date_in_milliseconds);
        cy.wait(500);
        cy.xpath("//span[text()='Сообщение']", { timeout: 10000 }).should('be.visible').parent().parent().parent().parent().next().next().children().should('be.visible').click();
        cy.wait(5500);
        cy.request({
            url: `${lead_url}/rest/${lead_user}/${lead_secret_key}/crm.lead.list?FILTER[>DATE_CREATE]=2024-01-01&FILTER[CREATED_BY_ID]=1&FILTER[EMAIL]=${fake_unique_email}`,
        }).as('content').then((response) => {
            const content = response.body
            const result = content.result;
            let array_length = result.length;
            let last_index = array_length - 1;
            let last_lead = result[last_index];
            const last_lead_name = last_lead.NAME;
            if (last_lead_name != "QA_TEST_1") {
                throw new Error("не найден правильный лид");
            } else {
                cy.log("Проверка лида прошла успешно")
                console.log("Проверка лида прошла успешно")
            }
            result.forEach((element) => {
                console.log(element.ID);
                cy.request({url: `${lead_url}/rest/${lead_user}/${lead_secret_key}/crm.lead.delete?id=${element.ID}`});
            });
        });
        cy.wait(3000);
        cy.request({
            url: `${lead_url}/rest/${lead_user}/${lead_secret_key}/crm.lead.list?FILTER[>DATE_CREATE]=2024-01-01&FILTER[CREATED_BY_ID]=1&FILTER[EMAIL]=${fake_unique_email}&SELECT[]=ID`,
        }).as('content').then((response) => {
            const content = response.body
            const result = content.result;
            expect(Boolean(result.length)).to.be.false;
        });
    });
    it('Открыть модалку Продажи на главной и создать & проверить Лид', function () {
        cy.visit('https://org-online.ru');
        cy.xpath("//span[text()='Связаться']", { timeout: 10000 }).should('be.visible').eq(0).click();
        cy.wait(500);
        cy.xpath("//span[text()='Имя  *']", { timeout: 10000 }).should('be.visible').next().type('QA_TEST_2');
        cy.wait(500);
        cy.xpath("//span[text()='Фамилия']", { timeout: 10000 }).should('be.visible').next().type('QA_TEST_2');
        cy.wait(500);
        cy.xpath("//span[text()='email *']", { timeout: 10000 }).should('be.visible').next().type(fake_unique_email);
        cy.wait(500);
        cy.xpath("//span[text()='Телефон *']", { timeout: 10000 }).should('be.visible').next().type('1234567890');
        cy.wait(500);
        cy.xpath("//span[text()='Сообщение']", { timeout: 10000 }).should('be.visible').parent().parent().next().type(date_in_milliseconds);
        cy.wait(500);
        cy.xpath("//span[text()='Сообщение']", { timeout: 10000 }).should('be.visible').parent().parent().parent().parent().next().next().children().should('be.visible').click();
        cy.wait(5500);
        cy.request({
            url: `${lead_url}/rest/${lead_user}/${lead_secret_key}/crm.lead.list?FILTER[>DATE_CREATE]=2024-01-01&FILTER[CREATED_BY_ID]=1&FILTER[EMAIL]=${fake_unique_email}`,
        }).as('content').then((response) => {
            const content = response.body
            const result = content.result;
            let array_length = result.length;
            let last_index = array_length - 1;
            let last_lead = result[last_index];
            const last_lead_name = last_lead.NAME;
            if (last_lead_name != "QA_TEST_2") {
                throw new Error("не найден правильный лид");
            } else {
                cy.log("Проверка лида прошла успешно")
                console.log("Проверка лида прошла успешно")
            }
            result.forEach((element) => {
                console.log(element.ID);
                cy.request({url: `${lead_url}/rest/${lead_user}/${lead_secret_key}/crm.lead.delete?id=${element.ID}`});
            });
        });
        cy.wait(3000);
        cy.request({
            url: `${lead_url}/rest/${lead_user}/${lead_secret_key}/crm.lead.list?FILTER[>DATE_CREATE]=2024-01-01&FILTER[CREATED_BY_ID]=1&FILTER[EMAIL]=${fake_unique_email}&SELECT[]=ID`,
        }).as('content').then((response) => {
            const content = response.body
            const result = content.result;
            expect(Boolean(result.length)).to.be.false;
        });
    });
    it('перейти на страницу /learning-center , заполнить форму и проверить Лид', function () {
        cy.visit(landingUrl);
        cy.xpath("//a[text()='Подробнее']", { timeout: 10000 }).eq(0).should('be.visible').click();
        cy.url().should('include', '/learning-center');
        cy.get('[type="text"]').should('be.visible').type(date_in_milliseconds);
        cy.wait(500);
        cy.get('[type="email"]').should('be.visible').type(fake_unique_email);
        cy.wait(500);
        cy.get('[type="tel"]').should('be.visible').type('1234567890');
        cy.wait(500);
        cy.xpath("//button[text()='Отправить']", { timeout: 10000 }).should('be.visible').click();
        cy.wait(5500);
        cy.request({
            url: `${lead_url}/rest/${lead_user}/${lead_secret_key}/crm.lead.list?FILTER[>DATE_CREATE]=2024-01-01&FILTER[CREATED_BY_ID]=1&FILTER[EMAIL]=${fake_unique_email}`,
        }).as('content').then((response) => {
            const content = response.body
            const result = content.result;
            let array_length = result.length;
            let last_index = array_length - 1;
            let last_lead = result[last_index];
            const last_lead_name = last_lead.NAME;
            if (last_lead_name != date_in_milliseconds) {
                throw new Error("не найден правильный лид");
            } else {
                cy.log("Проверка лида прошла успешно")
                console.log("Проверка лида прошла успешно")
            }
            result.forEach((element) => {
                console.log(element.ID);
                cy.request({url: `${lead_url}/rest/${lead_user}/${lead_secret_key}/crm.lead.delete?id=${element.ID}`});
            });
        });
        cy.wait(3000);
        cy.request({
            url: `${lead_url}/rest/${lead_user}/${lead_secret_key}/crm.lead.list?FILTER[>DATE_CREATE]=2024-01-01&FILTER[CREATED_BY_ID]=1&FILTER[EMAIL]=${fake_unique_email}&SELECT[]=ID`,
        }).as('content').then((response) => {
            const content = response.body
            const result = content.result;
            expect(Boolean(result.length)).to.be.false;
        });
    });
    it('перейти на страницу /policy , заполнить форму и проверить Лид', function () {
        cy.visit(landingUrl);
        cy.xpath("//a[text()='Подробнее']", { timeout: 10000 }).eq(1).should('be.visible').click();
        cy.url().should('include', '/policy');
        cy.get('[type="text"]').should('be.visible').type('QA_TEST_3');
        cy.wait(500);
        cy.get('[type="email"]').should('be.visible').type(fake_unique_email);
        cy.wait(500);
        cy.get('[type="tel"]').should('be.visible').type('1234567890');
        cy.wait(500);
        cy.xpath("//button[text()='Отправить']", { timeout: 10000 }).should('be.visible').click();
        cy.wait(5500);
        cy.request({
            url: `${lead_url}/rest/${lead_user}/${lead_secret_key}/crm.lead.list?FILTER[>DATE_CREATE]=2024-01-01&FILTER[CREATED_BY_ID]=1&FILTER[EMAIL]=${fake_unique_email}`,
        }).as('content').then((response) => {
            const content = response.body
            const result = content.result;
            let array_length = result.length;
            let last_index = array_length - 1;
            let last_lead = result[last_index];
            const last_lead_name = last_lead.NAME;
            if (last_lead_name != 'QA_TEST_3') {
                throw new Error("Не найден правильный лид");
            } else {
                cy.log("Проверка лида прошла успешно")
                console.log("Проверка лида прошла успешно")
            }
            result.forEach((element) => {
                console.log(element.ID);
                cy.request({url: `${lead_url}/rest/${lead_user}/${lead_secret_key}/crm.lead.delete?id=${element.ID}`});
            });
        });
        cy.wait(3000);
        cy.request({
            url: `${lead_url}/rest/${lead_user}/${lead_secret_key}/crm.lead.list?FILTER[>DATE_CREATE]=2024-01-01&FILTER[CREATED_BY_ID]=1&FILTER[EMAIL]=${fake_unique_email}&SELECT[]=ID`,
        }).as('content').then((response) => {
            const content = response.body
            const result = content.result;
            expect(Boolean(result.length)).to.be.false;
        });
    });
    // it('Перейти на страницу /prices заполнить форму и проверить Лид', function () {
    //     cy.visit('https://org-online.ru');
    //     cy.xpath("//a[text()='Цены']", {timeout: 10000}).should('be.visible').eq(0).click();
    //     cy.wait(1500);
    //     cy.url().should('include', '/prices');
    //     cy.get('[type="button"]').eq(2).should('be.visible').click();
    //     cy.wait(500);
    //     cy.xpath("//span[text()='Имя  *']", { timeout: 10000 }).should('be.visible').next().type('QA_TEST_4');
    //     cy.wait(500);
    //     cy.xpath("//span[text()='Фамилия']", { timeout: 10000 }).should('be.visible').next().type('QA_TEST_4');
    //     cy.wait(500);
    //     cy.xpath("//span[text()='email *']", { timeout: 10000 }).should('be.visible').next().type(fake_unique_email);
    //     cy.wait(500);
    //     cy.xpath("//span[text()='Телефон *']", { timeout: 10000 }).should('be.visible').next().type('1234567890');
    //     cy.wait(500);
    //     cy.xpath("//span[text()='Сообщение']", { timeout: 10000 }).should('be.visible').parent().parent().next().type(date_in_milliseconds);
    //     cy.wait(500);
    //     cy.xpath("//button[text()='Отправить']", { timeout: 10000 }).should('be.visible').click();
    //     cy.wait(5500);
    //     cy.request({
    //         url: `${lead_url}/rest/${lead_user}/${lead_secret_key}/crm.lead.list?FILTER[>DATE_CREATE]=2024-01-01&FILTER[CREATED_BY_ID]=1&FILTER[EMAIL]=${fake_unique_email}`,
    //     }).as('content').then((response) => {
    //         const content = response.body
    //         const result = content.result;
    //         let array_length = result.length;
    //         let last_index = array_length - 1;
    //         let last_lead = result[last_index];
    //         const last_lead_name = last_lead.NAME;
    //         if (last_lead_name != "QA_TEST_4") {
    //             throw new Error("Не найден правильный лид");
    //         } else {
    //             cy.log("Проверка лида прошла успешно")
    //             console.log("Проверка лида прошла успешно")
    //         }
    //         result.forEach((element) => {
    //             console.log(element.ID);
    //             cy.request({url: `${lead_url}/rest/${lead_user}/${lead_secret_key}/crm.lead.delete?id=${element.ID}`});
    //         });
    //     });
    //     cy.wait(3000);
    //     cy.request({
    //         url: `${lead_url}/rest/${lead_user}/${lead_secret_key}/crm.lead.list?FILTER[>DATE_CREATE]=2024-01-01&FILTER[CREATED_BY_ID]=1&FILTER[EMAIL]=${fake_unique_email}&SELECT[]=ID`,
    //     }).as('content').then((response) => {
    //         const content = response.body
    //         const result = content.result;
    //         expect(Boolean(result.length)).to.be.false;
    //     });
    // });
});
