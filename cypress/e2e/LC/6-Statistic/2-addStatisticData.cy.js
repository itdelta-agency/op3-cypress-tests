describe("Statistic.ST2. adding a value to statistics", () => {
    before(() => {
        cy.task("getEmailAccount").then((email) => {
            cy.login(email, Cypress.env('password'));
        });
    });

    it("adding a value to statistics", function () {
        cy.visit("/st/filled");
        cy.wait(1000);
        cy.contains("User Qa").click();
        cy.contains("span", "Qa statistic").click();
        cy.wait(500);
        // cy.searchRow('Qa');
        // cy.xpath(`//div[text()='Qa statistic']`).parent().parent().parent().parent().parent().find('.tooltip').eq(1).scrollIntoView().first().click();
        cy.get('[placeholder="Value"]').type(40);
        cy.get('[placeholder="Description"]').type("desc");
        cy.contains("button", "Add").click();
        cy.wait(1000);
        cy.contains("Success").should("be.visible");
    });
});
