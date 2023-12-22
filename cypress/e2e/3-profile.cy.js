describe("A3. Profile editing", () => {
    const newPassword = 'fg5fHe4$fg_56fG';

    beforeEach(() => {
        cy.login();
    });


    it('should assert profile page', function () {
        cy.visit('/profile');
       // cy.closePopup();

        // change names
        cy.xpath("//h1[text()='User Profile']").should('be.visible');
        cy.xpath("//input[@id='first-name']").clear().type('first-name');
        cy.xpath("//input[@id='last-name']").clear().type('last-name');

        // change password
        cy.xpath("//input[@id='new_password']").clear().type(newPassword, {log:false});
        cy.xpath("//button[@type='submit']").should('be.disabled');
        cy.xpath("//input[@id='password']").clear().type(newPassword, {log:false});

        cy.xpath("//button[@type='submit']").click();
        cy.wait(1000);
    });

    it('should login with new password and change it back', function () {
        Cypress.session.clearAllSavedSessions();
        cy.login(Cypress.env('email'), newPassword);
        cy.visit('/profile');
       // cy.closePopup();

        // change password back
        cy.xpath("//input[@id='new_password']").clear().type(Cypress.env("password"), {log:false});
        cy.xpath("//button[@type='submit']").should('be.disabled');
        cy.xpath("//input[@id='password']").clear().type(Cypress.env("password"), {log:false});

        cy.xpath("//button[@type='submit']").click();
        cy.wait(1000);

    });

    it('should have new name', function () {
        cy.visit('/profile');
      //  closePopup();
        cy.wait(500);
        cy.xpath("//h1[text()='User Profile']").should('be.visible');
        cy.xpath("//input[@id='first-name']").should('have.value','first-name');
        cy.xpath("//input[@id='last-name']").should('have.value', 'last-name');
    });

});
