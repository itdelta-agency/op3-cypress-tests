describe("Statistic.ST2. adding a value to statistics", () => {
    let lastName = Cypress.env('lastName');
    let statisticName = Cypress.env('statisticName');

    beforeEach(function () {
        cy.resetAppState();
        cy.logTestName.call(this);
        cy.admin();
    });

    it("adding a value to statistics", function () {
        cy.visit("/st/filled");
        cy.wait(1000);
        cy.contains(lastName).click();
        cy.contains(statisticName).click();
        cy.wait(500);
        cy.get('[placeholder="Value"]').type(40);
        cy.get('[placeholder="Description"]').type("Description statistic");
        cy.contains("button", "Add").click();
        cy.checkTextInParagraph();
    });
});
