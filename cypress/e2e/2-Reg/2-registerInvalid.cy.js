const {recurse} = require("cypress-recurse");
describe('Register Invalid', () => {
    let userEmail;
    let pass;
    let invalid_code = '0000';
    let name = 'QaRegister';
    let last_name = 'Test';
    let test_password = 'Qatest123';
    //let main = Cypress.config('baseUrl').split('.')[1]
    //let subject = 'Learning Center | Invitation to the Learning Center'
    //let confirmationLink;

    before(() => {
        const ctx = Cypress.mocha.getRunner().suite.ctx
        if (Cypress.config().baseUrl === Cypress.config().prodUrl) {
            cy.task("getTestAccount").then((res) => {
                userEmail = res.user;
                pass = res.pass;
                //userName = user.email.replace("@ethereal.email", "");
            })
        } else {
            ctx.skip();
        }
    });

    beforeEach(() => {
        cy.visit(Cypress.config().registerUrl);
        cy.changeLangAuth();
    })

    it('Invalid-email_code-input', function () {
        cy.xpath("//input[@id='email']", {timeout: 10000}).type(userEmail);
        cy.wait(1000);
        cy.xpath("//button[@type='submit']", { timeout: 10000 }).click();
        cy.wait(1500);
        cy.xpath("//input[@id='code']", {timeout: 10000}).clear().type(invalid_code);
        cy.xpath("//button[@type='submit']", { timeout: 10000 }).click();
        cy.wait(500);
        cy.contains("Выбранное значение для Код некорректно.").should("be.visible");
    });

    it("change email", function () {
        cy.xpath("//input[@id='email']", {timeout: 10000}).type(userEmail);
        cy.wait(1000);
        cy.xpath("//button[@type='submit']", { timeout: 10000 }).click();
        cy.wait(1000);
        cy.xpath("//a[text()='Сменить адрес почты']").click();
        cy.wait(500);
        cy.contains("Регистрация").should('be.visible')
    })

    it("code reset", function () {
        cy.xpath("//input[@id='email']", {timeout: 10000}).type(userEmail);
        cy.wait(1000);
        cy.xpath("//button[@type='submit']", { timeout: 10000 }).click();
        cy.wait(3000);
        cy.task('getLastEmail', {user: userEmail, pass: pass,}).its('html').then(($html) => {
            var doc = new DOMParser().parseFromString($html, "text/html");
            let midText = doc.querySelector("p").innerText;
            cy.xpath("//input[@id='code']", {timeout: 10000}).clear().type(midText.match(/[0-9]+/g)[0]);
        });
        cy.wait(60000);
        cy.xpath("//button[text()='Отправить код повторно']").click();
        cy.wait(1000);
        cy.task('getLastEmail', {user: userEmail, pass: pass,}).its('html').then(($html) => {
            var doc = new DOMParser().parseFromString($html, "text/html");
            let midText = doc.querySelector("p").innerText;
            cy.xpath("//input[@id='code']", {timeout: 10000}).clear().type(midText.match(/[0-9]+/g)[0]);
        });
    });

})