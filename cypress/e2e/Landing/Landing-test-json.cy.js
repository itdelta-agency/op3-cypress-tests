describe('Landing-Test.js', () => {
/*    beforeEach(() => {
        const ctx = Cypress.mocha.getRunner().suite.ctx
        if (Cypress.config().baseUrl !== 'http://tenant1.localhost:8001/') {
            ctx.skip();
        }
    })*/
    let landingUrl = 'https://org-online.ru';
    const date_in_milliseconds = new Date().getTime();
    const secret_key = Cypress.env('bitrixCode');
    let fake_unique_email = 'abrakadabra@thisisafakedomainthatdoesntexisthaveanicedayandhereijust.com'

    it('Открыть модалку Техническая поддержка на главной и создать & проверить Лид', function () {
        cy.visit('https://org-online.ru');
        cy.xpath("//span[text()='Связаться']", { timeout: 10000 }).should('be.visible').eq(1).click();
        cy.wait(500);
        cy.xpath("//span[text()='Имя  *']", { timeout: 10000 }).should('be.visible').next().type('QA_TEST');
        cy.wait(500);
        cy.xpath("//span[text()='Фамилия']", { timeout: 10000 }).should('be.visible').next().type('QA_TEST');
        cy.wait(500);
        cy.xpath("//span[text()='email *']", { timeout: 10000 }).should('be.visible').next().type(fake_unique_email);
        cy.wait(500);
        cy.xpath("//span[text()='Телефон *']", { timeout: 10000 }).should('be.visible').next().type('1234567890');
        cy.wait(500);
        cy.xpath("//span[text()='Сообщение *']", { timeout: 10000 }).should('be.visible').parent().parent().next().type(date_in_milliseconds);
        cy.wait(500);
        cy.xpath("//button[text()='Отправить']", { timeout: 10000 }).should('be.visible').click();
        cy.wait(5500);
        cy.request({
            url: `https://itdelta.bitrix24.ru/rest/1/${secret_key}/crm.lead.list?FILTER[>DATE_CREATE]=2024-01-01&FILTER[CREATED_BY_ID]=1&FILTER[EMAIL]=${fake_unique_email}`,
        }).as('content').then((response) => {
             const content = response.body
             const result = content.result;
             let array_length = result.length;
             let last_index = array_length - 1;
             let last_lead = result[last_index];
            console.log(last_lead);
             const last_lead_text = last_lead.COMMENTS.toString();
             console.log(last_lead);
             if (last_lead_text != date_in_milliseconds) {
                 throw new Error("не найден правильный лид");
             } else {
                 cy.log("Проверка лида прошла успешно")
                 console.log("Проверка лида прошла успешно")
             };
             result.forEach((element) => {
                 console.log(element.ID);
                 cy.request({url: `https://itdelta.bitrix24.ru/rest/1/${secret_key}/crm.lead.delete?id=${element.ID}`});
             });
         });
        cy.wait(3000);
        cy.request({
            url: `https://itdelta.bitrix24.ru/rest/1/${secret_key}/crm.lead.list?FILTER[>DATE_CREATE]=2024-01-01&FILTER[CREATED_BY_ID]=1&FILTER[EMAIL]=${fake_unique_email}&SELECT[]=ID`,
        }).as('content').then((response) => {
            const content = response.body
            const result = content.result;
            console.log(result);
        });
    });
    it('Открыть модалку Продажи на главной и создать & проверить Лид', function () {
        cy.visit('https://org-online.ru');
        cy.xpath("//span[text()='Связаться']", { timeout: 10000 }).should('be.visible').eq(0).click();
        cy.wait(500);
        cy.xpath("//span[text()='Имя  *']", { timeout: 10000 }).should('be.visible').next().type('QA_TEST');
        cy.wait(500);
        cy.xpath("//span[text()='Фамилия']", { timeout: 10000 }).should('be.visible').next().type('QA_TEST');
        cy.wait(500);
        cy.xpath("//span[text()='email *']", { timeout: 10000 }).should('be.visible').next().type(fake_unique_email);
        cy.wait(500);
        cy.xpath("//span[text()='Телефон *']", { timeout: 10000 }).should('be.visible').next().type('1234567890');
        cy.wait(500);
        cy.xpath("//span[text()='Сообщение *']", { timeout: 10000 }).should('be.visible').parent().parent().next().type(date_in_milliseconds);
        cy.wait(500);
        cy.xpath("//button[text()='Отправить']", { timeout: 10000 }).should('be.visible').click();
        cy.wait(5500);
        cy.request({
            url: `https://itdelta.bitrix24.ru/rest/1/${secret_key}/crm.lead.list?FILTER[>DATE_CREATE]=2024-01-01&FILTER[CREATED_BY_ID]=1&FILTER[EMAIL]=${fake_unique_email}`,
        }).as('content').then((response) => {
            const content = response.body
            const result = content.result;
            let array_length = result.length;
            let last_index = array_length - 1;
            let last_lead = result[last_index];
            console.log(last_lead);
            const last_lead_text = last_lead.COMMENTS.toString();
            console.log(last_lead);
            if (last_lead_text != date_in_milliseconds) {
                throw new Error("не найден правильный лид");
            } else {
                cy.log("Проверка лида прошла успешно")
                console.log("Проверка лида прошла успешно")
            };
            result.forEach((element) => {
                console.log(element.ID);
                cy.request({url: `https://itdelta.bitrix24.ru/rest/1/${secret_key}/crm.lead.delete?id=${element.ID}`});
            });
        });
        cy.wait(3000);
        cy.request({
            url: `https://itdelta.bitrix24.ru/rest/1/${secret_key}/crm.lead.list?FILTER[>DATE_CREATE]=2024-01-01&FILTER[CREATED_BY_ID]=1&FILTER[EMAIL]=${fake_unique_email}&SELECT[]=ID`,
        }).as('content').then((response) => {
            const content = response.body
            const result = content.result;
            console.log(result);
        });
    });
    it('перейти на страницу /learning-center , заполнить форму и проверить Лид', function () {
        //cy.visit('https://org-online.ru');
        cy.visit(landingUrl);
        cy.xpath("//a[text()='Подробнее']", { timeout: 10000 }).eq(0).should('be.visible').click();
//cy.wait(2500);
        cy.url().should('include', '/learning-center');
        //cy.xpath("//[text()='Связаться']", { timeout: 10000 }).should('be.visible').eq(0).click();
        cy.wait(500);
        cy.xpath("//input[placeholder()='Name *']", { timeout: 10000 }).should('be.visible').next().type('QA_TEST');
        cy.wait(500);
        cy.xpath("//span[text()='Фамилия']", { timeout: 10000 }).should('be.visible').next().type('QA_TEST');
        cy.wait(500);
        cy.xpath("//span[text()='email *']", { timeout: 10000 }).should('be.visible').next().type(fake_unique_email);
        cy.wait(500);
        cy.xpath("//span[text()='Телефон *']", { timeout: 10000 }).should('be.visible').next().type('1234567890');
        cy.wait(500);
        cy.xpath("//span[text()='Сообщение *']", { timeout: 10000 }).should('be.visible').parent().parent().next().type(date_in_milliseconds);
        cy.wait(500);
        cy.xpath("//button[text()='Отправить']", { timeout: 10000 }).should('be.visible').click();
        cy.wait(5500);
        cy.request({
            url: `https://itdelta.bitrix24.ru/rest/1/${secret_key}/crm.lead.list?FILTER[>DATE_CREATE]=2024-01-01&FILTER[CREATED_BY_ID]=1&FILTER[EMAIL]=${fake_unique_email}`,
        }).as('content').then((response) => {
            const content = response.body
            const result = content.result;
            let array_length = result.length;
            let last_index = array_length - 1;
            let last_lead = result[last_index];
            console.log(last_lead);
            const last_lead_text = last_lead.COMMENTS.toString();
            console.log(last_lead);
            if (last_lead_text != date_in_milliseconds) {
                throw new Error("не найден правильный лид");
            } else {
                cy.log("Проверка лида прошла успешно")
                console.log("Проверка лида прошла успешно")
            };
            result.forEach((element) => {
                console.log(element.ID);
                cy.request({url: `https://itdelta.bitrix24.ru/rest/1/${secret_key}/crm.lead.delete?id=${element.ID}`});
            });
        });
        cy.wait(3000);
        cy.request({
            url: `https://itdelta.bitrix24.ru/rest/1/${secret_key}/crm.lead.list?FILTER[>DATE_CREATE]=2024-01-01&FILTER[CREATED_BY_ID]=1&FILTER[EMAIL]=${fake_unique_email}&SELECT[]=ID`,
        }).as('content').then((response) => {
            const content = response.body
            const result = content.result;
            console.log(result);
        });
    });
});

