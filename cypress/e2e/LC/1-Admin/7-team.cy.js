describe("LC.A5. Create team", () => {
    const tName = "Qa Test Team";
    beforeEach(() => {
        cy.admin();
    });

    it('should create new team', function () {
        // Go to add user page
        cy.xpath("//a[text()='Teams']").click();
        cy.xpath("//button[text()='Add team']").click();

        // Input credentials
        cy.xpath("(//input[@type='text'])[1]").type(tName + 'sdadas4rwrwerw542345');
        cy.xpath("//textarea").type("Lorem ipsum dolor sit amet, consectetur adipisicing elit.");

        cy.xpath("//button[text()='Save']").click();

        // Assert team created
        cy.xpath("//p[text()='Success!']", { timeout: 5000 }).should('be.visible');
    });

    it('should edit team', function () {
        cy.visit('admin/teams');

        cy.wait(1000);
        // cy.accessAllItems();
        cy.xpath(`(//div[text()='${tName + 'sdadas4rwrwerw542345'}'])`).last().click();

        cy.contains('Edit team').click();

        cy.xpath("(//input[@type='text'])[1]").clear().type(tName);
        cy.wait(500);

        cy.xpath("//span[text()='Users']").next().children().click();
        cy.xpath("//div[text()='Qa User']").scrollIntoView().click();
        cy.wait(500);
        cy.xpath("//button[text()='Save']").should('be.visible').click();
        cy.wait(1000);
        cy.xpath("//p[text()='Success!']").should('be.visible');
    })

    it('check add User Team', function () {
        cy.login(Cypress.env('authEmail'), Cypress.env('authPassword'));

        cy.visit('/profile');
        cy.wait(1500);
        cy.xpath("//label[text()='Teams']").parent().contains('Qa Test Team').should('be.visible');
    })

});