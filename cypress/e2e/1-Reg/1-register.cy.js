const {recurse} = require("cypress-recurse");
describe('Register Ru', () => {
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
        cy.task("getTestAccount").then((res) => {
            userEmail = res.user;
            pass = res.pass;
            //userName = user.email.replace("@ethereal.email", "");
        })
        cy.visit(Cypress.config().registerUrl);
        cy.changeLangAuth();
    });

    it('valid-email-input', function () {
        cy.xpath("//input[@id='email']", {timeout: 10000}).type(userEmail);
        cy.wait(1000);
        cy.xpath("//button[@type='submit']", { timeout: 10000 }).click();
        cy.wait(3000);
        cy.task('getLastEmail', {user: userEmail, pass: pass,}).its('html').then(($html) => {
            var doc = new DOMParser().parseFromString($html, "text/html");
            let midText = doc.querySelector("p").innerText;
            cy.xpath("//input[@id='code']", {timeout: 10000}).type(invalid_code);
            cy.xpath("//button[@type='submit']", { timeout: 10000 }).click();
            cy.wait(500);
            cy.contains('Выбранное значение для Код некорректно.').should('be.visible');
            cy.wait(1000);
            cy.xpath("//input[@id='code']", {timeout: 10000}).clear().type(midText.match(/[0-9]+/g)[0]);
        });
        cy.xpath("//button[@type='submit']", { timeout: 10000 }).click();
        cy.wait(1000);
        cy.contains('Регистрация');
        cy.xpath("//input[@id='name']", { timeout: 10000 }).type(name);
        cy.wait(1000);
        cy.xpath("//input[@id='last_name']", { timeout: 10000 }).type(last_name);
        cy.wait(1000);
        cy.xpath("//input[@id='password']", { timeout: 10000 }).type(test_password);
        cy.wait(1000);
        cy.xpath("//input[@id='password_confirmation']", { timeout: 10000 }).type(test_password);
        cy.wait(1000);
        cy.xpath("//button[@type='submit']", { timeout: 10000 }).click();
        cy.wait(10000);
        cy.contains("Курсы").should('be.visible');
    });
})